/**
 * Shared scripture-passage rendering.
 *
 * The text is public domain (WEB and KJV), fetched at build time and shipped with the
 * site, but it is well over a megabyte — so it is loaded on first use rather than on
 * first paint. Both the atlas and the family tree open passages, hence this module
 * rather than a copy in each.
 */

let VERSES = null
let loading = null

export function loadVerses() {
  if (VERSES) return Promise.resolve(VERSES)
  loading ??= import('./data/verses.json').then((m) => (VERSES = m.default ?? m))
  return loading
}

export const TRANSLATION_NAME = { web: 'World English Bible', kjv: 'King James Version' }

export function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

/**
 * Markup for one passage, or null when the reference is not scripture — Josephus and
 * Tacitus are cited in this atlas too, and there is nothing to open for them.
 */
export function passageHtml(ref, translation) {
  const entry = VERSES?.[ref]
  if (!entry) return null
  const body = entry[translation] ?? entry.web ?? entry.kjv
  if (!body) return null

  const verses = body.verses
    .map((v) => `<span class="v"><sup>${v.v}</sup>${escapeHtml(v.t)}</span>`)
    .join(' ')

  return `
    <div class="passage-head">
      <strong>${escapeHtml(body.reference)}</strong>
      <div class="passage-trans">
        <button data-trans="web"${translation === 'web' ? ' class="on"' : ''}>WEB</button>
        <button data-trans="kjv"${translation === 'kjv' ? ' class="on"' : ''}>KJV</button>
      </div>
    </div>
    <div class="passage-body">${verses}</div>
    ${entry.excerpt ? '<p class="passage-note">Opening chapter only — the reference spans several chapters.</p>' : ''}
    ${body.truncated ? `<p class="passage-note">First ${body.verses.length} of ${body.totalVerses} verses.</p>` : ''}
    <p class="passage-credit">${TRANSLATION_NAME[translation]} · public domain</p>`
}

/** Render into a host element, loading the text on first use. */
export async function renderPassageInto(host, ref, translation) {
  if (!host) return
  if (!ref) { host.innerHTML = ''; return }
  host.innerHTML = '<p class="passage-loading">Loading…</p>'
  await loadVerses()
  host.innerHTML = passageHtml(ref, translation)
    ?? '<p class="passage-missing">Not a scripture reference, so there is no text to show.</p>'
}
