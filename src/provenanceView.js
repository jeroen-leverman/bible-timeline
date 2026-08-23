import {
  PROVENANCE_STATUS,
  PROVENANCE_STATUS_SHORT,
  SOURCE_CATALOG,
  SOURCE_ROLE_LABEL,
  VERIFICATION_LABEL,
} from './data/provenance.js'
import { escapeHtml } from './verses.js'

const clip = (value, length = 190) => {
  const text = String(value)
  return text.length > length ? `${text.slice(0, length - 1).trim()}…` : text
}

function sourceTitle(source, catalog) {
  const title = escapeHtml(catalog.title)
  const href = source.url ?? catalog.url
  return href
    ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${title} ↗</a>`
    : `<strong>${title}</strong>`
}

export function provenanceMarkup(provenance, label = 'Sources & provenance') {
  if (!provenance) return ''
  const statusClass = provenance.status.replace(/[^a-z-]/g, '')
  const sources = provenance.sources.map((source) => {
    const catalog = SOURCE_CATALOG[source.sourceId]
    if (!catalog) return ''
    const license = source.license ?? catalog.license
    return `<li class="source-entry">
      <div class="source-entry-head">
        ${sourceTitle(source, catalog)}
        <span>${escapeHtml(SOURCE_ROLE_LABEL[source.role] ?? source.role)}</span>
      </div>
      <div class="source-citations">${source.citations.map((citation) =>
        `<span title="${escapeHtml(citation)}">${escapeHtml(clip(citation))}</span>`).join('')}</div>
      <small>${escapeHtml(VERIFICATION_LABEL[source.verification] ?? source.verification)}${license ? ` · ${escapeHtml(license)}` : ''}</small>
    </li>`
  }).join('')

  return `<details class="source-details">
    <summary>
      <span>${escapeHtml(label)}</span>
      <b class="source-status ${statusClass}">${escapeHtml(PROVENANCE_STATUS[provenance.status] ?? provenance.status)}</b>
    </summary>
    <div class="source-details-body">
      <p>${escapeHtml(provenance.note)}</p>
      <ul>${sources}</ul>
      ${provenance.reviewedOn ? `<small class="source-reviewed">Reviewed ${escapeHtml(provenance.reviewedOn)}</small>` : ''}
    </div>
  </details>`
}

export function provenanceStatusMarkup(provenance) {
  if (!provenance) return ''
  const statusClass = provenance.status.replace(/[^a-z-]/g, '')
  return `<span class="source-status source-status-inline ${statusClass}">${escapeHtml(PROVENANCE_STATUS_SHORT[provenance.status] ?? provenance.status)}</span>`
}
