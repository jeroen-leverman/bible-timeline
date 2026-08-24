import { EVENT_BY_ID } from './data/events.js'
import { ERA_BY_ID } from './data/eras.js'
import { escapeHtml } from './verses.js'

const KIDS_STORIES = [
  {
    id: 'creation', question: 'Why does the story begin here?',
    story: 'Genesis begins with God making an ordered world and giving people a place in it.',
    history: 'Genesis does not give us a calendar year for creation. The date sometimes printed beside it comes from later calculations, not from archaeology.',
  },
  {
    id: 'call-abram', question: 'Why did Abraham travel so far?',
    story: 'Abraham leaves his home and travels toward Canaan because God promises a new land, a family, and a blessing for many peoples.',
    history: 'No surviving inscription names Abraham. Historians compare the story with the wider world of ancient Mesopotamia and Canaan.',
  },
  {
    id: 'exodus', question: 'What can the Merneptah Stele tell us?',
    story: 'Exodus tells how Israel escapes slavery in Egypt and begins a journey toward a new homeland.',
    history: 'An Egyptian monument names a people called Israel in Canaan by about 1208 BC. It does not describe the escape from Egypt.',
  },
  {
    id: 'david-king-israel', question: 'Was David remembered outside the Bible?',
    story: 'David becomes king over Israel and Judah before making Jerusalem his capital.',
    history: 'The Tel Dan Stele mentions a royal family called the “House of David.” It supports the dynasty’s name, but it cannot tell us every story about David.',
  },
  {
    id: 'hezekiah-tunnel', question: 'How did two teams meet underground?',
    story: 'Workers cut a water tunnel through rock so water could flow safely inside Jerusalem.',
    history: 'An inscription found in the tunnel describes the moment the two digging teams met. It does not name King Hezekiah.',
  },
  {
    id: 'jerusalem-falls', question: 'How do we study a city’s destruction?',
    story: 'Babylon captures Jerusalem, destroys the Temple, and carries many people into exile.',
    history: 'Burned buildings, military letters, and Babylonian records show a kingdom in crisis. Historians still debate whether the final fall was in 587 or 586 BC.',
  },
  {
    id: 'babylon-falls', question: 'Why did Cyrus change the empire?',
    story: 'Persia captures Babylon, replacing the empire that had conquered Judah.',
    history: 'Babylonian records date the capture to 539 BC. Cyrus’s own inscription describes restoring temples and displaced communities.',
  },
  {
    id: 'return', question: 'Did everyone return at once?',
    story: 'Some Judean families travel from Babylon to Jerusalem and begin rebuilding their community.',
    history: 'Persian policy made returns possible, but the Cyrus Cylinder does not name Jerusalem. The return probably happened in stages.',
  },
  {
    id: 'nativity', question: 'Why is Jesus’s birth dated as a range?',
    story: 'The Gospels place Jesus’s birth in Judea during the final years of Herod the Great.',
    history: 'Ancient writers help date Herod, but no outside record gives Jesus’s birthday. That is why the timeline shows an approximate range.',
  },
  {
    id: 'baptism', question: 'How does a ruler help date a story?',
    story: 'John baptizes Jesus in the Jordan at the beginning of Jesus’s public ministry.',
    history: 'Luke names rulers whose dates are known, including Tiberius and Pontius Pilate. Those rulers give us a time window, not proof of the baptism itself.',
  },
  {
    id: 'crucifixion', question: 'Which outside sources mention this?',
    story: 'The Gospels say Jesus is sentenced by Pilate and crucified outside Jerusalem.',
    history: 'A Roman inscription confirms Pilate’s office. The historian Tacitus later says Christus was executed under Pilate, but neither source chooses between AD 30 and AD 33.',
  },
  {
    id: 'gallio', question: 'How can one inscription date Paul’s travels?',
    story: 'Paul is brought before Gallio while teaching in Corinth, and the case is dismissed.',
    history: 'An inscription at Delphi dates Gallio’s time as governor. It gives historians one of their best fixed points for Paul’s journeys.',
  },
]

function storyCard(entry, index) {
  const event = EVENT_BY_ID[entry.id]
  const era = ERA_BY_ID[event.era]
  return `<article class="kids-card" style="--kids-color:${era.color}">
    <div class="kids-card-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</div>
    <p class="kids-era">${escapeHtml(era.short)} · ${escapeHtml(event.dateLabel)}</p>
    <h2>${escapeHtml(event.title)}</h2>
    <p class="kids-question">${escapeHtml(entry.question)}</p>
    <div class="kids-story"><strong>The Bible story</strong><p>${escapeHtml(entry.story)}</p></div>
    <div class="kids-history"><strong>History clue</strong><p>${escapeHtml(entry.history)}</p></div>
    <p class="kids-reference">Read it: ${event.scripture.map(escapeHtml).join(' · ')}</p>
    <button data-kids-event="${escapeHtml(event.id)}">Find it on the map →</button>
  </article>`
}

export function createKidsView(container, { onShowInAtlas, onShowEvidence }) {
  container.innerHTML = `<div class="kids-shell">
    <header class="kids-hero">
      <div><p class="kids-kicker">A simpler way to explore</p><h1>Big stories.<br><em>Real places.</em></h1>
      <p>Read the Bible story, look for history clues, and learn why some questions do not have one easy answer.</p></div>
      <div class="kids-compass" aria-hidden="true"><span>N</span><i></i><b>Explore</b></div>
    </header>
    <main class="kids-content">
      <section class="kids-guide" aria-label="How to use Kids View">
        <div><span>1</span><strong>Read the story</strong><p>Start with what the Bible says.</p></div>
        <div><span>2</span><strong>Look for clues</strong><p>See what objects and records survive.</p></div>
        <div><span>3</span><strong>Ask good questions</strong><p>A clue may support only part of a story.</p></div>
      </section>
      <div class="kids-heading"><div><p>Starter journey</p><h2>12 stops through Bible history</h2></div><button id="kids-evidence-link">Visit the full Evidence Explorer →</button></div>
      <section class="kids-grid">${KIDS_STORIES.map(storyCard).join('')}</section>
    </main>
  </div>`
  container.addEventListener('click', (event) => {
    const eventId = event.target.closest('[data-kids-event]')?.dataset.kidsEvent
    if (eventId) onShowInAtlas(eventId)
  })
  container.querySelector('#kids-evidence-link').addEventListener('click', onShowEvidence)
}
