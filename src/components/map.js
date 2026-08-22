import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { state, update, selectEvent, visibleEvents } from '../store.js'
import { PLACE_BY_ID, CERTAINTY_LABEL } from '../data/places.js'
import { ERA_BY_ID } from '../data/eras.js'
import { JOURNEYS, JOURNEY_BY_ID } from '../data/journeys.js'

const BASEMAPS = {
  plain: {
    label: 'Plain',
    url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
    maxZoom: 19,
  },
  terrain: {
    label: 'Terrain',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 13,
  },
  modern: {
    label: 'Modern',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
    maxZoom: 19,
  },
}

/** Certainty levels that get a dashed ring rather than a solid one. */
const UNSURE = new Set(['disputed', 'traditional', 'symbolic'])

export function createMap(root) {
  root.innerHTML = `
    <div id="leaflet"></div>
    <div class="map-controls">
      <div class="seg" role="group" aria-label="Base map">
        ${Object.entries(BASEMAPS).map(([k, v]) =>
          `<button data-base="${k}"${k === state.basemap ? ' class="on"' : ''}>${v.label}</button>`).join('')}
      </div>
    </div>
    <div class="map-legend">
      <span><i class="lg-dot"></i>Located</span>
      <span><i class="lg-dot lg-unsure"></i>Disputed or traditional</span>
    </div>
  `

  const map = L.map(root.querySelector('#leaflet'), {
    center: [32.5, 35.0],
    zoom: 6,
    minZoom: 3,
    maxZoom: 13,
    zoomControl: false,
    worldCopyJump: false,
    attributionControl: true,
  })
  L.control.zoom({ position: 'topleft' }).addTo(map)
  map.attributionControl.setPrefix('')

  let tileLayer = null
  function setBase(key) {
    const b = BASEMAPS[key]
    if (tileLayer) map.removeLayer(tileLayer)
    tileLayer = L.tileLayer(b.url, { attribution: b.attribution, maxZoom: b.maxZoom, crossOrigin: true })
    tileLayer.addTo(map)
    tileLayer.bringToBack()
  }
  setBase(state.basemap)

  root.querySelector('.map-controls').onclick = (e) => {
    const key = e.target.dataset.base
    if (!key) return
    root.querySelectorAll('[data-base]').forEach((b) => b.classList.toggle('on', b.dataset.base === key))
    setBase(key)
    update({ basemap: key }, 'basemap')
  }

  const journeyLayer = L.layerGroup().addTo(map)
  const markerLayer = L.layerGroup().addTo(map)
  const markers = new Map()   // placeId -> { marker, events }

  // ---- markers -----------------------------------------------------------
  function renderMarkers() {
    markerLayer.clearLayers()
    markers.clear()

    // One marker per place; several events often share a site.
    const byPlace = new Map()
    for (const ev of visibleEvents()) {
      if (!byPlace.has(ev.placeId)) byPlace.set(ev.placeId, [])
      byPlace.get(ev.placeId).push(ev)
    }

    const showLabels = map.getZoom() >= 7

    for (const [placeId, events] of byPlace) {
      const place = PLACE_BY_ID[placeId]
      if (!place) continue
      const unsure = UNSURE.has(place.certainty)
      const era = ERA_BY_ID[events[0].era]
      const hasSelected = events.some((e) => e.id === state.selectedId)
      const r = Math.min(13, 5 + Math.sqrt(events.length) * 2.2)

      const marker = L.circleMarker([place.lat, place.lng], {
        radius: hasSelected ? r + 3 : r,
        color: hasSelected ? '#1c1a17' : era.color,
        weight: hasSelected ? 2.5 : 1.6,
        fillColor: era.color,
        fillOpacity: hasSelected ? 0.95 : 0.62,
        dashArray: unsure ? '3 3' : null,
        className: `pin${unsure ? ' pin-unsure' : ''}${hasSelected ? ' pin-selected' : ''}`,
      })

      marker.bindTooltip(
        `<strong>${place.name}</strong>${place.modern ? `<em>${place.modern}</em>` : ''}` +
        `<span>${events.length} event${events.length > 1 ? 's' : ''}</span>`,
        { direction: 'top', offset: [0, -r - 2], className: 'pin-tip', permanent: false },
      )

      if (showLabels) {
        marker.bindTooltip(place.name, {
          permanent: true, direction: 'right', offset: [r + 3, 0], className: 'pin-name',
        })
      }

      marker.on('click', () => {
        // Cycle through events at a shared site on repeated clicks.
        const i = events.findIndex((e) => e.id === state.selectedId)
        selectEvent(events[(i + 1) % events.length].id)
      })
      marker.on('mouseover', () => update({ hoveredId: events[0].id }, 'hover'))
      marker.on('mouseout', () => update({ hoveredId: null }, 'hover'))

      marker.addTo(markerLayer)
      markers.set(placeId, { marker, events })
    }
  }

  // ---- journeys ----------------------------------------------------------
  function renderJourneys() {
    journeyLayer.clearLayers()
    for (const j of JOURNEYS) {
      if (!state.activeJourneys.has(j.id)) continue
      const pts = j.stops.map((id) => PLACE_BY_ID[id]).filter(Boolean).map((p) => [p.lat, p.lng])
      if (pts.length < 2) continue

      L.polyline(pts, {
        color: '#ffffff', weight: 7, opacity: 0.75, lineJoin: 'round', interactive: false,
      }).addTo(journeyLayer)

      const line = L.polyline(pts, {
        color: j.color, weight: 3, opacity: 0.95, lineJoin: 'round',
        dashArray: '10 7', className: 'route-line',
      }).addTo(journeyLayer)
      line.bindTooltip(`<strong>${j.name}</strong><span>${j.ref}</span>`, { sticky: true, className: 'pin-tip' })

      for (const [i, id] of j.stops.entries()) {
        const p = PLACE_BY_ID[id]
        if (!p) continue
        const first = i === 0, last = i === j.stops.length - 1
        if (!first && !last) continue
        L.circleMarker([p.lat, p.lng], {
          radius: 5, color: j.color, weight: 2.5,
          fillColor: first ? '#fff' : j.color, fillOpacity: 1, className: 'route-cap',
        }).bindTooltip(`${first ? 'Start' : 'End'}: ${p.name}`, { direction: 'top', className: 'pin-tip' })
          .addTo(journeyLayer)
      }
    }
  }

  /** Fit the map to a journey's extent. */
  function fitJourney(id) {
    const j = JOURNEY_BY_ID[id]
    if (!j) return
    const pts = j.stops.map((s) => PLACE_BY_ID[s]).filter(Boolean).map((p) => [p.lat, p.lng])
    if (pts.length) map.fitBounds(L.latLngBounds(pts).pad(0.12), { animate: true })
  }

  /** Centre on an event's place without yanking the zoom around. */
  function focusEvent(ev) {
    const place = PLACE_BY_ID[ev?.placeId]
    if (!place) return
    const target = L.latLng(place.lat, place.lng)
    if (!map.getBounds().pad(-0.18).contains(target)) {
      map.panTo(target, { animate: true, duration: 0.5 })
    }
    markers.get(ev.placeId)?.marker.openTooltip()
  }

  map.on('zoomend', renderMarkers)

  return { map, renderMarkers, renderJourneys, focusEvent, fitJourney }
}
