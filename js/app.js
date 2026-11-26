/* Remembering 26/11 — page behaviour */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const siteById = Object.fromEntries(SITES.map(s => [s.id, s]));
  const initials = name => name.replace(/^Major\s+/, "").split(/\s+/).map(w => w[0]).join("").slice(0, 3);

  /* Menu (small screens) */
  const menuBtn = $("#menu-btn"), nav = $("#site-nav");
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  $$("#site-nav a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }));

  /* Opening footage (CNN, embedded from YouTube) */
  const VIDEO_ID = "uOwn3HTBYdc";
  const ytSrc = params => `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?${new URLSearchParams(params)}`;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion) {
    const bg = document.createElement("iframe");
    bg.src = ytSrc({ autoplay: 1, mute: 1, loop: 1, playlist: VIDEO_ID, controls: 0, playsinline: 1, rel: 0, disablekb: 1, iv_load_policy: 3, modestbranding: 1 });
    bg.title = "Background footage of the Taj Mahal Palace on fire";
    bg.tabIndex = -1;
    bg.allow = "autoplay; encrypted-media";
    bg.addEventListener("load", () => setTimeout(() => $("#cover-video").classList.add("ready"), 1200));
    $("#cover-video").appendChild(bg);
  }

  const player = $("#player"), frame = $("#player-frame");
  function closePlayer() { frame.innerHTML = ""; if (player.open) player.close(); }
  $("#watch-btn").addEventListener("click", () => {
    frame.innerHTML = `<iframe src="${ytSrc({ autoplay: 1, rel: 0, playsinline: 1 })}" title="Footage of the Taj Mahal Palace on fire, 27 November 2008 (CNN)" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
    if (player.showModal) player.showModal(); else window.open(`https://www.youtube.com/watch?v=${VIDEO_ID}`, "_blank");
  });
  $("#player-close").addEventListener("click", closePlayer);
  player.addEventListener("close", () => { frame.innerHTML = ""; });
  player.addEventListener("click", e => { if (e.target === player) closePlayer(); });

  /* Timeline */
  $("#timeline-list").innerHTML = TIMELINE.map(t => `
    <li>
      <span class="tl-when">${esc(t.when)}</span>
      <div><h3 class="tl-title">${esc(t.title)}</h3><p class="tl-text">${esc(t.text)}</p></div>
    </li>`).join("");

  /* Roll of Honour */
  const AWARD_CLASS = { "Ashok Chakra": "ribbon-ac", "Kirti Chakra": "ribbon-kc" };
  const AWARD_NAME = { "Ashok Chakra": "Ashoka Chakra", "Kirti Chakra": "Kirti Chakra" };
  const state = { q: "", site: null };

  function personHtml(h) {
    const site = siteById[h.site];
    const portrait = h.photo
      ? `<div class="portrait"><img src="${esc(h.photo)}" alt="Portrait of ${esc(h.name)}" width="160" height="160" loading="lazy"></div>`
      : `<div class="portrait none" aria-hidden="true">${esc(initials(h.name))}</div>`;
    return `
      <li class="person">
        ${portrait}
        <div>
          <h3>${esc(h.name)}</h3>
          <span class="rank">${esc(h.rank)}</span>
          <span class="unit">${esc(h.force)}</span>
          <span class="fell">Fell at ${esc(site.short)}</span>
          ${h.award ? `<span class="award"><span class="ribbon ${AWARD_CLASS[h.award]}" aria-hidden="true"></span>${esc(AWARD_NAME[h.award])}</span>` : ""}
        </div>
        ${h.story ? `<p class="person-story">${esc(h.story)}</p>` : ""}
      </li>`;
  }

  function renderRoll() {
    const q = state.q.trim().toLowerCase();
    const list = HEROES.filter(h =>
      (!state.site || h.site === state.site) &&
      (!q || [h.name, h.rank, h.force, h.award, siteById[h.site].short].join(" ").toLowerCase().includes(q)));

    $("#roll-list").innerHTML = list.map(personHtml).join("");

    const empty = $("#roll-empty");
    if (list.length) {
      empty.hidden = true;
    } else {
      const s = state.site && siteById[state.site];
      empty.textContent = s && !q
        ? `No police or NSG personnel fell at ${s.short}. We remember the ${s.toll} people killed there.`
        : "No names match your search.";
      empty.hidden = false;
    }

    $("#filter-state").hidden = !state.site;
    if (state.site) $("#filter-name").textContent = siteById[state.site].short;
    $$("#site-list button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.site === state.site)));
  }

  $("#roll-search").addEventListener("input", e => { state.q = e.target.value; renderRoll(); });
  $("#clear-filter").addEventListener("click", () => { state.site = null; renderRoll(); });

  function showSite(id, scroll) {
    state.site = id;
    renderRoll();
    if (scroll) $("#roll").scrollIntoView({ behavior: "smooth" });
  }
  window.__showSite = showSite;

  /* Map */
  const markers = {};
  let map = null;

  function popupHtml(s) {
    const fallen = HEROES.filter(h => h.site === s.id).length;
    const toll = s.toll === "—" ? "" : `<p>${esc(s.toll)} killed${fallen && String(fallen) !== s.toll ? `, including ${fallen} ${fallen === 1 ? "officer" : "officers"}` : ""}.</p>`;
    return `<div class="pop">
      <span class="when">${esc(s.time)}</span>
      <h3>${esc(s.name)}</h3>
      <p>${esc(s.note)}</p>
      ${toll}
      ${fallen ? `<button type="button" onclick="__showSite('${s.id}', true)">See who fell here</button>` : ""}
    </div>`;
  }

  function initMap() {
    if (!window.L) {
      $("#map").innerHTML = '<p style="padding:20px;color:#a39e88">The map could not be loaded. The list of places is alongside.</p>';
      return;
    }
    map = L.map("map", { scrollWheelZoom: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    SITES.forEach(s => {
      const n = parseInt(s.toll, 10);
      const cls = s.id === "landing" ? "quiet" : (n >= 20 ? "major" : "");
      const size = cls === "major" ? 22 : 16;
      const icon = L.divIcon({ className: "", html: `<div class="marker ${cls}"></div>`, iconSize: [size, size] });
      const m = L.marker([s.lat, s.lng], { icon, title: s.name, alt: s.name, keyboard: true })
        .bindPopup(popupHtml(s), { maxWidth: 280 })
        .addTo(map);
      m.on("click", () => { if (HEROES.some(h => h.site === s.id)) showSite(s.id, false); });
      markers[s.id] = m;
    });

    // Frame South Mumbai; Vile Parle is far north and reachable from the list.
    const south = SITES.filter(s => s.id !== "vileparle").map(s => [s.lat, s.lng]);
    map.fitBounds(south, { padding: [30, 30] });
    map.on("click", () => map.scrollWheelZoom.enable());
  }

  function renderSiteList() {
    $("#site-list").innerHTML = SITES.filter(s => s.id !== "landing").map(s => `
      <li><button type="button" data-site="${s.id}" aria-pressed="false">
        <span><span class="s-name">${esc(s.short)}</span><span class="s-when">${esc(s.time)}</span></span>
        <span class="s-toll" title="People killed">${esc(s.toll)}</span>
      </button></li>`).join("");
    $$("#site-list button").forEach(b => b.addEventListener("click", () => {
      const id = b.dataset.site;
      if (state.site === id) { showSite(null, false); return; }
      showSite(id, false);
      const m = markers[id];
      if (map && m) { map.setView(m.getLatLng(), 16); m.openPopup(); }
    }));
  }

  /* Citizens */
  $("#citizen-list").innerHTML = CIVILIAN_HEROES.map(c => `
    <li class="citizen">
      ${c.photo
        ? `<div class="portrait"><img src="${esc(c.photo)}" alt="Portrait of ${esc(c.name)}" width="160" height="160" loading="lazy"></div>`
        : `<div class="portrait none" aria-hidden="true">${esc(initials(c.name))}</div>`}
      <div>
        <h3>${esc(c.name)}</h3>
        <span class="rank">${esc(c.role)}</span>
        <p>${esc(c.text)}</p>
      </div>
    </li>`).join("");

  renderSiteList();
  renderRoll();
  initMap();
})();
