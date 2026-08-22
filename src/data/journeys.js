/**
 * Journeys drawn as routes on the map.
 *
 * Routes are schematic. Ancient travellers followed roads, passes and coastlines,
 * not straight lines, and for the wilderness itinerary the stations themselves are
 * disputed. `confidence` says how much weight the line will bear.
 */

const J = (id, name, era, confidence, stops, opts = {}) => ({
  id, name, era, confidence, stops, ...opts,
})

export const JOURNEYS = [
  J('abraham', 'Abraham’s migration', 'patriarchs', 'schematic',
    ['ur', 'haran', 'shechem', 'bethel', 'beersheba', 'memphis', 'bethel', 'hebron'],
    {
      ref: 'Genesis 11:31–13:18',
      color: '#b3763a',
      blurb:
        'Ur to Haran, then south into Canaan, down to Egypt in a famine and back again ' +
        'to settle at Hebron. Roughly 1,500 miles by the practicable route, which follows ' +
        'the Euphrates rather than crossing the Syrian desert.',
    }),

  J('joseph', 'Joseph taken to Egypt', 'patriarchs', 'schematic',
    ['dothan', 'goshen', 'memphis'],
    { ref: 'Genesis 37–41', color: '#8a6d3b', blurb: 'Sold to a caravan at Dothan and carried down the coastal road into Egypt.' }),

  J('exodus', 'The Exodus and wilderness years', 'egypt-exodus', 'disputed',
    ['rameses', 'succoth', 'red-sea-crossing', 'marah', 'elim', 'rephidim', 'sinai',
     'kadesh-barnea', 'mount-hor', 'moab-plains', 'nebo'],
    {
      ref: 'Exodus 12–19; Numbers 33',
      color: '#c8553d',
      blurb:
        'The southern route, following the traditional Mount Sinai. Numbers 33 lists ' +
        'forty-two stations; most cannot be identified, and northern and Arabian routes ' +
        'have both been argued. Treat this line as one reading, not a survey.',
    }),

  J('conquest', 'Joshua’s campaigns', 'conquest-judges', 'schematic',
    ['jordan-crossing', 'jericho', 'ai', 'gibeon', 'lachish', 'hazor', 'shechem'],
    {
      ref: 'Joshua 3–11',
      color: '#a08a3c',
      blurb: 'A central thrust from the Jordan, then a southern campaign and a northern one.',
    }),

  J('exile', 'The road into exile', 'exile-return', 'probable',
    ['jerusalem', 'riblah', 'carchemish', 'babylon'],
    {
      ref: '2 Kings 25:1–21',
      color: '#5c5470',
      blurb:
        'Deportees went north up the Levantine corridor and east along the Euphrates — ' +
        'the long way round the desert. Zedekiah was sentenced at Riblah on the way.',
    }),

  J('return-journey', 'The return from exile', 'exile-return', 'probable',
    ['babylon', 'carchemish', 'damascus', 'jerusalem'],
    { ref: 'Ezra 1–2', color: '#6b7a8f', blurb: 'The same corridor in reverse, about four months on the road (Ezra 7:9).' }),

  J('paul1', 'Paul’s first journey', 'early-church', 'good',
    ['antioch-syria', 'seleucia', 'salamis', 'paphos', 'perga', 'antioch-pisidia',
     'iconium', 'lystra', 'derbe', 'lystra', 'iconium', 'antioch-pisidia', 'perga',
     'attalia', 'antioch-syria'],
    {
      ref: 'Acts 13–14', dates: [46, 48],
      color: '#8f3f5c',
      blurb: 'Cyprus, then the highlands of southern Asia Minor — and the same road home again.',
    }),

  J('paul2', 'Paul’s second journey', 'early-church', 'good',
    ['antioch-syria', 'tarsus', 'derbe', 'lystra', 'iconium', 'antioch-pisidia', 'troas',
     'philippi', 'thessalonica', 'berea', 'athens', 'corinth', 'cenchreae', 'ephesus',
     'caesarea', 'antioch-syria'],
    {
      ref: 'Acts 15:36–18:22', dates: [49, 52],
      color: '#2f6690',
      blurb: 'The crossing to Macedonia takes the movement into Europe for the first time.',
    }),

  J('paul3', 'Paul’s third journey', 'early-church', 'good',
    ['antioch-syria', 'tarsus', 'derbe', 'lystra', 'iconium', 'ephesus', 'troas',
     'philippi', 'thessalonica', 'corinth', 'philippi', 'troas', 'assos', 'miletus',
     'rhodes', 'tyre', 'caesarea', 'jerusalem'],
    {
      ref: 'Acts 18:23–21:16', dates: [53, 57],
      color: '#3f7d6e',
      blurb: 'Anchored by nearly three years at Ephesus, and ending with a deliberate return to Jerusalem.',
    }),

  J('paul-rome', 'The voyage to Rome', 'early-church', 'good',
    ['caesarea', 'sidon', 'myra', 'fair-havens', 'malta', 'syracuse', 'puteoli', 'rome'],
    {
      ref: 'Acts 27–28', dates: [59, 60],
      color: '#c8553d',
      blurb:
        'A prisoner transport that sails too late in the season. Acts 27 is one of the ' +
        'most detailed sailing narratives to survive from antiquity.',
    }),
]

export const JOURNEY_BY_ID = Object.fromEntries(JOURNEYS.map((j) => [j.id, j]))

export const CONFIDENCE_LABEL = {
  good: 'Route well attested',
  probable: 'Route probable',
  schematic: 'Schematic — stops known, path not',
  disputed: 'Route disputed',
}
