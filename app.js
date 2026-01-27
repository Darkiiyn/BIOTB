(() => {
  const cfg = window.SITE_CONFIG;
  const $ = (id) => document.getElementById(id);

  // Fill profile
  $("name").textContent = cfg.name;
  $("tagline").textContent = cfg.tagline;

  // Fill links
  const linkMap = {
    btnDiscord: cfg.links.discord,
    btnRoblox: cfg.links.roblox,
    btnTelegram: cfg.links.telegram,
    btnSpotify: cfg.links.spotify,
    btnTikTok: cfg.links.tiktok
  };
  Object.entries(linkMap).forEach(([id, url]) => {
    const el = $(id);
    if (el) el.href = url;
  });

  // Intro gate (user gesture -> audio allowed)
  const intro = $("intro");
  const app = $("app");

  function showApp() {
    intro.style.transition = "opacity .35s ease";
    intro.style.opacity = "0";
    setTimeout(() => {
      intro.style.display = "none";
      app.hidden = false;
      app.animate(
        [{ opacity: 0, transform: "translateY(8px) scale(.99)" }, { opacity: 1, transform: "translateY(0) scale(1)" }],
        { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" }
      );
    }, 380);
  }

  // Background stars
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  let w, h, dpr;
  let stars = [];

  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = canvas.width = Math.floor(innerWidth * dpr);
    h = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    stars = Array.from({ length: Math.floor((innerWidth * innerHeight) / 9000) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.4 + 0.3) * dpr,
      a: Math.random() * 0.55 + 0.10,
      s: (Math.random() * 0.25 + 0.05) * dpr
    }));
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  let t = 0;
  function loop() {
    t += 0.006;
    ctx.clearRect(0, 0, w, h);
    for (const st of stars) {
      st.y += st.s;
      if (st.y > h + 10) { st.y = -10; st.x = Math.random() * w; }
      const tw = (Math.sin(t + st.x * 0.001) + 1) * 0.5;
      ctx.globalAlpha = Math.min(0.9, st.a + tw * 0.25);
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    }
    requestAnimationFrame(loop);
  }
  loop();

  // Audio (background)
  const audio = new Audio();
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0.85;

  async function pickFirstExistingAudio() {
    const base = cfg.songBaseName || "public/song";
    const exts = Array.isArray(cfg.songExtensions) ? cfg.songExtensions : ["mp3"];
    for (const ext of exts) {
      const url = `${base}.${ext}`;
      try {
        const res = await fetch(url, { method: "HEAD", cache: "no-store" });
        if (res.ok) return url;
      } catch (_) {}
    }
    return `${base}.mp3`;
  }

  async function enter() {
    showApp();
    const url = await pickFirstExistingAudio();
    audio.src = url;
    try { await audio.play(); } catch (_) {}
  }

  intro.addEventListener("click", enter, { once: true });
})();