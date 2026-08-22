import { EVENTS, eventSpan } from './data/events.js'
import { ERAS } from './data/eras.js'
import { PLACE_BY_ID } from './data/places.js'

/** Full extent of the dated material, with a little breathing room. */
export const FULL_DOMAIN = { start: -2250, end: 130 }

const listeners = new Set()

export const state = {
  chronology: 'traditional',
  selectedId: null,
  hoveredId: null,
  activeEras: new Set(ERAS.map((e) => e.id)),
  activeTags: new Set(),           // empty = no category filter applied
  activeJourneys: new Set(),
  search: '',
  basemap: 'plain',
  showUncertain: true,
  domain: { ...FULL_DOMAIN },
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/**
 * Apply a patch and notify. `reason` lets views skip expensive work they don't
 * care about — the map, for instance, has no interest in a timeline pan.
 */
export function update(patch, reason = 'state') {
  Object.assign(state, patch)
  for (const fn of listeners) fn(state, reason)
}

export function toggleInSet(setName, id, reason) {
  const next = new Set(state[setName])
  next.has(id) ? next.delete(id) : next.add(id)
  update({ [setName]: next }, reason)
}

/** Events passing the current filters, sorted by date. Undated ones sort first. */
export function visibleEvents() {
  const q = state.search.trim().toLowerCase()
  const tagFilter = state.activeTags.size > 0

  return EVENTS.filter((ev) => {
    if (!state.activeEras.has(ev.era)) return false
    if (tagFilter && !ev.tags.some((t) => state.activeTags.has(t))) return false
    if (q) {
      const place = PLACE_BY_ID[ev.placeId]
      const hay = `${ev.title} ${ev.summary} ${ev.ref} ${place?.name ?? ''} ${place?.modern ?? ''}`
      if (!hay.toLowerCase().includes(q)) return false
    }
    return true
  }).sort((a, b) => {
    const sa = eventSpan(a, state.chronology)
    const sb = eventSpan(b, state.chronology)
    if (!sa && !sb) return 0
    if (!sa) return -1
    if (!sb) return 1
    return sa.start - sb.start || sa.end - sb.end
  })
}

export function datedVisibleEvents() {
  return visibleEvents().filter((e) => !e.dates.undated)
}

export function undatedVisibleEvents() {
  return visibleEvents().filter((e) => e.dates.undated)
}

/** Format an internal year as a BC/AD label. */
export function formatYear(y) {
  if (y === null || y === undefined) return '—'
  const n = Math.abs(Math.round(y))
  return y < 0 ? `${n} BC` : `AD ${n}`
}

/** Human label for an event's date under the current chronology. */
export function formatEventDate(ev, mode = state.chronology) {
  if (ev.dates.undated) return 'No date given'
  const span = eventSpan(ev, mode)
  const c = span.circa ? 'c. ' : ''
  if (span.start === span.end) return c + formatYear(span.start)
  // A range that stays on one side of the era boundary only needs one suffix.
  if (span.start < 0 && span.end < 0) return `${c}${Math.abs(span.start)}–${Math.abs(span.end)} BC`
  if (span.start > 0 && span.end > 0) return `${c}AD ${span.start}–${span.end}`
  return `${c}${formatYear(span.start)} – ${formatYear(span.end)}`
}

export function selectEvent(id) {
  update({ selectedId: id }, 'select')
}
