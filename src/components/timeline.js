import { state, update, selectEvent, datedVisibleEvents, formatYear, FULL_DOMAIN } from '../store.js'
import { ERAS, ERA_BY_ID } from '../data/eras.js'
import { eventSpan } from '../data/events.js'

const NS = 'http://www.w3.org/2000/svg'
const M = { top: 4, right: 18, bottom: 26, left: 18 }
const RIBBON_H = 18
const LANE_H = 15
const DOT_R = 4.5
const MIN_SPAN_W = 9
const LANE_GAP = 7          // px of clear space required between items in a lane
const MIN_YEARS = 12        // furthest zoom in

const el = (name, attrs = {}) => {
  const n = document.createElementNS(NS, name)
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v)
  return n
}

export function createTimeline(root) {
  root.innerHTML = `
    <div class="tl-toolbar">
      <span class="tl-label">Timeline</span>
      <div class="tl-eras" role="group" aria-label="Jump to era"></div>
      <div class="tl-zoom">
        <button class="btn-icon" data-zoom="out" title="Zoom out" aria-label="Zoom out">−</button>
        <button class="btn-icon" data-zoom="in" title="Zoom in" aria-label="Zoom in">+</button>
        <button class="btn-icon btn-reset" data-zoom="reset" title="Show everything">Reset</button>
      </div>
    </div>
    <div class="tl-canvas"><svg class="tl-svg"></svg><div class="tl-tip" hidden></div></div>
  `

  const canvas = root.querySelector('.tl-canvas')
  const svg = root.querySelector('.tl-svg')
  const tip = root.querySelector('.tl-tip')
  const eraBar = root.querySelector('.tl-eras')

  // --- era jump buttons ---------------------------------------------------
  for (const era of ERAS.filter((e) => e.range)) {
    const b = document.createElement('button')
    b.className = 'tl-era-btn'
    b.textContent = era.short
    b.style.setProperty('--era', era.color)
    b.title = `${era.name} — zoom timeline to this period`
    b.onclick = () => {
      const [s, e] = era.range
      const pad = Math.max(20, (e - s) * 0.08)
      update({ domain: { start: s - pad, end: e + pad } }, 'domain')
    }
    eraBar.appendChild(b)
  }

  root.querySelector('.tl-zoom').onclick = (e) => {
    const k = e.target.dataset.zoom
    if (!k) return
    if (k === 'reset') return update({ domain: { ...FULL_DOMAIN } }, 'domain')
    zoomBy(k === 'in' ? 0.6 : 1 / 0.6, 0.5)
  }

  let W = 0, H = 0, laidOut = []

  const xOf = (year) => {
    const { start, end } = state.domain
    return M.left + ((year - start) / (end - start)) * (W - M.left - M.right)
  }
  const yearAt = (px) => {
    const { start, end } = state.domain
    return start + ((px - M.left) / (W - M.left - M.right)) * (end - start)
  }

  function zoomBy(factor, anchorFrac) {
    const { start, end } = state.domain
    const span = end - start
    const next = Math.max(MIN_YEARS, Math.min(FULL_DOMAIN.end - FULL_DOMAIN.start, span * factor))
    const focus = start + span * anchorFrac
    update({ domain: clamp({ start: focus - next * anchorFrac, end: focus + next * (1 - anchorFrac) }) }, 'domain')
  }

  /** Keep the view inside the full extent without changing its width. */
  function clamp(d) {
    const span = Math.min(d.end - d.start, FULL_DOMAIN.end - FULL_DOMAIN.start)
    let start = d.start
    if (start < FULL_DOMAIN.start) start = FULL_DOMAIN.start
    if (start + span > FULL_DOMAIN.end) start = FULL_DOMAIN.end - span
    return { start, end: start + span }
  }

  // --- tick spacing -------------------------------------------------------
  const STEPS = [1000, 500, 250, 100, 50, 25, 10, 5, 2, 1]
  function ticks() {
    const span = state.domain.end - state.domain.start
    const target = Math.max(2, Math.floor((W - M.left - M.right) / 95))
    const step = STEPS.find((s) => span / s <= target) ?? 1
    const first = Math.ceil(state.domain.start / step) * step
    const out = []
    for (let y = first; y <= state.domain.end; y += step) out.push(y)
    return out
  }

  /**
   * Greedy lane packing. Events are pre-sorted by start year, so the first lane
   * with enough clearance is always a valid choice.
   */
  function layout(events) {
    const laneEnds = []
    return events.map((ev) => {
      const span = eventSpan(ev, state.chronology)
      const x1 = xOf(span.start)
      const x2 = Math.max(xOf(span.end), x1 + (span.start === span.end ? 0 : MIN_SPAN_W))
      const left = span.start === span.end ? x1 - DOT_R : x1
      const right = span.start === span.end ? x1 + DOT_R : x2
      let lane = laneEnds.findIndex((endX) => left > endX + LANE_GAP)
      if (lane === -1) { lane = laneEnds.length; laneEnds.push(-Infinity) }
      laneEnds[lane] = right
      return { ev, span, x1, x2, left, right, lane, isSpan: span.start !== span.end }
    })
  }

  // --- render -------------------------------------------------------------
  function render() {
    const rect = canvas.getBoundingClientRect()
    W = rect.width; H = rect.height
    if (W < 10) return
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
    svg.setAttribute('width', W)
    svg.setAttribute('height', H)
    while (svg.firstChild) svg.removeChild(svg.firstChild)

    const laneTop = M.top + RIBBON_H + 8
    const laneSpace = H - laneTop - M.bottom
    const maxLanes = Math.max(1, Math.floor(laneSpace / LANE_H))

    // era ribbon
    const gEra = el('g', { class: 'tl-ribbon' })
    for (const era of ERAS) {
      if (!era.range) continue
      const a = xOf(era.range[0]), b = xOf(era.range[1])
      if (b < M.left || a > W - M.right) continue
      const x = Math.max(a, M.left), w = Math.min(b, W - M.right) - x
      if (w <= 0) continue
      const dim = !state.activeEras.has(era.id)
      const r = el('rect', {
        x, y: M.top, width: w, height: RIBBON_H, rx: 3,
        fill: era.color, opacity: dim ? 0.12 : 0.32,
      })
      r.append(el('title')).textContent = era.name
      gEra.append(r)
      if (w > 46) {
        const t = el('text', {
          x: x + w / 2, y: M.top + RIBBON_H / 2 + 3.5,
          'text-anchor': 'middle', class: 'tl-ribbon-label',
          fill: era.color, opacity: dim ? 0.35 : 1,
        })
        t.textContent = w > 110 ? era.name : era.short
        gEra.append(t)
      }
    }
    svg.append(gEra)

    // axis
    const axisY = H - M.bottom + 10
    const gAxis = el('g', { class: 'tl-axis' })
    gAxis.append(el('line', { x1: M.left, y1: axisY, x2: W - M.right, y2: axisY, class: 'tl-axis-line' }))
    for (const y of ticks()) {
      const x = xOf(y)
      if (x < M.left - 1 || x > W - M.right + 1) continue
      gAxis.append(el('line', { x1: x, y1: laneTop - 6, x2: x, y2: axisY, class: 'tl-grid' }))
      const t = el('text', { x, y: axisY + 13, 'text-anchor': 'middle', class: 'tl-tick' })
      t.textContent = formatYear(y)
      gAxis.append(t)
    }
    svg.append(gAxis)

    // events
    laidOut = layout(datedVisibleEvents())
    const overflow = laidOut.filter((d) => d.lane >= maxLanes).length
    const gEv = el('g', { class: 'tl-events' })

    for (const d of laidOut) {
      if (d.lane >= maxLanes) continue
      if (d.right < M.left || d.left > W - M.right) continue
      const y = laneTop + d.lane * LANE_H + LANE_H / 2
      const era = ERA_BY_ID[d.ev.era]
      const selected = state.selectedId === d.ev.id
      const hovered = state.hoveredId === d.ev.id

      const g = el('g', {
        class: `tl-ev${selected ? ' is-selected' : ''}${hovered ? ' is-hovered' : ''}`,
        'data-id': d.ev.id, tabindex: '0', role: 'button',
      })
      g.append(el('title')).textContent = d.ev.title

      // Where this event would sit under the other chronology.
      if (d.ev.dates.diverges) {
        const other = state.chronology === 'traditional' ? 'academic' : 'traditional'
        const os = eventSpan(d.ev, other)
        const ox = xOf(os.start)
        if (Math.abs(ox - d.x1) > 3) {
          g.append(el('line', {
            x1: d.x1, y1: y, x2: ox, y2: y, class: 'tl-ghost-link', stroke: era.color,
          }))
          g.append(el('circle', { cx: ox, cy: y, r: 2.4, class: 'tl-ghost-dot', fill: era.color }))
        }
      }

      if (d.isSpan) {
        g.append(el('rect', {
          x: d.x1, y: y - 4.5, width: Math.max(MIN_SPAN_W, d.x2 - d.x1), height: 9,
          rx: 4.5, fill: era.color, class: 'tl-bar',
        }))
      } else {
        g.append(el('circle', { cx: d.x1, cy: y, r: DOT_R, fill: era.color, class: 'tl-dot' }))
      }

      // Label only when the lane has room before the next item.
      const nextInLane = laidOut.find((o) => o.lane === d.lane && o.left > d.right)
      const room = (nextInLane ? nextInLane.left : W - M.right) - d.right - 8
      if (room > 34 && d.right < W - M.right) {
        const t = el('text', { x: d.right + 6, y: y + 3.4, class: 'tl-ev-label' })
        const chars = Math.floor(room / 5.6)
        t.textContent = d.ev.title.length > chars ? d.ev.title.slice(0, Math.max(3, chars - 1)) + '…' : d.ev.title
        g.append(t)
      }
      gEv.append(g)
    }
    svg.append(gEv)

    if (overflow > 0) {
      const t = el('text', { x: W - M.right, y: laneTop - 10, 'text-anchor': 'end', class: 'tl-overflow' })
      t.textContent = `${overflow} more — zoom in or filter to see them`
      svg.append(t)
    }
  }

  // --- interaction --------------------------------------------------------
  const idFrom = (target) => target.closest?.('.tl-ev')?.dataset.id ?? null

  svg.addEventListener('pointermove', (e) => {
    const id = idFrom(e.target)
    if (id !== state.hoveredId) update({ hoveredId: id }, 'hover')
    if (id) {
      const box = canvas.getBoundingClientRect()
      tip.hidden = false
      const ev = datedVisibleEvents().find((x) => x.id === id)
      tip.innerHTML = `<strong>${escapeHtml(ev.title)}</strong><span>${escapeHtml(ev.ref)}</span>`
      const x = Math.min(Math.max(e.clientX - box.left, 70), box.width - 70)
      tip.style.left = `${x}px`
      tip.style.top = `${e.clientY - box.top - 12}px`
    } else tip.hidden = true
  })
  svg.addEventListener('pointerleave', () => {
    tip.hidden = true
    if (state.hoveredId) update({ hoveredId: null }, 'hover')
  })
  svg.addEventListener('click', (e) => {
    const id = idFrom(e.target)
    if (id) selectEvent(id)
  })
  svg.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    const id = idFrom(e.target)
    if (id) { e.preventDefault(); selectEvent(id) }
  })

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault()
    const box = canvas.getBoundingClientRect()
    const frac = Math.min(Math.max((e.clientX - box.left - M.left) / (box.width - M.left - M.right), 0), 1)
    zoomBy(e.deltaY > 0 ? 1.18 : 1 / 1.18, frac)
  }, { passive: false })

  // drag to pan
  let drag = null
  canvas.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return
    drag = { x: e.clientX, domain: { ...state.domain }, moved: false }
    canvas.setPointerCapture(e.pointerId)
  })
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return
    const dx = e.clientX - drag.x
    if (Math.abs(dx) > 2) { drag.moved = true; canvas.classList.add('is-panning') }
    const perPx = (drag.domain.end - drag.domain.start) / (W - M.left - M.right)
    update({ domain: clamp({ start: drag.domain.start - dx * perPx, end: drag.domain.end - dx * perPx }) }, 'domain')
  })
  const endDrag = () => { drag = null; canvas.classList.remove('is-panning') }
  canvas.addEventListener('pointerup', endDrag)
  canvas.addEventListener('pointercancel', endDrag)

  new ResizeObserver(() => render()).observe(canvas)

  /** Bring an event into view, widening the domain only if it falls outside. */
  function revealEvent(ev) {
    if (ev.dates.undated) return
    const s = eventSpan(ev, state.chronology)
    const { start, end } = state.domain
    const span = end - start
    if (s.start >= start + span * 0.08 && s.end <= end - span * 0.08) return
    const mid = (s.start + s.end) / 2
    const want = Math.max(span, (s.end - s.start) * 1.6, MIN_YEARS)
    update({ domain: clamp({ start: mid - want / 2, end: mid + want / 2 }) }, 'domain')
  }

  return { render, revealEvent }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}
