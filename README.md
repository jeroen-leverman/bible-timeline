# Scripture Atlas

An interactive timeline and historical map of events described in the Bible, from
Genesis through Revelation — including the period between the testaments, because the
New Testament opens in a world that period created.

**203 events · 146 places · 45 mapped routes · 31 curated threads · 226 passages · 9 territories**

## Lives and threads

An era answers *when*. An event type answers *what kind*. A theme answers *whose story
is this* — it gathers one life, or one long argument, so the timeline can be read as that
story instead of the whole sweep.

Twenty-eight lives — Noah, Abraham, Isaac, Jacob, Joseph, Moses, Joshua, Deborah, Gideon,
Samson, Ruth, Samuel, Saul, David, Solomon, Elijah, Elisha, Jonah, Isaiah, Jeremiah,
Daniel, Esther, Nehemiah, John the Baptist, Mary, Jesus, Peter, Paul — and three threads
that cut across eras: **The Temple** (a tent, two buildings and a ruin), **Exile and
return**, and **The covenants**.

Noah is the instructive one. His seven events carry no dates at all, and no location
until the ark grounds on the mountains of Ararat — so his life reads as a sequence
without a chronology, which is exactly what Genesis gives.

Themes are curations rather than categories: an event can sit in several, and plenty sit
in none. Event ids are validated on load, so a typo fails loudly instead of quietly
shortening someone's life.

Theme and era are mutually exclusive, since "the life of Paul" filtered to "the
patriarchs" is an empty screen. Search and event type still compose on top of a theme.

## The idea

A map flattens uncertainty. A precise dot looks equally confident whether it marks an
excavated tell or a guess, and a single date on a timeline hides the fact that scholars
disagree by two centuries. This atlas tries to keep those distinctions visible instead of
quietly resolving them.

### Dates are two things, not one

Biblical chronology is genuinely contested, and the gaps are not rounding errors. The
Exodus is placed either around **1446 BC** or around **1250 BC** depending on how you read
a single verse — and the two readings imply different pharaohs and a different Canaan.

Rather than pick a side, events that diverge carry both readings:

> **The Exodus from Egypt** — 1446 BC traditional · c. 1260–1230 BC academic
> *Chronology disputed*

- **Traditional** — the internal biblical chronology, taking the numbers in the text at
  face value and chaining them together.
- **Academic** — the ranges favoured by most historians and archaeologists, anchored on
  datable external records.

36 of the 132 events diverge this way. Most of the monarchy onward is not in dispute.

### Evidence from outside the Bible is marked

19 events are fixed by records independent of the biblical text — the Merneptah Stele,
the Kurkh Monolith, the Babylonian Chronicle, the Delphi inscription that dates Gallio's
proconsulship and with it the whole of Pauline chronology. Those events say so, and say
which record.

### Places carry a confidence rating

From *securely identified* excavated sites down to *no known location*. Sodom, Emmaus and
the sea crossing are shown where tradition or argument puts them, and labelled as such.
Eden is placed only so it can be drawn at all.

### Genesis 1–11 has no dates

It is marked **no date in the text** rather than given invented years. Ussher's 4004 BC
comes from adding up genealogies; the text supplies no year.

### Routes are interpretive

The stops are named in the text. The lines between them are straight, and are not
surveyed itineraries. The wilderness route in particular is one reading among several.

## Scripture, photographs and territories

**Every reference opens.** Click a primary text on any event card and the passage
appears, switchable between the **World English Bible** and the **King James Version**.
Both are public domain, so the text ships with the site rather than being fetched from
somebody's free API at read time — it is instant, and it keeps working if that API does
not. References spanning several chapters show the opening chapter and say so; long
chapters show the first twenty verses and say that too.

**Places carry a photograph and a summary** from Wikipedia, on the map popup. Licensing
is the reason this is a build step: Wikipedia prose is CC BY-SA, but image licences vary
per file and English Wikipedia hosts non-free images that may *not* be reused. Every
candidate image is checked against its own licence metadata at fetch time and dropped
unless it is public domain or Creative Commons — six were dropped on the last run — and
the photographer, licence and file page are rendered beside every image that survives.

**Kingdoms and empires** can be toggled on the map. The territory shown follows whatever
date the timeline is sitting on, so stepping through events redraws the political map
underneath them: the United Monarchy, the two kingdoms, Assyria, Babylon, Persia, the
Seleucids, the Hasmoneans, Herod's kingdom and Rome.

Those outlines are **schematic and say so on screen**. Ancient polities had cores,
tributary zones and desert margins rather than surveyed frontiers, and a crisp line
implies a precision that did not exist. They are hand-drawn approximations, not traced
from any copyrighted map.

## Refreshing the data

```bash
npm run fetch:verses      # scripture text, resumable — the API rate-limits
npm run fetch:wikipedia   # extracts, images and licence checks
```

Both scripts resume: anything already fetched is skipped, so an interrupted run can be
restarted without redoing the work.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:5174.

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build
```

## Deployment

Pushing to `main` builds and publishes to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The Vite `base` is `./`,
so the build works from any path without configuration.

## On other timelines

[BibleHub's timeline](https://biblehub.com/timeline/) is the closest widely used
reference, and a useful cross-check: its traditional anchors — a 1446 BC Exodus, the
temple begun in 966 BC — are exactly the ones this atlas uses for its *traditional*
reading, arrived at independently. It is also denser, running to several hundred entries.

Two things it does not do, which are the reason this project exists. It commits to a
single conservative chronology without showing where scholarship disagrees, and it is a
list rather than a map, so it cannot show that Abraham's journey is 1,500 miles or that
Paul's last voyage went the wrong way round Crete. No content has been copied from it;
dates and scripture references are facts, and the cross-check was only ever a check.

## Credits

Built with [Leaflet](https://leafletjs.com/). Basemap tiles by
[CARTO](https://carto.com/attributions), map data ©
[OpenStreetMap](https://www.openstreetmap.org/copyright) contributors. Regnal chronology
broadly follows Thiele.

Scripture text is the World English Bible and the King James Version, both public domain,
retrieved via [bible-api.com](https://bible-api.com). Place summaries and photographs come
from [Wikipedia](https://en.wikipedia.org) and Wikimedia Commons, used under CC BY-SA with
per-image attribution shown in the interface; images under any non-open licence are
excluded automatically rather than by hand.
