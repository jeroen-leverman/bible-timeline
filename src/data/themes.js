/**
 * Curated threads through the atlas.
 *
 * An era answers "when", a category answers "what kind of event". A theme answers
 * "whose story is this" — it gathers the events belonging to one life or one long
 * argument and lets the timeline be read as that story rather than as the whole
 * sweep. Selecting one filters the map and the rail down to its events, which stay
 * in chronological order because the event list is sorted globally.
 *
 * Themes are curations, not categories: an event can belong to several, and many
 * events belong to none. `events` lists ids from events.js and is validated on load,
 * so a typo fails loudly rather than silently shortening someone's life.
 */

const theme = (id, name, kind, subtitle, blurb, events) => ({ id, name, kind, subtitle, blurb, events })

export const THEMES = [
  // ---- lives ------------------------------------------------------------
  theme('noah', 'Noah', 'life', 'Genesis 6–9',
    'The one life in Genesis told almost entirely without geography. Nothing is located until the ark grounds on the mountains of Ararat, and no year is given at any point.',
    ['noah-ark', 'noah-enters-ark', 'flood', 'noah-dove', 'noah-altar', 'noah-covenant', 'noah-vineyard']),

  theme('abraham', 'Abraham', 'life', 'Genesis 11–25',
    'From Ur to Haran to Canaan to Egypt and back — roughly 1,500 miles, all of it on the promise of a land he never owns and a son he does not yet have.',
    ['abram-ur', 'call-abram', 'abram-egypt', 'abraham-covenant', 'sodom', 'isaac-born', 'binding-isaac']),

  theme('jacob', 'Jacob', 'life', 'Genesis 25–49',
    'A man who takes what he wants by cunning, spends twenty years in exile for it, and comes home limping with a new name.',
    ['jacob-esau', 'jacobs-ladder', 'jacob-wrestles', 'jacob-egypt']),

  theme('joseph', 'Joseph', 'life', 'Genesis 37–50',
    'Sold by his brothers at Dothan and carried down the coastal road; the story ends with him governing the country he arrived in as property.',
    ['joseph-sold', 'joseph-vizier', 'jacob-egypt']),

  theme('moses', 'Moses', 'life', 'Exodus – Deuteronomy',
    'Eighty years before the burning bush and forty after it. He argues with God, carries a nation across a desert, and dies within sight of the destination.',
    ['moses-born', 'burning-bush', 'plagues', 'exodus', 'sea-crossing', 'sinai-law', 'golden-calf',
     'tabernacle', 'kadesh-spies', 'wilderness', 'moses-nebo']),

  theme('joshua', 'Joshua', 'life', 'Joshua 1–24',
    'The campaigns, and the archaeology that both supports and complicates them — Hazor burns on schedule, Jericho does not.',
    ['jordan-crossing-ev', 'jericho', 'ai', 'gibeon-sun', 'hazor-burn', 'shechem-covenant']),

  theme('ruth', 'Ruth', 'life', 'Ruth 1–4',
    'A famine, two widows, and a foreign woman who refuses to go home. The whole book turns on a legal technicality about redeeming a dead man’s land, and ends by making her David’s great-grandmother.',
    ['ruth-moab', 'ruth-vow', 'ruth', 'ruth-threshing', 'ruth-obed']),

  theme('samuel', 'Samuel', 'life', '1 Samuel 1–16',
    'Born to a woman who was mocked for wanting a child, handed to a shrine, and left as the last judge — the man who both installs Israel’s first king and warns them what a king will cost.',
    ['samuel-born', 'samuel-call', 'ark-captured', 'saul-king', 'samuel-anoints-david']),

  theme('david', 'David', 'life', '1 Samuel 16 – 1 Kings 2',
    'Shepherd, outlaw, king, adulterer, refugee from his own son. The most fully told life in the Hebrew Bible, and the least flattering.',
    ['samuel-anoints-david', 'david-goliath', 'david-flees', 'gilboa', 'david-king', 'jerusalem-captured',
     'ark-jerusalem', 'davidic-covenant', 'bathsheba', 'absalom']),

  theme('solomon', 'Solomon', 'life', '1 Kings 1–11',
    'Asks for wisdom rather than long life or riches, builds the temple, and leaves a kingdom that splits the moment he dies.',
    ['solomon-king', 'first-temple', 'queen-sheba', 'division']),

  theme('elijah', 'Elijah and Elisha', 'life', '1 Kings 17 – 2 Kings 13',
    'Fire on Carmel, then a whisper at Horeb. The mantle passes to a successor who does twice as many miracles and gets a fraction of the attention.',
    ['elijah-carmel', 'elijah-horeb', 'naboth', 'elisha']),

  theme('isaiah', 'Isaiah', 'life', 'Isaiah 1–39',
    'Called in the year King Uzziah died, and active through the two Assyrian crises that defined his lifetime: the north falling in 722, and Jerusalem surviving 701.',
    ['isaiah-call', 'samaria-falls', 'sennacherib', 'lachish']),

  theme('jeremiah', 'Jeremiah', 'life', 'Jeremiah 1–52',
    'Forty years telling a city it will fall and that resistance is pointless — imprisoned, thrown into a cistern, and finally proved right, which helped nobody.',
    ['josiah-reform', 'megiddo-josiah', 'carchemish', 'jeremiah', 'first-deportation', 'jerusalem-falls']),

  theme('daniel', 'Daniel', 'life', 'Daniel 1–12',
    'Taken as a teenager in the first deportation and still at court seventy years later under a different empire. Court tales and visions, set in the exile whatever date the book itself was written.',
    ['daniel-taken', 'daniel-statue', 'daniel-furnace', 'daniel-madness', 'daniel-writing',
     'daniel-lions', 'daniel-visions']),

  theme('esther', 'Esther', 'life', 'Esther 1–10',
    'The one book in the canon that never mentions God. A queen who has concealed who she is decides, at the last possible moment, not to stay quiet.',
    ['esther-vashti', 'esther', 'esther-haman', 'esther-purim']),

  theme('john-baptist', 'John the Baptist', 'life', 'Luke 1; Mark 1–6',
    'Six months older than his cousin, and the one firm chronological peg in the Gospels — Luke dates his preaching to the fifteenth year of Tiberius. Killed at a fortress Josephus names.',
    ['john-born', 'john-preaching', 'baptism', 'john-death']),

  theme('jesus', 'Jesus', 'life', 'The Gospels',
    'From a birth placed before Herod’s death in 4 BC to an execution dated either AD 30 or 33 — a life whose start and end are both approximate.',
    ['nativity', 'flight-egypt', 'boy-temple', 'baptism', 'temptation', 'cana', 'capernaum-base',
     'sermon-mount', 'feeding-5000', 'walking-water', 'peter-confession', 'transfiguration', 'lazarus',
     'triumphal-entry', 'temple-cleansing', 'last-supper', 'gethsemane', 'crucifixion', 'resurrection',
     'emmaus-road', 'ascension']),

  theme('peter', 'Peter', 'life', 'The Gospels & Acts 1–12',
    'A fisherman from Capernaum who gets out of the boat, denies he ever knew the man, and ends up opening the movement to outsiders.',
    ['capernaum-base', 'walking-water', 'peter-confession', 'last-supper', 'gethsemane', 'resurrection',
     'pentecost', 'cornelius', 'nero-fire']),

  theme('paul', 'Paul', 'life', 'Acts 7–28 & the letters',
    'Holds the coats at a stoning, then spends thirty years crossing the empire. His chronology is the firmest in the New Testament, thanks to one bored proconsul.',
    ['stephen', 'damascus-road', 'antioch-church', 'paul-1', 'jerusalem-council', 'paul-2', 'gallio',
     'paul-3', 'paul-arrest', 'caesarea-prison', 'shipwreck', 'paul-rome', 'nero-fire']),

  // ---- threads ----------------------------------------------------------
  theme('temple', 'The Temple', 'thread', 'A tent, two buildings, and a ruin',
    'One continuous argument about where God is located: a portable tent in the desert, Solomon’s building, its ashes, the modest replacement, Herod’s vast expansion, and the rubble of AD 70.',
    ['tabernacle', 'ark-jerusalem', 'first-temple', 'golden-calves', 'josiah-reform', 'jerusalem-falls',
     'second-temple', 'herod', 'temple-cleansing', 'temple-destroyed']),

  theme('exile', 'Exile and return', 'thread', '722 – 445 BC',
    'The best-dated stretch of the Old Testament, because Assyria and Babylon kept records. Two kingdoms fall, one comes back.',
    ['samaria-falls', 'sennacherib', 'carchemish', 'first-deportation', 'jerusalem-falls', 'ezekiel',
     'daniel-lions', 'babylon-falls', 'cyrus-decree', 'return', 'second-temple', 'ezra', 'nehemiah']),

  theme('covenants', 'The covenants', 'thread', 'Noah to the upper room',
    'The agreements the whole library is built around — with a creature, a family, a nation, a king, and finally over bread and a cup.',
    ['noah-covenant', 'abraham-covenant', 'sinai-law', 'shechem-covenant', 'davidic-covenant',
     'jeremiah', 'last-supper', 'jerusalem-council']),
]

export const THEME_BY_ID = Object.fromEntries(THEMES.map((t) => [t.id, t]))

/** Membership lookups, built once so filtering stays O(1) per event. */
export const THEME_EVENT_SETS = Object.fromEntries(THEMES.map((t) => [t.id, new Set(t.events)]))

export const THEME_KIND_LABEL = { life: 'Life', thread: 'Thread' }
