import { EVENTS } from './data/events.js'
import { PLACES } from './data/places.js'
import { SOURCE_CATALOG } from './data/provenance.js'
import { escapeHtml } from './verses.js'

const SOURCE_TYPE_LABEL = {
  'primary-text': 'Primary text',
  editorial: 'Editorial method',
  'geographic-data': 'Geographic data',
  reference: 'Reference work',
  media: 'Media collection',
  'archaeological-reference': 'Archaeological authority',
  'basemap-data': 'Basemap data',
}

const SOURCE_ORDER = [
  'biblical-text',
  'ancient-text',
  'ucl-digital-egypt',
  'jewish-museum',
  'digital-karnak',
  'louvre-collections',
  'british-museum',
  'oracc',
  'michigan-image-database',
  'elephantine-project',
  'perseus',
  'israel-museum',
  'phi-inscriptions',
  'parco-colosseo',
  'unesco-world-heritage',
  'openbible-geocoding',
  'pleiades',
  'israel-nature-parks',
  'wikipedia',
  'wikimedia-commons',
  'openstreetmap',
  'editorial-research',
  'project-gazetteer',
]

function sourceLink(source) {
  const title = escapeHtml(source.title)
  return source.url
    ? `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${title}<span aria-hidden="true">↗</span></a>`
    : `<strong>${title}</strong>`
}

function unescoPlaces() {
  return PLACES.flatMap((place) => place.provenance.sources
    .filter(({ sourceId }) => sourceId === 'unesco-world-heritage')
    .map((source) => ({ place, source })))
    .sort((a, b) => a.place.name.localeCompare(b.place.name))
}

function eventsUsingPlaces(placeIds) {
  return EVENTS.filter((event) => event.places.some((id) => placeIds.has(id))).length
}

export function sourcesPageMarkup() {
  const heritagePlaces = unescoPlaces()
  const heritagePlaceIds = new Set(heritagePlaces.map(({ place }) => place.id))
  const reviewedPlaces = PLACES.filter(({ provenance }) => provenance.status === 'primary-cited').length
  const evidenceReviewedEvents = EVENTS.filter(({ evidenceLimit }) => evidenceLimit).length
  const latestReview = [...PLACES, ...EVENTS].map(({ provenance }) => provenance.reviewedOn)
    .filter(Boolean).sort().at(-1)

  const sourceCards = SOURCE_ORDER.map((id) => {
    const source = SOURCE_CATALOG[id]
    if (!source) return ''
    return `<article class="source-library-card">
      <p>${escapeHtml(SOURCE_TYPE_LABEL[source.type] ?? source.type)}</p>
      <h3>${sourceLink(source)}</h3>
      <small>${escapeHtml(source.license)}</small>
    </article>`
  }).join('')

  const heritageCards = heritagePlaces.map(({ place, source }) => `<li>
    <div>
      <strong>${escapeHtml(place.name)}</strong>
      <span>${escapeHtml(source.citations.join(' · '))}</span>
    </div>
    <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer" aria-label="Open UNESCO record for ${escapeHtml(place.name)}">View record ↗</a>
  </li>`).join('')

  return `<div class="sources-shell">
    <header class="sources-hero">
      <div>
        <p class="eyebrow">Research &amp; attribution</p>
        <h1>Follow the evidence.</h1>
        <p>Bible History Explorer separates the biblical narrative, historical chronology, geographic identification, and archaeological evidence. Every claim should lead readers back to the record that supports it.</p>
      </div>
      <dl class="sources-stats" aria-label="Source review progress">
        <div><dt>${reviewedPlaces}</dt><dd>places source-reviewed</dd></div>
        <div><dt>${evidenceReviewedEvents}</dt><dd>events evidence-reviewed</dd></div>
        <div><dt>${heritagePlaces.length}</dt><dd>UNESCO-linked places</dd></div>
        <div><dt>${eventsUsingPlaces(heritagePlaceIds)}</dt><dd>events with UNESCO context</dd></div>
      </dl>
    </header>

    <main class="sources-content">
      <section class="sources-section heritage-section" aria-labelledby="heritage-title">
        <div class="sources-section-heading">
          <div>
            <p class="eyebrow">World Heritage context</p>
            <h2 id="heritage-title">UNESCO in the timeline</h2>
          </div>
          <a class="source-primary-link" href="https://whc.unesco.org/" target="_blank" rel="noopener noreferrer">UNESCO World Heritage Centre ↗</a>
        </div>
        <div class="heritage-intro">
          <p>UNESCO records help establish the archaeological and cultural significance of a site. They do not, by themselves, prove that every biblical event associated with that place occurred as narrated.</p>
          <p>We summarize facts in our own words and link to the official record. We do not reproduce UNESCO descriptions, photographs, or emblems unless an individual item explicitly permits reuse.</p>
        </div>
        <ul class="heritage-list">${heritageCards}</ul>
        <div class="rights-note">
          <strong>Reuse policy</strong>
          <p>UNESCO rights can vary by item. Attribution alone is not always permission to republish. See the <a href="https://whc.unesco.org/en/faq/%26action%3Dlist%26mode%3Dblock%26maxrows%3D88" target="_blank" rel="noopener noreferrer">World Heritage Centre terms</a> and <a href="https://whc.unesco.org/en/licenses/" target="_blank" rel="noopener noreferrer">license catalogue</a>.</p>
        </div>
      </section>

      <section class="sources-section" aria-labelledby="library-title">
        <div class="sources-section-heading">
          <div>
            <p class="eyebrow">Source library</p>
            <h2 id="library-title">What the project consults</h2>
          </div>
        </div>
        <div class="source-library">${sourceCards}</div>
      </section>

      <section class="sources-section method-section" aria-labelledby="method-title">
        <div class="sources-section-heading">
          <div>
            <p class="eyebrow">Editorial method</p>
            <h2 id="method-title">How records earn a citation</h2>
          </div>
        </div>
        <ol class="method-steps">
          <li><span>01</span><div><strong>Start with the text</strong><p>The relevant biblical and ancient passages are cited without treating a citation as external corroboration.</p></div></li>
          <li><span>02</span><div><strong>Separate the questions</strong><p>An event’s date confidence and a place’s identification confidence are assessed independently.</p></div></li>
          <li><span>03</span><div><strong>Prefer original records</strong><p>Coordinates and archaeological claims are traced to gazetteers, excavations, heritage authorities, or other primary publishers.</p></div></li>
          <li><span>04</span><div><strong>Disclose uncertainty</strong><p>Probable, disputed, traditional, and symbolic locations remain visibly labelled instead of being flattened into exact points.</p></div></li>
        </ol>
        ${latestReview ? `<p class="sources-reviewed">Source register last reviewed ${escapeHtml(latestReview)}.</p>` : ''}
      </section>
    </main>
  </div>`
}
