/**
 * Build-time fetch of a photograph, a short extract and a link for each place.
 *
 * LICENSING — the reason this is a build step rather than a runtime call.
 * Wikipedia prose is CC BY-SA 4.0, so extracts are fine to reuse with attribution
 * and a link back, both of which the UI renders. Images are the trap: licences
 * vary per file, and English Wikipedia hosts some non-free "fair use" images that
 * may NOT be reused. Every candidate image is therefore checked against its
 * extmetadata here, and anything that is not public domain or Creative Commons is
 * dropped rather than shipped. Photographer, licence and file page are stored so
 * the page can credit them.
 *
 * DISAMBIGUATION — "Megiddo" is a disambiguation page and "Dan" is a given name.
 * Candidates are accepted only if the article's own coordinates land near the
 * coordinates already in places.js, which is a much stronger check than the title.
 *
 * Run with:  npm run fetch:wikipedia
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { PLACES } from '../src/data/places.js'

const API = 'https://en.wikipedia.org/w/api.php'
const UA = 'ScriptureAtlas/1.0 (https://github.com/jeroen-leverman/bible-timeline; atlas of biblical places)'
const OUT = new URL('../src/data/wikipedia.json', import.meta.url)
const MAX_KM = 40            // how far an article may sit from our coordinates
const DELAY_MS = 180

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Search plus a coordinates check gets most places right, but not all: it sent
 * Bethsaida to Capernaum six kilometres away, Gilgal to a modern Israeli
 * settlement of the same name, and Shiloh to the neighbouring village of Qaryut.
 * Anything the automated pass got wrong, or could not find at all, is pinned here.
 */
const TITLES = {
  // corrections to wrong matches
  bethsaida: 'Bethsaida', gilgal: 'Gilgal', shiloh: 'Shiloh (biblical city)',
  asshur: 'Assur', sheba: 'Sheba', 'jabesh-gilead': 'Jabesh-Gilead',
  goshen: 'Land of Goshen', jezreel: 'Jezreel (city)',
  // places the search could not resolve
  eden: 'Garden of Eden', shinar: 'Shinar', sodom: 'Sodom and Gomorrah',
  petra: 'Petra', cana: 'Cana', nain: 'Nain, Israel', endor: 'Endor (village)',
  aphek: 'Aphek (biblical)', zarephath: 'Sarepta', rhodes: 'Rhodes',
  'moab-plains': 'Moab', mizpah: 'Mizpah in Benjamin', nob: 'Nob (biblical town)',
  ziklag: 'Ziklag', marah: 'Marah (Bible)', 'red-sea-crossing': 'Crossing the Red Sea',
}

/** Licences we are allowed to redistribute. Anything else is dropped. */
const OPEN_LICENCE = /^(cc[-0-9a-z]*|pd|public[ -]?domain|cc0)/i

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

const km = (a, b, c, d) => {
  const R = 6371, r = Math.PI / 180
  const dLat = (c - a) * r, dLng = (d - b) * r
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}

/** Search a few phrasings, keep whichever article sits nearest our coordinates. */
async function resolveArticle(place) {
  const queries = [place.name.replace(/\s*\(.*?\)\s*/g, '').trim()]
  if (place.modern) queries.push(place.modern.split(',')[0].trim())
  if (TITLES[place.id]) return { title: TITLES[place.id], distance: 0, pinned: true }

  let best = null
  for (const q of queries) {
    let data
    try {
      data = await api({
        action: 'query', generator: 'search', gsrsearch: q, gsrlimit: '6',
        prop: 'coordinates', colimit: 'max',
      })
    } catch { continue }
    await sleep(DELAY_MS)
    for (const page of Object.values(data?.query?.pages ?? {})) {
      const co = page.coordinates?.[0]
      if (!co) continue
      const d = km(place.lat, place.lng, co.lat, co.lon)
      if (d <= MAX_KM && (!best || d < best.distance)) best = { title: page.title, distance: d }
    }
  }
  return best
}

/** Extract + link + image, with the image kept only if its licence permits reuse. */
async function fetchDetails(title) {
  const data = await api({
    action: 'query', titles: title, redirects: '1',
    prop: 'extracts|pageimages|info', inprop: 'url',
    exintro: '1', explaintext: '1', exsentences: '2', piprop: 'name',
  })
  await sleep(DELAY_MS)
  const page = Object.values(data?.query?.pages ?? {})[0]
  if (!page || page.missing !== undefined) return null

  const result = {
    title: page.title,
    url: page.fullurl,
    extract: (page.extract ?? '').trim() || null,
    image: null,
  }

  if (page.pageimage) {
    const info = await api({
      action: 'query', titles: `File:${page.pageimage}`,
      prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '640',
    })
    await sleep(DELAY_MS)
    const ii = Object.values(info?.query?.pages ?? {})[0]?.imageinfo?.[0]
    const meta = ii?.extmetadata ?? {}
    const licenceId = meta.License?.value ?? ''
    const licenceName = meta.LicenseShortName?.value ?? ''
    const strip = (h) => h ? String(h).replace(/<[^>]*>/g, '').trim() : null

    if (ii && OPEN_LICENCE.test(licenceId)) {
      result.image = {
        src: ii.thumburl ?? ii.url,
        width: ii.thumbwidth ?? null,
        licence: licenceName || licenceId,
        artist: strip(meta.Artist?.value),
        filePage: ii.descriptionurl,
      }
    } else if (ii) {
      result.rejectedImage = licenceName || licenceId || 'unknown licence'
    }
  }
  return result
}

const out = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {}
const save = () => writeFileSync(OUT, JSON.stringify(out, null, 1))

const todo = PLACES.filter((p) => !out[p.id])
console.log(`${PLACES.length} places, ${todo.length} to resolve\n`)

const unresolved = []
const rejected = []

for (const place of todo) {
  let article = null
  try { article = await resolveArticle(place) } catch { /* fall through */ }
  if (!article) { unresolved.push(place.id); console.log(`  ??  ${place.id.padEnd(20)} no article near ${place.lat},${place.lng}`); continue }

  let details = null
  try { details = await fetchDetails(article.title) } catch { /* fall through */ }
  if (!details) { unresolved.push(place.id); continue }

  if (details.rejectedImage) rejected.push(`${place.id}: ${details.rejectedImage}`)
  delete details.rejectedImage

  out[place.id] = { ...details, distanceKm: Math.round(article.distance * 10) / 10 }
  save()
  console.log(`  ok  ${place.id.padEnd(20)} ${details.title.padEnd(30)} ${details.image ? 'img ' + details.image.licence : 'no image'}`)
}

save()
console.log(`\nresolved   : ${Object.keys(out).length}/${PLACES.length}`)
console.log(`with image : ${Object.values(out).filter((x) => x.image).length}`)
console.log(`unresolved : ${unresolved.length} ${unresolved.join(', ')}`)
console.log(`images dropped for licensing: ${rejected.length}`)
for (const r of rejected) console.log(`   ${r}`)
