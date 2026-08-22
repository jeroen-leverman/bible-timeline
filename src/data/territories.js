/**
 * Political territories over time, drawn as simplified polygons.
 *
 * READ THIS BEFORE TRUSTING A BORDER.
 * These are schematic. Ancient polities did not have surveyed frontiers: they had
 * cores, tributary zones, garrisoned roads and desert margins that no one governed.
 * A crisp line on a screen implies a precision that did not exist, so each entry
 * carries a `precision` note and the UI says so on screen.
 *
 * The outlines are hand-drawn approximations of the extent usually shown in
 * historical atlases at the stated dates. They are our own work, not traced from a
 * copyrighted map, and they are deliberately coarse — enough to show that Judah was
 * small and Persia was enormous, not enough to argue about a valley.
 *
 * `span` is [startYear, endYear] on the same BC-negative scale as events.js. A
 * territory shows when the timeline's current year falls inside its span.
 */

const T = (id, name, span, color, precision, blurb, rings) =>
  ({ id, name, span, color, precision, blurb, rings })

export const TERRITORIES = [
  T('united-monarchy', 'The United Monarchy', [-1010, -932], '#3f7d6e',
    'Extent under David and Solomon as described in Samuel and Kings. The northern and eastern reaches are the least secure part of the picture.',
    'Biblical description; archaeologically contested',
    [[[34.30, 31.20], [34.55, 31.60], [34.95, 32.35], [34.90, 32.85], [35.15, 33.25],
      [35.75, 33.30], [36.10, 32.90], [36.05, 32.20], [35.85, 31.55], [35.55, 30.90],
      [35.20, 30.30], [34.85, 30.45], [34.45, 30.85]]]),

  T('israel-judah', 'Israel and Judah', [-931, -722], '#2f6690',
    'The two kingdoms after the split. Israel in the north is the larger and richer; Judah in the south is a highland rump around Jerusalem.',
    'Schematic; the frontier between them moved repeatedly',
    [
      // northern kingdom of Israel
      [[34.90, 32.30], [34.88, 32.90], [35.15, 33.25], [35.72, 33.28], [35.95, 32.85],
       [35.85, 32.25], [35.40, 31.95], [35.00, 32.00]],
      // southern kingdom of Judah
      [[34.75, 31.30], [34.95, 31.95], [35.35, 31.95], [35.60, 31.45], [35.45, 30.95],
       [35.05, 30.85], [34.80, 31.05]],
    ]),

  T('assyria', 'The Neo-Assyrian Empire', [-745, -612], '#8f3f5c',
    'At its height under Tiglath-Pileser III, Sargon II and Sennacherib — the power that ends the northern kingdom in 722 and besieges Jerusalem in 701.',
    'Imperial core and tributary zone, generalised',
    [[[31.00, 30.00], [30.20, 31.60], [32.50, 33.20], [36.00, 37.20], [42.00, 38.50],
      [46.50, 37.00], [48.50, 33.50], [47.00, 30.50], [44.00, 30.00], [39.00, 31.00],
      [35.50, 30.00], [34.20, 31.20], [34.00, 32.60], [35.50, 33.50]]]),

  T('babylon', 'The Neo-Babylonian Empire', [-626, -539], '#5c5470',
    'Nebuchadnezzar’s empire, which takes Jerusalem in 597 and destroys it in 586.',
    'Imperial core and tributary zone, generalised',
    [[[30.40, 31.40], [32.60, 33.30], [36.20, 37.00], [41.00, 37.50], [46.00, 35.00],
      [48.00, 31.50], [46.00, 29.80], [42.00, 30.20], [37.00, 30.20], [34.20, 31.10],
      [34.10, 32.70], [35.60, 33.40]]]),

  T('persia', 'The Achaemenid Persian Empire', [-539, -333], '#b8860b',
    'The empire of Cyrus, Darius and Xerxes — the largest the region had seen, and the one that lets the exiles go home.',
    'Imperial extent, heavily generalised',
    [[[26.00, 40.20], [24.00, 37.00], [26.50, 31.50], [31.00, 22.00], [34.00, 27.50],
      [38.00, 30.00], [45.00, 29.00], [52.00, 27.00], [61.00, 29.50], [66.00, 34.00],
      [63.00, 39.00], [56.00, 41.00], [48.00, 41.50], [40.00, 41.50], [33.00, 42.00]]]),

  T('hellenistic', 'The Seleucid and Ptolemaic kingdoms', [-332, -142], '#a08a3c',
    'Alexander’s empire divided between his generals. The Levant is the seam between the two, and changes hands repeatedly.',
    'Two successor kingdoms shown as one zone',
    [[[24.50, 40.50], [23.50, 36.00], [25.50, 31.00], [29.50, 24.50], [33.50, 26.00],
      [35.50, 29.50], [40.00, 30.50], [48.00, 30.00], [54.00, 32.00], [56.00, 37.00],
      [50.00, 39.50], [42.00, 40.00], [34.00, 41.50], [28.00, 41.50]]]),

  T('hasmonean', 'The Hasmonean kingdom', [-141, -63], '#c8553d',
    'Jewish independence won by the Maccabean revolt, at its greatest extent under Alexander Jannaeus, and ended by Pompey.',
    'Greatest extent; held only briefly',
    [[[34.50, 31.10], [34.85, 31.90], [34.95, 32.60], [35.30, 33.10], [35.90, 33.00],
      [36.10, 32.40], [35.90, 31.60], [35.60, 30.90], [35.10, 30.55], [34.70, 30.85]]]),

  T('herodian', 'Herod’s kingdom and Roman Judea', [-37, 70], '#7c6a9c',
    'The client kingdom of Herod the Great, later broken among his sons and absorbed as a Roman province — the political world of the Gospels.',
    'Herod’s kingdom at his death in 4 BC',
    [[[34.40, 31.05], [34.80, 31.85], [34.90, 32.55], [35.25, 33.15], [36.05, 33.20],
      [36.40, 32.60], [36.20, 31.80], [35.75, 30.95], [35.20, 30.40], [34.65, 30.80]]]),

  T('rome-east', 'The Roman Empire in the east', [-63, 100], '#292420',
    'The provinces the early church spreads through — and the roads and sea lanes that made it possible.',
    'Eastern provinces only; the empire extends far west of this frame',
    [[[12.00, 45.50], [10.00, 38.00], [14.00, 35.00], [20.00, 31.50], [25.00, 30.50],
      [32.00, 30.50], [35.50, 29.00], [39.00, 32.50], [42.00, 37.00], [40.00, 41.00],
      [33.00, 42.50], [26.00, 42.00], [19.00, 43.50]]]),
]

/** Territories whose span contains `year`. */
export function territoriesAt(year) {
  return TERRITORIES.filter((t) => year >= t.span[0] && year <= t.span[1])
}

export const TERRITORY_BY_ID = Object.fromEntries(TERRITORIES.map((t) => [t.id, t]))
