/**
 * The family tree view.
 *
 * Laid out as generation rows with connector lines drawn afterwards from measured DOM
 * positions, rather than by a tidy-tree algorithm: the biblical genealogy is mostly a
 * single spine with a handful of branches, so ordering each row by where its parent sits
 * in the row above is enough to keep the lines from crossing.
 *
 * Every parent link in people.js spans exactly one generation, which is checked at load.
 * That matters more than it sounds: the Judahite king list is easy to write with four
 * generations missing, and a tree drawn from it would quietly assert that Jehoshaphat
 * was Rehoboam's son.
 */
import { PEOPLE, PERSON_BY_ID, DATING_LABEL, childrenOf } from './data/people.js'
import { ERA_BY_ID } from './data/eras.js'
import { EVENT_BY_ID } from './data/events.js'
import { renderPassageInto, escapeHtml } from './verses.js'

const fmtYear = (y) => (y < 0 ? `${Math.abs(y)} BC` : `AD ${y}`)

function lifeLine(p) {
  if (p.born != null && p.died != null) return `${fmtYear(p.born)} – ${fmtYear(p.died)}`
  if (p.born != null) return `b. ${fmtYear(p.born)}`
  if (p.died != null) return `d. ${fmtYear(p.died)}`
  if (p.age) return `lived ${p.age} years`
  return 'no dates given'
}

export function createTree(root, { onShowInAtlas }) {
  const state = { selected: 'abraham', openRef: null, translation: 'web' }

  root.innerHTML = `
    <div class="tree-shell">
      <div class="tree-canvas" id="tree-canvas">
        <svg class="tree-links" id="tree-links" aria-hidden="true"></svg>
        <div class="tree-rows" id="tree-rows"></div>
      </div>
      <aside class="tree-detail" id="tree-detail"></aside>
    </div>`

  const rowsEl = root.querySelector('#tree-rows')
  const linksEl = root.querySelector('#tree-links')
  const detailEl = root.querySelector('#tree-detail')

  // ---- ordering ---------------------------------------------------------
  // Each row is sorted by where its parent sits in the row above, so children fall
  // under their parents. Spouses have no parent in the tree, so they borrow their
  // partner's key and sit beside them.
  const byGen = new Map()
  for (const p of PEOPLE) {
    if (!byGen.has(p.gen)) byGen.set(p.gen, [])
    byGen.get(p.gen).push(p)
  }
  const gens = [...byGen.keys()].sort((a, b) => a - b)
  const order = new Map()

  for (const g of gens) {
    const row = byGen.get(g)
    const keyOf = (p) => {
      const parent = p.father ?? p.mother
      if (parent && order.has(parent)) return order.get(parent) * 10
      const partner = p.spouses.find((sp) => PERSON_BY_ID[sp] && PERSON_BY_ID[sp].gen === p.gen)
      if (partner) {
        const pp = PERSON_BY_ID[partner]
        const pparent = pp.father ?? pp.mother
        if (pparent && order.has(pparent)) return order.get(pparent) * 10 + 1
      }
      return 9999
    }
    row.sort((a, b) => keyOf(a) - keyOf(b) || a.name.localeCompare(b.name))
    row.forEach((p, i) => order.set(p.id, i))
  }

  // ---- render -----------------------------------------------------------
  function renderRows() {
    rowsEl.innerHTML = gens.map((g) => {
      const row = byGen.get(g)
      const era = ERA_BY_ID[row[0].era]
      return `<div class="tree-row" data-gen="${g}">
        <span class="tree-gen" title="Generation ${g}, counting Adam as the first"
              style="--era:${era?.color ?? '#888'}">${g}</span>
        <div class="tree-cards">${row.map(cardHtml).join('')}</div>
      </div>`
    }).join('')
  }

  function cardHtml(p) {
    const era = ERA_BY_ID[p.era]
    return `<button class="tree-card${p.major ? ' is-major' : ''}${state.selected === p.id ? ' is-selected' : ''}"
                    data-person="${p.id}" style="--era:${era?.color ?? '#888'}">
      <span class="tc-name">${escapeHtml(p.name)}</span>
      <span class="tc-life">${escapeHtml(lifeLine(p))}</span>
    </button>`
  }

  /** Connectors are drawn from measured positions, so this runs after layout. */
  function drawLinks() {
    const canvas = root.querySelector('#tree-canvas')
    const box = canvas.getBoundingClientRect()
    const w = canvas.scrollWidth, h = canvas.scrollHeight
    // Explicit CSS pixels, not just the width/height attributes: the overlay is
    // absolutely positioned, so width:auto shrink-to-fit wins over the attribute and
    // collapses it to a sliver, scaling every path with it.
    linksEl.setAttribute('viewBox', `0 0 ${w} ${h}`)
    linksEl.style.width = `${w}px`
    linksEl.style.height = `${h}px`

    const at = (id) => {
      const el = rowsEl.querySelector(`[data-person="${id}"]`)
      if (!el) return null
      const r = el.getBoundingClientRect()
      return {
        cx: r.left - box.left + canvas.scrollLeft + r.width / 2,
        top: r.top - box.top + canvas.scrollTop,
        bottom: r.bottom - box.top + canvas.scrollTop,
        left: r.left - box.left + canvas.scrollLeft,
        right: r.right - box.left + canvas.scrollLeft,
        midY: r.top - box.top + canvas.scrollTop + r.height / 2,
      }
    }

    const parts = []
    // spouse links: a short bar between partners on the same row
    const drawn = new Set()
    for (const p of PEOPLE) {
      for (const sp of p.spouses) {
        const key = [p.id, sp].sort().join('|')
        if (drawn.has(key)) continue
        drawn.add(key)
        const a = at(p.id), b = at(sp)
        if (!a || !b || Math.abs(a.midY - b.midY) > 4) continue
        const x1 = Math.min(a.right, b.right), x2 = Math.max(a.left, b.left)
        if (x2 <= x1) continue
        parts.push(`<path class="tl-spouse" d="M${x1} ${a.midY} H${x2}" />`)
      }
    }
    // parent → child
    for (const p of PEOPLE) {
      const parent = p.father ?? p.mother
      if (!parent) continue
      const a = at(parent), b = at(p.id)
      if (!a || !b) continue
      const midY = a.bottom + (b.top - a.bottom) / 2
      parts.push(`<path class="tl-descent" d="M${a.cx} ${a.bottom} V${midY} H${b.cx} V${b.top}" />`)
    }
    linksEl.innerHTML = parts.join('')
  }

  // ---- detail panel ------------------------------------------------------
  function renderDetail() {
    const p = PERSON_BY_ID[state.selected]
    if (!p) { detailEl.innerHTML = ''; return }
    const era = ERA_BY_ID[p.era]
    const father = p.father && PERSON_BY_ID[p.father]
    const mother = p.mother && PERSON_BY_ID[p.mother]
    const spouses = p.spouses.map((id) => PERSON_BY_ID[id]).filter(Boolean)
    const kids = childrenOf(p.id)
    const events = p.events.map((id) => EVENT_BY_ID[id]).filter(Boolean)

    const rel = (label, list) => list.length
      ? `<div class="td-rel"><span>${label}</span><div>${list.map((x) =>
          `<button class="td-link" data-person="${x.id}">${escapeHtml(x.name)}</button>`).join('')}</div></div>`
      : ''

    detailEl.innerHTML = `
      <div class="td-era" style="--era:${era?.color ?? '#888'}">${era?.name ?? ''}</div>
      <h2>${escapeHtml(p.name)}</h2>
      <div class="td-life">
        <strong>${escapeHtml(lifeLine(p))}</strong>
        <span class="td-dating ${p.dating}">${DATING_LABEL[p.dating]}</span>
      </div>
      ${p.age && (p.born != null || p.died != null) ? `<p class="td-age">Scripture gives his age as ${p.age}.</p>` : ''}
      <p class="td-bio">${escapeHtml(p.bio)}</p>
      ${p.note ? `<p class="td-note"><strong>Note</strong>${escapeHtml(p.note)}</p>` : ''}
      <div class="td-rels">
        ${rel('Parents', [father, mother].filter(Boolean))}
        ${rel(spouses.length > 1 ? 'Wives' : 'Spouse', spouses)}
        ${rel('Children', kids)}
      </div>
      <div class="td-section">
        <span class="td-label">Scripture</span>
        <div class="scripture-refs">${p.scripture.map((r) =>
          `<button class="ref-btn${state.openRef === r ? ' open' : ''}" data-ref="${escapeHtml(r)}">${escapeHtml(r)}</button>`).join('')}</div>
        <div class="passage" id="tree-passage"></div>
      </div>
      ${events.length ? `<div class="td-section">
        <span class="td-label">In the atlas</span>
        <div class="scripture-refs">${events.map((e) =>
          `<button class="ref-btn td-event" data-event="${e.id}">${escapeHtml(e.title)}</button>`).join('')}</div>
      </div>` : ''}`

    renderPassageInto(detailEl.querySelector('#tree-passage'), state.openRef, state.translation)
  }

  // ---- interaction -------------------------------------------------------
  root.addEventListener('click', (e) => {
    const person = e.target.closest('[data-person]')
    if (person) {
      state.selected = person.dataset.person
      state.openRef = null
      rowsEl.querySelectorAll('.tree-card').forEach((c) =>
        c.classList.toggle('is-selected', c.dataset.person === state.selected))
      renderDetail()
      rowsEl.querySelector(`.tree-card[data-person="${state.selected}"]`)
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }
    const ev = e.target.closest('[data-event]')
    if (ev) { onShowInAtlas?.(ev.dataset.event); return }
    const ref = e.target.closest('.ref-btn[data-ref]')
    if (ref) {
      state.openRef = state.openRef === ref.dataset.ref ? null : ref.dataset.ref
      renderDetail()
      return
    }
    const trans = e.target.closest('[data-trans]')
    if (trans) {
      state.translation = trans.dataset.trans
      renderDetail()
    }
  })

  let drawn = false
  function show() {
    if (!drawn) { renderRows(); renderDetail(); drawn = true }
    // Drawn synchronously first: the connectors are the whole point of the view, and
    // requestAnimationFrame does not fire in a backgrounded tab, which would leave the
    // tree with no lines at all. The later passes only refine the measurements once
    // scrollbars and webfonts have settled the card widths.
    drawLinks()
    requestAnimationFrame(drawLinks)
    if (document.fonts?.ready) document.fonts.ready.then(drawLinks).catch(() => {})
  }

  new ResizeObserver(() => { if (drawn) drawLinks() }).observe(root)

  return { show, select: (id) => { state.selected = id; renderDetail() } }
}
