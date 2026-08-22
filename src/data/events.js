/**
 * Events of the biblical narrative, placed in time and space.
 *
 * `dateConfidence` describes the chronology, while place certainty lives in
 * places.js. They are separate questions and should remain separate in the UI.
 *
 * ON DATING
 * ---------
 * Biblical chronology is contested, and the disagreement is not a rounding error:
 * the Exodus is placed either c. 1446 BC or c. 1250 BC depending on how you read
 * 1 Kings 6:1, and the two readings imply different pharaohs and a different
 * Canaan. Where the two traditions diverge, `dateLabel` names both rather than
 * silently harmonising them, and `dateConfidence` is 'disputed'.
 *
 * `year` is the sort key and always follows the traditional chronology, so the
 * timeline steps in a single consistent order. `anchor` records the evidence from
 * outside the Bible that fixes a date, where such evidence exists; events without
 * one rest on the biblical text alone.
 */

const event = (id, title, year, era, category, places, details = {}) => ({
  id,
  title,
  year,
  era,
  category,
  places,
  dateConfidence: 'estimated',
  ...details,
})

// Routes are the sequence of places named in the text. They are interpretive:
// the stops are given, the roads between them are not.
const ROUTE_ABRAHAM = ['ur', 'haran', 'shechem', 'bethel', 'beersheba', 'memphis', 'bethel', 'hebron']
const ROUTE_JOSEPH = ['dothan', 'goshen', 'memphis']
const ROUTE_EXODUS = ['rameses', 'succoth', 'red-sea-crossing', 'marah', 'elim', 'rephidim', 'sinai']
const ROUTE_WILDERNESS = ['sinai', 'kadesh-barnea', 'mount-hor', 'moab-plains', 'nebo']
const ROUTE_CONQUEST = ['jordan-crossing', 'jericho', 'ai', 'gibeon', 'lachish', 'hazor', 'shechem']
const ROUTE_EXILE = ['jerusalem', 'riblah', 'carchemish', 'babylon']
const ROUTE_RETURN = ['babylon', 'carchemish', 'damascus', 'jerusalem']
const ROUTE_GALILEE = ['nazareth', 'capernaum', 'bethsaida', 'magdala', 'cana', 'galilee-sea']
const ROUTE_PASSION = ['bethany', 'olives', 'temple-mount', 'gethsemane', 'golgotha']
const ROUTE_PAUL1 = ['antioch-syria', 'seleucia', 'salamis', 'paphos', 'perga', 'antioch-pisidia',
  'iconium', 'lystra', 'derbe', 'attalia', 'antioch-syria']
const ROUTE_PAUL2 = ['antioch-syria', 'tarsus', 'derbe', 'lystra', 'antioch-pisidia', 'troas',
  'philippi', 'thessalonica', 'berea', 'athens', 'corinth', 'cenchreae', 'ephesus', 'caesarea', 'antioch-syria']
const ROUTE_PAUL3 = ['antioch-syria', 'iconium', 'ephesus', 'troas', 'philippi', 'corinth',
  'troas', 'assos', 'miletus', 'rhodes', 'tyre', 'caesarea', 'jerusalem']
const ROUTE_PAUL_ROME = ['caesarea', 'sidon', 'myra', 'fair-havens', 'malta', 'syracuse', 'puteoli', 'rome']

export const EVENTS = [
  // ------------------------------------------------------------- primeval
  event('creation', 'Creation', -4004, 'primeval', 'covenant', ['eden'], {
    dateLabel: 'No date given in the text', tickLabel: 'undated', dateConfidence: 'undated',
    scripture: ['Genesis 1–2'],
    summary: 'The opening account of the world’s making, and of humanity placed in a garden with a single prohibition.',
    note: 'Ussher’s 4004 BC comes from adding up genealogies, a method that assumes the lists are complete and the numbers are calendrical. The text supplies no year.',
  }),
  event('fall', 'The Fall', -4003, 'primeval', 'covenant', ['eden'], {
    dateLabel: 'No date given in the text', tickLabel: 'undated', dateConfidence: 'undated',
    scripture: ['Genesis 3'],
    summary: 'The prohibition is broken and the pair are sent out of the garden.',
  }),
  event('cain-abel', 'Cain and Abel', -4002, 'primeval', 'covenant', ['eden'], {
    dateLabel: 'No date given in the text', tickLabel: 'undated', dateConfidence: 'undated',
    scripture: ['Genesis 4'],
    summary: 'The first killing, and the first exile east of Eden.',
  }),
  event('flood', 'The Flood', -2348, 'primeval', 'covenant', ['ararat'], {
    dateLabel: 'No date given in the text', tickLabel: 'undated', dateConfidence: 'undated',
    scripture: ['Genesis 6–9'],
    summary: 'A deluge, an ark, and a covenant marked by a rainbow. The boat comes to rest on “the mountains of Ararat”.',
    note: 'Traditional chronologies put this near 2348 BC. There is no geological horizon corresponding to a global flood, and Mesopotamian flood narratives — Gilgamesh, Atrahasis — are older than Genesis and closely parallel.',
  }),
  event('babel', 'The Tower of Babel', -2200, 'primeval', 'migration', ['shinar'], {
    dateLabel: 'No date given in the text', tickLabel: 'undated', dateConfidence: 'undated',
    scripture: ['Genesis 11:1–9'],
    summary: 'A tower built to reach heaven; languages confused and humanity scattered. The imagery is that of a Mesopotamian ziggurat.',
  }),

  // ----------------------------------------------------------- patriarchs
  event('abram-ur', 'Terah’s family leaves Ur', -2091, 'patriarchs', 'migration', ['ur', 'haran'], {
    dateLabel: 'c. 2091 BC traditional · c. 1900–1750 BC academic', dateConfidence: 'disputed',
    scripture: ['Genesis 11:31'],
    summary: 'Abram, Sarai and Lot set out from Ur with Terah and settle at Haran.',
    note: 'No patriarch appears in any contemporary record. Academic ranges are inferred from social customs in the narratives, and many historians treat the figures as literary rather than datable.',
  }),
  event('call-abram', 'The call of Abram', -2091, 'patriarchs', 'migration', ['haran', 'shechem', 'bethel', 'hebron'], {
    dateLabel: 'c. 2091 BC traditional · c. 1900–1750 BC academic', dateConfidence: 'disputed',
    scripture: ['Genesis 12:1–9'],
    summary: '“Go from your country” — Abram leaves Haran for Canaan with a promise of land, descendants and blessing.',
    route: ROUTE_ABRAHAM, featured: true,
    note: 'Roughly 1,500 miles by the practicable route, which follows the Euphrates rather than crossing the Syrian desert.',
  }),
  event('abram-egypt', 'Abram in Egypt', -2085, 'patriarchs', 'migration', ['beersheba', 'memphis'], {
    dateLabel: 'c. 2085 BC traditional · c. 1900–1750 BC academic', dateConfidence: 'disputed',
    scripture: ['Genesis 12:10–20'],
    summary: 'Famine drives Abram to Egypt, where he passes Sarai off as his sister.',
  }),
  event('abraham-covenant', 'The covenant with Abraham', -2081, 'patriarchs', 'covenant', ['hebron'], {
    dateLabel: 'c. 2081 BC traditional · c. 1900–1750 BC academic', dateConfidence: 'disputed',
    scripture: ['Genesis 15', 'Genesis 17'],
    summary: 'A covenant cut between divided animals, later sealed by circumcision, promising land and innumerable descendants.',
  }),
  event('sodom', 'The destruction of Sodom and Gomorrah', -2067, 'patriarchs', 'miracle', ['sodom', 'hebron'], {
    dateLabel: 'c. 2067 BC traditional · c. 1900–1750 BC academic', dateConfidence: 'disputed',
    scripture: ['Genesis 18–19'],
    summary: 'Abraham bargains for the cities; Lot escapes as they are overthrown, and his wife looks back.',
  }),
  event('isaac-born', 'Birth of Isaac', -2066, 'patriarchs', 'covenant', ['beersheba'], {
    dateLabel: 'c. 2066 BC traditional · c. 1880–1730 BC academic', dateConfidence: 'disputed',
    scripture: ['Genesis 21:1–7'],
    summary: 'The promised son is born to Abraham and Sarah in their old age.',
  }),
  event('binding-isaac', 'The binding of Isaac', -2050, 'patriarchs', 'covenant', ['beersheba', 'temple-mount'], {
    dateLabel: 'c. 2050 BC traditional · c. 1880–1730 BC academic', dateConfidence: 'disputed',
    scripture: ['Genesis 22:1–19', '2 Chronicles 3:1'],
    summary: 'Abraham is told to sacrifice Isaac on a mountain in Moriah, and is stopped. Chronicles later identifies Moriah with the temple hill.',
    route: ['beersheba', 'temple-mount'],
  }),
  event('jacob-esau', 'Jacob takes Esau’s blessing', -1929, 'patriarchs', 'covenant', ['beersheba'], {
    dateLabel: 'c. 1929 BC traditional · c. 1850–1700 BC academic', dateConfidence: 'disputed',
    scripture: ['Genesis 27'],
    summary: 'Jacob deceives the blind Isaac and flees his brother’s anger.',
  }),
  event('jacobs-ladder', 'Jacob’s ladder at Bethel', -1928, 'patriarchs', 'covenant', ['bethel'], {
    dateLabel: 'c. 1928 BC traditional · c. 1850–1700 BC academic', dateConfidence: 'disputed',
    scripture: ['Genesis 28:10–22'],
    summary: 'A dream of a stairway to heaven; Jacob names the place Bethel, “house of God”.',
  }),
  event('jacob-wrestles', 'Jacob wrestles at Penuel', -1908, 'patriarchs', 'covenant', ['haran', 'mahanaim', 'penuel', 'shechem'], {
    dateLabel: 'c. 1908 BC traditional · c. 1850–1700 BC academic', dateConfidence: 'disputed',
    scripture: ['Genesis 31–35'],
    summary: 'Returning to Canaan, Jacob wrestles a stranger until daybreak and is renamed Israel. He leaves with a limp.',
    route: ['haran', 'mahanaim', 'penuel', 'shechem', 'bethel', 'hebron'],
  }),
  event('joseph-sold', 'Joseph sold by his brothers', -1898, 'patriarchs', 'migration', ['dothan', 'goshen'], {
    dateLabel: 'c. 1898 BC traditional · c. 1800–1650 BC academic', dateConfidence: 'disputed',
    scripture: ['Genesis 37'],
    summary: 'Thrown into a pit at Dothan and sold to a caravan bound for Egypt.',
    route: ROUTE_JOSEPH,
  }),
  event('joseph-vizier', 'Joseph rises in Egypt', -1885, 'patriarchs', 'kingdom', ['memphis'], {
    dateLabel: 'c. 1885 BC traditional · c. 1800–1650 BC academic', dateConfidence: 'disputed',
    scripture: ['Genesis 41'],
    summary: 'Interpreting Pharaoh’s dreams, Joseph is put in charge of Egypt’s grain.',
    note: 'Semitic officials did hold high office in Egypt during the Hyksos period, c. 1650–1550 BC, which is the usual setting proposed for Joseph — though no Egyptian source names him.',
  }),
  event('jacob-egypt', 'Jacob’s family settles in Goshen', -1876, 'patriarchs', 'migration', ['hebron', 'goshen'], {
    dateLabel: 'c. 1876 BC traditional · c. 1750–1600 BC academic', dateConfidence: 'disputed',
    scripture: ['Genesis 46–47'],
    summary: 'Seventy people go down to Egypt during the famine and are given the land of Goshen.',
    route: ['hebron', 'beersheba', 'goshen'],
  }),

  // -------------------------------------------------------- egypt & exodus
  event('slavery', 'Israel enslaved in Egypt', -1730, 'egypt-exodus', 'kingdom', ['rameses', 'pithom'], {
    dateLabel: 'c. 1730–1446 BC traditional · c. 1500–1250 BC academic', dateConfidence: 'disputed',
    scripture: ['Exodus 1'],
    summary: 'A new king “who did not know Joseph” sets the Israelites to forced labour building the store cities of Pithom and Rameses.',
  }),
  event('moses-born', 'Birth of Moses', -1526, 'egypt-exodus', 'kingdom', ['goshen'], {
    dateLabel: 'c. 1526 BC traditional · c. 1330–1300 BC academic', dateConfidence: 'disputed',
    scripture: ['Exodus 2:1–10'],
    summary: 'Hidden in a basket on the Nile and raised in Pharaoh’s household.',
  }),
  event('burning-bush', 'The burning bush', -1446, 'egypt-exodus', 'covenant', ['sinai'], {
    dateLabel: 'c. 1446 BC traditional · c. 1260 BC academic', dateConfidence: 'disputed',
    scripture: ['Exodus 3–4'],
    summary: 'Moses, in exile as a shepherd, is commissioned at Horeb and given the name I AM to carry back to Egypt.',
  }),
  event('plagues', 'The ten plagues', -1446, 'egypt-exodus', 'miracle', ['rameses'], {
    dateLabel: 'c. 1446 BC traditional · c. 1260 BC academic', dateConfidence: 'disputed',
    scripture: ['Exodus 7–12'],
    summary: 'Ten escalating judgements on Egypt, ending with the death of the firstborn and the first Passover.',
  }),
  event('exodus', 'The Exodus from Egypt', -1446, 'egypt-exodus', 'migration',
    ['rameses', 'succoth', 'red-sea-crossing', 'marah', 'elim'], {
    dateLabel: '1446 BC traditional · c. 1260–1230 BC academic', dateConfidence: 'disputed',
    scripture: ['Exodus 12:31–15:27'],
    summary: 'Israel leaves Egypt after the final plague and crosses the sea as the chariots pursue them.',
    route: ROUTE_EXODUS, featured: true,
    note: 'The central chronological dispute of the Hebrew Bible. 1 Kings 6:1 puts the Exodus 480 years before Solomon’s fourth year, giving 1446 BC. Against that, Exodus 1:11 names the city of Rameses, built under Ramesses II (1279–1213 BC), pointing to c. 1250 BC. The 480 may also be a schematic 12 × 40 rather than a count.',
    anchor: 'The Merneptah Stele of 1208 BC names “Israel” as a people already in Canaan — whichever date is right, Israel is in the land before then.',
  }),
  event('sea-crossing', 'Crossing the sea', -1446, 'egypt-exodus', 'miracle', ['red-sea-crossing'], {
    dateLabel: 'c. 1446 BC traditional · c. 1260 BC academic', dateConfidence: 'disputed',
    scripture: ['Exodus 14'],
    summary: 'The waters divide, Israel passes through, and the pursuing army is drowned.',
    note: 'The Hebrew reads yam suph, “Sea of Reeds”. Candidates range from Delta lakes to the Gulf of Suez to the Gulf of Aqaba.',
  }),
  event('sinai-law', 'The covenant at Sinai', -1446, 'egypt-exodus', 'covenant', ['sinai'], {
    dateLabel: 'c. 1446 BC traditional · c. 1260 BC academic', dateConfidence: 'disputed',
    scripture: ['Exodus 19–24'],
    summary: 'Israel camps at the mountain and receives the Ten Commandments and the covenant law, ratified in blood.',
    featured: true,
  }),
  event('golden-calf', 'The golden calf', -1446, 'egypt-exodus', 'temple', ['sinai'], {
    dateLabel: 'c. 1446 BC traditional · c. 1260 BC academic', dateConfidence: 'disputed',
    scripture: ['Exodus 32'],
    summary: 'While Moses is on the mountain the people make an image; the tablets are broken.',
  }),
  event('tabernacle', 'The tabernacle is built', -1445, 'egypt-exodus', 'temple', ['sinai'], {
    dateLabel: 'c. 1445 BC traditional · c. 1259 BC academic', dateConfidence: 'disputed',
    scripture: ['Exodus 35–40'],
    summary: 'A portable sanctuary is constructed to travel with the camp.',
  }),
  event('kadesh-spies', 'The twelve spies at Kadesh', -1444, 'egypt-exodus', 'migration', ['kadesh-barnea', 'hebron'], {
    dateLabel: 'c. 1444 BC traditional · c. 1258 BC academic', dateConfidence: 'disputed',
    scripture: ['Numbers 13–14'],
    summary: 'Ten of twelve scouts report the land cannot be taken. The generation is sentenced to forty years in the wilderness.',
  }),
  event('wilderness', 'Forty years in the wilderness', -1440, 'egypt-exodus', 'migration',
    ['sinai', 'kadesh-barnea', 'mount-hor', 'moab-plains'], {
    dateLabel: 'c. 1446–1406 BC traditional · c. 1260–1220 BC academic', dateConfidence: 'disputed',
    scripture: ['Numbers 14–36', 'Numbers 33'],
    summary: 'A generation lives and dies between Egypt and Canaan.',
    route: ROUTE_WILDERNESS,
    note: 'Numbers 33 lists forty-two stations; most cannot be identified, and northern and Arabian routes have both been argued. This line is one reading, not a survey.',
  }),
  event('moses-nebo', 'Moses sees the land from Nebo', -1406, 'egypt-exodus', 'covenant', ['nebo'], {
    dateLabel: 'c. 1406 BC traditional · c. 1220 BC academic', dateConfidence: 'disputed',
    scripture: ['Deuteronomy 34'],
    summary: 'Moses views Canaan from the mountain and dies in Moab without entering. “No one knows his burial place to this day.”',
  }),

  // ----------------------------------------------------- conquest & judges
  event('jordan-crossing-ev', 'Israel crosses the Jordan', -1406, 'conquest-judges', 'migration',
    ['moab-plains', 'jordan-crossing', 'gilgal'], {
    dateLabel: 'c. 1406 BC traditional · c. 1220–1200 BC academic', dateConfidence: 'disputed',
    scripture: ['Joshua 3–4'],
    summary: 'The river is stopped upstream and the people cross on dry ground at flood stage.',
    route: ROUTE_CONQUEST,
  }),
  event('jericho', 'The fall of Jericho', -1406, 'conquest-judges', 'battle', ['jericho'], {
    dateLabel: 'c. 1406 BC traditional · c. 1220–1200 BC academic', dateConfidence: 'disputed',
    scripture: ['Joshua 6'],
    summary: 'Seven days of circling, a shout, and the walls come down.',
    featured: true,
    note: 'Kathleen Kenyon’s excavation dated Jericho’s major destruction to c. 1550 BC and found the site largely unoccupied in the Late Bronze Age — a problem for both proposed conquest dates. Bryant Wood has contested her ceramic dating.',
  }),
  event('ai', 'Defeat and capture of Ai', -1405, 'conquest-judges', 'battle', ['ai', 'bethel'], {
    dateLabel: 'c. 1405 BC traditional · c. 1210 BC academic', dateConfidence: 'disputed',
    scripture: ['Joshua 7–8'],
    summary: 'A first assault fails over Achan’s hidden plunder; a second succeeds by ambush.',
  }),
  event('gibeon-sun', 'The long day at Gibeon', -1405, 'conquest-judges', 'battle', ['gibeon', 'lachish'], {
    dateLabel: 'c. 1405 BC traditional · c. 1210 BC academic', dateConfidence: 'disputed',
    scripture: ['Joshua 10'],
    summary: 'Joshua defends the Gibeonites against a coalition of five kings, and the sun is said to stand still.',
  }),
  event('hazor-burn', 'Hazor is burned', -1400, 'conquest-judges', 'battle', ['hazor'], {
    dateLabel: 'c. 1400 BC traditional · c. 1230 BC academic', dateConfidence: 'disputed',
    scripture: ['Joshua 11'],
    summary: 'The head of the northern kingdoms is taken and put to the torch.',
    anchor: 'Hazor shows a violent Late Bronze destruction layer c. 1230 BC — the one conquest narrative with a well-matched destruction horizon.',
  }),
  event('shechem-covenant', 'Covenant renewal at Shechem', -1375, 'conquest-judges', 'covenant', ['shechem', 'gerizim', 'ebal'], {
    dateLabel: 'c. 1375 BC traditional · c. 1200 BC academic', dateConfidence: 'disputed',
    scripture: ['Joshua 24'],
    summary: '“Choose this day whom you will serve.” The tribes commit to the covenant between the two mountains.',
  }),
  event('deborah', 'Deborah and Barak defeat Sisera', -1150, 'conquest-judges', 'battle', ['megiddo', 'hazor', 'dan'], {
    dateLabel: 'c. 1200–1125 BC', dateConfidence: 'estimated',
    scripture: ['Judges 4–5'],
    summary: 'A prophet and judge sends Barak against Sisera’s chariots by the Kishon. The victory song in Judges 5 is among the oldest Hebrew poetry preserved.',
  }),
  event('gideon', 'Gideon routs the Midianites', -1140, 'conquest-judges', 'battle', ['jezreel', 'endor'], {
    dateLabel: 'c. 1175–1100 BC', dateConfidence: 'estimated',
    scripture: ['Judges 6–8'],
    summary: 'An army cut to three hundred, armed with trumpets, jars and torches.',
  }),
  event('ruth', 'Ruth gleans in Bethlehem', -1120, 'conquest-judges', 'migration', ['moab-plains', 'bethlehem'], {
    dateLabel: 'c. 1150–1100 BC', dateConfidence: 'estimated',
    scripture: ['Ruth 1–4'],
    summary: 'A Moabite widow returns with Naomi and marries Boaz, becoming great-grandmother to David.',
    route: ['moab-plains', 'bethlehem'],
  }),
  event('samson', 'Samson and the Philistines', -1075, 'conquest-judges', 'battle', ['gaza', 'ashkelon'], {
    dateLabel: 'c. 1100–1050 BC', dateConfidence: 'estimated',
    scripture: ['Judges 13–16'],
    summary: 'A Nazirite of prodigious strength, undone and finally bringing down a temple at Gaza.',
  }),
  event('ark-captured', 'The ark captured at Ebenezer', -1050, 'conquest-judges', 'battle', ['aphek', 'shiloh', 'ashdod'], {
    dateLabel: 'c. 1050 BC', dateConfidence: 'estimated',
    scripture: ['1 Samuel 4'],
    summary: 'Israel is routed, Eli’s sons are killed, and the ark is taken to Ashdod.',
  }),

  // ------------------------------------------------------ united monarchy
  event('saul-king', 'Saul anointed king', -1050, 'united-monarchy', 'kingdom', ['mizpah', 'ramah', 'gibeah'], {
    dateLabel: 'c. 1050 BC', dateConfidence: 'estimated',
    scripture: ['1 Samuel 9–10'],
    summary: 'Israel demands a king “like the other nations”; Samuel anoints Saul.',
  }),
  event('david-goliath', 'David and Goliath', -1025, 'united-monarchy', 'battle', ['elah', 'gath', 'bethlehem'], {
    dateLabel: 'c. 1025 BC', dateConfidence: 'estimated',
    scripture: ['1 Samuel 17'],
    summary: 'A shepherd boy meets the Philistine champion in the Valley of Elah with a sling.',
    featured: true,
  }),
  event('david-flees', 'David a fugitive', -1015, 'united-monarchy', 'migration', ['adullam', 'en-gedi', 'ziklag', 'nob'], {
    dateLabel: 'c. 1020–1010 BC', dateConfidence: 'estimated',
    scripture: ['1 Samuel 19–30'],
    summary: 'Hunted by Saul, David gathers a band in the wilderness strongholds of Adullam and En Gedi, and twice spares the king’s life.',
    route: ['nob', 'gath', 'adullam', 'en-gedi', 'ziklag'],
  }),
  event('gilboa', 'Saul dies at Gilboa', -1010, 'united-monarchy', 'battle', ['gilboa', 'beth-shan', 'jabesh-gilead'], {
    dateLabel: 'c. 1010 BC', dateConfidence: 'estimated',
    scripture: ['1 Samuel 31'],
    summary: 'Defeated by the Philistines, Saul and Jonathan fall on Mount Gilboa.',
  }),
  event('david-king', 'David becomes king', -1010, 'united-monarchy', 'kingdom', ['hebron', 'jerusalem'], {
    dateLabel: '1010–970 BC', dateConfidence: 'estimated',
    scripture: ['2 Samuel 2', '2 Samuel 5'],
    summary: 'Made king over Judah at Hebron, and seven years later over all Israel.',
    route: ['hebron', 'jerusalem'],
  }),
  event('jerusalem-captured', 'David captures Jerusalem', -1003, 'united-monarchy', 'battle', ['jerusalem'], {
    dateLabel: 'c. 1003 BC', dateConfidence: 'estimated',
    scripture: ['2 Samuel 5:6–10'],
    summary: 'The Jebusite stronghold is taken and made the capital — a city belonging to no tribe, and so to all of them.',
    featured: true,
  }),
  event('ark-jerusalem', 'The ark brought to Jerusalem', -1000, 'united-monarchy', 'temple', ['gibeon', 'jerusalem'], {
    dateLabel: 'c. 1000 BC', dateConfidence: 'estimated',
    scripture: ['2 Samuel 6'],
    summary: 'David dances before the ark as it enters the city.',
  }),
  event('davidic-covenant', 'The covenant with David', -995, 'united-monarchy', 'covenant', ['jerusalem'], {
    dateLabel: 'c. 995 BC', dateConfidence: 'estimated',
    scripture: ['2 Samuel 7'],
    summary: 'David is refused permission to build a temple, and promised an enduring house.',
  }),
  event('bathsheba', 'David, Bathsheba and Nathan', -991, 'united-monarchy', 'prophet', ['jerusalem', 'rabbah'], {
    dateLabel: 'c. 991 BC', dateConfidence: 'estimated',
    scripture: ['2 Samuel 11–12'],
    summary: 'The king takes another man’s wife and arranges his death; Nathan confronts him with a parable.',
  }),
  event('absalom', 'Absalom’s revolt', -979, 'united-monarchy', 'kingdom', ['jerusalem', 'mahanaim', 'hebron'], {
    dateLabel: 'c. 979 BC', dateConfidence: 'estimated',
    scripture: ['2 Samuel 15–18'],
    summary: 'David flees his own son and is restored only after Absalom dies in the forest.',
    route: ['hebron', 'jerusalem', 'olives', 'mahanaim'],
  }),
  event('solomon-king', 'Solomon becomes king', -970, 'united-monarchy', 'kingdom', ['jerusalem', 'gibeon'], {
    dateLabel: '970–931 BC', dateConfidence: 'estimated',
    scripture: ['1 Kings 1–3'],
    summary: 'Anointed at Gihon, and asking for wisdom to govern rather than long life or riches.',
  }),
  event('first-temple', 'The First Temple is built', -966, 'united-monarchy', 'temple', ['temple-mount', 'tyre'], {
    dateLabel: '966–959 BC', dateConfidence: 'estimated',
    scripture: ['1 Kings 6–8'],
    summary: 'Seven years of building, with Phoenician cedar and craftsmen sent by Hiram of Tyre.',
    featured: true,
    note: 'Solomon’s fourth year, dated c. 966 BC, is the hinge on which the internal chronology of 1 Kings 6:1 turns.',
  }),
  event('queen-sheba', 'The queen of Sheba visits', -950, 'united-monarchy', 'kingdom', ['sheba', 'jerusalem'], {
    dateLabel: 'c. 950 BC', dateConfidence: 'estimated',
    scripture: ['1 Kings 10'],
    summary: 'A southern Arabian monarch arrives with spices, gold and hard questions.',
    route: ['sheba', 'ezion-geber', 'jerusalem'],
  }),

  // ------------------------------------------------------ divided kingdom
  event('division', 'The kingdom divides', -931, 'divided-kingdom', 'kingdom', ['shechem', 'jerusalem', 'dan', 'bethel'], {
    dateLabel: '931 BC', dateConfidence: 'estimated',
    scripture: ['1 Kings 12'],
    summary: 'Rehoboam refuses to lighten the forced labour and ten tribes secede under Jeroboam. Israel in the north, Judah in the south.',
    featured: true,
  }),
  event('golden-calves', 'Jeroboam’s calves at Dan and Bethel', -930, 'divided-kingdom', 'temple', ['dan', 'bethel'], {
    dateLabel: 'c. 930 BC', dateConfidence: 'estimated',
    scripture: ['1 Kings 12:25–33'],
    summary: 'To stop pilgrimage to Jerusalem, the northern king sets up rival sanctuaries at each end of his kingdom.',
    route: ['dan', 'bethel'],
  }),
  event('shishak', 'Shishak invades Judah', -925, 'divided-kingdom', 'battle', ['thebes-eg', 'megiddo', 'jerusalem'], {
    dateLabel: '925 BC', dateConfidence: 'anchored',
    scripture: ['1 Kings 14:25–28'],
    summary: 'The Egyptian pharaoh strips the treasures of the temple and palace.',
    anchor: 'Shoshenq I’s campaign is recorded on the Bubastite Portal at Karnak, listing captured towns — one of the earliest firm synchronisms with the biblical text.',
  }),
  event('omri-samaria', 'Omri founds Samaria', -880, 'divided-kingdom', 'kingdom', ['samaria'], {
    dateLabel: 'c. 880 BC', dateConfidence: 'anchored',
    scripture: ['1 Kings 16:23–24'],
    summary: 'A new hilltop capital is bought and built for the northern kingdom.',
    anchor: 'Assyrian records call Israel “the house of Omri” for over a century afterwards.',
  }),
  event('elijah-carmel', 'Elijah on Mount Carmel', -860, 'divided-kingdom', 'prophet', ['carmel', 'samaria', 'jezreel'], {
    dateLabel: 'c. 860 BC', dateConfidence: 'estimated',
    scripture: ['1 Kings 18'],
    summary: 'A contest with the prophets of Baal over which god answers by fire, in the reign of Ahab and Jezebel.',
    route: ['zarephath', 'carmel', 'jezreel'], featured: true,
  }),
  event('elijah-horeb', 'Elijah at Horeb', -859, 'divided-kingdom', 'prophet', ['beersheba', 'sinai'], {
    dateLabel: 'c. 859 BC', dateConfidence: 'estimated',
    scripture: ['1 Kings 19'],
    summary: 'Fleeing Jezebel, the prophet returns to the mountain of the law and hears not wind, earthquake or fire, but a low whisper.',
    route: ['jezreel', 'beersheba', 'sinai'],
  }),
  event('naboth', 'Naboth’s vineyard', -855, 'divided-kingdom', 'prophet', ['jezreel'], {
    dateLabel: 'c. 855 BC', dateConfidence: 'estimated',
    scripture: ['1 Kings 21'],
    summary: 'A judicial murder for a plot of land, and Elijah’s sentence on the dynasty.',
  }),
  event('qarqar', 'Ahab at the battle of Qarqar', -853, 'divided-kingdom', 'battle', ['samaria', 'damascus'], {
    dateLabel: '853 BC', dateConfidence: 'anchored',
    scripture: ['1 Kings 22 (context)'],
    summary: 'A coalition of Levantine states, Ahab among them, checks Assyria on the Orontes. The Bible does not mention the battle; Assyria does.',
    anchor: 'The Kurkh Monolith of Shalmaneser III credits “Ahab the Israelite” with 2,000 chariots — the first named Israelite king in an external record.',
  }),
  event('elisha', 'The ministry of Elisha', -850, 'divided-kingdom', 'prophet', ['samaria', 'jericho', 'damascus'], {
    dateLabel: 'c. 850–800 BC', dateConfidence: 'estimated',
    scripture: ['2 Kings 2–13'],
    summary: 'Elijah is taken up in a whirlwind and Elisha receives a double share — healing Naaman, feeding the hungry and out-manoeuvring Aram.',
  }),
  event('jehu', 'Jehu’s purge', -841, 'divided-kingdom', 'kingdom', ['jezreel', 'samaria'], {
    dateLabel: '841 BC', dateConfidence: 'anchored',
    scripture: ['2 Kings 9–10'],
    summary: 'The house of Ahab is destroyed, Jezebel thrown from a window, and Baal worship purged.',
    anchor: 'The Black Obelisk of Shalmaneser III shows Jehu, or his envoy, bowing in tribute — the only likely contemporary image of an Israelite king.',
  }),
  event('jonah', 'Jonah sent to Nineveh', -780, 'divided-kingdom', 'prophet', ['joppa', 'tarshish', 'nineveh'], {
    dateLabel: 'c. 780 BC', dateConfidence: 'traditional',
    scripture: ['Jonah 1–4'],
    summary: 'A prophet flees toward Tarshish, is swallowed, relents, and resents the mercy shown.',
    route: ['joppa', 'tarshish'],
    note: 'Jonah son of Amittai is placed in Jeroboam II’s reign (2 Kings 14:25), but many scholars read the book as a later didactic story rather than a report. Tarshish is unidentified; the point is that it is as far from Nineveh as a ship could go.',
  }),
  event('amos-hosea', 'Amos and Hosea preach in the north', -750, 'divided-kingdom', 'prophet', ['bethel', 'samaria'], {
    dateLabel: 'c. 760–725 BC', dateConfidence: 'estimated',
    scripture: ['Amos 1–9', 'Hosea 1–14'],
    summary: 'Amos indicts a prosperous Israel for crushing the poor; Hosea makes his own marriage a sign of covenant betrayal.',
  }),
  event('isaiah-call', 'The call of Isaiah', -740, 'divided-kingdom', 'prophet', ['temple-mount'], {
    dateLabel: '740 BC', dateConfidence: 'estimated',
    scripture: ['Isaiah 6'],
    summary: '“In the year that King Uzziah died” — a vision in the temple, and a commission.',
  }),
  event('samaria-falls', 'Fall of Samaria — the end of Israel', -722, 'divided-kingdom', 'battle', ['samaria', 'nineveh'], {
    dateLabel: '722 BC', dateConfidence: 'anchored',
    scripture: ['2 Kings 17'],
    summary: 'After a three-year siege the Assyrians take Samaria and deport its population. The ten northern tribes do not return.',
    route: ['samaria', 'asshur', 'nineveh'], featured: true,
    anchor: 'Recorded by Sargon II, who claims 27,290 deportees. The northern kingdom ends here.',
  }),
  event('sennacherib', 'Sennacherib besieges Jerusalem', -701, 'divided-kingdom', 'battle', ['lachish', 'jerusalem', 'nineveh'], {
    dateLabel: '701 BC', dateConfidence: 'anchored',
    scripture: ['2 Kings 18–19', 'Isaiah 36–37'],
    summary: 'Judah’s fortified towns fall and Jerusalem is surrounded, then the Assyrian army withdraws. Hezekiah’s tunnel, cut to secure the water supply, still stands.',
    route: ['nineveh', 'lachish', 'jerusalem'],
    anchor: 'Sennacherib’s prism says he shut Hezekiah up “like a bird in a cage” — and notably does not claim to have taken the city.',
  }),
  event('lachish', 'The siege of Lachish', -701, 'divided-kingdom', 'battle', ['lachish'], {
    dateLabel: '701 BC', dateConfidence: 'anchored',
    scripture: ['2 Kings 18:14'],
    summary: 'Judah’s second city is stormed by ramp and battering ram.',
    anchor: 'Depicted across a whole room of Sennacherib’s palace at Nineveh, and matched by the excavated siege ramp — the best-documented battle in the Hebrew Bible.',
  }),
  event('josiah-reform', 'Josiah’s reform and the book of the law', -622, 'divided-kingdom', 'temple', ['temple-mount', 'bethel'], {
    dateLabel: '622 BC', dateConfidence: 'estimated',
    scripture: ['2 Kings 22–23'],
    summary: 'A scroll found during temple repairs triggers a sweeping purge of shrines and a renewed Passover.',
  }),
  event('nineveh-falls', 'Fall of Nineveh', -612, 'divided-kingdom', 'battle', ['nineveh', 'babylon'], {
    dateLabel: '612 BC', dateConfidence: 'anchored',
    scripture: ['Nahum 1–3'],
    summary: 'The Assyrian capital falls to Babylon and the Medes, as Nahum had said it would.',
    anchor: 'The Babylonian Chronicle records the Medo-Babylonian capture of the city.',
  }),
  event('megiddo-josiah', 'Josiah killed at Megiddo', -609, 'divided-kingdom', 'battle', ['megiddo', 'jerusalem'], {
    dateLabel: '609 BC', dateConfidence: 'anchored',
    scripture: ['2 Kings 23:29–30'],
    summary: 'Judah’s reforming king intercepts Pharaoh Neco marching north, and dies.',
  }),
  event('carchemish', 'Battle of Carchemish', -605, 'divided-kingdom', 'battle', ['carchemish', 'babylon'], {
    dateLabel: '605 BC', dateConfidence: 'anchored',
    scripture: ['Jeremiah 46:2', 'Daniel 1:1–7'],
    summary: 'Nebuchadnezzar shatters Egypt on the Euphrates. Judah passes into Babylon’s sphere, and Daniel is among the first taken.',
    anchor: 'Dated precisely by the Babylonian Chronicle.',
  }),
  event('jeremiah', 'Jeremiah warns Jerusalem', -600, 'divided-kingdom', 'prophet', ['jerusalem'], {
    dateLabel: '627–586 BC', dateConfidence: 'estimated',
    scripture: ['Jeremiah 1–45'],
    summary: 'Forty years telling the city it will fall and that resistance is futile — imprisoned, thrown into a cistern, and vindicated.',
  }),

  // -------------------------------------------------------- exile & return
  event('first-deportation', 'First deportation to Babylon', -597, 'exile-return', 'migration', ['jerusalem', 'babylon'], {
    dateLabel: '597 BC', dateConfidence: 'anchored',
    scripture: ['2 Kings 24:10–16', 'Daniel 1'],
    summary: 'Jehoiachin, the court and the craftsmen are carried off; Zedekiah is left as a vassal.',
    anchor: 'The Babylonian Chronicle dates the capture of Jerusalem to 2 Adar — 16 March 597 BC. Ration tablets from Babylon later name King Jehoiachin.',
  }),
  event('jerusalem-falls', 'Fall of Jerusalem and the Temple burned', -586, 'exile-return', 'battle',
    ['jerusalem', 'riblah', 'babylon'], {
    dateLabel: '586 BC', dateConfidence: 'anchored',
    scripture: ['2 Kings 25', 'Jeremiah 52', 'Lamentations 1'],
    summary: 'After an eighteen-month siege the walls are breached, the temple burned, and Zedekiah blinded at Riblah after watching his sons die.',
    route: ROUTE_EXILE, featured: true,
    note: 'Either 587 or 586 BC depending on how the regnal years are counted. The event is certain; the year is off by one between systems. Deportees went north up the Levantine corridor and east along the Euphrates — the long way round the desert.',
  }),
  event('ezekiel', 'Ezekiel among the exiles', -593, 'exile-return', 'prophet', ['babylon'], {
    dateLabel: '593–571 BC', dateConfidence: 'estimated',
    scripture: ['Ezekiel 1–48'],
    summary: 'A priest deported to the Chebar canal sees wheels within wheels, the glory leaving the temple, and a valley of dry bones.',
  }),
  event('daniel-lions', 'Daniel in Babylon and Persia', -560, 'exile-return', 'prophet', ['babylon', 'susa'], {
    dateLabel: '605–536 BC', dateConfidence: 'traditional',
    scripture: ['Daniel 1–6'],
    summary: 'The fiery furnace, the writing on the wall, and the night in the lions’ den.',
    note: 'The book’s court tales are set in the exile; most critical scholars date its composition to the Maccabean crisis of the 160s BC, which is a separate question from when the stories are set.',
  }),
  event('babylon-falls', 'Cyrus takes Babylon', -539, 'exile-return', 'kingdom', ['babylon', 'persepolis'], {
    dateLabel: '539 BC', dateConfidence: 'anchored',
    scripture: ['Daniel 5', 'Isaiah 45'],
    summary: 'Persia takes the city, reportedly without a battle, and the empire changes hands.',
    anchor: 'The Nabonidus Chronicle and the Cyrus Cylinder both record the fall of the city and Cyrus’s policy of repatriating displaced peoples.',
  }),
  event('cyrus-decree', 'The decree of Cyrus', -538, 'exile-return', 'kingdom', ['susa', 'ecbatana'], {
    dateLabel: '538 BC', dateConfidence: 'anchored',
    scripture: ['Ezra 1', '2 Chronicles 36:22–23'],
    summary: 'Exiles are permitted to return to Jerusalem and rebuild the temple.',
  }),
  event('return', 'The return under Zerubbabel', -538, 'exile-return', 'migration', ['babylon', 'jerusalem'], {
    dateLabel: '538–536 BC', dateConfidence: 'anchored',
    scripture: ['Ezra 2–3'],
    summary: 'Some 42,000 make the journey back; the altar is rebuilt and foundations laid.',
    route: ROUTE_RETURN, featured: true,
    note: 'The exile corridor in reverse, about four months on the road (Ezra 7:9).',
  }),
  event('second-temple', 'The Second Temple completed', -516, 'exile-return', 'temple', ['temple-mount'], {
    dateLabel: '516 BC', dateConfidence: 'anchored',
    scripture: ['Ezra 6:15', 'Haggai 1–2', 'Zechariah 4'],
    summary: 'Finished in the sixth year of Darius, spurred on by Haggai and Zechariah. Those who remembered the first one wept.',
  }),
  event('esther', 'Esther at the Persian court', -479, 'exile-return', 'kingdom', ['susa'], {
    dateLabel: 'c. 479 BC', dateConfidence: 'estimated',
    scripture: ['Esther 1–10'],
    summary: 'Set in the reign of Xerxes I: a queen conceals her people, then risks the throne room to save them.',
  }),
  event('ezra', 'Ezra returns with the law', -458, 'exile-return', 'covenant', ['babylon', 'jerusalem'], {
    dateLabel: '458 BC', dateConfidence: 'anchored',
    scripture: ['Ezra 7–10', 'Nehemiah 8'],
    summary: 'A priest and scribe arrives from Babylon and reads the law aloud to the assembly.',
  }),
  event('nehemiah', 'Nehemiah rebuilds the walls', -445, 'exile-return', 'kingdom', ['susa', 'jerusalem'], {
    dateLabel: '445 BC', dateConfidence: 'anchored',
    scripture: ['Nehemiah 1–6'],
    summary: 'The king’s cupbearer takes leave to rebuild Jerusalem’s defences, finishing in fifty-two days despite sustained opposition.',
    route: ['susa', 'damascus', 'jerusalem'],
  }),

  // ------------------------------------------------- between the testaments
  event('alexander', 'Alexander takes the Levant', -332, 'second-temple', 'kingdom', ['tyre', 'jerusalem', 'alexandria'], {
    dateLabel: '332 BC', dateConfidence: 'anchored',
    scripture: ['Daniel 8 (cf.)'],
    summary: 'Persian rule ends and the region enters three centuries of Greek culture and language.',
    route: ['tyre', 'jerusalem', 'gaza', 'alexandria'],
  }),
  event('septuagint', 'The Septuagint translated', -250, 'second-temple', 'ministry', ['alexandria'], {
    dateLabel: 'c. 250 BC', dateConfidence: 'estimated',
    scripture: ['Letter of Aristeas'],
    summary: 'The Hebrew scriptures are rendered into Greek in Alexandria — the version most New Testament writers would quote.',
  }),
  event('antiochus', 'Antiochus IV desecrates the Temple', -167, 'second-temple', 'temple', ['temple-mount'], {
    dateLabel: '167 BC', dateConfidence: 'anchored',
    scripture: ['1 Maccabees 1', 'Daniel 11 (cf.)'],
    summary: 'Jewish practice is outlawed and a pagan altar set up in the sanctuary.',
  }),
  event('maccabees', 'The Maccabean revolt and rededication', -164, 'second-temple', 'battle', ['jerusalem', 'temple-mount'], {
    dateLabel: '167–164 BC', dateConfidence: 'anchored',
    scripture: ['1 Maccabees 2–4'],
    summary: 'Judas Maccabeus leads a revolt that retakes Jerusalem and rededicates the temple — the origin of Hanukkah — and wins a century of Jewish independence.',
    featured: true,
  }),
  event('pompey', 'Pompey takes Jerusalem', -63, 'second-temple', 'battle', ['jerusalem', 'rome'], {
    dateLabel: '63 BC', dateConfidence: 'anchored',
    scripture: ['Josephus, Antiquities 14'],
    summary: 'Rome intervenes in a Hasmonean civil war and stays. Judea becomes a client state.',
  }),
  event('herod', 'Herod the Great rebuilds the Temple', -20, 'second-temple', 'temple', ['temple-mount', 'caesarea', 'masada'], {
    dateLabel: '20 BC – AD 63', dateConfidence: 'anchored',
    scripture: ['John 2:20 (cf.)'],
    summary: 'A vast expansion of the Second Temple begun around 20 BC and not finished until a few years before its destruction.',
    anchor: 'The Western Wall and the Temple Mount platform are Herod’s work and still stand.',
  }),

  // --------------------------------------------------------- life of Jesus
  event('nativity', 'The birth of Jesus', -5, 'jesus', 'ministry', ['nazareth', 'bethlehem', 'jerusalem'], {
    dateLabel: 'c. 6–4 BC', dateConfidence: 'estimated',
    scripture: ['Matthew 1–2', 'Luke 2'],
    summary: 'Born in Bethlehem in the days of Herod; shepherds in Luke, magi in Matthew.',
    route: ['nazareth', 'bethlehem'], featured: true,
    note: 'Not AD 1. Matthew places the birth before Herod the Great’s death in 4 BC, so 6–4 BC is the usual range. The AD/BC scale was calculated in the 6th century by Dionysius Exiguus, who was simply off by a few years.',
  }),
  event('flight-egypt', 'The flight into Egypt', -4, 'jesus', 'migration', ['bethlehem', 'alexandria', 'nazareth'], {
    dateLabel: 'c. 5–4 BC', dateConfidence: 'estimated',
    scripture: ['Matthew 2:13–23'],
    summary: 'Warned in a dream, the family escapes Herod’s order and later settles in Nazareth.',
    route: ['bethlehem', 'gaza', 'alexandria', 'nazareth'],
  }),
  event('boy-temple', 'The boy Jesus in the Temple', 8, 'jesus', 'ministry', ['nazareth', 'temple-mount'], {
    dateLabel: 'c. AD 8', dateConfidence: 'estimated',
    scripture: ['Luke 2:41–52'],
    summary: 'Left behind after Passover at twelve years old, found questioning the teachers.',
  }),
  event('baptism', 'The baptism of Jesus', 29, 'jesus', 'ministry', ['jordan-crossing'], {
    dateLabel: 'c. AD 29', dateConfidence: 'anchored',
    scripture: ['Matthew 3', 'Mark 1', 'Luke 3'],
    summary: 'John baptises Jesus in the Jordan; the heavens open.',
    featured: true,
    anchor: 'Luke dates John’s preaching to the fifteenth year of Tiberius — AD 28/29 — the most precise chronological note in the Gospels.',
  }),
  event('temptation', 'Temptation in the wilderness', 29, 'jesus', 'ministry', ['jericho', 'temple-mount'], {
    dateLabel: 'c. AD 29', dateConfidence: 'estimated',
    scripture: ['Matthew 4:1–11'],
    summary: 'Forty days in the Judean desert, and three refusals.',
  }),
  event('cana', 'Water into wine at Cana', 29, 'jesus', 'miracle', ['cana'], {
    dateLabel: 'c. AD 29', dateConfidence: 'estimated',
    scripture: ['John 2:1–11'],
    summary: 'The first of John’s seven signs, at a wedding that has run dry.',
  }),
  event('capernaum-base', 'Ministry based at Capernaum', 29, 'jesus', 'ministry',
    ['capernaum', 'nazareth', 'bethsaida', 'magdala', 'galilee-sea'], {
    dateLabel: 'c. AD 29–30', dateConfidence: 'estimated',
    scripture: ['Matthew 4:12–17', 'Mark 1–2'],
    summary: 'A fishing town on the north shore becomes the centre of the Galilean ministry, and the first disciples are called from its boats.',
    route: ROUTE_GALILEE, featured: true,
  }),
  event('sermon-mount', 'The Sermon on the Mount', 30, 'jesus', 'ministry', ['galilee-sea', 'capernaum'], {
    dateLabel: 'c. AD 30', dateConfidence: 'estimated',
    scripture: ['Matthew 5–7'],
    summary: 'The Beatitudes, the Lord’s Prayer, and the command to love enemies.',
  }),
  event('feeding-5000', 'Feeding the five thousand', 30, 'jesus', 'miracle', ['bethsaida', 'galilee-sea'], {
    dateLabel: 'c. AD 30', dateConfidence: 'estimated',
    scripture: ['Mark 6:30–44', 'John 6'],
    summary: 'Five loaves and two fish — the only miracle in all four Gospels.',
  }),
  event('walking-water', 'Walking on the water', 30, 'jesus', 'miracle', ['galilee-sea', 'capernaum'], {
    dateLabel: 'c. AD 30', dateConfidence: 'estimated',
    scripture: ['Matthew 14:22–33'],
    summary: 'A night crossing in a headwind, and Peter stepping out of the boat.',
  }),
  event('peter-confession', 'Peter’s confession at Caesarea Philippi', 30, 'jesus', 'ministry', ['caesarea-philippi'], {
    dateLabel: 'c. AD 30', dateConfidence: 'estimated',
    scripture: ['Matthew 16:13–20'],
    summary: '“Who do you say that I am?” — asked at the northern edge of the land, beneath a pagan shrine.',
  }),
  event('transfiguration', 'The Transfiguration', 30, 'jesus', 'miracle', ['hermon', 'caesarea-philippi'], {
    dateLabel: 'c. AD 30', dateConfidence: 'estimated',
    scripture: ['Matthew 17:1–8'],
    summary: 'On a high mountain, Jesus appears transfigured with Moses and Elijah.',
    note: 'The mountain is unnamed. Hermon is nearest the preceding scene; Tabor is the traditional site.',
  }),
  event('lazarus', 'The raising of Lazarus', 30, 'jesus', 'miracle', ['bethany'], {
    dateLabel: 'c. AD 30', dateConfidence: 'estimated',
    scripture: ['John 11'],
    summary: 'Four days in the tomb, and a call to come out.',
  }),
  event('triumphal-entry', 'The entry into Jerusalem', 30, 'jesus', 'ministry', ['bethany', 'olives', 'jerusalem'], {
    dateLabel: 'c. AD 30', dateConfidence: 'estimated',
    scripture: ['Matthew 21:1–11'],
    summary: 'Down from the Mount of Olives on a donkey, into a city full for Passover.',
  }),
  event('temple-cleansing', 'Clearing the Temple courts', 30, 'jesus', 'temple', ['temple-mount'], {
    dateLabel: 'c. AD 30', dateConfidence: 'estimated',
    scripture: ['Mark 11:15–19'],
    summary: 'Tables of the money-changers overturned in the court of the Gentiles.',
  }),
  event('last-supper', 'The Last Supper', 30, 'jesus', 'covenant', ['jerusalem'], {
    dateLabel: 'c. AD 30', dateConfidence: 'estimated',
    scripture: ['Matthew 26', 'Luke 22', 'John 13'],
    summary: 'A Passover meal, bread and cup given new meaning, and feet washed.',
  }),
  event('gethsemane', 'Gethsemane and the arrest', 30, 'jesus', 'ministry', ['gethsemane', 'olives'], {
    dateLabel: 'c. AD 30', dateConfidence: 'estimated',
    scripture: ['Matthew 26:36–56'],
    summary: 'Prayer in an olive grove, disciples asleep, and a betrayal by kiss.',
  }),
  event('crucifixion', 'The crucifixion', 30, 'jesus', 'covenant', ['gethsemane', 'jerusalem', 'golgotha'], {
    dateLabel: 'AD 30 or AD 33', dateConfidence: 'disputed',
    scripture: ['Matthew 27', 'Mark 15', 'Luke 23', 'John 19'],
    summary: 'Condemned by Pilate and crucified outside the city wall between two others.',
    route: ROUTE_PASSION, featured: true,
    note: 'Either 7 April AD 30 or 3 April AD 33 — the two years in Pilate’s prefecture (AD 26–36) when 14 Nisan fell on a Friday. Scholars are genuinely split.',
    anchor: 'Pilate’s title is confirmed by an inscription found at Caesarea in 1961; Tacitus records the execution under Tiberius.',
  }),
  event('resurrection', 'The resurrection', 30, 'jesus', 'miracle', ['golgotha', 'jerusalem'], {
    dateLabel: 'AD 30 or AD 33', dateConfidence: 'disputed',
    scripture: ['Matthew 28', 'Luke 24', 'John 20'],
    summary: 'The tomb found empty on the first day of the week.',
    featured: true,
  }),
  event('emmaus-road', 'The road to Emmaus', 30, 'jesus', 'ministry', ['jerusalem', 'emmaus'], {
    dateLabel: 'AD 30 or AD 33', dateConfidence: 'disputed',
    scripture: ['Luke 24:13–35'],
    summary: 'Two travellers walk with a stranger and recognise him in the breaking of bread.',
    route: ['jerusalem', 'emmaus'],
    note: 'Luke gives a distance, not a location. Four rival sites have been proposed; Nicopolis is shown here.',
  }),
  event('ascension', 'The Ascension', 30, 'jesus', 'ministry', ['olives', 'bethany'], {
    dateLabel: 'AD 30 or AD 33', dateConfidence: 'disputed',
    scripture: ['Acts 1:6–11'],
    summary: 'A final commission on the Mount of Olives, forty days after the resurrection.',
  }),

  // ------------------------------------------------------- the early church
  event('pentecost', 'Pentecost', 30, 'early-church', 'miracle', ['jerusalem'], {
    dateLabel: 'AD 30 or AD 33', dateConfidence: 'disputed',
    scripture: ['Acts 2'],
    summary: 'Wind, fire and speech in many languages during the festival; the first proclamation and three thousand added.',
    featured: true,
  }),
  event('stephen', 'The stoning of Stephen', 34, 'early-church', 'ministry', ['jerusalem'], {
    dateLabel: 'c. AD 34', dateConfidence: 'estimated',
    scripture: ['Acts 6–7'],
    summary: 'The first killing of a follower of Jesus, with Saul of Tarsus watching the coats.',
  }),
  event('damascus-road', 'The Damascus road', 34, 'early-church', 'ministry', ['jerusalem', 'damascus'], {
    dateLabel: 'c. AD 33–36', dateConfidence: 'estimated',
    scripture: ['Acts 9', 'Galatians 1'],
    summary: 'Saul, travelling to arrest believers, is blinded by light and turned around.',
    route: ['jerusalem', 'damascus', 'tarsus'], featured: true,
  }),
  event('cornelius', 'Peter and Cornelius at Caesarea', 40, 'early-church', 'ministry', ['joppa', 'caesarea'], {
    dateLabel: 'c. AD 40', dateConfidence: 'estimated',
    scripture: ['Acts 10'],
    summary: 'A vision of unclean animals and a Roman centurion’s household baptised — the door opens to Gentiles.',
    route: ['lydda', 'joppa', 'caesarea'],
  }),
  event('antioch-church', 'The church at Antioch', 42, 'early-church', 'ministry', ['antioch-syria'], {
    dateLabel: 'c. AD 42', dateConfidence: 'estimated',
    scripture: ['Acts 11:19–26'],
    summary: 'A mixed Jewish and Gentile congregation in Rome’s third city, and the first place the disciples are called Christians.',
  }),
  event('paul-1', 'Paul’s first missionary journey', 46, 'early-church', 'migration',
    ['antioch-syria', 'salamis', 'paphos', 'antioch-pisidia', 'iconium', 'lystra', 'derbe'], {
    dateLabel: 'c. AD 46–48', dateConfidence: 'estimated',
    scripture: ['Acts 13–14'],
    summary: 'Barnabas and Paul sail to Cyprus, then inland across southern Asia Minor — acclaimed as gods at Lystra, then stoned there.',
    route: ROUTE_PAUL1, featured: true,
  }),
  event('jerusalem-council', 'The Council of Jerusalem', 49, 'early-church', 'covenant', ['jerusalem', 'antioch-syria'], {
    dateLabel: 'c. AD 49', dateConfidence: 'estimated',
    scripture: ['Acts 15', 'Galatians 2'],
    summary: 'The decisive question — whether Gentile believers must keep the law of Moses — is answered no.',
    featured: true,
  }),
  event('paul-2', 'Paul’s second journey: into Europe', 49, 'early-church', 'migration',
    ['troas', 'philippi', 'thessalonica', 'berea', 'athens', 'corinth'], {
    dateLabel: 'c. AD 49–52', dateConfidence: 'estimated',
    scripture: ['Acts 15:36–18:22'],
    summary: 'A vision at Troas turns the mission west. Lydia in Philippi, a riot in Thessalonica, the Areopagus in Athens, eighteen months in Corinth.',
    route: ROUTE_PAUL2, featured: true,
  }),
  event('gallio', 'Paul before Gallio at Corinth', 51, 'early-church', 'kingdom', ['corinth'], {
    dateLabel: 'AD 51–52', dateConfidence: 'anchored',
    scripture: ['Acts 18:12–17'],
    summary: 'Charges are brought and thrown out. An unremarkable hearing that happens to be the most useful date in the New Testament.',
    anchor: 'The Delphi inscription dates Gallio’s proconsulship to AD 51–52. This is the fixed point from which the whole of Pauline chronology is calculated.',
  }),
  event('paul-3', 'Paul’s third journey and the years at Ephesus', 53, 'early-church', 'migration',
    ['ephesus', 'troas', 'philippi', 'corinth', 'miletus', 'jerusalem'], {
    dateLabel: 'c. AD 53–57', dateConfidence: 'estimated',
    scripture: ['Acts 18:23–21:16'],
    summary: 'Nearly three years in Ephesus, a riot in the theatre of the silversmiths, and the letters to Corinth and Rome written along the way.',
    route: ROUTE_PAUL3,
  }),
  event('paul-arrest', 'Paul arrested in Jerusalem', 57, 'early-church', 'ministry', ['jerusalem', 'caesarea'], {
    dateLabel: 'c. AD 57', dateConfidence: 'estimated',
    scripture: ['Acts 21:27–23:35'],
    summary: 'Seized in the temple courts, rescued by Roman troops, and moved to Caesarea by night.',
  }),
  event('caesarea-prison', 'Two years’ custody at Caesarea', 57, 'early-church', 'ministry', ['caesarea'], {
    dateLabel: 'c. AD 57–59', dateConfidence: 'estimated',
    scripture: ['Acts 24–26'],
    summary: 'Hearings before Felix, Festus and Agrippa, ending with an appeal to Caesar that must be granted.',
  }),
  event('shipwreck', 'Shipwreck on Malta', 59, 'early-church', 'migration',
    ['caesarea', 'myra', 'fair-havens', 'malta'], {
    dateLabel: 'c. AD 59–60', dateConfidence: 'estimated',
    scripture: ['Acts 27–28:10'],
    summary: 'A late-season voyage runs into a north-easter and breaks up on Malta. All 276 aboard reach shore.',
    route: ROUTE_PAUL_ROME, featured: true,
    note: 'Acts 27 is one of the most detailed sailing narratives to survive from antiquity.',
  }),
  event('paul-rome', 'Paul under house arrest in Rome', 60, 'early-church', 'ministry', ['rome'], {
    dateLabel: 'c. AD 60–62', dateConfidence: 'estimated',
    scripture: ['Acts 28:11–31'],
    summary: 'Two years in rented lodgings, teaching without hindrance. Acts simply stops here, without saying how the trial ended.',
  }),
  event('nero-fire', 'The fire of Rome and Nero’s persecution', 64, 'early-church', 'kingdom', ['rome'], {
    dateLabel: 'AD 64', dateConfidence: 'anchored',
    scripture: ['Tacitus, Annals 15'],
    summary: 'After the fire, Christians in Rome are scapegoated and executed. Tradition places the deaths of Peter and Paul in this period.',
    anchor: 'Tacitus describes Nero blaming the Christians — the earliest hostile pagan account of the movement.',
  }),
  event('jewish-revolt', 'The First Jewish Revolt', 66, 'early-church', 'battle', ['caesarea', 'jerusalem', 'galilee-sea'], {
    dateLabel: 'AD 66–70', dateConfidence: 'anchored',
    scripture: ['Josephus, Jewish War'],
    summary: 'Revolt against Rome spreads from Caesarea and Jerusalem across the province.',
  }),
  event('temple-destroyed', 'The Temple destroyed', 70, 'early-church', 'temple', ['jerusalem', 'temple-mount', 'rome'], {
    dateLabel: 'AD 70', dateConfidence: 'anchored',
    scripture: ['Mark 13', 'Luke 21', 'Josephus, Jewish War 6'],
    summary: 'Titus takes Jerusalem and burns the temple. Sacrificial worship ends and does not resume; both Judaism and Christianity are reshaped by its absence.',
    featured: true,
    anchor: 'The Arch of Titus in Rome still shows the menorah being carried off.',
  }),
  event('masada-fall', 'The fall of Masada', 73, 'early-church', 'battle', ['masada'], {
    dateLabel: 'AD 73–74', dateConfidence: 'anchored',
    scripture: ['Josephus, Jewish War 7'],
    summary: 'The last stronghold of the revolt falls after a siege ramp is built against the cliff.',
  }),
  event('revelation', 'Revelation written on Patmos', 95, 'early-church', 'prophet',
    ['patmos', 'ephesus', 'smyrna', 'pergamum', 'thyatira', 'sardis', 'philadelphia', 'laodicea'], {
    dateLabel: 'c. AD 95', dateConfidence: 'traditional',
    scripture: ['Revelation 1–3'],
    summary: 'A vision received in exile on a small Aegean island, addressed first to seven churches on the mainland opposite.',
    route: ['patmos', 'ephesus', 'smyrna', 'pergamum', 'thyatira', 'sardis', 'philadelphia', 'laodicea'],
    note: 'Usually placed late in Domitian’s reign, c. AD 95, though some argue for the 60s.',
  }),
].sort((a, b) => a.year - b.year)

export const EVENT_BY_ID = Object.fromEntries(EVENTS.map((item) => [item.id, item]))

export const DATE_CONFIDENCE = {
  anchored: 'Historically anchored date',
  estimated: 'Approximate date',
  disputed: 'Chronology disputed',
  traditional: 'Traditional chronology',
  undated: 'No date in the text',
}
