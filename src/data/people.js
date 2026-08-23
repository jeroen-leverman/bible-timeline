/**
 * The main figures of the biblical narrative, and how they are related.
 *
 * ON DATES — read this before trusting a year.
 * Genesis 5 and 11 state how old each man was when his son was born and how long he
 * lived. Those ages are in the text. The *years* are not: they come from chaining the
 * ages together from a fixed creation date, which is what Ussher did and what most
 * study-Bible charts still reproduce. Two things follow:
 *
 *   - The Hebrew "X fathered Y" does not require Y to be X's immediate son; it is used
 *     of grandsons and remoter descendants elsewhere. A genealogy may telescope
 *     generations, which would stretch every derived year.
 *   - Lifespans of nine centuries are what the text says. They are recorded here as
 *     stated, which is not the same as asserting them.
 *
 * `dating` therefore says where a year came from:
 *   text     – the number is stated in scripture
 *   derived  – chained from stated ages; internally consistent, externally unanchored
 *   inferred – a scholarly estimate from external evidence
 *   unknown  – scripture gives nothing
 *
 * `gen` is the generation index used to lay the tree out, counting Adam as 1.
 * `major` marks figures who carry a full card; the rest are genealogical links and
 * collapse into a run.
 * `reigns` records distinct royal offices so an accession can link back to its own
 * timeline event instead of turning a person's whole life into one undifferentiated reign.
 */

const P = (id, name, o) => ({
  id,
  name,
  spouses: [],
  scripture: [],
  events: [],
  reigns: [],
  major: false,
  ...o,
})

export const PEOPLE = [
  // ---- Genesis 5: Adam to Noah ------------------------------------------
  P('adam', 'Adam', {
    gen: 1, age: 930, dating: 'text', era: 'primeval', major: true,
    spouses: ['eve'], scripture: ['Genesis 2:7', 'Genesis 5:1–5'], events: ['creation', 'fall'],
    bio: 'The first man, formed from the ground and placed in a garden with one prohibition. Named the animals, broke the prohibition, and was sent out to farm the soil he came from.',
  }),
  P('eve', 'Eve', {
    gen: 1, dating: 'unknown', era: 'primeval', major: true, spouses: ['adam'],
    scripture: ['Genesis 2:18–25', 'Genesis 3'], events: ['fall'],
    bio: 'Made as a partner rather than a subordinate, and the one the serpent bothers to argue with. Her name means "living", given after the sentence rather than before it.',
  }),
  P('cain', 'Cain', {
    gen: 2, dating: 'unknown', era: 'primeval', major: true, father: 'adam', mother: 'eve',
    scripture: ['Genesis 4:1–17'], events: ['cain-abel'],
    bio: 'A farmer whose offering is not regarded, who is warned that sin is crouching at the door and kills his brother anyway. Marked for protection, not destruction, and sent east.',
  }),
  P('abel', 'Abel', {
    gen: 2, dating: 'unknown', era: 'primeval', major: true, father: 'adam', mother: 'eve',
    scripture: ['Genesis 4:1–16'], events: ['cain-abel'],
    bio: 'A shepherd, and the first person in the Bible to die. He is given no recorded speech.',
  }),
  P('seth', 'Seth', {
    gen: 2, age: 912, dating: 'text', era: 'primeval',
    father: 'adam', mother: 'eve', scripture: ['Genesis 4:25–26', 'Genesis 5:6–8'],
    bio: 'Born after Abel’s death and named as a replacement for him. The line the genealogies follow.',
  }),
  P('enosh', 'Enosh', { gen: 3, age: 905, dating: 'text', era: 'primeval', father: 'seth', scripture: ['Genesis 5:9–11'], bio: 'In his days people began to call on the name of the Lord.' }),
  P('kenan', 'Kenan', { gen: 4, age: 910, dating: 'text', era: 'primeval', father: 'enosh', scripture: ['Genesis 5:12–14'], bio: 'A name and two numbers.' }),
  P('mahalalel', 'Mahalalel', { gen: 5, age: 895, dating: 'text', era: 'primeval', father: 'kenan', scripture: ['Genesis 5:15–17'], bio: 'A name and two numbers.' }),
  P('jared', 'Jared', { gen: 6, age: 962, dating: 'text', era: 'primeval', father: 'mahalalel', scripture: ['Genesis 5:18–20'], bio: 'Father of Enoch, and the second-longest life recorded.' }),
  P('enoch', 'Enoch', {
    gen: 7, age: 365, dating: 'text', era: 'primeval', major: true,
    father: 'jared', scripture: ['Genesis 5:21–24', 'Hebrews 11:5'],
    bio: 'The one break in the pattern: the formula "and he died" is replaced by "he walked with God, and he was not, for God took him". His 365 years are the shortest life in the chapter.',
    note: 'Genesis does not say he died, which later writers made a great deal of.',
  }),
  P('methuselah', 'Methuselah', {
    gen: 8, age: 969, dating: 'text', era: 'primeval', major: true,
    father: 'enoch', scripture: ['Genesis 5:25–27'],
    bio: 'The longest life the Bible records. On the derived reckoning he dies in the year of the flood, which readers have noticed for a very long time.',
  }),
  P('lamech', 'Lamech', { gen: 9, age: 777, dating: 'text', era: 'primeval', father: 'methuselah', scripture: ['Genesis 5:28–31'], bio: 'Names his son Noah — "rest" — hoping for relief from the cursed ground.' }),
  P('noah', 'Noah', {
    gen: 10, age: 950, dating: 'text', era: 'primeval', major: true,
    father: 'lamech', scripture: ['Genesis 6–9'],
    events: ['noah-ark', 'flood', 'noah-covenant', 'noah-vineyard'],
    bio: 'Found righteous in a corrupt generation, given measurements and a hundred and twenty years’ warning. Survives the flood, plants a vineyard, and the story ends badly.',
  }),
  P('shem', 'Shem', {
    gen: 11, age: 600, dating: 'text', era: 'primeval', major: true,
    father: 'noah', scripture: ['Genesis 9:18–27', 'Genesis 11:10–11'],
    bio: 'Eldest of Noah’s three sons and the line Abraham descends from. The word "Semitic" is taken from his name.',
  }),
  P('ham', 'Ham', { gen: 11, dating: 'unknown', era: 'primeval', father: 'noah', scripture: ['Genesis 9:18–27'], bio: 'Sees his father drunk and tells his brothers; the curse falls on his son Canaan rather than on him.' }),
  P('japheth', 'Japheth', { gen: 11, dating: 'unknown', era: 'primeval', father: 'noah', scripture: ['Genesis 10:2–5'], bio: 'Walks backwards with Shem to cover their father. His descendants are placed to the north and west.' }),

  // ---- Genesis 11: Shem to Abraham ---------------------------------------
  P('arphaxad', 'Arphaxad', { gen: 12, age: 438, dating: 'text', era: 'primeval', father: 'shem', scripture: ['Genesis 11:12–13'], bio: 'Born two years after the flood.' }),
  P('shelah', 'Shelah', { gen: 13, age: 433, dating: 'text', era: 'primeval', father: 'arphaxad', scripture: ['Genesis 11:14–15'], bio: 'A name and two numbers.' }),
  P('eber', 'Eber', { gen: 14, age: 464, dating: 'text', era: 'primeval', father: 'shelah', scripture: ['Genesis 11:16–17'], bio: 'The name behind "Hebrew", on the usual derivation.' }),
  P('peleg', 'Peleg', { gen: 15, age: 239, dating: 'text', era: 'primeval', father: 'eber', scripture: ['Genesis 10:25', 'Genesis 11:18–19'], bio: '"In his days the earth was divided" — the lifespans halve from here on.' }),
  P('reu', 'Reu', { gen: 16, age: 239, dating: 'text', era: 'primeval', father: 'peleg', scripture: ['Genesis 11:20–21'], bio: 'A name and two numbers.' }),
  P('serug', 'Serug', { gen: 17, age: 230, dating: 'text', era: 'primeval', father: 'reu', scripture: ['Genesis 11:22–23'], bio: 'A name and two numbers.' }),
  P('nahor-elder', 'Nahor', { gen: 18, age: 148, dating: 'text', era: 'primeval', father: 'serug', scripture: ['Genesis 11:24–25'], bio: 'Grandfather of Abraham, and the shortest life in the chain.' }),
  P('terah', 'Terah', {
    gen: 19, age: 205, dating: 'text', era: 'patriarchs', major: true,
    father: 'nahor-elder', scripture: ['Genesis 11:26–32'], events: ['abram-ur'],
    bio: 'Sets out from Ur for Canaan with Abram, Sarai and Lot, gets as far as Haran, and settles there. Joshua 24 says he served other gods.',
  }),

  // ---- the patriarchs -----------------------------------------------------
  P('abraham', 'Abraham', {
    gen: 20, born: -2166, died: -1991, age: 175, dating: 'derived', era: 'patriarchs', major: true,
    father: 'terah', spouses: ['sarah', 'hagar'],
    scripture: ['Genesis 12–25'],
    events: ['call-abram', 'abraham-covenant', 'binding-isaac'],
    bio: 'Told to leave everything he knows for a land he is not shown, on the promise of a nation and a son. Waits twenty-five years for the son and never owns any of the land except a grave.',
  }),
  P('sarah', 'Sarah', {
    gen: 20, born: -2156, died: -2029, age: 127, dating: 'derived', era: 'patriarchs', major: true,
    spouses: ['abraham'], scripture: ['Genesis 12–23'],
    events: ['sarah-hagar', 'sarah-laughs', 'sarah-death'],
    bio: 'Barren into her nineties and told so repeatedly. Hands her slave to her husband to secure the promise, then cannot live with the result. The only woman whose age at death the Bible records.',
  }),
  P('hagar', 'Hagar', {
    gen: 20, dating: 'unknown', era: 'patriarchs', major: true, spouses: ['abraham'],
    scripture: ['Genesis 16', 'Genesis 21:8–21'], events: ['hagar-flight', 'hagar-wilderness'],
    bio: 'An Egyptian slave with no say in any of it, twice driven into the desert. The only person in the Hebrew Bible to give God a name — El Roi, the God who sees.',
  }),
  P('lot', 'Lot', {
    gen: 20, dating: 'unknown', era: 'patriarchs', major: true, scripture: ['Genesis 13', 'Genesis 19'], events: ['sodom'],
    bio: 'Abraham’s nephew, who chooses the well-watered plain and ends up in Sodom. Escapes it, barely, and loses his wife on the way out.',
  }),
  P('ishmael', 'Ishmael', {
    gen: 21, born: -2080, died: -1943, age: 137, dating: 'derived', era: 'patriarchs', major: true,
    father: 'abraham', mother: 'hagar', scripture: ['Genesis 16', 'Genesis 21', 'Genesis 25:12–18'],
    events: ['hagar-wilderness'],
    bio: 'Abraham’s first son, promised a nation of his own and sent away to the wilderness with his mother. Returns to bury his father alongside Isaac.',
  }),
  P('isaac', 'Isaac', {
    gen: 21, born: -2066, died: -1886, age: 180, dating: 'derived', era: 'patriarchs', major: true,
    father: 'abraham', mother: 'sarah', spouses: ['rebekah'],
    scripture: ['Genesis 21–35'], events: ['isaac-born', 'binding-isaac', 'isaac-gerar'],
    bio: 'The quietest patriarch, carried through his own story by other people: bound by his father, given a wife by a servant, deceived by his son. Genesis 26 is his one chapter.',
  }),
  P('rebekah', 'Rebekah', {
    gen: 21, dating: 'unknown', era: 'patriarchs', major: true, spouses: ['isaac'],
    scripture: ['Genesis 24', 'Genesis 27'], events: ['isaac-rebekah', 'jacob-esau'],
    bio: 'Chosen at a well for offering to water ten camels, and the only matriarch asked whether she consents. Later engineers the theft of the blessing and never sees Jacob again.',
  }),
  P('esau', 'Esau', {
    gen: 22, born: -2006, dating: 'derived', era: 'patriarchs', major: true,
    father: 'isaac', mother: 'rebekah', scripture: ['Genesis 25', 'Genesis 27', 'Genesis 33'],
    events: ['jacob-born', 'jacob-esau', 'jacob-reunion'],
    bio: 'The elder twin, a hunter, who sells his birthright for a bowl of stew and loses the blessing to a disguise. Twenty years later he runs to meet his brother and embraces him.',
  }),
  P('jacob', 'Jacob', {
    gen: 22, born: -2006, died: -1859, age: 147, dating: 'derived', era: 'patriarchs', major: true,
    father: 'isaac', mother: 'rebekah', spouses: ['leah', 'rachel'],
    scripture: ['Genesis 25–49'],
    events: ['jacob-born', 'jacobs-ladder', 'jacob-wrestles', 'jacob-blesses'],
    bio: 'Takes what he wants by cunning, spends twenty years in exile paying for it, and comes home limping with a new name. Israel is named after him.',
  }),
  P('leah', 'Leah', {
    gen: 22, dating: 'unknown', era: 'patriarchs', major: true, spouses: ['jacob'],
    scripture: ['Genesis 29–30', 'Genesis 49:31'], events: ['jacob-haran'],
    bio: 'Married to Jacob by deception and unloved for it. Mother of six of the twelve tribes including Levi and Judah, and the wife buried beside him at Machpelah.',
  }),
  P('rachel', 'Rachel', {
    gen: 22, died: -1906, dating: 'derived', era: 'patriarchs', major: true, spouses: ['jacob'],
    scripture: ['Genesis 29–35'], events: ['jacob-haran', 'jacob-bethel-return'],
    bio: 'The one Jacob worked fourteen years for, barren for most of the marriage, mother of Joseph and Benjamin. Dies on the road giving birth to the second.',
  }),
  P('judah', 'Judah', {
    gen: 23, dating: 'unknown', era: 'patriarchs', major: true, father: 'jacob', mother: 'leah',
    scripture: ['Genesis 37', 'Genesis 38', 'Genesis 44'], events: ['joseph-sold', 'jacob-blesses'],
    bio: 'Proposes selling Joseph rather than killing him, is outmanoeuvred by Tamar, and finally offers himself in Benjamin’s place. The royal line runs through him.',
  }),
  P('joseph', 'Joseph', {
    gen: 23, born: -1915, died: -1805, age: 110, dating: 'derived', era: 'patriarchs', major: true,
    father: 'jacob', mother: 'rachel',
    scripture: ['Genesis 37–50'], events: ['joseph-dreams', 'joseph-sold', 'joseph-vizier', 'joseph-forgives'],
    bio: 'Sold by his brothers at Dothan and governing Egypt within thirteen years. Genesis ends with his coffin waiting to go home.',
  }),
  P('benjamin', 'Benjamin', { gen: 23, dating: 'unknown', era: 'patriarchs', father: 'jacob', mother: 'rachel', scripture: ['Genesis 35:16–18', 'Genesis 44'], bio: 'Rachel’s second son, born as she died. She named him Ben-oni, son of my sorrow; his father renamed him.' }),
  P('levi', 'Levi', { gen: 23, dating: 'unknown', era: 'patriarchs', father: 'jacob', mother: 'leah', scripture: ['Genesis 34', 'Genesis 49:5–7'], bio: 'Ancestor of the priestly tribe, and of Moses and Aaron. Jacob’s blessing on him is closer to a rebuke.' }),
  P('tamar', 'Tamar', {
    gen: 23, dating: 'unknown', era: 'patriarchs', major: true, scripture: ['Genesis 38'],
    bio: 'Twice widowed and denied the third son she was owed, she takes the matter into her own hands and forces Judah to admit she was in the right. Matthew names her in the genealogy of Jesus.',
  }),
  P('perez', 'Perez', { gen: 24, dating: 'unknown', era: 'patriarchs', father: 'judah', mother: 'tamar', scripture: ['Genesis 38:29', 'Ruth 4:18'], bio: 'Tamar’s son, and the link from Judah to David.' }),
]

// ---- Exodus generation (Levi's line, off the royal descent) --------------
const LEVI_LINE = [
  P('amram', 'Amram', { gen: 25, dating: 'unknown', era: 'egypt-exodus', spouses: ['jochebed'], scripture: ['Exodus 6:20'], bio: 'A Levite, father of Moses, Aaron and Miriam.' }),
  P('jochebed', 'Jochebed', { gen: 25, dating: 'unknown', era: 'egypt-exodus', major: true, spouses: ['amram'], scripture: ['Exodus 2:1–10', 'Exodus 6:20'], events: ['moses-born'],
    bio: 'Hides her son three months, then waterproofs a basket and puts him in the river the edict told her to drown him in — and is hired to nurse her own child.' }),
  P('miriam', 'Miriam', { gen: 26, died: -1407, dating: 'derived', era: 'egypt-exodus', major: true, father: 'amram', mother: 'jochebed',
    scripture: ['Exodus 15:19–21', 'Numbers 12', 'Numbers 20:1'], events: ['miriam-song', 'miriam-challenge', 'miriam-death'],
    bio: 'Called a prophet, and the first person in the Bible to lead worship. Challenges Moses jointly with Aaron and is punished alone.' }),
  P('aaron', 'Aaron', { gen: 26, born: -1529, died: -1407, age: 123, dating: 'text', era: 'egypt-exodus', major: true, father: 'amram', mother: 'jochebed',
    scripture: ['Exodus 4:14–16', 'Exodus 32', 'Numbers 20:22–29'], events: ['golden-calf', 'plagues'],
    bio: 'Moses’ older brother and his mouthpiece, first high priest, and the man who made the golden calf and then blamed the fire.' }),
  P('moses', 'Moses', { gen: 26, born: -1526, died: -1406, age: 120, dating: 'text', era: 'egypt-exodus', major: true, father: 'amram', mother: 'jochebed', spouses: ['zipporah'],
    scripture: ['Exodus 2 – Deuteronomy 34'], events: ['moses-born', 'burning-bush', 'exodus', 'sinai-law', 'moses-nebo'],
    bio: 'Eighty years before the burning bush and forty after it. Argues with God more than anyone else in scripture, and dies within sight of the destination.' }),
  P('zipporah', 'Zipporah', { gen: 26, dating: 'unknown', era: 'egypt-exodus', spouses: ['moses'], scripture: ['Exodus 2:16–22', 'Exodus 4:24–26'], bio: 'A Midianite priest’s daughter who saves Moses’ life in one of the strangest passages in the Torah.' }),
]

// ---- Perez to David: the royal line (Ruth 4:18–22) ----------------------
const ROYAL_LINE = [
  P('hezron', 'Hezron', { gen: 25, dating: 'unknown', era: 'egypt-exodus', father: 'perez', scripture: ['Ruth 4:18'], bio: 'A link in the royal line.' }),
  P('ram', 'Ram', { gen: 26, dating: 'unknown', era: 'egypt-exodus', father: 'hezron', scripture: ['Ruth 4:19'], bio: 'A link in the royal line.' }),
  P('amminadab', 'Amminadab', { gen: 27, dating: 'unknown', era: 'egypt-exodus', father: 'ram', scripture: ['Ruth 4:19'], bio: 'A link in the royal line.' }),
  P('nahshon', 'Nahshon', { gen: 28, dating: 'unknown', era: 'conquest-judges', father: 'amminadab', scripture: ['Numbers 1:7', 'Ruth 4:20'], bio: 'Leader of Judah in the wilderness census.' }),
  P('salmon', 'Salmon', { gen: 29, dating: 'unknown', era: 'conquest-judges', father: 'nahshon', spouses: ['rahab'], scripture: ['Ruth 4:21', 'Matthew 1:5'], bio: 'Matthew names Rahab as his wife.' }),
  P('rahab', 'Rahab', { gen: 29, dating: 'unknown', era: 'conquest-judges', major: true, spouses: ['salmon'],
    scripture: ['Joshua 2', 'Joshua 6:22–25', 'Matthew 1:5'], events: ['rahab-spies'],
    bio: 'A prostitute living in the city wall who hides two spies, lies to the king’s men, and negotiates survival for her whole family. Matthew puts her in the genealogy of Jesus.' }),
  P('boaz', 'Boaz', { gen: 30, dating: 'unknown', era: 'conquest-judges', major: true, father: 'salmon', mother: 'rahab', spouses: ['ruth'],
    scripture: ['Ruth 2–4'], events: ['ruth', 'ruth-threshing', 'ruth-obed'],
    bio: 'A landowner who notices a foreign woman gleaning, protects her, and then goes to the town gate to buy the right to marry her.' }),
  P('ruth', 'Ruth', { gen: 30, dating: 'unknown', era: 'conquest-judges', major: true, spouses: ['boaz'],
    scripture: ['Ruth 1–4'], events: ['ruth-vow', 'ruth', 'ruth-obed'],
    bio: 'A Moabite widow who refuses to go home, binds herself to a people not her own, and becomes David’s great-grandmother.' }),
  P('obed', 'Obed', { gen: 31, dating: 'unknown', era: 'conquest-judges', father: 'boaz', mother: 'ruth', scripture: ['Ruth 4:17–22'], bio: 'Named by the women of Bethlehem rather than by his parents.' }),
  P('jesse', 'Jesse', { gen: 32, dating: 'unknown', era: 'united-monarchy', father: 'obed', scripture: ['1 Samuel 16', 'Isaiah 11:1'], events: ['samuel-anoints-david'],
    bio: 'Presents seven sons to Samuel before anyone thinks to fetch the youngest in from the sheep.' }),
]

// ---- the house of David --------------------------------------------------
const DAVIDIC = [
  P('david', 'David', { gen: 33, born: -1040, died: -970, age: 70, dating: 'text', era: 'united-monarchy', major: true, father: 'jesse', spouses: ['abigail', 'bathsheba'],
    scripture: ['1 Samuel 16 – 1 Kings 2'],
    events: ['samuel-anoints-david', 'david-goliath', 'david-flees', 'david-king', 'david-king-israel',
      'jerusalem-captured', 'ark-jerusalem', 'davidic-covenant', 'bathsheba', 'absalom'],
    reigns: [
      { title: 'King of Judah', place: 'Hebron', from: -1010, to: -1003, event: 'david-king' },
      { title: 'King over Israel and Judah', place: 'Hebron → Jerusalem', from: -1003, to: -970, event: 'david-king-israel' },
    ],
    reignNote: '2 Samuel records two accessions: Judah first, then all Israel.',
    bio: 'Shepherd, outlaw, king, adulterer, and refugee from his own son. The most fully told life in the Hebrew Bible and the least flattering.' }),
  P('abigail', 'Abigail', { gen: 33, dating: 'unknown', era: 'united-monarchy', major: true, spouses: ['david'],
    scripture: ['1 Samuel 25'], events: ['abigail-nabal', 'abigail-david'],
    bio: 'Rides down a ravine to intercept four hundred armed men and talks David out of a massacre in the longest speech Samuel gives any woman.' }),
  P('bathsheba', 'Bathsheba', { gen: 33, dating: 'unknown', era: 'united-monarchy', major: true, spouses: ['david'],
    scripture: ['2 Samuel 11–12', '1 Kings 1'], events: ['bathsheba', 'solomon-king'],
    bio: 'Summoned by a king with no realistic option to refuse, widowed by his arrangement, and bereaved of the child. Twenty years later she secures the throne for her son.' }),
  P('absalom', 'Absalom', { gen: 34, died: -979, dating: 'derived', era: 'united-monarchy', major: true, father: 'david',
    scripture: ['2 Samuel 13–18'], events: ['absalom'],
    bio: 'Kills the brother who raped his sister, is exiled, returns, and takes the kingdom from his father before dying in a forest.' }),
  P('solomon', 'Solomon', { gen: 34, born: -991, died: -931, dating: 'derived', era: 'united-monarchy', major: true, father: 'david', mother: 'bathsheba',
    scripture: ['1 Kings 1–11'], events: ['solomon-king', 'first-temple', 'solomon-apostasy'],
    reigns: [{ title: 'King over Israel and Judah', place: 'Jerusalem', from: -970, to: -931, event: 'solomon-king' }],
    reignNote: 'Kings and Chronicles present the same reign with different emphases: royal policy in Kings, temple and worship in Chronicles.',
    bio: 'Asks for wisdom rather than long life or riches, builds the temple, and leaves a kingdom that splits the moment he dies.' }),
  P('rehoboam', 'Rehoboam', { gen: 35, born: -972, died: -913, dating: 'inferred', era: 'divided-kingdom', major: true, father: 'solomon',
    scripture: ['1 Kings 12'], events: ['division', 'shishak'],
    reigns: [{ title: 'King of Judah', place: 'Jerusalem', from: -931, to: -913, event: 'division' }],
    reignNote: '1 Kings 12 and 2 Chronicles 10 place his accession at the division of the united kingdom.',
    bio: 'Takes the advice of the young men over the elders, refuses to lighten the forced labour, and loses ten tribes in an afternoon.' }),
  P('abijah', 'Abijah', { gen: 36, dating: 'inferred', era: 'divided-kingdom', father: 'rehoboam', scripture: ['1 Kings 15:1–8'], bio: 'Three years, and a war with Jeroboam.' }),
  P('asa', 'Asa', { gen: 37, dating: 'inferred', era: 'divided-kingdom', father: 'abijah', scripture: ['1 Kings 15:9–24'], bio: 'A long reign and a thorough purge of the shrines, including deposing his own grandmother.' }),
  P('jehoram-judah', 'Jehoram', { gen: 39, dating: 'inferred', era: 'divided-kingdom', father: 'jehoshaphat', scripture: ['2 Kings 8:16–24'], bio: 'Married Ahab’s daughter Athaliah and killed all six of his brothers.' }),
  P('ahaziah-judah', 'Ahaziah', { gen: 40, dating: 'inferred', era: 'divided-kingdom', father: 'jehoram-judah', scripture: ['2 Kings 8:25–29'], events: ['jehu'], bio: 'One year, ended by Jehu’s purge.' }),
  P('joash', 'Joash', { gen: 41, dating: 'inferred', era: 'divided-kingdom', major: true, father: 'ahaziah-judah', scripture: ['2 Kings 11–12'],
    bio: 'Hidden in the temple as an infant while his grandmother Athaliah killed the rest of the royal family, and crowned at seven.' }),
  P('amaziah', 'Amaziah', { gen: 42, dating: 'inferred', era: 'divided-kingdom', father: 'joash', scripture: ['2 Kings 14:1–20'], bio: 'Picked a fight with Israel and lost a section of Jerusalem’s wall for it.' }),
  P('jotham', 'Jotham', { gen: 44, dating: 'inferred', era: 'divided-kingdom', father: 'uzziah', scripture: ['2 Kings 15:32–38'], bio: 'Regent while his father was a leper, then king in his own right.' }),
  P('amon', 'Amon', { gen: 48, dating: 'inferred', era: 'divided-kingdom', father: 'manasseh', scripture: ['2 Kings 21:19–26'], bio: 'Two years, and assassinated by his own officials.' }),
  P('jehoiakim', 'Jehoiakim', { gen: 50, dating: 'inferred', era: 'divided-kingdom', father: 'josiah', scripture: ['2 Kings 23:36–24:7', 'Jeremiah 36'], events: ['carchemish'],
    bio: 'Cut up Jeremiah’s scroll a column at a time and burned it on the brazier as it was read to him.' }),
  P('jehoiachin', 'Jehoiachin', { gen: 51, dating: 'inferred', era: 'exile-return', major: true, father: 'jehoiakim', scripture: ['2 Kings 24:8–17', '2 Kings 25:27–30'], events: ['first-deportation'],
    bio: 'Three months on the throne and thirty-seven years in Babylon, where ration tablets naming him have been excavated.' }),
  P('shealtiel', 'Shealtiel', { gen: 52, dating: 'unknown', era: 'exile-return', father: 'jehoiachin', scripture: ['1 Chronicles 3:17', 'Ezra 3:2'], bio: 'Son of the exiled king, and the link to Zerubbabel.',
    note: 'Ezra and Matthew make Zerubbabel his son; 1 Chronicles 3:19 makes him the son of Shealtiel’s brother Pedaiah. The discrepancy is old and unresolved.' }),
  P('jehoshaphat', 'Jehoshaphat', { gen: 38, born: -908, died: -848, dating: 'inferred', era: 'divided-kingdom', father: 'asa', scripture: ['1 Kings 22', '2 Chronicles 17–20'], bio: 'A reforming king of Judah who allied with Ahab of Israel and was told off for it.' }),
  P('uzziah', 'Uzziah', { gen: 43, born: -808, died: -740, dating: 'inferred', era: 'divided-kingdom', major: true, father: 'amaziah',
    scripture: ['2 Kings 15:1–7', '2 Chronicles 26', 'Isaiah 6:1'], events: ['isaiah-call'],
    bio: 'A long and successful reign that ends in leprosy and isolation. Isaiah dates his own call to the year Uzziah died.' }),
  P('ahaz', 'Ahaz', { gen: 45, born: -762, died: -715, dating: 'inferred', era: 'divided-kingdom', father: 'jotham', scripture: ['2 Kings 16', 'Isaiah 7'], bio: 'Buys Assyrian protection with temple silver, and is offered a sign he refuses to ask for.' }),
  P('hezekiah', 'Hezekiah', { gen: 46, born: -741, died: -686, dating: 'inferred', era: 'divided-kingdom', major: true, father: 'ahaz',
    scripture: ['2 Kings 18–20', 'Isaiah 36–39'], events: ['hezekiah-reform', 'hezekiah-tunnel', 'sennacherib'],
    bio: 'Cuts a tunnel through rock to beat a siege. His reign leaves more physical evidence than any other in Kings.' }),
  P('manasseh', 'Manasseh', { gen: 47, born: -709, died: -643, dating: 'inferred', era: 'divided-kingdom', father: 'hezekiah', scripture: ['2 Kings 21'], bio: 'The longest reign in Judah and, by Kings’ account, the worst.' }),
  P('josiah', 'Josiah', { gen: 49, born: -648, died: -609, dating: 'inferred', era: 'divided-kingdom', major: true, father: 'amon',
    scripture: ['2 Kings 22–23'], events: ['josiah-reform', 'megiddo-josiah'],
    bio: 'Comes to the throne at eight, finds a scroll during temple repairs, and tears the country’s shrines down. Dies intercepting an Egyptian army at Megiddo.' }),
  P('zedekiah', 'Zedekiah', { gen: 50, born: -618, dating: 'inferred', era: 'exile-return', major: true, father: 'josiah',
    scripture: ['2 Kings 25', 'Jeremiah 39'], events: ['jerusalem-falls'],
    bio: 'The last king of Judah, installed as a vassal and blinded at Riblah after watching his sons die. The line of kings ends with him.' }),
  P('zerubbabel', 'Zerubbabel', { gen: 53, dating: 'unknown', era: 'exile-return', major: true, father: 'shealtiel', scripture: ['Ezra 3', 'Haggai 2:23', 'Matthew 1:12–16'], events: ['return', 'second-temple'],
    bio: 'A descendant of the exiled kings who leads the first return and lays the foundations of the second temple, governor rather than king.' }),
]

// ---- Matthew's line: Zerubbabel to Joseph (Matthew 1:12–16) ------------
// Matthew and Luke give different post-exilic genealogies. This atlas follows
// Matthew here because the royal line above already runs through Solomon.
const MATTHEW_LINE = [
  P('matthew-abiud', 'Abiud', { gen: 54, dating: 'unknown', era: 'second-temple', father: 'zerubbabel', scripture: ['Matthew 1:12–16'],
    bio: 'Matthew names him as the next link after Zerubbabel and before Eliakim. The New Testament gives no other biographical details.' }),
  P('matthew-eliakim', 'Eliakim', { gen: 55, dating: 'unknown', era: 'second-temple', father: 'matthew-abiud', scripture: ['Matthew 1:12–16'],
    bio: 'A link in Matthew’s genealogy between Abiud and Azor; not otherwise described in the New Testament.' }),
  P('matthew-azor', 'Azor', { gen: 56, dating: 'unknown', era: 'second-temple', father: 'matthew-eliakim', scripture: ['Matthew 1:12–16'],
    bio: 'A link in Matthew’s genealogy between Eliakim and Zadok; not otherwise described in the New Testament.' }),
  P('matthew-zadok', 'Zadok', { gen: 57, dating: 'unknown', era: 'second-temple', father: 'matthew-azor', scripture: ['Matthew 1:12–16'],
    bio: 'A link in Matthew’s genealogy between Azor and Achim; not otherwise described in the New Testament.' }),
  P('matthew-achim', 'Achim', { gen: 58, dating: 'unknown', era: 'second-temple', father: 'matthew-zadok', scripture: ['Matthew 1:12–16'],
    bio: 'A link in Matthew’s genealogy between Zadok and Eliud; not otherwise described in the New Testament.' }),
  P('matthew-eliud', 'Eliud', { gen: 59, dating: 'unknown', era: 'second-temple', father: 'matthew-achim', scripture: ['Matthew 1:12–16'],
    bio: 'A link in Matthew’s genealogy between Achim and Eleazar; not otherwise described in the New Testament.' }),
  P('matthew-eleazar', 'Eleazar', { gen: 60, dating: 'unknown', era: 'second-temple', father: 'matthew-eliud', scripture: ['Matthew 1:12–16'],
    bio: 'A link in Matthew’s genealogy between Eliud and Matthan; not otherwise described in the New Testament.' }),
  P('matthew-matthan', 'Matthan', { gen: 61, dating: 'unknown', era: 'second-temple', father: 'matthew-eleazar', scripture: ['Matthew 1:12–16'],
    bio: 'A link in Matthew’s genealogy between Eleazar and Jacob; not otherwise described in the New Testament.' }),
  P('matthew-jacob', 'Jacob', { gen: 62, dating: 'unknown', era: 'second-temple', father: 'matthew-matthan', scripture: ['Matthew 1:12–16'],
    bio: 'The Jacob named directly before Joseph in Matthew’s genealogy; not the patriarch Jacob of Genesis.' }),
]

// ---- the New Testament family -------------------------------------------
const NT_FAMILY = [
  P('zechariah-priest', 'Zechariah', { gen: 63, dating: 'unknown', era: 'jesus', spouses: ['elizabeth'], scripture: ['Luke 1:5–25'], events: ['john-born'],
    bio: 'A priest struck mute for doubting an angel at the incense altar, and given his voice back when he writes the child’s name.' }),
  P('elizabeth', 'Elizabeth', { gen: 63, dating: 'unknown', era: 'jesus', major: true, spouses: ['zechariah-priest'], scripture: ['Luke 1:5–45'], events: ['john-born', 'visitation'],
    bio: 'Childless into old age, and the first person to recognise what Mary is carrying.' }),
  P('joseph-nazareth', 'Joseph', { gen: 63, dating: 'unknown', era: 'jesus', major: true, father: 'matthew-jacob', spouses: ['mary'], scripture: ['Matthew 1–2', 'Luke 2'], events: ['nativity', 'flight-egypt'],
    bio: 'A carpenter who plans to end the engagement quietly rather than expose her, changes his mind on a dream, and is never quoted saying anything.' }),
  P('mary', 'Mary', { gen: 63, dating: 'unknown', era: 'jesus', major: true, spouses: ['joseph-nazareth'],
    scripture: ['Luke 1–2', 'John 2', 'John 19:25–27'], events: ['annunciation', 'visitation', 'nativity', 'crucifixion'],
    bio: 'Present at the start and the end and largely silent in between. Her one long speech is a song about thrones being emptied.' }),
  P('john-baptist', 'John the Baptist', { gen: 64, born: -6, died: 30, dating: 'inferred', era: 'jesus', major: true, father: 'zechariah-priest', mother: 'elizabeth',
    scripture: ['Luke 1', 'Mark 1', 'Mark 6:14–29'], events: ['john-born', 'john-preaching', 'baptism', 'john-death'],
    bio: 'Six months older than his cousin, and the firmest chronological peg in the Gospels. Executed at Machaerus after a dance and a rash oath.' }),
  P('jesus', 'Jesus', { gen: 64, born: -5, died: 30, dating: 'inferred', era: 'jesus', major: true, father: 'joseph-nazareth', mother: 'mary',
    scripture: ['Matthew 1:18–25', 'Luke 2:1–20', 'Mark 1:9–11', 'John 19:16–30'], events: ['nativity', 'baptism', 'crucifixion', 'resurrection'],
    bio: 'Born before Herod the Great’s death in 4 BC and executed under Pilate, who governed AD 26–36 — the two ends of the life are both approximate.',
    note: 'This tree follows Matthew’s royal genealogy through Solomon and Zerubbabel. Luke gives a different line through David’s son Nathan; both genealogies culminate in Joseph.' }),
  P('james-brother', 'James', { gen: 64, died: 62, dating: 'inferred', era: 'early-church', major: true, father: 'joseph-nazareth', mother: 'mary',
    scripture: ['Mark 6:3', 'Acts 15:13–21', 'Galatians 1:19'], events: ['jerusalem-council'],
    bio: 'Sceptical during his brother’s lifetime and leading the Jerusalem church afterwards. Josephus records his execution in AD 62.' }),
]

for (const list of [LEVI_LINE, ROYAL_LINE, DAVIDIC, MATTHEW_LINE, NT_FAMILY]) PEOPLE.push(...list)

export const PERSON_BY_ID = Object.fromEntries(PEOPLE.map((p) => [p.id, p]))

export const DATING_LABEL = {
  text: 'Age stated in scripture',
  derived: 'Year chained from stated ages',
  inferred: 'Estimated from external evidence',
  unknown: 'No date given',
}

/** Children of a person, in generation order. */
export function childrenOf(id) {
  return PEOPLE.filter((p) => p.father === id || p.mother === id)
}
