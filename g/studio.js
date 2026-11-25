// Five Nights at Seth's — the studio's sign (Midnight Grid Studios), played over the page when it is first opened, while the game
// downloads underneath. All black; the sign fades in tiny, bobbing; springs up to its full size, wobbling like a jelly as it settles; rests
// while its two stars twinkle; dips, and slides up off the top; then the black lifts onto the loading screen. A click, a tap or a key sends it
// away at once. The game waits for it before its own loading screen gets going: window.fnasIntro is 0 while it plays, 1 once it lifts.
// (The same as the game's own StudioIntro.cs, which plays it when the game is not in a web page.)
window.fnasStudio = function (base, stage) {
  base = base || ''; stage = stage || document.body; window.fnasIntro = 0;
  var css = document.createElement('style');
  css.textContent = '#studio{position:absolute;inset:0;z-index:3;background:#000;display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:pointer}' +
    '#studio .sign{position:relative;flex:none;opacity:0;will-change:transform,opacity}#studio img,#studio i{position:absolute;display:block;pointer-events:none}' +
    '#studio .logo{left:0;top:0;width:100%;height:100%;object-fit:contain}#studio i{opacity:0;background:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cpath fill=\'%23fff\' d=\'M50 0Q56.5 43.5 100 50Q56.5 56.5 50 100Q43.5 56.5 0 50Q43.5 43.5 50 0Z\'/%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'14\' fill=\'%23fff\' fill-opacity=\'.35\'/%3E%3C/svg%3E") center/contain no-repeat}';
  document.head.appendChild(css);
  var box = document.createElement('div'); box.id = 'studio'; box.setAttribute('role', 'img'); box.setAttribute('aria-label', 'Midnight Grid Studios');
  var sign = document.createElement('div'); sign.className = 'sign'; box.appendChild(sign);
  var halo = document.createElement('img'); halo.alt = ''; halo.src = base + 'studio_glow.webp'; sign.appendChild(halo);
  var pic = document.createElement('img'); pic.className = 'logo'; pic.alt = ''; pic.src = base + 'studio.webp'; sign.appendChild(pic);
  var stars = [document.createElement('i'), document.createElement('i')]; sign.appendChild(stars[0]); sign.appendChild(stars[1]);
  stage.appendChild(box);

  var IN = 0.35, GROW = 1.2, REST = 2.9, OUT = 3.7, LIFT = 4.3, END = 4.9, SMALL = 0.2, HURRY = 0.35, SHAPE = 972 / 520;
  var STAR = [[95.79, 18.87, 2.62], [4.42, 7.31, 3.02]], calm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var w = 0, h = 0, H = 600, t0 = 0, hurryAt = -1, done = false;
  function ease(u) { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); }
  function twinkle(x, len) { if (x <= 0 || x >= len) return 0; var u = x / len; return u < 0.3 ? ease(u / 0.3) : 1 - ease((u - 0.3) / 0.7); }
  function size() {
    var W = box.clientWidth || window.innerWidth; H = box.clientHeight || window.innerHeight;
    w = Math.min(Math.max(260, 0.5 * Math.min(W, H * 1.6)), 600, W - 48); h = w / SHAPE; if (h > H * 0.5) { h = H * 0.5; w = h * SHAPE; }
    sign.style.width = w + 'px'; sign.style.height = h + 'px'; var pad = 0.1388 * w;
    halo.style.left = -pad + 'px'; halo.style.top = -pad + 'px'; halo.style.width = (w + 2 * pad) + 'px'; halo.style.height = (h + 2 * pad) + 'px';
    var s = Math.max(16, w * 0.07); for (var i = 0; i < 2; i++) { var st = stars[i].style; st.width = s + 'px'; st.height = s + 'px'; st.left = (w * STAR[i][0] / 100 - s / 2) + 'px'; st.top = (h * STAR[i][1] / 100 - s / 2) + 'px'; }
  }
  function frame(t) {
    var a = 0, s = SMALL, sx = 1, sy = 1, r = 0, y = 0, glow = 0, black = 1, all = 1;
    if (t < IN) a = 0;
    else if (t < GROW) { a = ease((t - IN) / (GROW - IN)); y = -5 * Math.sin((t - IN) * Math.PI * 2 * 1.3); s = SMALL * (1 + 0.05 * Math.sin((t - IN) * 9)); }
    else {
      // up to its full size on a spring (over, under, over a little, settling), squashing and stretching like a jelly, rocking, bobbing
      a = 1; var g = t - GROW, w0 = 8.5, z = 0.42, wd = w0 * Math.sqrt(1 - z * z), decay = Math.exp(-z * w0 * g);
      s = 1 - (1 - SMALL) * decay * (Math.cos(wd * g) + z * w0 / wd * Math.sin(wd * g));
      var jelly = 0.075 * Math.exp(-3 * g) * Math.sin(13 * g); sx = 1 + jelly; sy = 1 - jelly;
      r = 6 * Math.exp(-2.6 * g) * Math.sin(10 * g + 0.3); y = -16 * Math.exp(-3.2 * g) * Math.sin(7 * g);
      glow = 0.42 * Math.min(1, g / 0.35) * Math.exp(-1.8 * Math.max(0, g - 0.35)) + 0.12 * Math.min(1, g / 0.6);
      if (t >= REST) { var q = t - REST; y += -2.5 * Math.sin(q * 3.2); glow += 0.03 * Math.sin(q * 4); }
      if (t >= OUT) {
        // a little dip, then up and away off the top, stretching as it goes
        var o = t - OUT, v = Math.max(0, Math.min(1, (o - 0.1) / 0.55)), dip = 10 * Math.sin(Math.min(1, o / 0.16) * Math.PI / 2) * (1 - v);
        y += dip - (H * 0.5 + h * 0.75 + 60) * Math.pow(v, 2.3); sy *= 1 + 0.1 * Math.sin(v * Math.PI); sx *= 1 - 0.05 * Math.sin(v * Math.PI); glow *= 1 - v;
      }
    }
    if (calm) { s = 1; sx = sy = 1; r = 0; y = 0; if (t >= OUT) a = 1 - ease((t - OUT) / 0.5); }      // (for those who would rather things did not move about: it only fades)
    if (t >= LIFT) black = 1 - ease((t - LIFT) / (END - LIFT));
    if (hurryAt >= 0) all = 1 - ease((t - hurryAt) / HURRY);
    sign.style.transform = 'translateY(' + y.toFixed(2) + 'px) rotate(' + r.toFixed(3) + 'deg) scale(' + (s * sx).toFixed(4) + ',' + (s * sy).toFixed(4) + ')';
    sign.style.opacity = (a * all).toFixed(3); halo.style.opacity = (Math.max(0, Math.min(1, glow)) * a * all).toFixed(3);
    for (var i = 0; i < 2; i++) {
      var k = twinkle(t - STAR[i][2], 0.5) + (i === 0 ? 0.6 * twinkle(t - 3.45, 0.4) : 0), st = stars[i].style;
      st.opacity = (Math.min(1, k) * a * all).toFixed(3); st.transform = 'scale(' + (0.3 + 0.9 * k).toFixed(3) + ') rotate(' + (45 * k).toFixed(2) + 'deg)';
    }
    box.style.background = 'rgba(0,0,0,' + Math.max(0, Math.min(1, black * all)).toFixed(3) + ')';
    if (t >= LIFT || hurryAt >= 0) { window.fnasIntro = 1; box.style.pointerEvents = 'none'; }
    return t >= END || (hurryAt >= 0 && t - hurryAt >= HURRY);
  }
  function finish() {
    done = true; window.fnasIntro = 1; if (box.parentNode) box.parentNode.removeChild(box);
    ['pointerdown', 'keydown'].forEach(function (n) { window.removeEventListener(n, hurry, true); }); window.removeEventListener('resize', size);
  }
  function tick() { if (done) return; if (frame((performance.now() - t0) / 1000)) { finish(); return; } requestAnimationFrame(tick); }
  function hurry() { if (done || hurryAt >= 0 || !t0) return; var t = (performance.now() - t0) / 1000; if (t > 0.15) hurryAt = t; }
  ['pointerdown', 'keydown'].forEach(function (n) { window.addEventListener(n, hurry, true); });
  window.addEventListener('resize', size); size(); frame(0);
  // the clock starts once the sign's picture is ready (or soon anyway), so that it is not missed; and a hidden page does not hold the game up
  var started = false; function go() { if (started) return; started = true; t0 = performance.now(); requestAnimationFrame(tick); }
  if (pic.complete && pic.naturalWidth) go(); else { pic.addEventListener('load', go); pic.addEventListener('error', go); setTimeout(go, 1500); }
  setTimeout(function () { if (!done) { window.fnasIntro = 1; } }, 9000);
};
