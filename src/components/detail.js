import { state, update, formatEventDate } from '../store.js'
import { EVENT_BY_ID, eventSpan } from '../data/events.js'
import { ERA_BY_ID, CATEGORY_BY_ID } from '../data/eras.js'
import { PLACE_BY_ID, CERTAINTY_LABEL } from '../data/places.js'

export function createDetail(root) {
  root.addEventListener('click', (e) => {
    if (e.target.closest('.dt-close')) update({ selectedId: null }, 'select')
    const nav = e.target.closest('[data-goto]')
    if (nav) update({ selectedId: nav.dataset.goto }, 'select')
  })

  function render() {
    const ev = EVENT_BY_ID[state.selectedId]
    if (!ev) { root.hidden = true; root.innerHTML = ''; return }
    root.hidden = false

    const era = ERA_BY_ID[ev.era]
    const place = PLACE_BY_ID[ev.placeId]
    const other = state.chronology === 'traditional' ? 'academic' : 'traditional'
    const unsurePlace = ['disputed', 'traditional', 'symbolic'].includes(place?.certainty)

    root.innerHTML = `
      <button class="dt-close" aria-label="Close">×</button>
      <div class="dt-era" style="--era:${era.color}">${era.name}</div>
      <h2 class="dt-title">${esc(ev.title)}</h2>
      <div class="dt-when">${esc(formatEventDate(ev, state.chronology))}</div>
      ${ev.dates.diverges ? `
        <div class="dt-alt">
          <span class="dt-alt-k">${other === 'academic' ? 'Academic' : 'Traditional'} dating</span>
          <span class="dt-alt-v">${esc(formatEventDate(ev, other))}</span>
        </div>` : ''}

      <p class="dt-summary">${esc(ev.summary)}</p>

      <div class="dt-meta">
        <div class="dt-row">
          <span class="dt-k">Reference</span>
          <span class="dt-v">${esc(ev.ref)}</span>
        </div>
        ${place ? `
        <div class="dt-row">
          <span class="dt-k">Place</span>
          <span class="dt-v">${esc(place.name)}${place.modern ? ` <em>· ${esc(place.modern)}</em>` : ''}
            <span class="cert${unsurePlace ? ' cert-unsure' : ''}">${CERTAINTY_LABEL[place.certainty]}</span>
          </span>
        </div>` : ''}
        ${ev.tags.length ? `
        <div class="dt-row">
          <span class="dt-k">Themes</span>
          <span class="dt-v">${ev.tags.map((t) =>
            `<span class="dt-tag" style="--c:${CATEGORY_BY_ID[t].color}">${CATEGORY_BY_ID[t].name}</span>`).join('')}</span>
        </div>` : ''}
      </div>

      ${place?.note ? `<div class="dt-note dt-note-place"><strong>On this location.</strong> ${esc(place.note)}</div>` : ''}
      ${ev.dateNote ? `<div class="dt-note"><strong>On the date.</strong> ${esc(ev.dateNote)}</div>` : ''}
      ${ev.anchor ? `<div class="dt-note dt-anchor"><strong>Outside evidence.</strong> ${esc(ev.anchor)}</div>` : ''}

      ${neighbours(ev)}
    `
  }

  /** Previous and next dated events, so the panel can be walked like a list. */
  function neighbours(ev) {
    if (ev.dates.undated) return ''
    const all = Object.values(EVENT_BY_ID)
      .filter((e) => !e.dates.undated)
      .sort((a, b) => eventSpan(a, state.chronology).start - eventSpan(b, state.chronology).start)
    const i = all.findIndex((e) => e.id === ev.id)
    const prev = all[i - 1], next = all[i + 1]
    if (!prev && !next) return ''
    return `<div class="dt-nav">
      ${prev ? `<button data-goto="${prev.id}" class="dt-navbtn">← ${esc(trunc(prev.title))}</button>` : '<span></span>'}
      ${next ? `<button data-goto="${next.id}" class="dt-navbtn dt-next">${esc(trunc(next.title))} →</button>` : '<span></span>'}
    </div>`
  }

  return { render }
}

const trunc = (s) => (s.length > 26 ? s.slice(0, 25) + '…' : s)
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
