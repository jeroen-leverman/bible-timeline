# Scripture Atlas

An interactive timeline and historical map of events described in the Bible, from
Genesis through Revelation — including the period between the testaments, because the
New Testament opens in a world that period created.

**138 events · 141 places · 35 mapped routes · 15 curated threads**

## Lives and threads

An era answers *when*. An event type answers *what kind*. A theme answers *whose story
is this* — it gathers one life, or one long argument, so the timeline can be read as that
story instead of the whole sweep.

Twelve lives — Noah, Abraham, Jacob, Joseph, Moses, Joshua, David, Solomon, Elijah and
Elisha, Jesus, Peter, Paul — and three threads that cut across eras: **The Temple** (a
tent, two buildings and a ruin), **Exile and return**, and **The covenants**.

Noah is the instructive one. His seven events carry no dates at all, and no location
until the ark grounds on the mountains of Ararat — so his life reads as a sequence
without a chronology, which is exactly what Genesis gives.

Themes are curations rather than categories: an event can sit in several, and plenty sit
in none. Event ids are validated on load, so a typo fails loudly instead of quietly
shortening someone's life.

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

## Credits

Built with [Leaflet](https://leafletjs.com/). Basemap tiles by
[CARTO](https://carto.com/attributions), map data ©
[OpenStreetMap](https://www.openstreetmap.org/copyright) contributors. Regnal chronology
broadly follows Thiele.
