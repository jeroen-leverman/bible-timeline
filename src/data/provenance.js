import { booksForReferences } from './books.js'

/**
 * Provenance schema v1
 * --------------------
 * Every event, person, and place carries a `provenance` object. A source entry
 * describes what a source supports (`role`), how precisely it is cited
 * (`verification`), and the reference or locator that lets a reader find it.
 *
 * New hand-curated records can add `sourceRefs` alongside their normal fields:
 *   sourceRefs: [{
 *     sourceId: 'pleiades', role: 'geographic-identification',
 *     citation: 'Pleiades place 687928', url: 'https://...',
 *     license: 'CC BY 3.0', verification: 'cited'
 *   }]
 */

export const PROVENANCE_SCHEMA_VERSION = 1

export const SOURCE_CATALOG = {
  'biblical-text': {
    title: 'Biblical text',
    type: 'primary-text',
    license: 'WEB and KJV text displayed here: public domain',
  },
  'ancient-text': {
    title: 'Ancient literary source',
    type: 'primary-text',
    license: 'Citation only; edition varies',
  },
  'editorial-research': {
    title: 'Bible History Explorer research',
    type: 'editorial',
    license: 'Original project content',
  },
  'project-gazetteer': {
    title: 'Project gazetteer',
    type: 'geographic-data',
    license: 'Original project data; bibliography in progress',
  },
  wikipedia: {
    title: 'Wikipedia',
    type: 'reference',
    license: 'Article licence shown by publisher',
    url: 'https://www.wikipedia.org/',
  },
  'wikimedia-commons': {
    title: 'Wikimedia Commons',
    type: 'media',
    license: 'Per-file licence',
    url: 'https://commons.wikimedia.org/',
  },
  'openbible-geocoding': {
    title: 'OpenBible.info geocoding data',
    type: 'geographic-data',
    license: 'CC BY 4.0',
    url: 'https://www.openbible.info/geo/',
  },
  pleiades: {
    title: 'Pleiades',
    type: 'geographic-data',
    license: 'CC BY 3.0',
    url: 'https://pleiades.stoa.org/',
  },
  'unesco-world-heritage': {
    title: 'UNESCO World Heritage Centre',
    type: 'archaeological-reference',
    license: 'Citation only; reuse terms vary by item',
    url: 'https://whc.unesco.org/',
  },
  'israel-nature-parks': {
    title: 'Israel Nature and Parks Authority',
    type: 'archaeological-reference',
    license: 'Citation only; page rights retained by publisher',
    url: 'https://en.parks.org.il/',
  },
  openstreetmap: {
    title: 'OpenStreetMap',
    type: 'basemap-data',
    license: 'ODbL',
    url: 'https://www.openstreetmap.org/copyright',
  },
}

export const PROVENANCE_STATUS = {
  'primary-cited': 'Sources cited',
  partial: 'Bibliography in progress',
  'needs-review': 'Source review needed',
}

export const PROVENANCE_STATUS_SHORT = {
  'primary-cited': 'Sources cited',
  partial: 'Sources in progress',
  'needs-review': 'Source review',
}

export const VERIFICATION_LABEL = {
  cited: 'Source cited',
  'method-disclosed': 'Method disclosed',
  'needs-citation': 'Full citation needed',
}

export const SOURCE_ROLE_LABEL = {
  'primary-text': 'Biblical narrative',
  'ancient-primary': 'Ancient primary text',
  chronology: 'Chronology',
  'historical-evidence': 'External evidence',
  commentary: 'Historical commentary',
  biography: 'Biographical summary',
  'geographic-identification': 'Place identification and coordinates',
  'reference-summary': 'Reference summary',
  media: 'Image',
}

const citations = (value) => (Array.isArray(value) ? value : value ? [value] : [])
const isBiblicalReference = (reference) => booksForReferences([reference]).length > 0

function referenceSources(references = []) {
  const biblical = references.filter(isBiblicalReference)
  const ancient = references.filter((reference) => !isBiblicalReference(reference))
  return [
    biblical.length && {
      sourceId: 'biblical-text', role: 'primary-text', citations: biblical, verification: 'cited',
    },
    ancient.length && {
      sourceId: 'ancient-text', role: 'ancient-primary', citations: ancient, verification: 'cited',
    },
  ].filter(Boolean)
}

function manualSources(record) {
  return (record.sourceRefs ?? []).map((source) => ({
    ...source,
    citations: citations(source.citations ?? source.citation),
    verification: source.verification ?? 'cited',
  }))
}

function provenance(kind, status, note, sources, reviewedOn = null) {
  return {
    schemaVersion: PROVENANCE_SCHEMA_VERSION,
    kind,
    status,
    reviewedOn,
    note,
    sources,
  }
}

export function buildEventProvenance(record) {
  const sources = [...referenceSources(record.scripture), ...manualSources(record)]
  const hasChronologySource = sources.some(({ role }) => role === 'chronology')
  if (!hasChronologySource) {
    sources.push({
      sourceId: 'editorial-research', role: 'chronology',
      citations: [record.dateLabel ?? String(record.year)],
      verification: record.dateConfidence === 'undated' ? 'method-disclosed' : 'needs-citation',
    })
  }
  if (record.anchor && !sources.some(({ role }) => role === 'historical-evidence')) {
    sources.push({
      sourceId: 'editorial-research', role: 'historical-evidence',
      citations: [record.anchor], verification: 'needs-citation',
    })
  }
  if (record.note && !sources.some(({ role }) => role === 'commentary')) {
    sources.push({
      sourceId: 'editorial-research', role: 'commentary',
      citations: [record.note], verification: 'needs-citation',
    })
  }
  const incomplete = sources.some(({ verification }) => verification === 'needs-citation')
  return provenance(
    'event',
    incomplete ? 'partial' : 'primary-cited',
    incomplete
      ? 'Primary texts are cited; date or historical claims still need complete bibliographic records.'
      : 'Primary texts are cited and the chronology method is disclosed.',
    sources,
    record.reviewedOn,
  )
}

export function buildPersonProvenance(record) {
  const sources = [...referenceSources(record.scripture), ...manualSources(record)]
  const hasChronologySource = sources.some(({ role }) => role === 'chronology')
  if (!hasChronologySource) {
    const datingCitation = {
      text: 'Age stated in the cited biblical text',
      derived: 'Year chained from ages stated in the biblical genealogies',
      inferred: 'Displayed dates are estimates from external historical evidence',
      unknown: 'No date is supplied by the cited text',
    }[record.dating]
    sources.push({
      sourceId: 'editorial-research', role: 'chronology', citations: [datingCitation],
      verification: record.dating === 'inferred' ? 'needs-citation' : 'method-disclosed',
    })
  }
  if (record.note && !sources.some(({ role }) => role === 'commentary')) {
    sources.push({
      sourceId: 'editorial-research', role: 'commentary',
      citations: [record.note], verification: 'needs-citation',
    })
  }
  const incomplete = sources.some(({ verification }) => verification === 'needs-citation')
  return provenance(
    'person',
    incomplete ? 'partial' : 'primary-cited',
    incomplete
      ? 'Biblical references are cited; external dating or commentary needs a complete citation.'
      : 'Biblical references are cited and the dating method is disclosed.',
    sources,
    record.reviewedOn,
  )
}

export function buildPlaceProvenance(record) {
  const sources = manualSources(record)
  const hasGeographicSource = sources.some(({ role }) => role === 'geographic-identification')
  if (!hasGeographicSource) {
    sources.push({
      sourceId: 'project-gazetteer', role: 'geographic-identification',
      citations: [`${record.lat.toFixed(4)}, ${record.lng.toFixed(4)} · ${record.certainty}`],
      verification: 'needs-citation',
    })
  }
  if (record.note && !sources.some(({ role }) => role === 'commentary')) {
    sources.push({
      sourceId: 'editorial-research', role: 'commentary',
      citations: [record.note], verification: 'needs-citation',
    })
  }
  const incomplete = sources.some(({ verification }) => verification === 'needs-citation')
  return provenance(
    'place',
    incomplete ? 'needs-review' : 'primary-cited',
    record.sourceReviewNote ?? (incomplete
      ? 'The map records its current certainty judgment, but the identification and coordinates need an original geographic citation.'
      : 'The place identification and coordinates have a cited geographic source.'),
    sources,
    record.reviewedOn,
  )
}

export function contextualPlaceProvenance(record, references = [], wikipedia = null) {
  const sources = [...record.provenance.sources, ...referenceSources(references)]
  if (wikipedia?.url) {
    sources.push({
      sourceId: 'wikipedia', role: 'reference-summary', citations: [wikipedia.title],
      url: wikipedia.url, verification: 'cited',
    })
  }
  if (wikipedia?.image?.filePage) {
    sources.push({
      sourceId: 'wikimedia-commons', role: 'media',
      citations: [wikipedia.image.artist || wikipedia.title],
      url: wikipedia.image.filePage, license: wikipedia.image.licence, verification: 'cited',
    })
  }
  return { ...record.provenance, sources }
}

export function validateProvenanceCollection(records, kind) {
  const errors = []
  const statuses = new Set(Object.keys(PROVENANCE_STATUS))
  const verifications = new Set(Object.keys(VERIFICATION_LABEL))
  for (const record of records) {
    const item = record.provenance
    if (!item || item.schemaVersion !== PROVENANCE_SCHEMA_VERSION) {
      errors.push(`${kind}:${record.id} has no provenance schema v${PROVENANCE_SCHEMA_VERSION}`)
      continue
    }
    if (item.kind !== kind) errors.push(`${kind}:${record.id} is labelled ${item.kind}`)
    if (!statuses.has(item.status)) errors.push(`${kind}:${record.id} has invalid status ${item.status}`)
    if (!item.sources?.length) errors.push(`${kind}:${record.id} has no provenance sources`)
    if (kind === 'place' && item.status === 'primary-cited' && !/^\d{4}-\d{2}-\d{2}$/.test(item.reviewedOn ?? '')) {
      errors.push(`${kind}:${record.id} has cited geography but no ISO review date`)
    }
    for (const source of item.sources ?? []) {
      if (!SOURCE_CATALOG[source.sourceId]) errors.push(`${kind}:${record.id} has unknown source ${source.sourceId}`)
      if (!SOURCE_ROLE_LABEL[source.role]) errors.push(`${kind}:${record.id} has invalid role ${source.role}`)
      if (!verifications.has(source.verification)) errors.push(`${kind}:${record.id} has invalid verification ${source.verification}`)
      if (!source.citations?.length) errors.push(`${kind}:${record.id} source ${source.sourceId} has no citation`)
    }
  }
  if (errors.length) throw new Error(`Provenance validation failed:\n${errors.join('\n')}`)
  return { kind, records: records.length, valid: records.length }
}
