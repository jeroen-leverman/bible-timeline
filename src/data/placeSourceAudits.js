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

const reviewed = (...sourceRefs) => {
  const crossChecks = sourceRefs.slice(1).map(({ sourceId }) => ({
    pleiades: 'Pleiades',
    'unesco-world-heritage': 'UNESCO archaeological records',
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
}
