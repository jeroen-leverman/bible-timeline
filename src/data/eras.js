/**
 * Historical eras used to group events and colour the timeline.
 *
 * Year convention used throughout this project:
 *   negative number = BC (e.g. -586 is 586 BC)
 *   positive number = AD (e.g. 30 is AD 30)
 * There is no year 0. On a 2,000-year scale the resulting one-year seam at the
 * BC/AD boundary is not visible, so we don't correct for it.
 */

export const ERAS = [
  {
    id: 'primeval',
    name: 'Primeval History',
    short: 'Primeval',
    color: '#7c6a9c',
    undated: true,
    blurb:
      'Genesis 1–11. These narratives are not anchored to any datable event, and the ' +
      'text itself gives no absolute years. They are shown outside the dated timeline.',
  },
  {
    id: 'patriarchs',
    name: 'The Patriarchs',
    short: 'Patriarchs',
    color: '#b3763a',
    range: [-2100, -1650],
    blurb:
      'Abraham, Isaac, Jacob and Joseph. No patriarch is named in any surviving ' +
      'contemporary record, so all dates here are inference, not measurement.',
  },
  {
    id: 'egypt-exodus',
    name: 'Egypt & the Exodus',
    short: 'Exodus',
    color: '#c8553d',
    range: [-1650, -1200],
    blurb:
      'Israel in Egypt, the Exodus, Sinai and the wilderness years. The single ' +
      'largest chronological dispute in the Hebrew Bible sits here.',
  },
  {
    id: 'conquest-judges',
    name: 'Conquest & Judges',
    short: 'Judges',
    color: '#a08a3c',
    range: [-1400, -1050],
    blurb:
      'Joshua’s campaigns and the cycle of tribal leaders in Judges, before Israel ' +
      'had a king.',
  },
  {
    id: 'united-monarchy',
    name: 'The United Monarchy',
    short: 'Monarchy',
    color: '#3f7d6e',
    range: [-1050, -930],
    blurb:
      'Samuel, Saul, David and Solomon. From roughly David onward, biblical dates ' +
      'begin to interlock with datable events outside the Bible.',
  },
  {
    id: 'divided-kingdom',
    name: 'The Divided Kingdom',
    short: 'Divided',
    color: '#2f6690',
    range: [-930, -586],
    blurb:
      'Israel in the north, Judah in the south, and the prophets. Assyrian and ' +
      'Babylonian records make this the best-dated stretch of the Old Testament.',
  },
  {
    id: 'exile-return',
    name: 'Exile & Return',
    short: 'Exile',
    color: '#5c5470',
    range: [-586, -400],
    blurb:
      'Judah in Babylon, the Persian decree of return, the Second Temple, Ezra and ' +
      'Nehemiah.',
  },
  {
    id: 'second-temple',
    name: 'Between the Testaments',
    short: 'Second Temple',
    color: '#6b7a8f',
    range: [-400, -5],
    blurb:
      'Alexander, the Maccabean revolt, Hasmonean rule and the arrival of Rome. ' +
      'Outside the Protestant canon, but it is the world the New Testament opens in.',
  },
  {
    id: 'jesus',
    name: 'The Life of Jesus',
    short: 'Jesus',
    color: '#b8860b',
    range: [-6, 33],
    blurb:
      'From the nativity to the crucifixion and resurrection, anchored by the reigns ' +
      'of Herod the Great, Tiberius and Pontius Pilate.',
  },
  {
    id: 'early-church',
    name: 'The Early Church',
    short: 'Church',
    color: '#8f3f5c',
    range: [30, 100],
    blurb:
      'Pentecost, the spread beyond Judea, Paul’s journeys and letters, the Jewish ' +
      'revolt and the destruction of the Temple.',
  },
]

export const ERA_BY_ID = Object.fromEntries(ERAS.map((e) => [e.id, e]))

export const CATEGORIES = [
  { id: 'covenant',  name: 'Covenant & law',        color: '#b8860b' },
  { id: 'migration', name: 'Journeys & migration',  color: '#3f7d6e' },
  { id: 'battle',    name: 'Battles & conquest',    color: '#c8553d' },
  { id: 'kingdom',   name: 'Kings & politics',      color: '#2f6690' },
  { id: 'prophet',   name: 'Prophets',              color: '#7c6a9c' },
  { id: 'temple',    name: 'Temple & worship',      color: '#a08a3c' },
  { id: 'miracle',   name: 'Miracles & signs',      color: '#8f3f5c' },
  { id: 'ministry',  name: 'Teaching & ministry',   color: '#5c8a7a' },
]

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))
