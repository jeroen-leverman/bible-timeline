import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import './style.css'
import { ERAS, ERA_BY_ID, CATEGORIES, CATEGORY_BY_ID } from './data/eras.js'
import { PLACES, PLACE_BY_ID, CERTAINTY_LABEL } from './data/places.js'
import { EVENTS, EVENT_BY_ID, DATE_CONFIDENCE } from './data/events.js'
import { THEMES, THEME_BY_ID, THEME_EVENT_SETS, THEME_KIND_LABEL } from './data/themes.js'
import { territoriesAt } from './data/territories.js'
import { BOOKS, BOOK_GROUP_LABEL, booksForReferences } from './data/books.js'
import { renderPassageInto, escapeHtml } from './verses.js'
import { createTree } from './tree.js'

const ICONS = {
  compass: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>',
  book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5c3.2-.8 5.9 0 8 2v12c-2.1-2-4.8-2.8-8-2V5.5Z"/><path d="M20 5.5c-3.2-.8-5.9 0-8 2v12c2.1-2 4.8-2.8 8-2V5.5Z"/></svg>',
  layers: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></svg>',
  route: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M7.5 16.5 16.5 7.5M8 6h3a3 3 0 0 1 3 3v6"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  territory: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5 9.5 5l5 2.5L20 5v11.5L14.5 19l-5-2.5L4 19Z"/><path d="M9.5 5v11.5M14.5 7.5V19"/></svg>',
}

const app = document.querySelector('#app')

app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="#" aria-label="Bible History Explorer home">
      <span class="brand-mark">${ICONS.compass}</span>
      <span><strong>Bible History Explorer</strong><small>History, scripture &amp; place</small></span>
    </a>
    <nav class="view-tabs" role="tablist" aria-label="View">
      <button role="tab" data-view="atlas" aria-selected="true" class="on">Atlas</button>
      <button role="tab" data-view="tree" aria-selected="false">Family tree</button>
    </nav>
    <div class="top-actions">
      <button class="icon-button mobile-only" id="mobile-filters" aria-label="Open filters">${ICONS.layers}</button>
      <button class="method-button" id="method-button" aria-label="About this atlas"><span>About this atlas</span><span aria-hidden="true">↗</span></button>
    </div>
  </header>

  <main class="atlas-shell">
    <aside class="sidebar" id="sidebar" aria-label="Explore biblical history">
      <div class="sidebar-scroll">
        <section class="intro-block">
          <p class="eyebrow">Explore the record</p>
          <h1>Where history<br><em>meets the text.</em></h1>
          <p>Trace biblical events across the ancient world. Dates and locations show their level of historical certainty.</p>
        </section>

        <label class="search-box" for="atlas-search">
          ${ICONS.search}
          <input id="atlas-search" type="search" placeholder="Search events, places, scripture…" autocomplete="off" />
          <kbd>⌘ K</kbd>
        </label>

        <section class="filter-section">
          <div class="section-heading"><h2>Historical era</h2><button class="text-button" id="clear-era">All eras</button></div>
          <div class="era-list" id="era-list"></div>
        </section>

        <section class="filter-section book-filter-section">
          <div class="section-heading"><h2>Biblical book</h2><button class="text-button" id="clear-book">All books</button></div>
          <label class="book-select" for="book-filter">
            ${ICONS.book}
            <select id="book-filter" aria-label="Filter events by biblical book"></select>
            <span aria-hidden="true">⌄</span>
          </label>
          <p class="book-filter-summary" id="book-filter-summary" hidden></p>
        </section>

        <section class="filter-section">
          <div class="section-heading"><h2>Lives &amp; threads</h2><button class="text-button" id="clear-theme">Clear</button></div>
          <div class="theme-list" id="theme-list"></div>
          <div class="theme-blurb" id="theme-blurb" hidden></div>
        </section>

        <section class="filter-section">
          <div class="section-heading"><h2>Event type</h2><button class="text-button" id="clear-categories">Reset</button></div>
          <div class="category-list" id="category-list"></div>
        </section>

        <section class="confidence-key">
          <h2>Reading the map</h2>
          <div class="confidence-row"><span class="certainty-symbol secure"></span><span><strong>Secure</strong> broadly identified</span></div>
          <div class="confidence-row"><span class="certainty-symbol probable"></span><span><strong>Probable</strong> some uncertainty</span></div>
          <div class="confidence-row"><span class="certainty-symbol disputed"></span><span><strong>Disputed</strong> rival locations</span></div>
          <div class="confidence-row"><span class="certainty-symbol traditional"></span><span><strong>Traditional</strong> later tradition</span></div>
        </section>
      </div>
      <button class="sidebar-close mobile-only" id="sidebar-close">Close filters</button>
    </aside>

    <section class="map-workspace" aria-label="Interactive map and timeline">
      <div id="map" role="application" aria-label="Map of biblical events"></div>
      <div class="map-wash" aria-hidden="true"></div>

      <div class="map-status glass-panel">
        <span class="status-era" id="status-era">All eras</span>
        <strong id="status-date">c. 2000 BC</strong>
      </div>

      <div class="map-tools glass-panel" aria-label="Map options">
        <button id="fit-event" aria-label="Fit selected event on map" title="Fit selected event">${ICONS.route}</button>
        <button id="toggle-places" class="active" aria-pressed="true" aria-label="Toggle place labels" title="Toggle all places">${ICONS.layers}</button>
        <button id="toggle-territories" aria-pressed="false" aria-label="Toggle kingdom territories" title="Show kingdoms and empires at this date">${ICONS.territory}</button>
      </div>

      <div class="territory-caption glass-panel" id="territory-caption" hidden></div>
      <article class="event-card glass-panel" id="event-card" aria-live="polite"></article>

      <section class="timeline-panel" aria-label="Historical timeline">
        <div class="timeline-controls">
          <button class="play-button" id="play-timeline" aria-label="Play timeline"><span class="play-icon">▶</span></button>
          <div class="timeline-range-wrap">
            <div class="timeline-meta">
              <div><span class="eyebrow">Timeline stop</span><strong id="timeline-date">c. 2000 BC</strong></div>
              <span id="event-count">0 events</span>
            </div>
            <input id="timeline-range" type="range" min="0" max="1" value="0" step="1" aria-label="Move through historical events" />
            <div class="timeline-ticks" id="timeline-ticks" aria-hidden="true"></div>
          </div>
        </div>
        <div class="event-rail" id="event-rail" tabindex="0" aria-label="Events in chronological order"></div>
      </section>
    </section>
  </main>

  <section class="tree-view" id="tree-view" hidden></section>

  <dialog class="method-dialog" id="method-dialog">
    <button class="dialog-close icon-button" id="dialog-close" aria-label="Close">${ICONS.close}</button>
    <p class="eyebrow">A note on method</p>
    <h2>An atlas can clarify history—and overstate it.</h2>
    <p>This atlas distinguishes what the biblical text says, how an event is dated, and how confidently a place or family relationship can be reconstructed. A precise dot or line does not always mean a precise identification.</p>
    <div class="method-grid">
      <div><span>01</span><h3>Dates are ranges</h3><p>Approximate and disputed chronologies are labeled rather than silently harmonized.</p></div>
      <div><span>02</span><h3>Places vary</h3><p>Excavated sites, probable identifications, and later traditional sites use different symbols.</p></div>
      <div><span>03</span><h3>Routes are interpretive</h3><p>Lines connect the named sequence of places; they do not claim to reconstruct every ancient road.</p></div>
      <div><span>04</span><h3>Genealogies telescope</h3><p>Generation gaps are disclosed: “fathered” can refer to a later descendant rather than an immediate son.</p></div>
    </div>
    <section class="source-policy" aria-labelledby="source-policy-title">
      <p class="eyebrow">Source policy</p>
      <h3 id="source-policy-title">Research independently. Attribute every dataset.</h3>
      <p>Other atlases can reveal a topic worth investigating, but their prose, hand-curated databases, and interface are not copied here. Biblical claims are checked against the cited passages. External facts and coordinates are traced to their original sources, licensed, and attributed.</p>
      <div class="source-links" aria-label="Open source candidates">
        <a href="https://www.openbible.info/geo/" target="_blank" rel="noreferrer">OpenBible.info <span>CC BY 4.0</span></a>
        <a href="https://pleiades.stoa.org/" target="_blank" rel="noreferrer">Pleiades <span>CC BY 3.0</span></a>
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap <span>ODbL</span></a>
      </div>
    </section>
    <p class="dialog-footnote">The basemap shows modern coastlines and terrain with present-day labels removed, so the ancient names stand on their own. It does not depict ancient political boundaries.</p>
  </dialog>
  <div class="mobile-scrim" id="mobile-scrim"></div>
`

const state = {
  selectedEra: null,
  selectedBook: null,
  selectedTheme: null,
  selectedCategories: new Set(CATEGORIES.map(({ id }) => id)),
  selectedEvent: (EVENTS.find((item) => item.featured) || EVENTS[0]).id,
  query: '',
  showPlaces: true,
  showTerritories: false,
  translation: 'web',
  openRef: null,
  playing: false,
}

const EVENT_BOOKS = new Map(EVENTS.map((item) => [item.id, booksForReferences(item.scripture)]))

const map = L.map('map', {
  center: [32.4, 35.2],
  zoom: 6,
  minZoom: 3,
  zoomControl: false,
  attributionControl: true,
  worldCopyJump: true,
})

L.control.zoom({ position: 'topright' }).addTo(map)
// CARTO's Positron basemap, label-free. OpenStreetMap's own tile servers run on donated
// capacity and their usage policy asks applications not to lean on them; CARTO's basemaps
// are free to use publicly with attribution. Dropping the labels is also the right call
// cartographically: present-day country and city names competing with Shechem and Ur made
// the map harder to read, and the ancient names now stand on their own.
const retina = L.Browser.retina ? '@2x' : ''
L.tileLayer(`https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}${retina}.png`, {
  subdomains: 'abcd',
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
    '&copy; <a href="https://carto.com/attributions">CARTO</a>',
}).addTo(map)

const territoryLayer = L.layerGroup().addTo(map)
const allPlacesLayer = L.layerGroup().addTo(map)
const eventOverviewLayer = L.layerGroup().addTo(map)
const selectedEventLayer = L.layerGroup().addTo(map)
let playTimer = null

function formatYear(year) {
  if (year < 0) return `${Math.abs(year).toLocaleString()} BC`
  if (year === 0) return 'BC / AD'
  return `AD ${year}`
}

function iconForPlace(place, selected = false, category = null) {
  const color = category ? CATEGORY_BY_ID[category]?.color : '#6d766b'
  return L.divIcon({
    className: 'atlas-marker-wrap',
    html: `<span class="atlas-marker ${place.certainty} ${selected ? 'selected' : ''}" style="--marker-color:${color}"><i></i></span>`,
    iconSize: selected ? [26, 26] : [18, 18],
    iconAnchor: selected ? [13, 13] : [9, 9],
  })
}

/** Photographs and extracts load on first popup, not on first paint. */
let WIKI = null
let wikiLoading = null
function loadWiki() {
  if (WIKI) return Promise.resolve(WIKI)
  wikiLoading ??= import('./data/wikipedia.json').then((m) => (WIKI = m.default ?? m))
  return wikiLoading
}

/**
 * Every image here passed a licence check at build time, and the credit line is a
 * condition of reusing it rather than decoration — so it is rendered with the image
 * or the image is not rendered at all.
 */
function wikiMarkup(place) {
  const wiki = WIKI?.[place.id]
  if (!wiki) return ''
  const figure = wiki.image ? `<figure class="wiki-figure">
      <img src="${wiki.image.src}" alt="${place.name}" loading="lazy" />
      <figcaption>${wiki.image.artist ? wiki.image.artist + ' · ' : ''}<a href="${wiki.image.filePage}" target="_blank" rel="noopener noreferrer">${wiki.image.licence}</a></figcaption>
    </figure>` : ''
  const summary = wiki.extract ? `<p class="wiki-extract">${wiki.extract}</p>` : ''
  const link = wiki.url ? `<a class="wiki-link" href="${wiki.url}" target="_blank" rel="noopener noreferrer">Read about ${wiki.title} on Wikipedia →</a>` : ''
  return figure + summary + link
}

/** Popup content is regenerated rather than patched in place: Leaflet's own
 *  update() re-renders from the stored content string, so anything written straight
 *  into the live DOM is wiped the moment the popup resizes. Re-setting the content
 *  is the supported path and lets the popup size itself around the photograph. */
async function hydratePopup(popup, place) {
  if (!WIKI) await loadWiki()
  if (!WIKI?.[place.id]) return
  popup.setContent(placePopup(place))
  wireRelatedEvents()
}

/** The related-event buttons live inside popup content, so they are re-bound
 *  whenever that content is regenerated. */
function wireRelatedEvents() {
  document.querySelectorAll('.popup-events button').forEach((button) => {
    button.addEventListener('click', () => selectEvent(button.dataset.eventId))
  })
}

/** Keeps an open popup out from under the event card and the timeline panel. */
const POPUP_OPTIONS = {
  maxWidth: 310,
  className: 'atlas-popup',
  autoPanPaddingTopLeft: [48, 64],
  autoPanPaddingBottomRight: [400, 230],
}

function placePopup(place) {
  const related = EVENTS.filter((item) => item.places.includes(place.id)).slice(0, 4)

  return `<div class="place-popup">
    ${wikiMarkup(place)}
    <span class="popup-certainty ${place.certainty}">${CERTAINTY_LABEL[place.certainty]}</span>
    <h3>${place.name}</h3>
    ${place.modern ? `<p class="modern-name">Today: ${place.modern}</p>` : ''}
    ${place.note ? `<p>${place.note}</p>` : ''}
    ${related.length ? `<div class="popup-events"><strong>Events here</strong>${related.map((item) => `<button data-event-id="${item.id}">${item.title}</button>`).join('')}</div>` : ''}
  </div>`
}

function renderAllPlaces() {
  allPlacesLayer.clearLayers()
  if (!state.showPlaces) return
  PLACES.forEach((place) => {
    const marker = L.marker([place.lat, place.lng], {
      icon: iconForPlace(place),
      opacity: 0.46,
      riseOnHover: true,
      keyboard: true,
      title: place.name,
    })
    marker.bindTooltip(place.name, { direction: 'top', offset: [0, -7], className: 'place-tooltip' })
    marker.bindPopup(placePopup(place), POPUP_OPTIONS)
    marker.on('popupopen', (event) => {
      wireRelatedEvents()
      hydratePopup(event.popup, place)
    })
    marker.addTo(allPlacesLayer)
  })
}

function renderTerritories() {
  territoryLayer.clearLayers()
  const caption = document.querySelector('#territory-caption')
  const item = EVENT_BY_ID[state.selectedEvent]
  if (!state.showTerritories || !item) { if (caption) caption.hidden = true; return }

  const active = territoriesAt(item.year)
  for (const t of active) {
    for (const ring of t.rings) {
      L.polygon(ring.map(([lng, lat]) => [lat, lng]), {
        color: t.color, weight: 1.5, opacity: 0.75, fillColor: t.color, fillOpacity: 0.1,
        dashArray: '7 5', interactive: false, className: 'territory-shape',
      }).addTo(territoryLayer)
    }
  }
  territoryLayer.eachLayer((l) => l.bringToBack())

  if (caption) {
    caption.hidden = false
    // An empty result is information too: before the monarchy there is no polity to
    // draw, and saying nothing would read as the layer being broken.
    caption.innerHTML = active.length
      ? `<strong>${active.map((t) => t.name).join(' · ')}</strong>
         <span>${active.length === 1 ? active[0].precision + ' — ' : ''}borders are schematic</span>`
      : `<strong>No mapped polity at this date</strong>
         <span>the atlas maps territories from the monarchy onward</span>`
  }
}

function filteredEvents() {
  const query = state.query.trim().toLowerCase()
  return EVENTS.filter((item) => {
    if (state.selectedEra && item.era !== state.selectedEra) return false
    if (state.selectedBook && !EVENT_BOOKS.get(item.id).includes(state.selectedBook)) return false
    if (state.selectedTheme && !THEME_EVENT_SETS[state.selectedTheme].has(item.id)) return false
    if (!state.selectedCategories.has(item.category)) return false
    if (!query) return true
    const placeNames = item.places.map((id) => PLACE_BY_ID[id]?.name || '').join(' ')
    return [item.title, item.summary, item.scripture.join(' '), placeNames]
      .join(' ')
      .toLowerCase()
      .includes(query)
  })
}

function renderBookFilter() {
  const select = document.querySelector('#book-filter')
  const represented = BOOKS.map((book) => ({
    ...book,
    count: EVENTS.filter((item) => EVENT_BOOKS.get(item.id).includes(book.name)).length,
  })).filter(({ count }) => count > 0)

  select.innerHTML = `<option value="">All represented books</option>${Object.keys(BOOK_GROUP_LABEL).map((group) => {
    const books = represented.filter((book) => book.group === group)
    if (!books.length) return ''
    return `<optgroup label="${BOOK_GROUP_LABEL[group]}">${books.map((book) =>
      `<option value="${escapeHtml(book.name)}">${escapeHtml(book.name)} · ${book.count}</option>`).join('')}</optgroup>`
  }).join('')}`
  select.value = state.selectedBook ?? ''

  const summary = document.querySelector('#book-filter-summary')
  summary.hidden = !state.selectedBook
  if (state.selectedBook) {
    const count = filteredEvents().length
    summary.textContent = `${count} ${count === 1 ? 'timeline stop' : 'timeline stops'} · related people highlighted in the tree`
  }
}

function renderEraList() {
  const container = document.querySelector('#era-list')
  container.innerHTML = ERAS.filter((era) => !era.undated).map((era) => {
    const count = EVENTS.filter((item) => item.era === era.id).length
    return `<button class="era-option ${state.selectedEra === era.id ? 'active' : ''}" data-era="${era.id}" style="--era-color:${era.color}">
      <span class="era-dot"></span><span><strong>${era.name}</strong><small>${era.range.map(formatYear).join(' – ')}</small></span><b>${count}</b>
    </button>`
  }).join('')

  container.querySelectorAll('.era-option').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedEra = state.selectedEra === button.dataset.era ? null : button.dataset.era
      if (state.selectedEra) state.selectedTheme = null
      ensureSelectedEvent()
      render()
      fitFilteredEvents()
    })
  })
}

function renderThemes() {
  const container = document.querySelector('#theme-list')
  container.innerHTML = THEMES.map((item) => {
    const count = item.events.length
    return `<button class="theme-option ${state.selectedTheme === item.id ? 'active' : ''}" data-theme="${item.id}">
      <span class="theme-kind">${THEME_KIND_LABEL[item.kind]}</span>
      <span><strong>${item.name}</strong><small>${item.subtitle}</small></span><b>${count}</b>
    </button>`
  }).join('')

  container.querySelectorAll('.theme-option').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedTheme = state.selectedTheme === button.dataset.theme ? null : button.dataset.theme
      if (state.selectedTheme) state.selectedEra = null
      ensureSelectedEvent()
      render()
      fitFilteredEvents()
    })
  })

  const blurb = document.querySelector('#theme-blurb')
  const active = state.selectedTheme && THEME_BY_ID[state.selectedTheme]
  blurb.hidden = !active
  if (active) blurb.innerHTML = `<p>${active.blurb}</p>`
}

function renderCategories() {
  const container = document.querySelector('#category-list')
  container.innerHTML = CATEGORIES.map((category) => `
    <label class="category-chip ${state.selectedCategories.has(category.id) ? 'active' : ''}" style="--category-color:${category.color}">
      <input type="checkbox" value="${category.id}" ${state.selectedCategories.has(category.id) ? 'checked' : ''} />
      <span class="category-swatch"></span>${category.name}
    </label>
  `).join('')
  container.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', () => {
      input.checked ? state.selectedCategories.add(input.value) : state.selectedCategories.delete(input.value)
      ensureSelectedEvent()
      render()
    })
  })
}

function ensureSelectedEvent() {
  const events = filteredEvents()
  if (!events.some(({ id }) => id === state.selectedEvent)) state.selectedEvent = events[0]?.id || null
}

function renderOverviewMarkers() {
  eventOverviewLayer.clearLayers()
  filteredEvents().forEach((item) => {
    if (item.id === state.selectedEvent) return
    const place = PLACE_BY_ID[item.places[0]]
    if (!place) return
    const marker = L.marker([place.lat, place.lng], {
      icon: iconForPlace(place, false, item.category),
      opacity: 0.76,
      title: item.title,
    })
    marker.bindTooltip(`<strong>${item.title}</strong><br>${item.dateLabel}`, { direction: 'top', className: 'event-tooltip' })
    marker.on('click', () => selectEvent(item.id))
    marker.addTo(eventOverviewLayer)
  })
}

function drawSelectedEvent({ fit = false } = {}) {
  selectedEventLayer.clearLayers()
  const item = EVENT_BY_ID[state.selectedEvent]
  if (!item) return
  const category = CATEGORY_BY_ID[item.category]
  const placeIds = item.route || item.places
  const points = placeIds.map((id) => PLACE_BY_ID[id]).filter(Boolean)

  if (item.route && points.length > 1) {
    L.polyline(points.map(({ lat, lng }) => [lat, lng]), {
      color: category.color,
      weight: 4,
      opacity: 0.9,
      dashArray: item.dateConfidence === 'disputed' ? '9 8' : null,
      lineJoin: 'round',
      className: 'event-route-line',
    }).addTo(selectedEventLayer)
    L.polyline(points.map(({ lat, lng }) => [lat, lng]), {
      color: '#fffaf0',
      weight: 10,
      opacity: 0.35,
      lineJoin: 'round',
      className: 'event-route-glow',
    }).addTo(selectedEventLayer).bringToBack()
  }

  points.forEach((place, index) => {
    const marker = L.marker([place.lat, place.lng], {
      icon: iconForPlace(place, true, item.category),
      zIndexOffset: 1000,
      title: place.name,
    })
    marker.bindTooltip(`<strong>${index + 1}. ${place.name}</strong>${place.modern ? `<br>${place.modern}` : ''}`, {
      permanent: points.length <= 4,
      direction: 'top',
      offset: [0, -11],
      className: 'selected-tooltip',
    })
    marker.bindPopup(placePopup(place), POPUP_OPTIONS)
    marker.on('popupopen', (event) => hydratePopup(event.popup, place))
    marker.addTo(selectedEventLayer)
  })

  if (fit) fitPoints(points)
}

function fitPoints(points) {
  if (!points.length) return
  if (points.length === 1) {
    map.flyTo([points[0].lat, points[0].lng], 9, { duration: 0.8 })
    return
  }
  const bounds = L.latLngBounds(points.map(({ lat, lng }) => [lat, lng]))
  const isMobile = window.matchMedia('(max-width: 760px)').matches
  map.flyToBounds(bounds, {
    paddingTopLeft: isMobile ? [24, 46] : [42, 48],
    paddingBottomRight: isMobile ? [24, 178] : [385, 42],
    maxZoom: 8,
    duration: 0.9,
  })
}

function fitSelectedEvent() {
  const item = EVENT_BY_ID[state.selectedEvent]
  if (!item) return
  fitPoints((item.route || item.places).map((id) => PLACE_BY_ID[id]).filter(Boolean))
}

function fitFilteredEvents() {
  const points = filteredEvents().flatMap((item) => item.places.map((id) => PLACE_BY_ID[id])).filter(Boolean)
  if (points.length) fitPoints(points)
}

function confidenceClass(confidence) {
  return ['anchored', 'estimated', 'disputed', 'traditional', 'undated'].includes(confidence) ? confidence : 'estimated'
}

function renderEventCard() {
  const card = document.querySelector('#event-card')
  const item = EVENT_BY_ID[state.selectedEvent]
  if (!item) {
    card.innerHTML = `<div class="empty-card"><p class="eyebrow">No matching events</p><h2>Try broadening your filters.</h2></div>`
    card.classList.add('empty')
    return
  }
  card.classList.remove('empty')
  const era = ERA_BY_ID[item.era]
  const category = CATEGORY_BY_ID[item.category]
  const placeNames = item.places.map((id) => PLACE_BY_ID[id]?.name).filter(Boolean)
  const books = EVENT_BOOKS.get(item.id)
  card.innerHTML = `
    <div class="event-card-top">
      <span class="event-category" style="--category-color:${category.color}"><i></i>${category.name}</span>
      <span class="event-number">${String(EVENTS.indexOf(item) + 1).padStart(2, '0')}</span>
    </div>
    <p class="event-era">${era.name}</p>
    <h2>${item.title}</h2>
    <div class="event-date-row">
      <strong>${item.dateLabel}</strong>
      <span class="date-confidence ${confidenceClass(item.dateConfidence)}">${DATE_CONFIDENCE[item.dateConfidence]}</span>
    </div>
    <p class="event-summary">${item.summary}</p>
    ${books.length ? `<div class="event-books" aria-label="Biblical books">${books.map((book) =>
      `<span>${escapeHtml(book)}</span>`).join('')}</div>` : ''}
    <div class="place-sequence">${placeNames.map((name, index) => `<span>${name}</span>${index < placeNames.length - 1 ? '<i>→</i>' : ''}`).join('')}</div>
    ${item.note ? `<p class="event-note"><strong>Historical note</strong>${item.note}</p>` : ''}
    ${item.anchor ? `<p class="event-note event-anchor"><strong>Outside evidence</strong>${item.anchor}</p>` : ''}
    <div class="scripture-row">${ICONS.book}<div><span>Primary texts</span>
      <div class="scripture-refs">${item.scripture.map((ref) =>
        `<button class="ref-btn${state.openRef === ref ? ' open' : ''}" data-ref="${ref}">${ref}</button>`).join('')}</div>
    </div></div>
    <div class="passage" id="passage"></div>`

  renderPassage()
}

async function renderPassage() {
  await renderPassageInto(document.querySelector('#passage'), state.openRef, state.translation)
}

function renderEventRail() {
  const events = filteredEvents()
  const rail = document.querySelector('#event-rail')
  rail.innerHTML = events.map((item, index) => {
    const category = CATEGORY_BY_ID[item.category]
    return `<button class="rail-event ${item.id === state.selectedEvent ? 'active' : ''}" data-event-id="${item.id}" style="--category-color:${category.color}">
      <span class="rail-node"></span>
      <small>${item.dateLabel}</small>
      <strong>${item.title}</strong>
      <span>${item.places.length} ${item.places.length === 1 ? 'place' : 'places'}</span>
    </button>`
  }).join('')
  rail.querySelectorAll('.rail-event').forEach((button) => button.addEventListener('click', () => selectEvent(button.dataset.eventId)))

  const range = document.querySelector('#timeline-range')
  const selectedIndex = Math.max(0, events.findIndex(({ id }) => id === state.selectedEvent))
  range.max = Math.max(0, events.length - 1)
  range.value = selectedIndex
  range.disabled = events.length < 2
  range.style.setProperty('--range-progress', events.length > 1 ? `${(selectedIndex / (events.length - 1)) * 100}%` : '0%')

  document.querySelector('#event-count').textContent = `${events.length} ${events.length === 1 ? 'event' : 'events'}`
  document.querySelector('#timeline-ticks').innerHTML = events.map((item, index) => {
    if (events.length > 9 && index % Math.ceil(events.length / 7) !== 0 && index !== events.length - 1) return ''
    return `<span style="left:${events.length === 1 ? 0 : (index / (events.length - 1)) * 100}%">${item.tickLabel || formatYear(item.year)}</span>`
  }).join('')

  requestAnimationFrame(() => {
    const active = rail.querySelector('.active')
    if (!active) return
    rail.scrollTo({
      left: active.offsetLeft - (rail.clientWidth / 2) + (active.clientWidth / 2),
      behavior: 'smooth',
    })
  })
}

function renderStatus() {
  const item = EVENT_BY_ID[state.selectedEvent]
  const era = item ? ERA_BY_ID[item.era] : null
  document.querySelector('#status-era').textContent = era?.name || (state.selectedEra ? ERA_BY_ID[state.selectedEra].name : 'All eras')
  document.querySelector('#status-date').textContent = item?.dateLabel || 'No events'
  document.querySelector('#timeline-date').textContent = item?.dateLabel || 'No events'
}

function render() {
  renderBookFilter()
  renderEraList()
  renderThemes()
  renderCategories()
  renderEventRail()
  renderEventCard()
  renderOverviewMarkers()
  drawSelectedEvent()
  renderTerritories()
  renderStatus()
}

function selectEvent(id, { fit = true } = {}) {
  if (!EVENT_BY_ID[id]) return
  state.selectedEvent = id
  render()
  if (fit) fitSelectedEvent()
}

function stopPlayback() {
  state.playing = false
  clearInterval(playTimer)
  playTimer = null
  const button = document.querySelector('#play-timeline')
  button.classList.remove('playing')
  button.querySelector('.play-icon').textContent = '▶'
  button.setAttribute('aria-label', 'Play timeline')
}

function togglePlayback() {
  if (state.playing) return stopPlayback()
  const events = filteredEvents()
  if (events.length < 2) return
  state.playing = true
  const button = document.querySelector('#play-timeline')
  button.classList.add('playing')
  button.querySelector('.play-icon').textContent = 'Ⅱ'
  button.setAttribute('aria-label', 'Pause timeline')
  playTimer = setInterval(() => {
    const currentIndex = events.findIndex(({ id }) => id === state.selectedEvent)
    const nextIndex = (currentIndex + 1) % events.length
    selectEvent(events[nextIndex].id)
  }, 2800)
}

function openSidebar() {
  document.querySelector('#sidebar').classList.add('open')
  document.querySelector('#mobile-scrim').classList.add('visible')
}

function closeSidebar() {
  document.querySelector('#sidebar').classList.remove('open')
  document.querySelector('#mobile-scrim').classList.remove('visible')
}

document.querySelector('#timeline-range').addEventListener('input', (event) => {
  const events = filteredEvents()
  const item = events[Number(event.target.value)]
  if (item) selectEvent(item.id, { fit: false })
})
document.querySelector('#timeline-range').addEventListener('change', fitSelectedEvent)
document.querySelector('#play-timeline').addEventListener('click', togglePlayback)
document.querySelector('#fit-event').addEventListener('click', fitSelectedEvent)
document.querySelector('#toggle-places').addEventListener('click', (event) => {
  state.showPlaces = !state.showPlaces
  event.currentTarget.classList.toggle('active', state.showPlaces)
  event.currentTarget.setAttribute('aria-pressed', String(state.showPlaces))
  renderAllPlaces()
})
document.querySelector('#toggle-territories').addEventListener('click', (event) => {
  state.showTerritories = !state.showTerritories
  event.currentTarget.classList.toggle('active', state.showTerritories)
  event.currentTarget.setAttribute('aria-pressed', String(state.showTerritories))
  renderTerritories()
})

// Scripture references and the translation switch both live inside markup that is
// re-rendered on every selection, so they are delegated from the card itself.
document.querySelector('#event-card').addEventListener('click', (event) => {
  const ref = event.target.closest('.ref-btn')
  if (ref) {
    state.openRef = state.openRef === ref.dataset.ref ? null : ref.dataset.ref
    renderEventCard()
    return
  }
  const trans = event.target.closest('[data-trans]')
  if (trans) {
    state.translation = trans.dataset.trans
    renderPassage()
    document.querySelectorAll('[data-trans]').forEach((b) =>
      b.classList.toggle('on', b.dataset.trans === state.translation))
  }
})

const tree = createTree(document.querySelector('#tree-view'), {
  onShowInAtlas: (eventId) => { setView('atlas'); selectEvent(eventId) },
})

function setView(view) {
  const isTree = view === 'tree'
  document.querySelector('.topbar').classList.toggle('tree-mode', isTree)
  document.querySelector('.atlas-shell').hidden = isTree
  document.querySelector('#tree-view').hidden = !isTree
  document.querySelectorAll('[data-view]').forEach((b) => {
    const on = b.dataset.view === view
    b.classList.toggle('on', on)
    b.setAttribute('aria-selected', String(on))
  })
  if (isTree) {
    tree.setBook(state.selectedBook)
    tree.show()
  }
  // Leaflet cannot measure a hidden container, so the map is re-measured on return.
  else requestAnimationFrame(() => map.invalidateSize())
}

document.querySelector('.view-tabs').addEventListener('click', (event) => {
  const view = event.target.closest('[data-view]')?.dataset.view
  if (view) setView(view)
})

document.querySelector('#clear-era').addEventListener('click', () => {
  state.selectedEra = null
  ensureSelectedEvent()
  render()
  fitFilteredEvents()
})
document.querySelector('#book-filter').addEventListener('change', (event) => {
  state.selectedBook = event.target.value || null
  ensureSelectedEvent()
  tree.setBook(state.selectedBook)
  render()
  fitFilteredEvents()
})
document.querySelector('#clear-book').addEventListener('click', () => {
  state.selectedBook = null
  ensureSelectedEvent()
  tree.setBook(null)
  render()
  fitFilteredEvents()
})
document.querySelector('#clear-theme').addEventListener('click', () => {
  state.selectedTheme = null
  ensureSelectedEvent()
  render()
  fitFilteredEvents()
})
document.querySelector('#clear-categories').addEventListener('click', () => {
  state.selectedCategories = new Set(CATEGORIES.map(({ id }) => id))
  ensureSelectedEvent()
  render()
})
document.querySelector('#atlas-search').addEventListener('input', (event) => {
  state.query = event.target.value
  ensureSelectedEvent()
  render()
})

const methodDialog = document.querySelector('#method-dialog')
document.querySelector('#method-button').addEventListener('click', () => methodDialog.showModal())
document.querySelector('#dialog-close').addEventListener('click', () => methodDialog.close())
methodDialog.addEventListener('click', (event) => {
  if (event.target === methodDialog) methodDialog.close()
})
document.querySelector('#mobile-filters').addEventListener('click', openSidebar)
document.querySelector('#sidebar-close').addEventListener('click', closeSidebar)
document.querySelector('#mobile-scrim').addEventListener('click', closeSidebar)

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    document.querySelector('#atlas-search').focus()
    openSidebar()
  }
  if (event.key === 'Escape') closeSidebar()
  if (['ArrowRight', 'ArrowLeft'].includes(event.key) && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    const events = filteredEvents()
    const index = events.findIndex(({ id }) => id === state.selectedEvent)
    const next = event.key === 'ArrowRight' ? index + 1 : index - 1
    if (events[next]) selectEvent(events[next].id)
  }
})

renderAllPlaces()
render()

// Leaflet measures its container when the map is created, which happens before the
// shell has been laid out, and the stylesheet pulls in webfonts that reflow it again
// afterwards. Fitting before both have settled measures the wrong container size, so the
// space reserved for the event card ends up on the wrong side and the start of a long
// route (Ur, on Abraham's journey) lands underneath the card. Wait for fonts, then fit.
const initialFit = () => {
  map.invalidateSize()
  fitSelectedEvent()
}
const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve()
fontsReady.then(() => requestAnimationFrame(initialFit)).catch(() => requestAnimationFrame(initialFit))

window.addEventListener('beforeunload', () => clearInterval(playTimer))
