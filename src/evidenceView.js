import { EVENTS } from './data/events.js'
import { ERA_BY_ID, ERAS } from './data/eras.js'
import { PLACE_BY_ID } from './data/places.js'
import { SOURCE_CATALOG } from './data/provenance.js'
import { escapeHtml } from './verses.js'

const reviewedEvents = () => EVENTS.filter(({ evidenceLimit }) => evidenceLimit)

function sourceName(source) {
  return SOURCE_CATALOG[source.sourceId]?.title ?? source.sourceId
}

function evidenceSources(event) {
  return event.provenance.sources.filter(({ role, url }) => role === 'historical-evidence' && url)
}

function evidenceCard(event) {
  const era = ERA_BY_ID[event.era]
  const places = event.places.map((id) => PLACE_BY_ID[id]?.name).filter(Boolean)
  const sources = evidenceSources(event)
  return `<article class="evidence-card" style="--era-color:${era.color}">
    <div class="evidence-card-top"><span>${escapeHtml(era.short)}</span><b>${escapeHtml(event.dateLabel)}</b></div>
    <h2>${escapeHtml(event.title)}</h2>
    <p class="evidence-support"><strong>What survives</strong>${escapeHtml(event.anchor)}</p>
    <p class="evidence-caution"><strong>Read with care</strong>${escapeHtml(event.evidenceLimit)}</p>
    <div class="evidence-card-places" aria-label="Places">${places.map((name) => `<span>${escapeHtml(name)}</span>`).join('')}</div>
    <div class="evidence-card-sources">${sources.map((source) =>
      `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer"><span>${escapeHtml(sourceName(source))}</span><small>${escapeHtml(source.citations[0])}</small></a>`).join('')}</div>
    <button class="evidence-atlas-link" data-evidence-event="${escapeHtml(event.id)}">Show event on the atlas →</button>
  </article>`
}

export function createEvidenceExplorer(container, { onShowInAtlas }) {
  let query = ''
  let era = ''

  container.innerHTML = `<div class="evidence-shell">
    <header class="evidence-hero">
      <div><p class="eyebrow">Objects, inscriptions &amp; ancient texts</p><h1>Evidence Explorer</h1>
      <p>Start with what survives. Then see which part of a biblical event it can—and cannot—help historians evaluate.</p></div>
      <div class="evidence-hero-count"><strong>${reviewedEvents().length}</strong><span>events reviewed</span><small>Every card links to its publishing museum, corpus, or ancient text.</small></div>
    </header>
    <main class="evidence-content">
      <div class="evidence-toolbar">
        <label><span>Search evidence</span><input id="evidence-search" type="search" placeholder="Try David, Babylon, inscription…"></label>
        <label><span>Historical era</span><select id="evidence-era"><option value="">All reviewed eras</option>${ERAS.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join('')}</select></label>
        <p id="evidence-result-count"></p>
      </div>
      <section class="evidence-grid" id="evidence-grid" aria-live="polite"></section>
    </main>
  </div>`

  const render = () => {
    const needle = query.trim().toLowerCase()
    const events = reviewedEvents().filter((event) => {
      if (era && event.era !== era) return false
      if (!needle) return true
      const haystack = [event.title, event.anchor, event.evidenceLimit, event.dateLabel,
        ...event.places.map((id) => PLACE_BY_ID[id]?.name ?? ''),
        ...evidenceSources(event).flatMap((source) => [sourceName(source), ...source.citations])].join(' ').toLowerCase()
      return haystack.includes(needle)
    })
    container.querySelector('#evidence-result-count').textContent = `${events.length} reviewed ${events.length === 1 ? 'event' : 'events'}`
    container.querySelector('#evidence-grid').innerHTML = events.length
      ? events.map(evidenceCard).join('')
      : '<p class="evidence-empty">No evidence records match those filters.</p>'
  }

  container.querySelector('#evidence-search').addEventListener('input', (event) => {
    query = event.target.value
    render()
  })
  container.querySelector('#evidence-era').addEventListener('change', (event) => {
    era = event.target.value
    render()
  })
  container.addEventListener('click', (event) => {
    const eventId = event.target.closest('[data-evidence-event]')?.dataset.evidenceEvent
    if (eventId) onShowInAtlas(eventId)
  })
  render()

  return { refresh: render }
}
