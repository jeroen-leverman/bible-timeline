const REVIEWED_ON = '2026-08-24'

const evidence = (sourceId, citation, url) => ({
  sourceId,
  role: 'historical-evidence',
  citation,
  url,
  verification: 'cited',
})

const chronology = (citation) => ({
  sourceId: 'editorial-research',
  role: 'chronology',
  citation,
  verification: 'method-disclosed',
})

const commentary = (sourceId, citation, url) => ({
  sourceId,
  role: 'commentary',
  citation,
  url,
  verification: 'cited',
})

// First evidence-review batch. These records distinguish what an object or text
// actually attests from the wider biblical narrative associated with it.
export const EVENT_SOURCE_AUDITS = {
  exodus: {
    reviewedOn: REVIEWED_ON,
    anchor: 'The Merneptah Stele, usually dated about 1208 BC, names Israel as a people already in Canaan.',
    evidenceLimit: 'It provides a latest possible boundary for an Exodus tradition; it does not describe or independently prove the Exodus.',
    sourceRefs: [
      evidence('ucl-digital-egypt', 'Merneptah victory stele, Cairo CG 34025: the hieroglyphic list includes Israel', 'https://www.ucl.ac.uk/museums-static/digitalegypt/thebes/merenptah/stela.html'),
      chronology('The page displays the two principal chronology models; the evidence review does not choose between them.'),
      commentary('ucl-digital-egypt', 'Merneptah Stele used only as a terminus ante quem for Israel in Canaan', 'https://www.ucl.ac.uk/museums-static/digitalegypt/thebes/merenptah/stela.html'),
    ],
  },
  'david-king-israel': {
    reviewedOn: REVIEWED_ON,
    anchor: 'The ninth-century BC Tel Dan Stele refers to a Judahite royal dynasty as the “House of David,” the earliest known extrabiblical use of that dynastic name.',
    evidenceLimit: 'The fragment supports the existence of a dynasty bearing David’s name, not the date, scale, or individual episodes of David’s reign.',
    sourceRefs: [
      evidence('jewish-museum', 'Tel Dan Stele, ninth century BC; “House of David” inscription', 'https://thejewishmuseum.org/exhibitions/tel-dan-stele/'),
      chronology('The displayed accession date is a conventional reconstruction from the biblical regnal sequence, not a date supplied by the stele.'),
    ],
  },
  shishak: {
    reviewedOn: REVIEWED_ON,
    anchor: 'Shoshenq I’s Bubastite Portal at Karnak records a campaign in the southern Levant through a surviving list of place names.',
    evidenceLimit: 'The campaign is a strong Egyptian synchronism, but Jerusalem is not named in the surviving list and the relief does not confirm the reported temple plunder.',
    sourceRefs: [evidence('digital-karnak', 'Bubastite Portal of Shoshenq I: campaign relief and 156 name rings', 'https://digitalkarnak.ucsc.edu/bubastite-portal/')],
  },
  'omri-samaria': {
    reviewedOn: REVIEWED_ON,
    anchor: 'Assyrian royal texts continued to call the northern kingdom the “House of Omri” after Omri’s dynasty had ended.',
    evidenceLimit: 'The Assyrian label demonstrates Omri’s dynastic importance; it does not date the purchase or construction of Samaria.',
    sourceRefs: [
      evidence('british-museum', 'Black Obelisk, BM 118885: tribute of the “House of Omri” in the Jehu panel', 'https://www.britishmuseum.org/collection/object/W_1848-1104-1'),
      chronology('The foundation date is reconstructed from the biblical regnal sequence; the Assyrian label supplies context, not the year.'),
    ],
  },
  qarqar: {
    reviewedOn: REVIEWED_ON,
    anchor: 'Shalmaneser III’s Kurkh Monolith names “Ahab the Israelite” among the coalition at Qarqar and claims that he fielded 2,000 chariots and 10,000 troops.',
    evidenceLimit: 'The inscription anchors Ahab in the 853 BC campaign, but its numbers and victory language belong to an Assyrian royal boast.',
    sourceRefs: [evidence('oracc', 'Kurkh Monolith inscription A.0.102.2, lines 91–102: coalition at Qarqar and Ahab the Israelite', 'https://oracc.museum.upenn.edu/riao/ria5/Q004607')],
  },
  'mesha-revolt': {
    reviewedOn: REVIEWED_ON,
    anchor: 'Mesha’s victory stele describes Moab recovering territories from Israel and names Omri and his dynasty; 2 Kings also remembers a Moabite revolt.',
    evidenceLimit: 'The stele corroborates conflict between Moab and Omri’s dynasty, not every episode or outcome in 2 Kings 3; the two accounts speak from opposing perspectives.',
    sourceRefs: [
      evidence('louvre-collections', 'Mesha Stele, Louvre AO 5066: ninth-century Moabite royal inscription', 'https://collections.louvre.fr/en/ark:/53355/cl010120339'),
      chronology('Placed approximately within Mesha’s reign; the artifact page dates the monument within the ninth century BC rather than to this exact year.'),
    ],
  },
  jehu: {
    reviewedOn: REVIEWED_ON,
    anchor: 'The Black Obelisk records tribute from Jehu, or his envoy, to Shalmaneser III in 841 BC and depicts the tribute scene.',
    evidenceLimit: 'It anchors Jehu and Israel’s submission to Assyria; it does not independently confirm Jehu’s purge.',
    sourceRefs: [evidence('british-museum', 'Black Obelisk, BM 118885: tribute from biblical King Jehu, 841 BC', 'https://www.britishmuseum.org/collection/object/W_1848-1104-1')],
  },
  'samaria-falls': {
    reviewedOn: REVIEWED_ON,
    anchor: 'An inscription of Sargon II claims that he conquered Samaria, deported 27,290 inhabitants, and took fifty chariots.',
    evidenceLimit: 'This is Assyrian royal propaganda, and the division of credit between Shalmaneser V and Sargon II remains debated; manuscript copies also vary in the deportee total.',
    sourceRefs: [evidence('oracc', 'Sargon II inscription, lines 23–25: conquest of Samaria and deportation claim', 'https://oracc.museum.upenn.edu/rinap/rinap2/Q006488')],
  },
  'hezekiah-tunnel': {
    reviewedOn: REVIEWED_ON,
    dateConfidence: 'estimated',
    anchor: 'The Siloam Inscription describes two tunnelling teams meeting and water flowing through the completed channel.',
    evidenceLimit: 'Its late-eighth-century script fits Hezekiah’s period, but the inscription does not name Hezekiah or state why the tunnel was cut.',
    sourceRefs: [
      evidence('michigan-image-database', 'Siloam Inscription: description, translation, and late-eighth-century palaeographic date', 'https://image-database.nes.lsa.umich.edu/items/show/86'),
      chronology('Placed shortly before the 701 BC Assyrian campaign; the inscription supplies only a late-eighth-century palaeographic range.'),
    ],
  },
  sennacherib: {
    reviewedOn: REVIEWED_ON,
    anchor: 'Sennacherib’s prism recounts the 701 BC campaign in Judah, names Hezekiah, and records tribute after Jerusalem was contained but not claimed as captured.',
    evidenceLimit: 'The prism is the Assyrian king’s presentation of the campaign; its silence about taking Jerusalem is significant but does not establish the biblical explanation for his withdrawal.',
    sourceRefs: [evidence('british-museum', 'Taylor Prism, BM 91032: Sennacherib’s campaign and tribute from Hezekiah, 701 BC', 'https://www.britishmuseum.org/collection/object/W_1855-1003-1')],
  },
  lachish: {
    reviewedOn: REVIEWED_ON,
    anchor: 'Palace reliefs from Nineveh depict Assyria’s assault on Lachish with siege engines, a ramp, captives, and deportees.',
    evidenceLimit: 'The reliefs strongly attest the Assyrian capture of Lachish, but they are an imperial commemoration rather than a neutral battle report.',
    sourceRefs: [evidence('british-museum', 'Lachish relief, BM 124906: assault, siege engines, ramp, captives and deportees', 'https://www.britishmuseum.org/collection/object/W_1856-0909-14_2')],
  },
  'nineveh-falls': {
    reviewedOn: REVIEWED_ON,
    anchor: 'The Babylonian Fall of Nineveh Chronicle records the campaigns of 616–609 BC and the capture of Nineveh in 612 BC.',
    evidenceLimit: 'The chronicle anchors the city’s fall; it does not verify the prophetic speeches or theological interpretation attached to Nineveh.',
    sourceRefs: [evidence('british-museum', 'Fall of Nineveh Chronicle, BM 21901: campaigns of 616–609 BC', 'https://www.britishmuseum.org/collection/object/W_1896-0409-6')],
  },
  carchemish: {
    reviewedOn: REVIEWED_ON,
    anchor: 'The Nebuchadnezzar Chronicle records Babylon’s defeat of the Egyptian army at Carchemish in 605 BC.',
    evidenceLimit: 'The chronicle anchors the campaign and succession, but it does not supply every movement or biblical interpretation associated with the battle.',
    sourceRefs: [evidence('british-museum', 'Nebuchadnezzar Chronicle, BM 21946: campaigns of 605–594 BC', 'https://www.britishmuseum.org/collection/object/W_1896-0409-51')],
  },
  'first-deportation': {
    reviewedOn: REVIEWED_ON,
    anchor: 'The Nebuchadnezzar Chronicle records the Babylonian campaign against Jerusalem and the installation of a new king in 597 BC.',
    evidenceLimit: 'It anchors the first capture of Jerusalem; the tablet’s summary does not reproduce the biblical lists of deportees or their individual stories.',
    sourceRefs: [evidence('british-museum', 'Nebuchadnezzar Chronicle, BM 21946: first Babylonian campaign against Jerusalem in 597 BC', 'https://www.britishmuseum.org/collection/object/W_1896-0409-51')],
  },
  'babylon-falls': {
    reviewedOn: REVIEWED_ON,
    anchor: 'The Nabonidus Chronicle records Babylon’s capture in 539 BC; the Cyrus Cylinder presents Cyrus’s restoration of cults and displaced communities.',
    evidenceLimit: 'The Cylinder describes a wider imperial policy and does not name Judah or Jerusalem, so it should not be treated as a copy of the decree in Ezra.',
    sourceRefs: [
      evidence('british-museum', 'Nabonidus Chronicle, BM 35382: final years of Nabonidus and Persian conquest', 'https://www.britishmuseum.org/collection/object/W_Sp-II-964'),
      evidence('british-museum', 'Cyrus Cylinder, BM 90920: conquest of Babylon and restoration policy', 'https://www.britishmuseum.org/collection/object/W_1880-0617-1941'),
    ],
  },
  'nehemiah-opposition': {
    reviewedOn: REVIEWED_ON,
    dateConfidence: 'estimated',
    anchor: 'An Elephantine petition names Delaiah and Shelemiah as sons of Sanballat, governor of Samaria.',
    evidenceLimit: 'The papyrus attests the Samaritan governor’s family and title near Nehemiah’s period; it does not independently verify each episode of opposition in Nehemiah.',
    sourceRefs: [
      evidence('elephantine-project', 'Petition concerning the Jewish temple at Elephantine: Sanballat’s sons and title', 'https://elephantine.smb.museum/objects/object.php?o=308133'),
      chronology('The displayed year follows the conventional dating of Nehemiah’s first term; the later Elephantine letter supplies family and office context, not the event date.'),
    ],
  },
  'john-death': {
    reviewedOn: REVIEWED_ON,
    anchor: 'Josephus independently reports that Herod Antipas imprisoned and executed John and connects the episode with Machaerus.',
    evidenceLimit: 'Josephus confirms the execution but gives a political motive and framing different from the Gospel narrative.',
    sourceRefs: [
      evidence('perseus', 'Josephus, Jewish Antiquities 18.5.2: John the Baptist, Herod Antipas, and Machaerus', 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0146%3Abook%3D18%3Awhiston+chapter%3D5'),
      chronology('Placed approximately within the Gospel ministry sequence; Josephus does not supply the displayed year.'),
    ],
  },
  crucifixion: {
    reviewedOn: REVIEWED_ON,
    anchor: 'The Caesarea inscription attests Pontius Pilate’s office in Judea, while Tacitus later reports that Christus was executed under Tiberius by Pilate.',
    evidenceLimit: 'These sources support the Roman setting and execution under Pilate; they do not decide between AD 30 and AD 33 or verify the Gospel trial details.',
    sourceRefs: [
      evidence('israel-museum', 'Pilate inscription from Caesarea: dedicatory inscription bearing Pontius Pilate’s name', 'https://www.imj.org.il/en/exhibitions/cradle-christianity'),
      evidence('perseus', 'Tacitus, Annals 15.44: Christus executed under Tiberius by Pontius Pilate', 'https://www.perseus.tufts.edu/hopper/text?doc=Tac.+Ann.+15.44'),
      chronology('The two candidate dates are an editorial synthesis of Gospel chronology and reconstructed Passover calendars; neither external source chooses one.'),
      commentary('perseus', 'Tacitus is a Roman literary witness written decades after the event', 'https://www.perseus.tufts.edu/hopper/text?doc=Tac.+Ann.+15.44'),
    ],
  },
  gallio: {
    reviewedOn: REVIEWED_ON,
    anchor: 'Claudius’s Delphi inscription names Gallio as proconsul of Achaia, anchoring his office around AD 51–52 and therefore Paul’s stay at Corinth.',
    evidenceLimit: 'It fixes Gallio’s administrative window, not every date in Paul’s itinerary or the details of the hearing in Acts.',
    sourceRefs: [evidence('phi-inscriptions', 'Delphi inscription FD III 4:286: Claudius names Gallio as friend and proconsul', 'https://epigraphy.packhum.org/text/240470')],
  },
  'temple-destroyed': {
    reviewedOn: REVIEWED_ON,
    anchor: 'The Arch of Titus commemorates Rome’s victory in the war of AD 70; its relief shows temple spoils including the menorah being carried in triumph.',
    evidenceLimit: 'The monument is later Roman commemoration of victory and spoils, not an eyewitness image of the Temple’s destruction.',
    sourceRefs: [evidence('parco-colosseo', 'Arch of Titus: Flavian victory monument and relief of spoils from the Jerusalem Temple', 'https://colosseo.it/en/marvels/arch-of-titus/')],
  },
}
