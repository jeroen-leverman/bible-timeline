import { state, update, toggleInSet, selectEvent, visibleEvents, formatEventDate } from '../store.js'
import { ERAS, CATEGORIES } from '../data/eras.js'
import { JOURNEYS, CONFIDENCE_LABEL } from '../data/journeys.js'
import { PLACE_BY_ID } from '../data/places.js'

export function createSidebar(root, { onJourneyFocus }) {
  root.innerHTML = `
    <div class="side-search">
      <input type="search" id="q" placeholder="Search events, places, references…" autocomplete="off"
             aria-label="Search events">
    </div>

    <details class="side-sec" open>
      <summary>Periods <span class="sec-act" data-all="activeEras">all</span></summary>
      <div class="era-list">
        ${ERAS.map((e) => `
          <label class="era-row" style="--era:${e.color}">
            <input type="checkbox" data-era="${e.id}" checked>
            <span class="swatch"></span>
            <span class="era-name">${e.name}</span>
          </label>`).join('')}
      </div>
    </details>

    <details class="side-sec">
      <summary>Themes <span class="sec-act" data-clear="activeTags">clear</span></summary>
      <div class="chips">
        ${CATEGORIES.map((c) => `
          <button class="chip" data-tag="${c.id}" style="--c:${c.color}">${c.name}</button>`).join('')}
      </div>
    </details>

    <details class="side-sec" open>
      <summary>Journeys <span class="sec-act" data-clear="activeJourneys">clear</span></summary>
      <div class="journey-list">
        ${JOURNEYS.map((j) => `
          <div class="j-row" data-journey="${j.id}" style="--c:${j.color}">
            <button class="j-toggle" aria-pressed="false">
              <span class="j-line"></span>
              <span class="j-body">
                <span class="j-name">${j.name}</span>
                <span class="j-meta">${j.ref} · ${CONFIDENCE_LABEL[j.confidence]}</span>
              </span>
            </button>
          </div>`).join('')}
      </div>
    </details>

    <div class="side-sec side-events">
      <div class="ev-head">Events <span class="ev-count"></span></div>
      <ul class="ev-list" role="listbox" aria-label="Events"></ul>
    </div>
  `

  const q = root.querySelector('#q')
  const list = root.querySelector('.ev-list')
  const count = root.querySelector('.ev-count')

  let searchTimer
  q.addEventListener('input', () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => update({ search: q.value }, 'filter'), 140)
  })

  root.addEventListener('click', (e) => {
    const all = e.target.dataset?.all
    if (all === 'activeEras') {
      e.preventDefault()
      const on = state.activeEras.size < ERAS.length
      update({ activeEras: new Set(on ? ERAS.map((x) => x.id) : []) }, 'filter')
      return
    }
    const clear = e.target.dataset?.clear
    if (clear) { e.preventDefault(); update({ [clear]: new Set() }, clear === 'activeJourneys' ? 'journeys' : 'filter'); return }

    const chip = e.target.closest('.chip')
    if (chip) return toggleInSet('activeTags', chip.dataset.tag, 'filter')

    const jrow = e.target.closest('.j-row')
    if (jrow) {
      const id = jrow.dataset.journey
      const turningOn = !state.activeJourneys.has(id)
      toggleInSet('activeJourneys', id, 'journeys')
      if (turningOn) onJourneyFocus?.(id)
      return
    }

    const li = e.target.closest('.ev-item')
    if (li) selectEvent(li.dataset.id)
  })

  root.addEventListener('change', (e) => {
    const era = e.target.dataset?.era
    if (era) toggleInSet('activeEras', era, 'filter')
  })

  function renderControls() {
    root.querySelectorAll('[data-era]').forEach((cb) => { cb.checked = state.activeEras.has(cb.dataset.era) })
    root.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', state.activeTags.has(c.dataset.tag)))
    root.querySelectorAll('.j-row').forEach((r) => {
      const on = state.activeJourneys.has(r.dataset.journey)
      r.classList.toggle('on', on)
      r.querySelector('.j-toggle').setAttribute('aria-pressed', String(on))
    })
    root.querySelector('[data-all="activeEras"]').textContent =
      state.activeEras.size < ERAS.length ? 'all' : 'none'
  }

  function renderList() {
    const events = visibleEvents()
    count.textContent = `${events.length}`
    list.innerHTML = events.map((ev) => {
      const place = PLACE_BY_ID[ev.placeId]
      return `<li class="ev-item${ev.id === state.selectedId ? ' on' : ''}" data-id="${ev.id}"
                  role="option" aria-selected="${ev.id === state.selectedId}" tabindex="0">
        <span class="ev-date">${formatEventDate(ev)}</span>
        <span class="ev-title">${esc(ev.title)}</span>
        <span class="ev-place">${esc(place?.name ?? '')}</span>
      </li>`
    }).join('') || `<li class="ev-empty">Nothing matches these filters.</li>`
  }

  function scrollSelectedIntoView() {
    const node = list.querySelector('.ev-item.on')
    if (!node) return
    const box = list.getBoundingClientRect()
    const r = node.getBoundingClientRect()
    if (r.top < box.top || r.bottom > box.bottom) node.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  return { renderControls, renderList, scrollSelectedIntoView }
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
