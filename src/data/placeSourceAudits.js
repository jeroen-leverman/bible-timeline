const REVIEWED_ON = '2026-08-23'

const openBible = (id, slug, label) => ({
  sourceId: 'openbible-geocoding',
  role: 'geographic-identification',
  citation: `OpenBible.info ancient place ${id} — ${label}`,
  url: `https://www.openbible.info/geo/ancient/${id}/${slug}`,
  license: 'CC BY 4.0',
  verification: 'cited',
})

const pleiades = (id, label) => ({
  sourceId: 'pleiades',
  role: 'geographic-identification',
  citation: `Pleiades place ${id} — ${label}`,
  url: `https://pleiades.stoa.org/places/${id}`,
  license: 'CC BY 3.0',
  verification: 'cited',
})

const unesco = (id, label) => ({
  sourceId: 'unesco-world-heritage',
  role: 'historical-evidence',
  citation: `UNESCO World Heritage property ${id} — ${label}`,
  url: `https://whc.unesco.org/en/list/${id}`,
  license: 'Page text CC BY-SA 3.0 IGO; citation only',
  verification: 'cited',
})

const nationalPark = (slug, label) => ({
  sourceId: 'israel-nature-parks',
  role: 'historical-evidence',
  citation: `Israel Nature and Parks Authority — ${label}`,
  url: `https://en.parks.org.il/reserve-park/${slug}/`,
  license: 'Citation only; page rights retained by publisher',
  verification: 'cited',
})

const biblicalText = (citation) => ({
  sourceId: 'biblical-text',
  role: 'commentary',
  citation,
  verification: 'cited',
})

const reviewed = (...sourceRefs) => {
  const crossChecks = sourceRefs.slice(1).map(({ sourceId }) => ({
    pleiades: 'Pleiades',
    'unesco-world-heritage': 'UNESCO archaeological records',
    'israel-nature-parks': 'an official archaeological site record',
  })[sourceId]).filter(Boolean)
  const comparison = crossChecks.length
    ? ` Cross-checked with ${crossChecks.join(' and ')}.`
    : ' A second independent gazetteer or archaeological citation has not yet been attached.'
  return {
    reviewedOn: REVIEWED_ON,
    sourceReviewNote: `The marker uses the top-ranked ancient-place identification from OpenBible.info.${comparison}`,
    sourceRefs,
  }
}

const reviewedWithNote = (sourceReviewNote, ...sourceRefs) => ({
  ...reviewed(...sourceRefs),
  sourceReviewNote,
})

/**
 * First core-place audit batch.
 *
 * Names with several biblical referents are deliberately pinned to a specific
 * OpenBible record. Pleiades records are included only where the place match
 * was independently verified; a missing Pleiades entry is not treated as a
 * reason to force a match. UNESCO records corroborate the archaeological or
 * historical site but are not used as point-coordinate datasets.
 */
export const PLACE_SOURCE_AUDITS = {
  ur: reviewed(
    openBible('a6cf75c', 'ur-1', 'Ur 1 (Genesis 11:28)'),
    pleiades('912985', 'Ur(i)'),
    unesco('1481', 'The Ahwar of Southern Iraq (Ur component)'),
  ),
  haran: reviewed(
    openBible('a6d9af3', 'haran', 'Haran (Genesis 11:31)'),
    pleiades('658427', 'Harran/Carrhae'),
  ),
  babylon: reviewed(
    openBible('a217d18', 'babylon-1', 'Babylon 1, the Mesopotamian city'),
    unesco('278', 'Babylon'),
  ),
  nineveh: reviewed(
    openBible('a70fd5d', 'nineveh', 'Nineveh'),
    pleiades('874621', 'Nineveh/Ninos'),
  ),
  jerusalem: reviewed(
    openBible('a15257a', 'jerusalem', 'Jerusalem'),
    unesco('148', 'Old City of Jerusalem and its Walls'),
  ),
  bethlehem: reviewed(
    openBible('a112427', 'bethlehem-1', 'Bethlehem 1 (Bethlehem of Judah)'),
    unesco('1433', 'Birthplace of Jesus, Bethlehem'),
  ),
  hebron: reviewed(
    openBible('a85151a', 'hebron', 'Hebron'),
    pleiades('687915', 'Hebron'),
    unesco('1565', 'Hebron/Al-Khalil Old Town'),
  ),
  beersheba: {
    ...reviewed(
      openBible('a075d61', 'beersheba-2', 'Beersheba 2 (Genesis references)'),
      openBible('ad2f6c2', 'beersheba-1', 'Beersheba 1 (later biblical references)'),
      pleiades('687846', 'Beer Sheva/Berosaba'),
      unesco('1108', 'Biblical Tels — Beer Sheba component'),
    ),
    sourceReviewNote: 'OpenBible.info separates the Genesis and later biblical references, but both top-ranked identifications converge on Tel Beer Sheba. Pleiades and the UNESCO archaeological record corroborate the tell rather than the modern city centre.',
  },
  bethel: reviewed(
    openBible('a64f355', 'bethel-1', 'Bethel 1 (north of Jerusalem)'),
  ),
  shechem: reviewed(
    openBible('adf74d4', 'shechem', 'Shechem'),
    pleiades('678403', 'Sychem'),
  ),
  jericho: reviewed(
    openBible('a231f80', 'jericho-1', 'Jericho 1, the Old Testament settlement'),
    unesco('1687', 'Ancient Jericho/Tell es-Sultan'),
  ),
  nazareth: reviewed(
    openBible('af5884f', 'nazareth', 'Nazareth'),
  ),
  capernaum: reviewed(
    openBible('af2161c', 'capernaum', 'Capernaum'),
    pleiades('678231', 'Kefar Nahum/Kapharnaoum'),
  ),
  damascus: reviewed(
    openBible('a69c1d4', 'damascus', 'Damascus'),
    unesco('20', 'Ancient City of Damascus'),
  ),
  'antioch-syria': reviewed(
    openBible('ae41ab4', 'antioch-1', 'Antioch 1 (Antioch of Syria)'),
    pleiades('658381', 'Antiochia/Theoupolis'),
  ),
  ephesus: reviewed(
    openBible('a5feb15', 'ephesus', 'Ephesus'),
    unesco('1018', 'Ephesus'),
  ),
  corinth: reviewed(
    openBible('a6f437a', 'corinth', 'Corinth'),
    pleiades('570182', 'Corinthus/Korinthos'),
  ),
  rome: reviewed(
    openBible('afc8e7a', 'rome', 'Rome'),
    pleiades('423025', 'Roma'),
    unesco('91', 'Historic Centre of Rome'),
  ),
  tyre: reviewed(
    openBible('a160272', 'tyre', 'Tyre'),
    unesco('299', 'Tyre'),
  ),
  athens: reviewed(
    openBible('a1fe6e7', 'athens', 'Athens'),
    pleiades('579885', 'Athenae'),
    unesco('404', 'Acropolis, Athens'),
  ),

  // ---- Israel, Judah & neighboring anchor sites (batch 2) -------------
  'temple-mount': reviewedWithNote(
    'The temple platform is securely located. Connecting it with Genesis’s broader “land of Moriah” follows 2 Chronicles 3:1 and later interpretation; it is not a separately excavated identification of the binding of Isaac.',
    openBible('aac1fcf', 'mount-moriah', 'Mount Moriah (2 Chronicles 3:1)'),
    pleiades('973646718', 'Second Temple, Jerusalem'),
    unesco('148', 'Old City of Jerusalem and its Walls'),
    biblicalText('Genesis 22:2; 2 Chronicles 3:1'),
  ),
  shiloh: reviewedWithNote(
    'The marker follows OpenBible’s high-confidence Khirbet Seilun identification. Pleiades’ representative point for Silo is about 0.9 km east, so the two points are retained as a disclosed gazetteer difference.',
    openBible('aa4680a', 'shiloh', 'Shiloh'),
    pleiades('688028', 'Silo'),
  ),
  gibeon: reviewed(
    openBible('aede336', 'gibeon', 'Gibeon'),
    pleiades('687900', 'Gabaon'),
  ),
  lachish: reviewed(
    openBible('a3cc590', 'lachish', 'Lachish'),
    pleiades('687951', 'Lachish'),
  ),
  'en-gedi': reviewedWithNote(
    'OpenBible and Pleiades use different representative points within the En Gedi oasis. The marker uses Pleiades’ ancient Engaddai point and the official antiquities record rather than a modern reserve entrance.',
    pleiades('687893', 'Engaddai'),
    openBible('a51df0e', 'engedi', 'Engedi'),
    nationalPark('engedi', 'En Gedi Antiquities National Park'),
  ),
  masada: reviewedWithNote(
    'Masada is not named in the biblical text dataset. Its marker and AD 73 event are sourced from the archaeological gazetteer, UNESCO, and the official site authority.',
    pleiades('687968', 'Masada'),
    unesco('1040', 'Masada'),
    nationalPark('masada-national-park', 'Masada National Park'),
  ),
  bethany: reviewed(
    openBible('a4f35bc', 'bethany-1', 'Bethany 1 (near Jerusalem)'),
    pleiades('156668177', 'Bethania'),
  ),
  olives: reviewed(
    openBible('ac2c4c5', 'mount-of-olives', 'Mount of Olives'),
  ),
  nebo: reviewedWithNote(
    'OpenBible’s leading candidate is about 2.4 km east and has a lower identification score. The marker therefore uses Pleiades’ mountain representative point and retains the project’s traditional certainty label.',
    pleiades('563265622', 'Mount Nebo'),
    openBible('aefaa2d', 'mount-nebo', 'Mount Nebo'),
  ),
  rabbah: reviewed(
    openBible('ae067b5', 'rabbah-1', 'Rabbah 1 (Rabbah of the Ammonites)'),
    pleiades('697728', 'Amman/Philadelpheia'),
  ),
  'beth-shan': reviewed(
    openBible('a2a8df0', 'beth-shan', 'Beth-shan'),
    pleiades('678378', 'Scythopolis/Nysa'),
    nationalPark('bet-shean-national-park', 'Bet She’an National Park'),
  ),
  jezreel: reviewed(
    openBible('ae0bf4a', 'jezreel-2', 'Jezreel 2 (the northern city)'),
    pleiades('678197', 'Iezreel/Isdradela'),
  ),
  megiddo: reviewed(
    openBible('a8554e3', 'megiddo', 'Megiddo'),
    pleiades('26356565', 'Magidû'),
    unesco('1108', 'Biblical Tels — Megiddo component'),
    nationalPark('tel-megiddo-armageddon-national-park', 'Tel Megiddo National Park'),
  ),
  samaria: reviewedWithNote(
    'The marker identifies Omri’s city at Sebastia, not the wider region also called Samaria. Pleiades place 678370 is used for the city; the OpenBible-linked regional record is deliberately not substituted.',
    openBible('a041bb3', 'samaria-1', 'Samaria 1 (the city)'),
    pleiades('678370', 'Samaria/Sebaste'),
  ),
  hazor: reviewed(
    openBible('a6f33c5', 'hazor-1', 'Hazor 1 (the northern royal city)'),
    pleiades('779967430', 'Tel Hazor'),
    unesco('1108', 'Biblical Tels — Hazor component'),
    nationalPark('tel-hazor-national-park', 'Tel Hazor National Park'),
  ),
  dan: reviewedWithNote(
    'The marker follows OpenBible’s high-confidence Tel Dan point and the official archaeological site. Pleiades’ broader representative point lies about 1 km southwest.',
    openBible('a513646', 'dan', 'Dan'),
    pleiades('678109', 'Dan'),
    nationalPark('tel-dan-nature-reserve', 'Tel Dan Nature Reserve'),
  ),
  'caesarea-philippi': reviewed(
    openBible('ab7bf48', 'caesarea-philippi', 'Caesarea Philippi'),
    pleiades('678324', 'Paneas/Caesarea Philippi'),
  ),
  caesarea: reviewed(
    openBible('a58735e', 'caesarea', 'Caesarea (Maritima)'),
    pleiades('678401', 'Stratonos Pyrgos/Caesarea'),
    nationalPark('caesarea-national-park', 'Caesarea National Park'),
  ),
  gath: reviewed(
    openBible('a18873f', 'gath-1', 'Gath 1 (the Philistine city)'),
    pleiades('889522884', 'Gimtu/Gath at Tell es-Safi'),
  ),
  gaza: reviewedWithNote(
    'Ancient Gaza lies beneath and around the modern city, so both datasets provide representative rather than excavated point coordinates. The marker follows OpenBible; Pleiades’ city point is about 2.5 km northwest.',
    openBible('aa8edd2', 'gaza', 'Gaza'),
    pleiades('687902', 'Gaza'),
  ),
}
