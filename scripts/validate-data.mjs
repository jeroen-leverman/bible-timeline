import { EVENTS } from '../src/data/events.js'
import { PEOPLE } from '../src/data/people.js'
import { PLACES } from '../src/data/places.js'
import { validateProvenanceCollection } from '../src/data/provenance.js'

const collections = [
  ['event', EVENTS],
  ['person', PEOPLE],
  ['place', PLACES],
]

for (const [kind, records] of collections) {
  validateProvenanceCollection(records, kind)
  const statusCounts = records.reduce((counts, { provenance }) => {
    counts[provenance.status] = (counts[provenance.status] ?? 0) + 1
    return counts
  }, {})
  const statuses = Object.entries(statusCounts)
    .map(([status, count]) => `${status}: ${count}`)
    .join(', ')
  console.log(`✓ ${records.length} ${kind} records · ${statuses}`)
}

const reviewedPlaces = PLACES.filter(({ provenance }) => provenance.reviewedOn).length
console.log(`✓ ${reviewedPlaces} place records have completed source reviews`)

const evidenceReviewedEvents = EVENTS.filter(({ evidenceLimit, provenance }) => evidenceLimit && provenance.reviewedOn).length
if (evidenceReviewedEvents < 20) throw new Error(`Expected at least 20 evidence-reviewed events; found ${evidenceReviewedEvents}`)
console.log(`✓ ${evidenceReviewedEvents} event records have completed historical-evidence reviews`)

console.log(`✓ ${collections.reduce((total, [, records]) => total + records.length, 0)} provenance records valid`)
