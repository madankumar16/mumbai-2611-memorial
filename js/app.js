/* =====================================================================
   26/11 Mumbai Memorial — behaviour
   ===================================================================== */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const siteById = Object.fromEntries(SITES.map(s => [s.id, s]));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------------- Tribute audio ---------------- */
  const Audio = {
    ctx: null, master: null, el: null, playing: false, timer: null,

    start() {
      if (CONFIG.audioSrc) {
        this.el = new window.Audio(CONFIG.audioSrc);
        this.el.loop = true; this.el.volume = 0.6;
        this.el.play().catch(() => {});
        this.playing = true;
        return;
      }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.gain.linearRampToValueAtTime(0.32, this.ctx.currentTime + 3);

      // Soft hall reverb from a generated impulse response
      const len = this.ctx.sampleRate * 3.5;
      const ir = this.ctx.createBuffer(2, len, this.ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
      }
      const verb = this.ctx.createConvolver(); verb.buffer = ir;
      const wet = this.ctx.createGain(); wet.gain.value = 0.55;
      const dry = this.ctx.createGain(); dry.gain.value = 0.6;
      this.bus = this.ctx.createGain();
      this.bus.connect(dry).connect(this.master);
      this.bus.connect(verb).connect(wet).connect(this.master);
      this.master.connect(this.ctx.destination);

      this.playing = true;
      this.loop();
    },

    // An original, slow, solemn phrase in D minor over a low drone.
    loop() {
      if (!this.ctx || !this.playing) return;
      const t0 = this.ctx.currentTime + 0.1;
      const hz = n => 440 * Math.pow(2, (n - 69) / 12);
      const melody = [
        [62, 2], [65, 1], [69, 3], [67, 1.5], [65, .5], [64, 2], [62, 4],
        [69, 2], [70, 1], [72, 3], [70, 1.5], [69, .5], [67, 2], [69, 4],
        [65, 2], [67, 1], [69, 2], [65, 1], [64, 2], [61, 2], [62, 6]
      ];
      const beat = 0.85;
      let t = t0;
      melody.forEach(([n, d]) => { this.note(hz(n), t, d * beat, 0.22, "triangle"); t += d * beat; });
      const total = t - t0;
      [[38, 0], [45, 0], [50, total / 2]].forEach(([n, off]) =>
        this.note(hz(n), t0 + off, total / (off ? 2 : 1), 0.07, "sine"));
      this.timer = setTimeout(() => this.loop(), (total - 0.3) * 1000);
    },

    note(freq, when, dur, vol, type) {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(vol, when + Math.min(0.5, dur / 3));
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur + 0.8);
      o.connect(g).connect(this.bus);
      o.start(when); o.stop(when + dur + 1);
    },

    toggle() {
      if (this.el) {
        if (this.el.paused) { this.el.play(); this.playing = true; } else { this.el.pause(); this.playing = false; }
      } else if (this.ctx) {
        if (this.ctx.state === "running") { this.ctx.suspend(); this.playing = false; }
        else { this.ctx.resume(); this.playing = true; }
      }
      return this.playing;
    }
  };

  /* ---------------- Entrance ---------------- */
  function enter(withSound) {
    const ent = $("#entrance");
    ent.classList.add("gone");
    document.body.classList.remove("locked");
    document.body.classList.add("entered");
    setTimeout(() => ent.remove(), 1500);
    if (withSound) {
      Audio.start();
      $("#sound-toggle").hidden = false;
    }
    $("#hero").scrollIntoView({ behavior: "instant", block: "start" });
  }
  $("#enter-btn").addEventListener("click", () => enter(true));
  $("#enter-silent").addEventListener("click", () => enter(false));
  $("#sound-toggle").addEventListener("click", e => {
    const on = Audio.toggle();
    e.currentTarget.textContent = on ? "🔊" : "🔈";
    e.currentTarget.setAttribute("aria-label", on ? "Mute tribute audio" : "Play tribute audio");
  });

  /* ---------------- Nav ---------------- */
  const navToggle = $("#nav-toggle"), navLinks = $("#nav-links");
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open);
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  $$("#nav-links a").forEach(a => a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }));

  /* ---------------- Reveal + counters + typewriter ---------------- */
  function countUp(el) {
    const target = +el.dataset.count, suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const dur = 2200, start = performance.now();
    const step = now => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const typeQueue = [];
  let typing = false;
  function typeNext() {
    if (typing || !typeQueue.length) return;
    typing = true;
    const el = typeQueue.shift(), text = el.dataset.text;
    if (reduceMotion) { el.textContent = text; typing = false; return typeNext(); }
    el.classList.add("typing");
    let i = 0;
    const tick = () => {
      i += 2;
      el.textContent = text.slice(0, i);
      if (i < text.length) setTimeout(tick, 22);
      else { el.classList.remove("typing"); typing = false; setTimeout(typeNext, 250); }
    };
    tick();
  }

  // Accessible copy for screen readers before typing starts
  $$(".type").forEach(p => p.setAttribute("aria-label", p.dataset.text));

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      if (el.classList.contains("reveal")) el.classList.add("in");
      if (el.classList.contains("stat-num")) countUp(el);
      if (el.classList.contains("type")) { typeQueue.push(el); typeNext(); }
      io.unobserve(el);
    });
  }, { threshold: 0.35 });
  $$(".reveal, .stat-num, .type").forEach(el => io.observe(el));

  /* ---------------- Timeline ---------------- */
  $("#timeline-list").innerHTML = TIMELINE.map(t => `
    <li class="reveal">
      <div class="tl-when">${esc(t.when)}</div>
      <div class="tl-title">${esc(t.title)}</div>
      <p class="tl-text">${esc(t.text)}</p>
    </li>`).join("");
  $$("#timeline-list .reveal").forEach(el => io.observe(el));

  /* ---------------- Roll of Honour ---------------- */
  const state = { q: "", site: null };
  const wall = $("#honour-wall");

  function renderRoll() {
    const q = state.q.trim().toLowerCase();
    const list = HEROES.filter(h =>
      (!state.site || h.site === state.site) &&
      (!q || [h.name, h.rank, h.force, h.award, siteById[h.site].short].join(" ").toLowerCase().includes(q)));

    wall.innerHTML = list.length ? list.map(h => {
      const site = siteById[h.site];
      return `
      <article class="hero-card ${h.award === "Ashok Chakra" ? "ashok" : ""}">
        <div class="hc-portrait ${h.photo ? "" : "no-photo"}">
          ${h.photo ? `<img src="${esc(h.photo)}" alt="${esc(h.name)}" width="160" height="160" loading="lazy">` : ""}
          <div class="candle" aria-hidden="true"><span class="c-flame"></span><span class="c-wax"></span></div>
        </div>
        <div>
          <h3 class="hc-name">${esc(h.name)}</h3>
          <p class="hc-rank">${esc(h.rank)}</p>
          <p class="hc-force">${esc(h.force)}</p>
          <div class="hc-meta">
            <span class="chip">📍 ${esc(site.short)}</span>
            <span class="chip">${esc(h.state)}</span>
            ${h.award ? `<span class="chip award">🎖 ${esc(h.award)} (posthumous)</span>` : ""}
          </div>
          ${h.story ? `<p class="hc-story">${esc(h.story)}</p>` : ""}
        </div>
      </article>`;
    }).join("") : (() => {
      const s = state.site && siteById[state.site];
      return `<p class="empty">${s
        ? `No police or NSG personnel fell at ${esc(s.short)}. We remember the ${esc(s.toll)} civilians whose lives were taken there.`
        : "No names match your search."}</p>`;
    })();

    $("#roll-count").textContent = `${list.length} of ${HEROES.length} shown`;
    const af = $("#active-filter");
    af.hidden = !state.site;
    if (state.site) $("#active-filter-text").textContent = "📍 " + siteById[state.site].short;
    $$("#site-list button").forEach(b => b.classList.toggle("active", b.dataset.site === state.site));
  }

  $("#roll-search").addEventListener("input", e => { state.q = e.target.value; renderRoll(); });
  $("#clear-filter").addEventListener("click", () => { state.site = null; renderRoll(); });

  function filterBySite(id, scroll) {
    state.site = id;
    renderRoll();
    if (scroll) $("#roll").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }
  window.__filterSite = filterBySite; // used by map popups

  /* ---------------- Map ---------------- */
  const markers = {};
  let map = null;

  function popupHtml(s) {
    const fallen = HEROES.filter(h => h.site === s.id).length;
    return `<div class="pop">
      <h3>${esc(s.name)}</h3>
      <div class="t">${esc(s.time)}</div>
      <p>${esc(s.note)}</p>
      <p>Lives lost: <span class="toll">${esc(s.toll)}</span>${fallen ? ` · Security personnel who fell: <span class="toll">${fallen}</span>` : ""}</p>
      ${s.id !== "landing" ? `<button onclick="__filterSite('${s.id}', true)">Show in Roll of Honour</button>` : ""}
    </div>`;
  }

  function initMap() {
    if (!window.L) {
      $("#map").innerHTML = '<div class="map-fallback">The map could not load. Use the list of locations instead.</div>';
      return;
    }
    map = L.map("map", { scrollWheelZoom: false, zoomControl: true }).setView([18.94, 72.83], 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const cluster = L.markerClusterGroup ? L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 40 }) : L.layerGroup();
    SITES.forEach(s => {
      const big = parseInt(s.toll, 10) >= 20;
      const icon = L.divIcon({ className: "", html: `<div class="site-marker ${big ? "big" : ""}"></div>`, iconSize: big ? [24, 24] : [18, 18] });
      const m = L.marker([s.lat, s.lng], { icon, title: s.name, alt: s.name }).bindPopup(popupHtml(s), { maxWidth: 280 });
      m.on("click", () => { if (s.id !== "landing") filterBySite(s.id, false); });
      markers[s.id] = m;
      cluster.addLayer(m);
    });
    cluster.addTo(map);
    map.on("click", () => map.scrollWheelZoom.enable());
    window.__cluster = cluster;
  }

  function renderSiteList() {
    $("#site-list").innerHTML = SITES.filter(s => s.id !== "landing").map(s => `
      <li><button data-site="${s.id}">
        <span><span class="s-name">${esc(s.short)}</span><span class="s-time">${esc(s.time)}</span></span>
        <span class="s-toll" title="Lives lost">${esc(s.toll)}</span>
      </button></li>`).join("");
    $$("#site-list button").forEach(b => b.addEventListener("click", () => {
      const id = b.dataset.site;
      if (state.site === id) { filterBySite(null); return; }
      filterBySite(id, false);
      const m = markers[id];
      if (map && m) {
        const open = () => { map.setView(m.getLatLng(), 16); m.openPopup(); };
        if (window.__cluster && window.__cluster.zoomToShowLayer) window.__cluster.zoomToShowLayer(m, open); else open();
      }
    }));
  }

  /* ---------------- Civilian heroes ---------------- */
  $("#civ-grid").innerHTML = CIVILIAN_HEROES.map(c => `
    <article class="civ-card reveal">
      <div class="civ-head">
        ${c.photo ? `<img src="${esc(c.photo)}" alt="${esc(c.name)}" width="160" height="160" loading="lazy">` : ""}
        <div><h3>${esc(c.name)}</h3><div class="role">${esc(c.role)}</div></div>
      </div>
      <p>${esc(c.text)}</p>
    </article>`).join("");
  $$("#civ-grid .reveal").forEach(el => io.observe(el));

  /* ---------------- Tribute film ---------------- */
  function initFilm() {
    const box = $("#film-box"), stage = $("#film-stage"), play = $("#film-play"), bar = $("#film-progress");

    if (CONFIG.videoSrc) {
      stage.innerHTML = `<video src="${esc(CONFIG.videoSrc)}" controls playsinline preload="metadata"></video>`;
      play.remove(); bar.parentElement.remove();
      return;
    }

    const slides = [
      { k: "26 · 11 · 2008", b: "Mumbai's darkest night", s: "Ten gunmen. Twelve attacks. Sixty hours." },
      ...HEROES.map(h => ({ k: h.rank, b: h.name, s: `${siteById[h.site].short}${h.award ? " · " + h.award : ""}` })),
      { k: "And", b: "166 lives", s: "Travellers, guests, staff, families, children." },
      { k: "We will never forget", b: "Jai Hind", s: "" }
    ];
    stage.innerHTML = slides.map(s => `
      <div class="film-slide">
        <div class="fs-candle"></div>
        <div class="fs-kicker">${esc(s.k)}</div>
        <div class="fs-big">${esc(s.b)}</div>
        ${s.s ? `<div class="fs-small">${esc(s.s)}</div>` : ""}
      </div>`).join("");
    const els = $$(".film-slide", stage);
    els[0].classList.add("show");

    let i = 0, timer = null;
    const per = 3200;
    function show(n) {
      els.forEach((e, k) => e.classList.toggle("show", k === n));
      bar.style.transition = "none";
      bar.style.width = (n / (els.length - 1) * 100) + "%";
    }
    function run() {
      box.classList.add("playing");
      i = 0; show(0);
      clearInterval(timer);
      timer = setInterval(() => {
        i++;
        if (i >= els.length) { clearInterval(timer); box.classList.remove("playing"); return; }
        show(i);
      }, per);
    }
    play.addEventListener("click", run);
  }

  /* ---------------- Candle ---------------- */
  function initCandle() {
    const btn = $("#big-candle"), msg = $("#candle-msg");
    let lit = false;
    try { lit = localStorage.getItem("2611-candle") === "1"; } catch (e) {}
    const set = on => {
      btn.classList.toggle("lit", on);
      btn.setAttribute("aria-pressed", on);
      btn.setAttribute("aria-label", on ? "Candle lit" : "Light a candle");
      msg.textContent = on ? "Thank you. Your candle burns for them." : "Tap the candle to light it in their memory.";
    };
    set(lit);
    btn.addEventListener("click", () => {
      lit = !lit; set(lit);
      try { localStorage.setItem("2611-candle", lit ? "1" : "0"); } catch (e) {}
    });
  }

  /* ---------------- Boot ---------------- */
  renderSiteList();
  renderRoll();
  initMap();
  initFilm();
  initCandle();
})();
