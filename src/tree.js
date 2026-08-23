/**
 * The family tree view.
 *
 * Laid out as generation rows with connector lines drawn afterwards from measured DOM
 * positions, rather than by a tidy-tree algorithm: the biblical genealogy is mostly a
 * single spine with a handful of branches, so ordering each row by where its parent sits
 * in the row above is enough to keep the lines from crossing.
 *
 * Every named-descent link in people.js occupies the next displayed generation.
 * That matters more than it sounds: the Judahite king list is easy to write with four
 * generations missing, and a tree drawn from it could quietly assert that Jehoshaphat
 * was Rehoboam's immediate son.
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
  const state = {
    selected: 'abraham',
    openRef: null,
    translation: 'web',
    trace: true,
    focus: false,
    query: '',
  }

  const jumpPeople = ['adam', 'noah', 'abraham', 'moses', 'david', 'jesus']
    .map((id) => PERSON_BY_ID[id])
    .filter(Boolean)

  root.innerHTML = `
    <div class="tree-shell">
      <div class="tree-canvas" id="tree-canvas">
        <div class="tree-toolbar">
          <div class="tree-toolbar-main">
            <div class="tree-search-wrap">
              <label class="tree-search" for="tree-search">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
                <input id="tree-search" type="search" placeholder="Find a person…" autocomplete="off" />
              </label>
              <div class="tree-search-results" id="tree-search-results" hidden></div>
            </div>
            <label class="tree-jump-label">
              <span>Jump to</span>
              <select id="tree-jump" aria-label="Jump to a key person">
                <option value="">Key person…</option>
                ${jumpPeople.map((p) => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('')}
              </select>
            </label>
            <div class="tree-toolbar-actions" aria-label="Tree display options">
              <button class="tree-tool is-on" data-tree-action="trace" aria-pressed="true" title="Highlight ancestors and descendants">
                <span class="tool-lineage" aria-hidden="true"></span><span>Trace lineage</span>
              </button>
              <button class="tree-tool" data-tree-action="focus" aria-pressed="false" title="Show parents, children, and nearby family">
                <span class="tool-focus" aria-hidden="true"></span><span>Close family</span>
              </button>
              <button class="tree-tool tree-center-tool" data-tree-action="center" title="Center the selected person">
                <span class="tool-center" aria-hidden="true"></span><span>Center</span>
              </button>
            </div>
          </div>
          <div class="tree-toolbar-foot">
            <div><span id="tree-context" aria-live="polite"></span><small>Spacing follows named generations; genealogies may skip unnamed ancestors.</small></div>
            <div class="tree-legend" aria-label="Relationship line legend">
              <span><i class="legend-descent"></i>Named descent</span>
              <span><i class="legend-spouse"></i>Spouses</span>
            </div>
          </div>
        </div>
        <svg class="tree-links" id="tree-links" aria-hidden="true"></svg>
        <div class="tree-rows" id="tree-rows"></div>
      </div>
      <aside class="tree-detail" id="tree-detail" aria-live="polite"></aside>
    </div>`

  const canvas = root.querySelector('#tree-canvas')
  const rowsEl = root.querySelector('#tree-rows')
  const linksEl = root.querySelector('#tree-links')
  const detailEl = root.querySelector('#tree-detail')
  const toolbarEl = root.querySelector('.tree-toolbar')
  const contextEl = root.querySelector('#tree-context')
  const searchEl = root.querySelector('#tree-search')
  const resultsEl = root.querySelector('#tree-search-results')
  const jumpEl = root.querySelector('#tree-jump')

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
  function nearbyFamily(id, maxDepth = 2) {
    const seen = new Set([id])
    let frontier = [id]
    for (let depth = 0; depth < maxDepth; depth += 1) {
      const next = []
      for (const current of frontier) {
        const p = PERSON_BY_ID[current]
        if (!p) continue
        const neighbours = [p.father, p.mother, ...p.spouses, ...childrenOf(current).map((c) => c.id)]
          .filter(Boolean)
        for (const neighbour of neighbours) {
          if (seen.has(neighbour)) continue
          seen.add(neighbour)
          next.push(neighbour)
        }
      }
      frontier = next
    }
    return seen
  }

  function visiblePeople() {
    const visibleIds = state.focus ? nearbyFamily(state.selected) : null
    return visibleIds ? PEOPLE.filter((p) => visibleIds.has(p.id)) : PEOPLE
  }

  function rowEra(row) {
    const counts = new Map()
    row.forEach((p) => counts.set(p.era, (counts.get(p.era) || 0) + 1))
    const id = [...counts].sort((a, b) => b[1] - a[1])[0]?.[0]
    return ERA_BY_ID[id]
  }

  function rowDateLabel(row) {
    const births = row.map((p) => p.born).filter((year) => year != null)
    const deaths = row.map((p) => p.died).filter((year) => year != null)
    const years = births.length ? births : deaths
    if (!years.length) return ''
    return `c. ${fmtYear(Math.min(...years))}`
  }

  function renderRows() {
    const visibleIds = new Set(visiblePeople().map((p) => p.id))
    const visibleGens = gens.filter((g) => byGen.get(g).some((p) => visibleIds.has(p.id)))
    let previousGen = null
    let previousEra = null

    rowsEl.innerHTML = visibleGens.map((g, index) => {
      const row = byGen.get(g).filter((p) => visibleIds.has(p.id))
      const era = rowEra(row)
      const dateLabel = rowDateLabel(row)
      const gap = previousGen == null ? 0 : g - previousGen - 1
      const eraChanged = era?.id && era.id !== previousEra
      const prefix = `${gap > 0 ? `<div class="tree-gap">
          <span aria-hidden="true">•••</span>
          <strong>${gap} ${gap === 1 ? 'generation' : 'generations'} ${state.focus ? 'outside this close-family view' : 'not represented in this dataset'}</strong>
        </div>` : ''}${eraChanged ? `<div class="tree-era-break" style="--era:${era?.color ?? '#888'}">
          <i></i><span>${escapeHtml(era?.name ?? '')}</span><i></i>
        </div>` : ''}`
      previousGen = g
      previousEra = era?.id
      return `${prefix}<div class="tree-row${index === 0 ? ' is-first' : ''}${index === visibleGens.length - 1 ? ' is-last' : ''}" data-gen="${g}">
        <div class="tree-time" style="--era:${era?.color ?? '#888'}" ${dateLabel ? `aria-label="Approximate date ${dateLabel}"` : 'aria-hidden="true"'}>
          <span>${dateLabel}</span><i></i><b></b>
        </div>
        <span class="tree-gen" title="Generation ${g}, counting Adam as the first"
              style="--era:${era?.color ?? '#888'}">${g}</span>
        <div class="tree-cards">${row.map(cardHtml).join('')}</div>
      </div>`
    }).join('')
  }

  function cardHtml(p) {
    const era = ERA_BY_ID[p.era]
    return `<button class="tree-card${p.major ? ' is-major' : ''}${state.selected === p.id ? ' is-selected' : ''}"
                    data-person="${p.id}" style="--era:${era?.color ?? '#888'}"
                    aria-pressed="${state.selected === p.id}">
      <span class="tc-name">${escapeHtml(p.name)}</span>
      <span class="tc-life">${escapeHtml(lifeLine(p))}</span>
    </button>`
  }

  function traceSets(id) {
    const ancestors = new Set()
    const descendants = new Set()
    const collectAncestors = (personId) => {
      const p = PERSON_BY_ID[personId]
      if (!p) return
      for (const parent of [p.father, p.mother].filter(Boolean)) {
        if (ancestors.has(parent)) continue
        ancestors.add(parent)
        collectAncestors(parent)
      }
    }
    const collectDescendants = (personId) => {
      for (const child of childrenOf(personId)) {
        if (descendants.has(child.id)) continue
        descendants.add(child.id)
        collectDescendants(child.id)
      }
    }
    collectAncestors(id)
    collectDescendants(id)
    const p = PERSON_BY_ID[id]
    const immediate = new Set([
      p?.father,
      p?.mother,
      ...(p?.spouses || []),
      ...childrenOf(id).map((child) => child.id),
    ].filter(Boolean))
    return { ancestors, descendants, immediate }
  }

  function refreshHighlights() {
    const { ancestors, descendants, immediate } = traceSets(state.selected)
    const traced = new Set([state.selected, ...ancestors, ...descendants, ...immediate])
    canvas.classList.toggle('is-tracing', state.trace)

    rowsEl.querySelectorAll('.tree-card').forEach((card) => {
      const id = card.dataset.person
      const selected = id === state.selected
      card.classList.toggle('is-selected', selected)
      card.classList.toggle('is-lineage', ancestors.has(id) || descendants.has(id))
      card.classList.toggle('is-immediate', immediate.has(id))
      card.setAttribute('aria-pressed', String(selected))
    })

    linksEl.querySelectorAll('path').forEach((path) => {
      const ids = [path.dataset.from, path.dataset.parent2, path.dataset.to].filter(Boolean)
      path.classList.toggle('is-traced', ids.length > 0 && ids.every((id) => traced.has(id)))
    })
  }

  /** Connectors are drawn from measured positions, so this runs after layout. */
  function drawLinks() {
    const box = canvas.getBoundingClientRect()
    // A previous full-tree render may have made the absolute SVG thousands of pixels
    // tall. Reset it before measuring so switching to Close family can shrink the
    // scrollable canvas instead of inheriting the old overlay's dimensions.
    linksEl.style.width = '0px'
    linksEl.style.height = '0px'
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
        parts.push(`<path class="tl-spouse" data-from="${p.id}" data-to="${sp}" d="M${x1} ${a.midY} H${x2}" />`)
      }
    }
    // parent → child
    for (const p of PEOPLE) {
      const parentIds = [...new Set([p.father, p.mother].filter(Boolean))]
      const parents = parentIds.map((id) => ({ id, box: at(id) })).filter(({ box: parentBox }) => parentBox)
      const child = at(p.id)
      if (!parents.length || !child) continue

      const areSpouses = parents.length === 2 && (
        PERSON_BY_ID[parents[0].id]?.spouses.includes(parents[1].id) ||
        PERSON_BY_ID[parents[1].id]?.spouses.includes(parents[0].id)
      )
      if (areSpouses && Math.abs(parents[0].box.midY - parents[1].box.midY) <= 4) {
        const [left, right] = parents.map(({ box: parentBox }) => parentBox).sort((a, b) => a.left - b.left)
        const sourceX = (left.right + right.left) / 2
        const sourceY = left.midY
        const midY = sourceY + (child.top - sourceY) / 2
        parts.push(`<path class="tl-descent" data-from="${parents[0].id}" data-parent2="${parents[1].id}" data-to="${p.id}" d="M${sourceX} ${sourceY} V${midY} H${child.cx} V${child.top}" />`)
      } else {
        // Two named parents are not necessarily spouses (Judah and Tamar are the
        // important case here), so draw independent parent links rather than a
        // marriage-shaped joint connector.
        parents.forEach(({ id, box: parentBox }) => {
          const midY = parentBox.bottom + (child.top - parentBox.bottom) / 2
          parts.push(`<path class="tl-descent" data-from="${id}" data-to="${p.id}" d="M${parentBox.cx} ${parentBox.bottom} V${midY} H${child.cx} V${child.top}" />`)
        })
      }
    }
    linksEl.innerHTML = parts.join('')
    refreshHighlights()
  }

  function centerPerson(id, behavior = 'smooth') {
    const card = rowsEl.querySelector(`.tree-card[data-person="${id}"]`)
    if (!card) return
    const canvasBox = canvas.getBoundingClientRect()
    const cardBox = card.getBoundingClientRect()
    const toolbarHeight = toolbarEl.getBoundingClientRect().height + 12
    const usableHeight = Math.max(120, canvas.clientHeight - toolbarHeight)
    const top = canvas.scrollTop + cardBox.top - canvasBox.top - toolbarHeight - (usableHeight / 2) + (cardBox.height / 2)
    const left = canvas.scrollLeft + cardBox.left - canvasBox.left - (canvas.clientWidth / 2) + (cardBox.width / 2)
    canvas.scrollTo({ top: Math.max(0, top), left: Math.max(0, left), behavior })
  }

  function updateToolbar() {
    const people = visiblePeople()
    const p = PERSON_BY_ID[state.selected]
    contextEl.textContent = state.focus
      ? `${people.length} close relatives around ${p?.name ?? 'the selection'}`
      : `${PEOPLE.length} people · ${gens.length} represented generations${state.trace ? ` · tracing ${p?.name ?? ''}` : ''}`
    const traceButton = root.querySelector('[data-tree-action="trace"]')
    const focusButton = root.querySelector('[data-tree-action="focus"]')
    traceButton.classList.toggle('is-on', state.trace)
    traceButton.setAttribute('aria-pressed', String(state.trace))
    focusButton.classList.toggle('is-on', state.focus)
    focusButton.setAttribute('aria-pressed', String(state.focus))
  }

  function selectPerson(id, { center = true } = {}) {
    if (!PERSON_BY_ID[id]) return
    state.selected = id
    state.openRef = null
    if (state.focus) {
      renderRows()
      drawLinks()
    } else {
      refreshHighlights()
    }
    renderDetail()
    updateToolbar()
    if (center) requestAnimationFrame(() => centerPerson(id))
  }

  function renderSearchResults(query) {
    const q = query.trim().toLowerCase()
    if (!q) {
      resultsEl.hidden = true
      resultsEl.innerHTML = ''
      return
    }
    const matches = PEOPLE
      .filter((p) => p.name.toLowerCase().includes(q))
      .sort((a, b) => Number(!a.name.toLowerCase().startsWith(q)) - Number(!b.name.toLowerCase().startsWith(q)) || a.gen - b.gen)
      .slice(0, 8)
    resultsEl.innerHTML = matches.length
      ? matches.map((p) => `<button class="tree-search-result" data-person="${p.id}">
          <span><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(ERA_BY_ID[p.era]?.name ?? '')}</small></span>
          <b>Gen ${p.gen}</b>
        </button>`).join('')
      : '<p>No people found</p>'
    resultsEl.hidden = false
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
      <div class="td-heading-meta"><div class="td-era" style="--era:${era?.color ?? '#888'}">${era?.name ?? ''}</div><span>Generation ${p.gen}</span></div>
      <h2>${escapeHtml(p.name)}</h2>
      <div class="td-life">
        <strong>${escapeHtml(lifeLine(p))}</strong>
        <span class="td-dating ${p.dating}">${DATING_LABEL[p.dating]}</span>
      </div>
      ${p.age && (p.born != null || p.died != null) ? `<p class="td-age">Scripture gives an age of ${p.age} years.</p>` : ''}
      <p class="td-bio">${escapeHtml(p.bio)}</p>
      ${p.note ? `<p class="td-note"><strong>Note</strong>${escapeHtml(p.note)}</p>` : ''}
      <div class="td-rels">
        ${rel('Named parent / ancestor', [father, mother].filter(Boolean))}
        ${rel(spouses.length > 1 ? 'Spouses' : 'Spouse', spouses)}
        ${rel('Named child / descendant', kids)}
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
      if (person.classList.contains('tree-search-result')) {
        searchEl.value = ''
        state.query = ''
        renderSearchResults('')
      }
      selectPerson(person.dataset.person)
      return
    }
    const action = e.target.closest('[data-tree-action]')?.dataset.treeAction
    if (action === 'trace') {
      state.trace = !state.trace
      refreshHighlights()
      updateToolbar()
      return
    }
    if (action === 'focus') {
      state.focus = !state.focus
      renderRows()
      drawLinks()
      updateToolbar()
      requestAnimationFrame(() => centerPerson(state.selected))
      return
    }
    if (action === 'center') {
      centerPerson(state.selected)
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

  searchEl.addEventListener('input', () => {
    state.query = searchEl.value
    renderSearchResults(state.query)
  })
  searchEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const first = resultsEl.querySelector('[data-person]')
      if (first) {
        searchEl.value = ''
        renderSearchResults('')
        selectPerson(first.dataset.person)
      }
    }
    if (event.key === 'Escape') renderSearchResults('')
  })
  searchEl.addEventListener('blur', () => setTimeout(() => renderSearchResults(''), 120))
  jumpEl.addEventListener('change', () => {
    if (jumpEl.value) selectPerson(jumpEl.value)
    jumpEl.value = ''
  })

  let drawn = false
  let initiallyCentered = false
  function show() {
    if (!drawn) { renderRows(); renderDetail(); updateToolbar(); drawn = true }
    // Drawn synchronously first: the connectors are the whole point of the view, and
    // requestAnimationFrame does not fire in a backgrounded tab, which would leave the
    // tree with no lines at all. The later passes only refine the measurements once
    // scrollbars and webfonts have settled the card widths.
    drawLinks()
    requestAnimationFrame(() => {
      drawLinks()
      if (!initiallyCentered) {
        centerPerson(state.selected, 'auto')
        initiallyCentered = true
      }
    })
    if (document.fonts?.ready) document.fonts.ready.then(drawLinks).catch(() => {})
  }

  new ResizeObserver(() => { if (drawn) drawLinks() }).observe(root)

  return { show, select: (id) => selectPerson(id) }
}
