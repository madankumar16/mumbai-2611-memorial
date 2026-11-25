# 26/11 Mumbai Memorial

A digital memorial to the 166 lives lost in the Mumbai terror attacks of 26–29 November 2008. It honours the police officers, Home Guard and NSG commandos who fell, and the civilians who protected others.

**Live site:** https://mumbai-2611-memorial.vercel.app/

Built in plain HTML, CSS and JavaScript, with Leaflet.js and Leaflet.markercluster for the map. It follows the same design as my Pulwama memorial.

## Features

- Full-screen memorial entrance with tribute audio, fading into the site
- Counters that climb to 166 lives, 17 fallen security personnel, 300+ injured and 60 hours
- The story of the attacks, typed out as you scroll to it
- A timeline from the sea landing to the end of Operation Black Tornado
- Interactive map of Mumbai: click an attack site to filter the Roll of Honour to the people who fell there
- Roll of Honour with portrait, name, rank, force, gallantry award and a candle for each hero, searchable by name
- A spotlight on Major Sandeep Unnikrishnan
- Heroes Without Uniform: hotel staff, a nurse, a railway announcer and a nanny
- Video tribute (a built-in candlelight film, or your own video)
- Light a candle
- Ends with "Jai Hind"
- Mobile-first

## Run it locally

```
python -m http.server 8000
```

Then open http://localhost:8000.

## Add your own audio or video

Put the files in `audio/` or `video/` and set the paths in `js/data.js`:

```js
const CONFIG = {
  audioSrc: "audio/tribute.mp3",
  videoSrc: "video/tribute.mp4"
};
```

If you leave them empty, the site plays a soft built-in tribute tone and a candlelight film made from the Roll of Honour.

## Sources

- Maharashtra Police, *List of Martyrs of Maharashtra Police* (names, ranks and units)
- Bombay High Court, *State of Maharashtra v. Mohammed Ajmal Amir Kasab*, Confirmation Case No. 2 of 2010 (where each officer fell)
- Gallantry awards announced on Republic Day, 26 January 2009
- Wikipedia, *2008 Mumbai attacks* (timeline and per-site figures)

Per-site figures differ slightly between official and press sources. The most commonly cited figures are used.

Photographs belong to their original photographers and publishers and are used here only in tribute.

We will never forget. Jai Hind.
