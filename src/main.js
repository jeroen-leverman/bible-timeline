import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import './style.css'
import { ERAS, ERA_BY_ID, CATEGORIES, CATEGORY_BY_ID } from './data/eras.js'
import { PLACES, PLACE_BY_ID, CERTAINTY_LABEL } from './data/places.js'
import { EVENTS, EVENT_BY_ID, DATE_CONFIDENCE } from './data/events.js'
import { THEMES, THEME_BY_ID, THEME_EVENT_SETS, THEME_KIND_LABEL } from './data/themes.js'

const ICONS = {
  compass: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>',
  book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5c3.2-.8 5.9 0 8 2v12c-2.1-2-4.8-2.8-8-2V5.5Z"/><path d="M20 5.5c-3.2-.8-5.9 0-8 2v12c2.1-2 4.8-2.8 8-2V5.5Z"/></svg>',
  layers: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></svg>',
  route: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M7.5 16.5 16.5 7.5M8 6h3a3 3 0 0 1 3 3v6"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
}

const app = document.querySelector('#app')

app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="#" aria-label="Scripture Atlas home">
      <span class="brand-mark">${ICONS.compass}</span>
      <span><strong>Scripture Atlas</strong><small>Biblical history in place & time</small></span>
    </a>
    <div class="top-actions">
      <button class="icon-button mobile-only" id="mobile-filters" aria-label="Open filters">${ICONS.layers}</button>
      <button class="method-button" id="method-button"><span>About this atlas</span><span aria-hidden="true">↗</span></button>
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
      </div>

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

  <dialog class="method-dialog" id="method-dialog">
    <button class="dialog-close icon-button" id="dialog-close" aria-label="Close">${ICONS.close}</button>
    <p class="eyebrow">A note on method</p>
    <h2>A map can clarify history—and overstate it.</h2>
    <p>This atlas distinguishes three different things: what the biblical text says, how an event is dated, and how confidently a modern location can be identified. A precise dot does not always mean a precise identification.</p>
    <div class="method-grid">
      <div><span>01</span><h3>Dates are ranges</h3><p>Approximate and disputed chronologies are labeled rather than silently harmonized.</p></div>
      <div><span>02</span><h3>Places vary</h3><p>Excavated sites, probable identifications, and later traditional sites use different symbols.</p></div>
      <div><span>03</span><h3>Routes are interpretive</h3><p>Lines connect the named sequence of places; they do not claim to reconstruct every ancient road.</p></div>
    </div>
    <p class="dialog-footnote">The basemap shows modern coastlines and terrain with present-day labels removed, so the ancient names stand on their own. It does not depict ancient political boundaries.</p>
  </dialog>
  <div class="mobile-scrim" id="mobile-scrim"></div>
`

const state = {
  selectedEra: null,
  selectedTheme: null,
  selectedCategories: new Set(CATEGORIES.map(({ id }) => id)),
  selectedEvent: (EVENTS.find((item) => item.featured) || EVENTS[0]).id,
  query: '',
  showPlaces: true,
  playing: false,
}

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

function placePopup(place) {
  const related = EVENTS.filter((item) => item.places.includes(place.id)).slice(0, 4)
  return `<div class="place-popup">
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
    marker.bindPopup(placePopup(place), { maxWidth: 310, className: 'atlas-popup' })
    marker.on('popupopen', () => {
      document.querySelectorAll('.popup-events button').forEach((button) => {
        button.addEventListener('click', () => selectEvent(button.dataset.eventId))
      })
    })
    marker.addTo(allPlacesLayer)
  })
}

function filteredEvents() {
  const query = state.query.trim().toLowerCase()
  return EVENTS.filter((item) => {
    if (state.selectedEra && item.era !== state.selectedEra) return false
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
    marker.bindPopup(placePopup(place), { maxWidth: 310, className: 'atlas-popup' })
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
    <div class="place-sequence">${placeNames.map((name, index) => `<span>${name}</span>${index < placeNames.length - 1 ? '<i>→</i>' : ''}`).join('')}</div>
    ${item.note ? `<p class="event-note"><strong>Historical note</strong>${item.note}</p>` : ''}
    ${item.anchor ? `<p class="event-note event-anchor"><strong>Outside evidence</strong>${item.anchor}</p>` : ''}
    <div class="scripture-row">${ICONS.book}<div><span>Primary texts</span><strong>${item.scripture.join(' · ')}</strong></div></div>
  `
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
  renderEraList()
  renderThemes()
  renderCategories()
  renderEventRail()
  renderEventCard()
  renderOverviewMarkers()
  drawSelectedEvent()
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
document.querySelector('#clear-era').addEventListener('click', () => {
  state.selectedEra = null
  ensureSelectedEvent()
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

