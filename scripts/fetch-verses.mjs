/**
 * Build-time fetch of scripture text for every reference in events.js.
 *
 * WHY BUILD TIME: the WEB and KJV are both public domain, so the text can simply
 * be shipped with the site. That removes a runtime dependency on someone else's
 * free API, keeps a passage instant to open, and means the atlas keeps working if
 * bible-api.com ever goes away or rate-limits a visitor.
 *
 * The API rate-limits, so this resumes: already-complete references are skipped
 * and results are flushed to disk as they arrive. Re-run until it reports nothing
 * left to do.
 *
 * Run with:  npm run fetch:verses
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { EVENTS } from '../src/data/events.js'
import { PEOPLE } from '../src/data/people.js'

const API = 'https://bible-api.com'
const UA = 'ScriptureAtlas/1.0 (https://github.com/jeroen-leverman/bible-timeline)'
const TRANSLATIONS = ['web', 'kjv']
const MAX_VERSES = 20
const OUT = new URL('../src/data/verses.json', import.meta.url)

let baseDelay = 900          // adapts upward if the service pushes back
const MAX_RETRIES = 5

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const NOT_SCRIPTURE = /Josephus|Tacitus|Aristeas|Maccabees|Annals|Jewish War|Antiquities/i

const normalise = (ref) => ref.replace(/[–—]/g, '-').replace(/\s*\((context|cf\.)\)\s*/gi, '').trim()

/**
 * The opening chapter of any reference the API will not serve whole. Covers plain
 * chapter spans ("Genesis 6-9") and cross-chapter verse ranges alike
 * ("Acts 15:36-18:22", "Acts 27-28:10"), which the earlier chapter-only pattern
 * missed and which therefore came back with no text at all.
 */
function firstChapter(ref) {
  const m = normalise(ref).match(/^((?:[1-3]\s+)?[A-Za-z][A-Za-z ]*?)\s+(\d+)/)
  if (!m) return null
  const candidate = `${m[1]} ${m[2]}`
  return candidate === normalise(ref) ? null : candidate
}

/** Fetch one passage, backing off and slowing the whole run down on a 429. */
async function fetchPassage(query, translation) {
  const url = `${API}/${encodeURIComponent(query)}?translation=${translation}`
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (res.status === 429) {
      const wait = 15000 * (attempt + 1)
      baseDelay = Math.min(baseDelay + 250, 3000)
      process.stdout.write(`    rate limited, waiting ${wait / 1000}s (base now ${baseDelay}ms)\n`)
      await sleep(wait)
      continue
    }
    if (!res.ok) return { error: `HTTP ${res.status}` }
    const data = await res.json()
    if (data.error) return { error: data.error }
    return {
      reference: data.reference,
      verses: (data.verses ?? []).map((v) => ({ c: v.chapter, v: v.verse, t: v.text.trim() })),
    }
  }
  return { error: 'rate limited after retries' }
}

const out = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {}
const save = () => writeFileSync(OUT, JSON.stringify(out))

// Both the atlas and the family tree open passages, so both are sources of references.
const all = [...new Set([...EVENTS, ...PEOPLE].flatMap((e) => e.scripture))].sort()
const scripture = all.filter((r) => !NOT_SCRIPTURE.test(r))
const complete = (r) => out[r]?.web && out[r]?.kjv
const todo = scripture.filter((r) => !complete(r))

console.log(`${all.length} references, ${scripture.length} are scripture`)
console.log(`already done: ${scripture.length - todo.length}   remaining: ${todo.length}\n`)

const failed = []
let done = 0

for (const ref of todo) {
  const entry = out[ref] ?? { ref }
  let query = normalise(ref)
  let isExcerpt = entry.excerpt ?? false

  for (const translation of TRANSLATIONS) {
    if (entry[translation]) continue
    let result = await fetchPassage(query, translation)
    await sleep(baseDelay)

    // The API refuses spans of several chapters; fall back to the opening chapter
    // and mark it, so the UI can say so rather than imply it is the whole passage.
    if (result.error && firstChapter(ref)) {
      query = firstChapter(ref)
      isExcerpt = true
      result = await fetchPassage(query, translation)
      await sleep(baseDelay)
    }
    if (result.error) { failed.push(`${ref} [${translation}] ${result.error}`); continue }

    entry[translation] = {
      reference: result.reference,
      verses: result.verses.slice(0, MAX_VERSES),
      truncated: result.verses.length > MAX_VERSES,
      totalVerses: result.verses.length,
    }
  }

  entry.excerpt = isExcerpt
  if (entry.web || entry.kjv) { out[ref] = entry; save() }
  done++
  if (done % 10 === 0) console.log(`  ${done}/${todo.length} …`)
}

save()
const still = scripture.filter((r) => !complete(r))
console.log(`\ncomplete  : ${scripture.length - still.length}/${scripture.length}`)
console.log(`incomplete: ${still.length}${still.length ? ' — re-run to finish' : ''}`)
console.log(`failed    : ${failed.length}`)
for (const f of failed.slice(0, 10)) console.log(`   ${f}`)
