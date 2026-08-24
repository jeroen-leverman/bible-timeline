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
  'hazor-burn': {
    reviewedOn: REVIEWED_ON,
    dateConfidence: 'disputed',
    anchor: 'Excavation at Hazor has exposed a violently burned Late Bronze Age palace and the destruction of the Canaanite city.',
    evidenceLimit: 'The destruction is real, but its precise date, agents, and relationship to Joshua or Judges remain disputed; archaeology cannot identify the attackers from the burn layer alone.',
    sourceRefs: [
      evidence('unesco-world-heritage', 'Biblical Tels dossier 1108: Hazor’s Late Bronze palace, successive destruction, and the controversy surrounding biblical attribution', 'https://whc.unesco.org/en/list/1108/'),
      chronology('The card displays both traditional and archaeological chronology because the excavated destruction does not settle the narrative date.'),
    ],
  },
  'megiddo-josiah': {
    reviewedOn: REVIEWED_ON,
    anchor: 'The Babylonian Fall of Nineveh Chronicle places an Egyptian army in the final Assyrian campaigns around Harran in 609 BC, matching the geopolitical setting of Neco’s northward march.',
    evidenceLimit: 'The chronicle supplies the campaign context and year but does not mention Josiah, his motive, or his death at Megiddo.',
    sourceRefs: [evidence('british-museum', 'Fall of Nineveh Chronicle, BM 21901: Egyptian support for Assyria in the campaigns ending in 609 BC', 'https://www.britishmuseum.org/collection/object/W_1896-0409-6')],
  },
  'daniel-taken': {
    reviewedOn: REVIEWED_ON,
    dateConfidence: 'estimated',
    anchor: 'The Nebuchadnezzar Chronicle fixes Babylon’s victory at Carchemish and subsequent western campaign in 605 BC.',
    evidenceLimit: 'It establishes the historical campaign setting, but it does not report a Jerusalem deportation in 605 BC or name Daniel.',
    sourceRefs: [
      evidence('british-museum', 'Nebuchadnezzar Chronicle, BM 21946: accession year and western campaigns beginning in 605 BC', 'https://www.britishmuseum.org/collection/object/W_1896-0409-51'),
      chronology('Daniel 1 is placed against Nebuchadnezzar’s 605 BC campaign; the chronicle does not independently date Daniel’s journey.'),
    ],
  },
  'jerusalem-falls': {
    reviewedOn: REVIEWED_ON,
    dateConfidence: 'disputed',
    anchor: 'The Lachish Letters come from Judah’s final military crisis, while destruction remains in Jerusalem and surrounding towns mark the Babylonian collapse of the kingdom.',
    evidenceLimit: 'The surviving Babylonian Chronicle ends before the final siege. Archaeology strongly supports destruction, but the choice between 587 and 586 BC depends on regnal-year counting.',
    sourceRefs: [
      evidence('british-museum', 'Lachish Ostraca, including BM 125702: Hebrew military correspondence from Judah’s final years', 'https://www.britishmuseum.org/collection/object/W_1959-0711-2'),
      chronology('The one-year difference reflects accession-year and non-accession-year systems; the event itself is not in doubt.'),
      commentary('british-museum', 'Lachish letters used as evidence for the final crisis in Judah, not as an eyewitness account of Jerusalem burning', 'https://www.britishmuseum.org/collection/object/W_1959-0711-2'),
    ],
  },
  'daniel-writing': {
    reviewedOn: REVIEWED_ON,
    anchor: 'A Nabonidus cylinder names Belshazzar as the king’s son, confirming a Babylonian royal figure absent from later Greek king lists.',
    evidenceLimit: 'The cylinder attests Belshazzar and his status as crown prince; it does not call him king, make Nebuchadnezzar his father, or verify the feast and handwriting episode.',
    sourceRefs: [evidence('british-museum', 'Nabonidus Cylinder, BM 91128: prayer for Nabonidus and Belshazzar his son', 'https://www.britishmuseum.org/collection/object/W_K-1692')],
  },
  'cyrus-decree': {
    reviewedOn: REVIEWED_ON,
    dateConfidence: 'estimated',
    anchor: 'The Cyrus Cylinder presents a Persian policy of restoring displaced cult images, temples, and communities after Babylon’s capture.',
    evidenceLimit: 'It makes the policy in Ezra historically plausible but does not mention Judah, Jerusalem, or reproduce Ezra’s decree.',
    sourceRefs: [
      evidence('british-museum', 'Cyrus Cylinder, BM 90920: conquest of Babylon and restoration policy', 'https://www.britishmuseum.org/collection/object/W_1880-0617-1941'),
      chronology('Placed immediately after the 539 BC conquest; the cylinder does not date a Judah-specific decree.'),
    ],
  },
  return: {
    reviewedOn: REVIEWED_ON,
    dateConfidence: 'estimated',
    anchor: 'Cyrus’s own Babylonian inscription describes restoration and return as features of his imperial settlement after 539 BC.',
    evidenceLimit: 'It supports the wider Persian policy environment, not Ezra’s number of returnees or the date and leadership of a particular Judean caravan.',
    sourceRefs: [
      evidence('british-museum', 'Cyrus Cylinder, BM 90920: restoration of cults and return of displaced peoples', 'https://www.britishmuseum.org/collection/object/W_1880-0617-1941'),
      chronology('The return is placed within the first years of Persian rule; its exact staging is reconstructed from Ezra.'),
      commentary('british-museum', 'The Cyrus Cylinder is comparative imperial evidence, not a Judah-specific decree', 'https://www.britishmuseum.org/collection/object/W_1880-0617-1941'),
    ],
  },
  'second-temple': {
    reviewedOn: REVIEWED_ON,
    dateConfidence: 'estimated',
    anchor: 'The later Elephantine correspondence addresses Jerusalem’s high priest and presumes an operating Jerusalem cult within the Persian period.',
    evidenceLimit: 'This is indirect evidence that the Jerusalem temple existed by the late fifth century BC; it does not date the building’s completion to 516 BC.',
    sourceRefs: [
      evidence('elephantine-project', 'Elephantine temple petition: correspondence with Jerusalem and Samaritan authorities in the Persian period', 'https://elephantine.smb.museum/objects/object.php?o=308133'),
      chronology('The sixth year of Darius in Ezra supplies the displayed date; the external correspondence is later context.'),
    ],
  },
  alexander: {
    reviewedOn: REVIEWED_ON,
    anchor: 'Coins and Egyptian monuments name Alexander as ruler, and securely date the Macedonian takeover of the eastern Mediterranean and Egypt to 332 BC.',
    evidenceLimit: 'These objects anchor Alexander’s rule and the regional transition; they do not verify later stories about a visit to Jerusalem.',
    sourceRefs: [evidence('met-museum', 'Block with cartouche of Alexander, 332–305 BC, Met 66.99.133', 'https://www.metmuseum.org/art/collection/search/551617')],
  },
  antiochus: {
    reviewedOn: REVIEWED_ON,
    anchor: 'Contemporary coinage securely attests Antiochus IV Epiphanes and his royal imagery during the Seleucid crisis described in 1 Maccabees.',
    evidenceLimit: 'The coin confirms the ruler and period, not the temple desecration; the narrative evidence comes principally from 1 Maccabees and later Josephus.',
    sourceRefs: [evidence('british-museum', 'Tetradrachm of Antiochus IV Epiphanes, British Museum RPK,p181A.10.AntIV', 'https://www.britishmuseum.org/collection/object/C_RPK-p181A-10-AntIV')],
  },
  maccabees: {
    reviewedOn: REVIEWED_ON,
    dateConfidence: 'estimated',
    anchor: 'Hasmonean coinage and later historical accounts attest the dynasty that emerged from the revolt narrated in 1 Maccabees.',
    evidenceLimit: 'Coins document the resulting Hasmonean state more directly than the revolt’s individual battles or the miracle later associated with Hanukkah.',
    sourceRefs: [
      evidence('british-museum', 'British Museum Hasmonean coin collection and ruler records', 'https://www.britishmuseum.org/collection/search?keyword=Hasmonean&view=grid'),
      chronology('The 167–164 BC range follows dated Seleucid and Maccabean history; individual stages are summarized.'),
    ],
  },
  pompey: {
    reviewedOn: REVIEWED_ON,
    anchor: 'Josephus gives a detailed ancient account of Pompey’s capture of Jerusalem and places it in Roman consular and Olympiad chronology.',
    evidenceLimit: 'Josephus wrote more than a century later and shaped the episode as Jewish history under Rome; he remains the main narrative source, not an independent contemporary inscription.',
    sourceRefs: [evidence('perseus', 'Josephus, Jewish Antiquities 14: Pompey’s capture of Jerusalem', 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0146%3Abook%3D14')],
  },
  herod: {
    reviewedOn: REVIEWED_ON,
    dateConfidence: 'estimated',
    anchor: 'Herodian masonry, gates, streets, and monumental buildings survive around the Temple Mount and across Jerusalem, demonstrating Herod’s enormous construction program.',
    evidenceLimit: 'The surviving platform and associated architecture attest the project, but the sanctuary itself was destroyed in AD 70 and the work continued after Herod’s death.',
    sourceRefs: [
      evidence('israel-museum', 'Herod the Great: archaeological finds and reconstructions from Herodian building projects', 'https://www.imj.org.il/en/exhibitions/herod-great'),
      chronology('Construction began around 20/19 BC under Herod and continued for decades; the displayed range is intentionally broad.'),
    ],
  },
  'john-preaching': {
    reviewedOn: REVIEWED_ON,
    dateConfidence: 'estimated',
    anchor: 'Luke locates John’s ministry within a network of independently known rulers: Tiberius, Pilate, Herod Antipas, Philip, and Lysanias.',
    evidenceLimit: 'External records confirm the administrative setting, not John’s preaching; translating Tiberius’s “fifteenth year” into AD 28 or 29 depends on counting conventions.',
    sourceRefs: [
      evidence('israel-museum', 'Pilate inscription from Caesarea: one independently attested official in Luke 3’s dating framework', 'https://www.imj.org.il/en/exhibitions/cradle-christianity'),
      chronology('The fifteenth year of Tiberius is normally converted to AD 28/29, with a one-year variation from regnal counting.'),
    ],
  },
  baptism: {
    reviewedOn: REVIEWED_ON,
    dateConfidence: 'estimated',
    anchor: 'The securely dated reign of Tiberius and Pilate’s Caesarea inscription provide the historical window in which Luke places John and Jesus.',
    evidenceLimit: 'They establish the governing context only; no surviving external record describes Jesus’s baptism.',
    sourceRefs: [
      evidence('israel-museum', 'Pilate inscription from Caesarea: Pontius Pilate’s office in Judea', 'https://www.imj.org.il/en/exhibitions/cradle-christianity'),
      chronology('Placed after the beginning of John’s ministry in Luke’s fifteenth year of Tiberius; the exact year remains approximate.'),
    ],
  },
  'claudius-famine': {
    reviewedOn: REVIEWED_ON,
    dateConfidence: 'estimated',
    anchor: 'Josephus independently describes a severe Judean famine under Claudius and Queen Helena’s purchase of imported food for Jerusalem.',
    evidenceLimit: 'Josephus supports a famine in the period described by Acts, but he does not mention Agabus’s prophecy or the Antioch relief collection.',
    sourceRefs: [
      evidence('perseus', 'Josephus, Jewish Antiquities 20.2: famine and Queen Helena’s relief for Jerusalem', 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0146%3Abook%3D20%3Awhiston+chapter%3D2'),
      chronology('Placed in the mid-40s AD within the procuratorships discussed by Josephus; the famine extended over more than one season.'),
    ],
  },
  'agrippa-death': {
    reviewedOn: REVIEWED_ON,
    anchor: 'Josephus independently reports Agrippa I being acclaimed as divine at Caesarea, suffering sudden abdominal illness, and dying five days later in AD 44.',
    evidenceLimit: 'Acts and Josephus agree on the setting, acclaim, and sudden death but differ in imagery and theological emphasis.',
    sourceRefs: [evidence('perseus', 'Josephus, Jewish Antiquities 19.343–350: Agrippa’s acclamation, illness, and death at Caesarea', 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0146%3Abook%3D19%3Asection%3D343')],
  },
  'nero-fire': {
    reviewedOn: REVIEWED_ON,
    anchor: 'Tacitus reports the fire of Rome and Nero’s punishment of Christians as scapegoats in AD 64.',
    evidenceLimit: 'Tacitus is a hostile Roman witness writing decades later; he does not name Peter or Paul or verify later martyrdom traditions.',
    sourceRefs: [evidence('perseus', 'Tacitus, Annals 15.44: Nero, the fire, and punishments of Christians', 'https://www.perseus.tufts.edu/hopper/text?doc=Tac.+Ann.+15.44')],
  },
  'jewish-revolt': {
    reviewedOn: REVIEWED_ON,
    anchor: 'Revolt coinage dated by year, Roman victory monuments, and destruction layers independently document the war of AD 66–70.',
    evidenceLimit: 'Coins express the rebels’ program and Josephus supplies the fullest narrative; neither should be treated as a neutral account of every faction or battle.',
    sourceRefs: [evidence('british-museum', 'First Jewish Revolt collection: dated coins minted in Jerusalem, AD 66–70', 'https://www.britishmuseum.org/collection/term/BIOG90751')],
  },
  'masada-fall': {
    reviewedOn: REVIEWED_ON,
    anchor: 'The Roman siege camps, circumvallation wall, assault ramp, breach, projectiles, and fortress remains survive around Masada.',
    evidenceLimit: 'Archaeology strongly confirms the siege and breach, but Josephus is the only source for the mass-suicide speeches and sequence inside the fortress.',
    sourceRefs: [evidence('israel-nature-parks', 'Masada National Park: surviving Roman camps, fortifications, ramp, and breach', 'https://en.parks.org.il/reserve-park/masada-national-park/')],
  },
}
