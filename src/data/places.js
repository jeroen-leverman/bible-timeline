/**
 * Gazetteer of biblical places.
 *
 * `certainty` is deliberately part of the data model, because a map flattens the
 * difference between "this tell has been excavated and is securely identified"
 * and "tradition puts it here". Values:
 *   secure   – site identified with broad agreement (usually an excavated tell)
 *   probable – widely accepted identification, some dissent
 *   disputed – serious rival candidates exist
 *   traditional – placement rests on later tradition, not evidence
 *   symbolic – no real-world location; positioned only so it can be drawn
 */

const P = (id, name, lat, lng, certainty, opts = {}) => ({
  id, name, lat, lng, certainty, ...opts,
})

export const PLACES = [
  // ---- Mesopotamia & the east -------------------------------------------
  P('ur', 'Ur of the Chaldees', 30.9626, 46.1030, 'secure', { modern: 'Tell el-Muqayyar, Iraq' }),
  P('haran', 'Haran', 36.8642, 39.0306, 'secure', { modern: 'Harran, Türkiye' }),
  P('babylon', 'Babylon', 32.5364, 44.4208, 'secure', { modern: 'Hillah, Iraq' }),
  P('nineveh', 'Nineveh', 36.3594, 43.1525, 'secure', { modern: 'Mosul, Iraq' }),
  P('asshur', 'Asshur', 35.4569, 43.2597, 'secure', { modern: 'Qal‘at Sharqat, Iraq' }),
  P('susa', 'Susa (Shushan)', 32.1897, 48.2575, 'secure', { modern: 'Shush, Iran' }),
  P('ecbatana', 'Ecbatana', 34.7981, 48.5147, 'secure', { modern: 'Hamadan, Iran' }),
  P('persepolis', 'Persepolis', 29.9356, 52.8917, 'secure', { modern: 'Fars, Iran' }),
  P('carchemish', 'Carchemish', 36.8300, 38.0100, 'secure', { modern: 'Karkamış, Türkiye' }),
  P('ararat', 'Mountains of Ararat', 39.7025, 44.2986, 'traditional', {
    modern: 'Mt. Ararat, Türkiye',
    note: 'Genesis says "the mountains of Ararat" — a region (Urartu), not a peak. ' +
          'The identification with the mountain now called Ararat is later tradition.',
  }),
  P('eden', 'Eden', 31.0000, 47.4000, 'symbolic', {
    note: 'Unlocated. Genesis names four rivers, two of them unidentified. Placed here ' +
          'only at the Tigris–Euphrates confluence, a common guess — not a finding.',
  }),
  P('shinar', 'Plain of Shinar (Babel)', 32.5364, 44.4208, 'traditional', {
    note: 'Shinar is southern Mesopotamia; the tower is traditionally linked to Babylon’s ziggurat.',
  }),

  // ---- Egypt & Sinai -----------------------------------------------------
  P('rameses', 'Rameses (Pi-Ramesses)', 30.7986, 31.8347, 'probable', { modern: 'Qantir, Egypt' }),
  P('goshen', 'Land of Goshen', 30.5500, 31.9000, 'probable', { modern: 'Wadi Tumilat, Egypt' }),
  P('succoth', 'Succoth', 30.5556, 32.0917, 'probable', { modern: 'Tell el-Maskhuta, Egypt' }),
  P('pithom', 'Pithom', 30.5500, 32.1000, 'disputed', { modern: 'Eastern Nile Delta' }),
  P('memphis', 'Memphis', 29.8444, 31.2506, 'secure', { modern: 'Mit Rahina, Egypt' }),
  P('thebes-eg', 'Thebes (No-Amon)', 25.6872, 32.6396, 'secure', { modern: 'Luxor, Egypt' }),
  P('alexandria', 'Alexandria', 31.2001, 29.9187, 'secure', { modern: 'Alexandria, Egypt' }),
  P('red-sea-crossing', 'Sea crossing', 30.1500, 32.5500, 'disputed', {
    note: 'The Hebrew reads yam suph, "Sea of Reeds". Candidates range from Delta lakes ' +
          'to the Gulf of Suez to the Gulf of Aqaba. Shown at one common Delta candidate.',
  }),
  P('marah', 'Marah', 29.8500, 32.7500, 'disputed'),
  P('elim', 'Elim', 29.2000, 33.0000, 'disputed'),
  P('rephidim', 'Rephidim', 28.7200, 33.7500, 'disputed'),
  P('sinai', 'Mount Sinai (Horeb)', 28.5392, 33.9750, 'traditional', {
    modern: 'Jebel Musa, Egypt',
    note: 'The traditional peak, fixed by Byzantine monasticism. Jebel al-Lawz, Har Karkom ' +
          'and several Negev peaks have all been proposed instead.',
  }),
  P('kadesh-barnea', 'Kadesh Barnea', 30.6833, 34.4500, 'probable', { modern: 'Ain el-Qudeirat' }),
  P('ezion-geber', 'Ezion Geber', 29.5333, 35.0000, 'probable', { modern: 'Aqaba / Eilat' }),
  P('mount-hor', 'Mount Hor', 30.3167, 35.4067, 'traditional'),

  // ---- Canaan: highlands & Judah ----------------------------------------
  P('jerusalem', 'Jerusalem', 31.7683, 35.2137, 'secure'),
  P('temple-mount', 'Temple Mount (Moriah)', 31.7780, 35.2354, 'secure'),
  P('bethlehem', 'Bethlehem', 31.7054, 35.2024, 'secure'),
  P('hebron', 'Hebron', 31.5326, 35.0998, 'secure'),
  P('beersheba', 'Beersheba', 31.2518, 34.7913, 'secure'),
  P('bethel', 'Bethel', 31.9275, 35.2333, 'probable', { modern: 'Beitin' }),
  P('ai', 'Ai', 31.9167, 35.2611, 'disputed', { modern: 'et-Tell' }),
  P('shechem', 'Shechem', 32.2137, 35.2833, 'secure', { modern: 'Tell Balata, Nablus' }),
  P('shiloh', 'Shiloh', 32.0556, 35.2894, 'secure', { modern: 'Khirbet Seilun' }),
  P('gerizim', 'Mount Gerizim', 32.2000, 35.2733, 'secure'),
  P('ebal', 'Mount Ebal', 32.2333, 35.2833, 'secure'),
  P('gibeon', 'Gibeon', 31.8464, 35.1847, 'secure', { modern: 'el-Jib' }),
  P('gibeah', 'Gibeah', 31.8236, 35.2311, 'probable', { modern: 'Tell el-Ful' }),
  P('mizpah', 'Mizpah', 31.8900, 35.1800, 'disputed' ),
  P('ramah', 'Ramah', 31.8500, 35.2333, 'probable' ),
  P('nob', 'Nob', 31.7900, 35.2400, 'disputed'),
  P('lachish', 'Lachish', 31.5650, 34.8494, 'secure', { modern: 'Tel Lachish' }),
  P('elah', 'Valley of Elah', 31.6900, 34.9700, 'secure'),
  P('adullam', 'Adullam', 31.6500, 34.9800, 'probable'),
  P('en-gedi', 'En Gedi', 31.4614, 35.3925, 'secure'),
  P('ziklag', 'Ziklag', 31.4000, 34.7000, 'disputed'),
  P('qumran', 'Qumran', 31.7411, 35.4589, 'secure'),
  P('masada', 'Masada', 31.3156, 35.3536, 'secure'),
  P('bethany', 'Bethany', 31.7714, 35.2622, 'probable', { modern: 'al-Eizariya' }),
  P('olives', 'Mount of Olives', 31.7784, 35.2456, 'secure'),
  P('gethsemane', 'Gethsemane', 31.7794, 35.2397, 'traditional'),
  P('golgotha', 'Golgotha', 31.7784, 35.2298, 'traditional', {
    note: 'Traditional site under the Church of the Holy Sepulchre. Well-argued, but ' +
          'resting on 4th-century identification.',
  }),
  P('emmaus', 'Emmaus', 31.8394, 34.9894, 'disputed', {
    note: 'Luke gives a distance, not a location. Four rival sites; Nicopolis shown here.',
  }),

  // ---- Canaan: Jordan valley, north & coast ------------------------------
  P('jericho', 'Jericho', 31.8711, 35.4436, 'secure', { modern: 'Tell es-Sultan' }),
  P('gilgal', 'Gilgal', 31.8700, 35.5100, 'disputed'),
  P('jordan-crossing', 'Jordan crossing / Bethany beyond the Jordan', 31.8372, 35.5450, 'probable', {
    modern: 'Al-Maghtas, Jordan',
  }),
  P('nebo', 'Mount Nebo', 31.7683, 35.7250, 'traditional'),
  P('moab-plains', 'Plains of Moab', 31.8300, 35.6000, 'probable'),
  P('sodom', 'Sodom & Gomorrah', 31.2500, 35.5000, 'disputed', {
    note: 'Unlocated. Bab edh-Dhra and Tall el-Hammam are the leading candidates; ' +
          'neither is settled. Placed near the southern Dead Sea.',
  }),
  P('penuel', 'Penuel', 32.1900, 35.6800, 'probable'),
  P('mahanaim', 'Mahanaim', 32.2200, 35.6700, 'disputed'),
  P('jabesh-gilead', 'Jabesh Gilead', 32.4400, 35.6800, 'disputed'),
  P('rabbah', 'Rabbah of the Ammonites', 31.9539, 35.9106, 'secure', { modern: 'Amman, Jordan' }),
  P('petra', 'Sela / Petra (Edom)', 30.3285, 35.4444, 'secure', { modern: 'Petra, Jordan' }),
  P('beth-shan', 'Beth Shan', 32.5031, 35.5031, 'secure' ),
  P('jezreel', 'Jezreel', 32.5556, 35.3306, 'secure'),
  P('gilboa', 'Mount Gilboa', 32.5000, 35.4000, 'secure'),
  P('endor', 'Endor', 32.6300, 35.4200, 'probable'),
  P('megiddo', 'Megiddo', 32.5847, 35.1839, 'secure'),
  P('carmel', 'Mount Carmel', 32.7333, 35.0500, 'secure'),
  P('samaria', 'Samaria', 32.2800, 35.1950, 'secure', { modern: 'Sebastia' }),
  P('sychar', 'Sychar (Jacob’s Well)', 32.2100, 35.2800, 'probable'),
  P('dothan', 'Dothan', 32.4067, 35.1919, 'secure'),
  P('hazor', 'Hazor', 33.0175, 35.5686, 'secure'),
  P('dan', 'Dan', 33.2486, 35.6522, 'secure', { modern: 'Tel Dan' }),
  P('hermon', 'Mount Hermon', 33.4162, 35.8571, 'secure'),
  P('caesarea-philippi', 'Caesarea Philippi', 33.2481, 35.6944, 'secure', { modern: 'Banias' }),
  P('nazareth', 'Nazareth', 32.6996, 35.3035, 'secure'),
  P('cana', 'Cana', 32.7458, 35.3417, 'disputed'),
  P('nain', 'Nain', 32.6300, 35.3400, 'probable'),
  P('capernaum', 'Capernaum', 32.8808, 35.5750, 'secure'),
  P('bethsaida', 'Bethsaida', 32.9100, 35.6300, 'disputed'),
  P('magdala', 'Magdala', 32.8244, 35.5158, 'secure'),
  P('tiberias', 'Tiberias', 32.7922, 35.5312, 'secure'),
  P('galilee-sea', 'Sea of Galilee', 32.8000, 35.5900, 'secure'),
  P('gadara', 'Gadara', 32.6528, 35.6844, 'secure', { modern: 'Umm Qais, Jordan' }),
  P('joppa', 'Joppa', 32.0500, 34.7500, 'secure', { modern: 'Jaffa' }),
  P('lydda', 'Lydda', 31.9500, 34.8900, 'secure', { modern: 'Lod' }),
  P('aphek', 'Aphek / Ebenezer', 32.1042, 34.9333, 'secure' ),
  P('caesarea', 'Caesarea Maritima', 32.5000, 34.8917, 'secure'),
  P('gaza', 'Gaza', 31.5017, 34.4668, 'secure'),
  P('ashkelon', 'Ashkelon', 31.6667, 34.5500, 'secure'),
  P('ashdod', 'Ashdod', 31.8000, 34.6500, 'secure'),
  P('ekron', 'Ekron', 31.7783, 34.8514, 'secure', { modern: 'Tel Miqne' }),
  P('gath', 'Gath', 31.6997, 34.8472, 'probable', { modern: 'Tell es-Safi' }),

  // ---- Syria, Phoenicia, Arabia -----------------------------------------
  P('damascus', 'Damascus', 33.5138, 36.2765, 'secure'),
  P('riblah', 'Riblah', 34.4500, 36.5300, 'probable'),
  P('tyre', 'Tyre', 33.2705, 35.2038, 'secure'),
  P('sidon', 'Sidon', 33.5606, 35.3758, 'secure'),
  P('zarephath', 'Zarephath', 33.4600, 35.2900, 'probable'),
  P('sheba', 'Sheba', 15.4200, 45.3300, 'probable', { modern: 'Marib, Yemen' }),

  // ---- Asia Minor & the Aegean -------------------------------------------
  P('antioch-syria', 'Antioch on the Orontes', 36.2021, 36.1604, 'secure', { modern: 'Antakya, Türkiye' }),
  P('seleucia', 'Seleucia Pieria', 36.1200, 35.9300, 'secure'),
  P('tarsus', 'Tarsus', 36.9177, 34.8956, 'secure'),
  P('salamis', 'Salamis (Cyprus)', 35.1833, 33.9000, 'secure'),
  P('paphos', 'Paphos', 34.7571, 32.4067, 'secure'),
  P('perga', 'Perga', 36.9611, 30.8536, 'secure'),
  P('attalia', 'Attalia', 36.8969, 30.7133, 'secure', { modern: 'Antalya' }),
  P('antioch-pisidia', 'Antioch in Pisidia', 38.3050, 31.1900, 'secure', { modern: 'Yalvaç' }),
  P('iconium', 'Iconium', 37.8746, 32.4932, 'secure', { modern: 'Konya' }),
  P('lystra', 'Lystra', 37.5800, 32.4500, 'secure'),
  P('derbe', 'Derbe', 37.3500, 33.4500, 'probable'),
  P('troas', 'Troas', 39.7500, 26.1600, 'secure'),
  P('assos', 'Assos', 39.4900, 26.3400, 'secure'),
  P('ephesus', 'Ephesus', 37.9397, 27.3417, 'secure'),
  P('miletus', 'Miletus', 37.5300, 27.2775, 'secure'),
  P('smyrna', 'Smyrna', 38.4192, 27.1287, 'secure', { modern: 'İzmir' }),
  P('pergamum', 'Pergamum', 39.1319, 27.1839, 'secure'),
  P('thyatira', 'Thyatira', 38.9186, 27.8408, 'secure', { modern: 'Akhisar' }),
  P('sardis', 'Sardis', 38.4886, 28.0400, 'secure'),
  P('philadelphia', 'Philadelphia', 38.3500, 28.5167, 'secure', { modern: 'Alaşehir' }),
  P('laodicea', 'Laodicea', 37.8358, 29.1078, 'secure'),
  P('colossae', 'Colossae', 37.7900, 29.2600, 'secure'),
  P('patmos', 'Patmos', 37.3089, 26.5475, 'secure'),
  P('rhodes', 'Rhodes', 36.4400, 28.2200, 'secure'),
  P('myra', 'Myra', 36.2589, 29.9853, 'secure'),

  // ---- Greece, Italy, the west -------------------------------------------
  P('philippi', 'Philippi', 41.0136, 24.2864, 'secure'),
  P('thessalonica', 'Thessalonica', 40.6401, 22.9444, 'secure'),
  P('berea', 'Berea', 40.5236, 22.2028, 'secure', { modern: 'Veria' }),
  P('athens', 'Athens', 37.9838, 23.7275, 'secure'),
  P('corinth', 'Corinth', 37.9060, 22.8781, 'secure'),
  P('cenchreae', 'Cenchreae', 37.8869, 22.9878, 'secure'),
  P('nicopolis', 'Nicopolis', 39.0100, 20.7300, 'secure'),
  P('fair-havens', 'Fair Havens (Crete)', 34.9400, 24.8100, 'probable'),
  P('malta', 'Malta', 35.9375, 14.3754, 'secure'),
  P('syracuse', 'Syracuse', 37.0755, 15.2866, 'secure'),
  P('puteoli', 'Puteoli', 40.8250, 14.1200, 'secure', { modern: 'Pozzuoli' }),
  P('rome', 'Rome', 41.9028, 12.4964, 'secure'),
  P('tarshish', 'Tarshish', 36.9000, -6.3500, 'disputed', {
    note: 'Unidentified. Tartessos in southern Spain is the usual guess — the point ' +
          'in Jonah is that it is as far from Nineveh as a ship could go.',
  }),
]

export const PLACE_BY_ID = Object.fromEntries(PLACES.map((p) => [p.id, p]))

export const CERTAINTY_LABEL = {
  secure: 'Securely identified',
  probable: 'Probable identification',
  disputed: 'Disputed location',
  traditional: 'Traditional site',
  symbolic: 'No known location',
}
