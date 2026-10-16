/* PixelNet – pixelová smyčka „od zafouknutí po data"
   Použití: <canvas class="pxnet" data-mode="strip|full"></canvas>
   Barvy z CSS proměnných na canvasu: --px-bg, --px-ink, --px-soft, --px-accent */
(function () {
  var L = 1000, G = 70, FY = 81;
  var STAGES = [
    [0, 200, 'Zafukování kabelu do mikrotrubičky'],
    [200, 340, 'Svařování vláken ve spojce'],
    [340, 470, 'Měření trasy reflektometrem OTDR'],
    [470, 600, 'Aktivní prvky v rozvaděči'],
    [600, 760, 'Metalická kabeláž ke koncovému místu'],
    [760, 1000, 'Data v provozu — a zpět do vlákna']
  ];

  function hash(n) { n = (n * 374761393) | 0; n = (n ^ (n >>> 13)) * 1274126177 | 0; return (n ^ (n >>> 16)) >>> 0; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function pathY(x) {
    if (x < 495) return FY;
    if (x < 505) return lerp(FY, 48, (x - 495) / 10);
    if (x < 522) return 48;
    if (x < 530) return lerp(48, 67, (x - 522) / 8);
    if (x < 706) return 67;
    if (x < 716) return lerp(67, 47, (x - 706) / 10);
    if (x < 760) return 47;
    if (x < 930) return lerp(47, FY, ease((x - 760) / 170));
    return FY;
  }

  function PixelNet(cv) {
    var full = cv.dataset.mode === 'full';
    var cfg = {
      speed: full ? 34 : 22,
      top: full ? 0 : 12,
      clouds: full,
      puffs: full,
      pulseAt: full ? 0.3 : 0.62
    };
    var VH = 100 - cfg.top, cx = cv.getContext('2d'), C = {}, scale = 2, VW = 300;
    var cap = cv.parentElement.querySelector('.pxnet-cap');

    function colors() {
      var s = getComputedStyle(cv);
      ['bg', 'ink', 'soft', 'accent'].forEach(function (k) { C[k] = s.getPropertyValue('--px-' + k).trim(); });
    }
    function size() {
      var w = cv.parentElement.clientWidth;
      scale = full ? (w < 700 ? 2 : 3) : 2;
      VW = Math.ceil(w / scale);
      cv.width = VW; cv.height = VH;
      cv.style.width = VW * scale + 'px'; cv.style.height = VH * scale + 'px';
      cx.imageSmoothingEnabled = false;
    }
    function R(x, y, w, h, c) { cx.fillStyle = c; cx.fillRect(Math.round(x), Math.round(y) - cfg.top, w, h); }
    function cloud(x, y) {
      var i = C.soft;
      R(x + 4, y, 10, 1, i); R(x + 2, y + 1, 2, 1, i); R(x + 14, y + 1, 2, 1, i); R(x + 1, y + 2, 1, 2, i);
      R(x + 16, y + 2, 3, 1, i); R(x + 19, y + 3, 1, 2, i); R(x, y + 4, 1, 1, i); R(x, y + 5, 20, 1, i);
    }

    function world(o, t) {
      var I = C.ink, A = C.accent, B = C.bg, S = C.soft, x, i, k;
      for (x = 0; x < L; x++) {
        var sx = o + x; if (sx < -2 || sx > VW + 2) continue;
        var h = hash(x);
        if (h % 17 === 0) R(sx, 73 + h % 3, 1, 1, S);
        if (h % 29 === 0) R(sx, 89 + h % 5, 2, 1, S);
        if (h % 41 === 0) R(sx, 92 + h % 4, 1, 1, S);
      }
      R(o, G, L, 1, I); R(o, 77, L, 1, I); R(o, 85, L, 1, I);
      for (x = 0; x < L; x += 4) R(o + x, FY, 2, 1, S);
      [[106, 114], [492, 498], [926, 934]].forEach(function (p) {
        R(o + p[0], G, p[1] - p[0], 1, B); R(o + p[0], G, 1, 7, I); R(o + p[1] - 1, G, 1, 7, I); R(o + p[0] + 1, 77, p[1] - p[0] - 2, 1, B);
      });

      /* zafukovací vůz + kompresor */
      R(o + 20, 48, 40, 18, I); R(o + 60, 55, 14, 11, I); R(o + 64, 57, 7, 5, B); R(o + 25, 52, 10, 10, B); R(o + 27, 54, 6, 6, I); R(o + 29, 56, 2, 2, B);
      R(o + 24, 64, 9, 6, I); R(o + 27, 66, 3, 2, B); R(o + 57, 64, 9, 6, I); R(o + 60, 66, 3, 2, B);
      R(o + 84, 58, 15, 12, I); for (i = 0; i < 4; i++) R(o + 86 + i * 3, 60, 1, 6, B);
      R(o + 99, 68, 8, 1, I); R(o + 107, 68, 1, 9, I);
      if (cfg.puffs) for (i = 0; i < 4; i++) { var ph = ((t * 0.8 + i * 0.25) % 1); if (ph < .85) R(o + 88 + Math.sin(ph * 6 + i) * 3 + ph * 6, 56 - ph * 16, ph < .5 ? 2 : 1, ph < .5 ? 2 : 1, S); }

      /* svařovací stan + svářečka + spojka */
      for (i = 0; i < 9; i++) R(o + 250 - i * 3, 40 + i, 6 + i * 6, 1, I);
      R(o + 226, 49, 2, 21, I); R(o + 273, 49, 2, 21, I);
      R(o + 236, 60, 28, 2, I); R(o + 238, 62, 1, 8, I); R(o + 261, 62, 1, 8, I);
      R(o + 243, 53, 13, 7, I); R(o + 245, 55, 5, 3, B);
      if (Math.floor(t * 9) % 5 < 2) { R(o + 253, 51, 1, 1, A); R(o + 254, 50, 1, 1, A); R(o + 252, 50, 1, 1, A); }
      R(o + 238, 78, 26, 7, I); R(o + 241, 80, 20, 3, B);

      /* OTDR na stativu */
      R(o + 380, 38, 28, 18, I); R(o + 382, 40, 24, 13, B);
      var n = Math.floor(((t * 0.5) % 1) * 22);
      for (i = 0; i < n; i++) { var ty = 42 + Math.floor(i * 0.35); if (i === 8 || i === 15) ty -= 2; if (i === 19) ty += 3; R(o + 383 + i, ty, 1, 1, A); }
      R(o + 392, 56, 2, 4, I); R(o + 386, 60, 1, 10, I); R(o + 393, 60, 1, 10, I); R(o + 400, 60, 1, 10, I); R(o + 386, 60, 15, 1, I);
      R(o + 408, 46, 6, 1, S); R(o + 413, 46, 1, 24, S);

      /* budova v řezu */
      R(o + 466, 8, 330, 62, B); R(o + 466, 16, 328, 2, I); R(o + 470, 18, 2, 52, I); R(o + 790, 18, 2, 22, I); R(o + 790, 52, 2, 18, I);
      for (i = 0; i < 6; i++) R(o + 480 + i * 52, 24, 10, 6, S);

      /* rozvaděč */
      R(o + 498, 28, 24, 42, I); R(o + 500, 30, 20, 38, B);
      for (i = 0; i < 5; i++) { R(o + 501, 32 + i * 7, 18, 5, I); for (k = 0; k < 4; k++) { var on = (hash(Math.floor(t * 4) + i * 7 + k * 13) % 3) === 0; R(o + 503 + k * 4, 34 + i * 7, 2, 1, on ? A : B); } }
      for (i = 48; i < FY; i += 2) R(o + 495, i, 1, 1, S);

      /* metalika, zásuvka, stůl, monitor */
      for (x = 530; x < 700; x += 3) R(o + x, 67, 2, 1, I);
      R(o + 522, 48, 1, 19, S);
      R(o + 700, 61, 6, 7, I); R(o + 702, 63, 2, 2, B);
      R(o + 706, 67, 6, 1, I); R(o + 711, 58, 1, 9, I);
      R(o + 712, 56, 56, 2, I); R(o + 714, 58, 2, 12, I); R(o + 764, 58, 2, 12, I);
      R(o + 728, 37, 26, 17, I); R(o + 730, 39, 22, 13, B); R(o + 739, 54, 4, 2, I); R(o + 733, 55, 16, 1, I);
      for (i = 0; i < 4; i++) R(o + 732, 41 + i * 3, 4 + hash(Math.floor(t * 2) + i) % 12, 1, S);

      /* pakety */
      for (i = 0; i < 9; i++) {
        var px = 760 + ((t * 42 + i * 19) % 170);
        if (px < 930) R(o + px - 1, pathY(px) - 1, 3, 3, i % 3 === 0 ? A : I);
      }
    }

    function frame(t) {
      var cam = (t * cfg.speed) % L, k;
      cx.fillStyle = C.bg; cx.fillRect(0, 0, VW, VH);
      if (cfg.clouds) {
        var cOff = (t * cfg.speed * 0.25) % 600;
        for (k = -1; k < 3; k++) [30, 180, 330, 470].forEach(function (c0, j) { var x = c0 - cOff + k * 600; if (x > -30 && x < VW + 10) cloud(x, 8 + (j % 2) * 9); });
      }
      for (k = -1; k <= Math.ceil(VW / L) + 1; k++) world(-cam + k * L, t);
      var ps = Math.round(VW * cfg.pulseAt), pw = (cam + ps) % L, py = Math.round(pathY(pw));
      if (pw < 760 || pw >= 930) {
        for (var i = 1; i < 34; i++) { if (i % 2 === 0 || i < 10) R(ps - i, pathY((pw - i + L) % L), 1, 1, i < 14 ? C.accent : C.soft); }
        R(ps - 1, py - 1, 3, 3, C.accent); R(ps, py - 2, 1, 1, C.accent); R(ps, py + 2, 1, 1, C.accent); R(ps + 2, py, 1, 1, C.accent);
      }
      if (cap) for (var s = 0; s < STAGES.length; s++) if (pw >= STAGES[s][0] && pw < STAGES[s][1]) { if (cap.textContent !== STAGES[s][2]) cap.textContent = STAGES[s][2]; break; }
    }

    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fix = /[?&#]t=([\d.]+)/.exec(location.search + location.hash);
    var running = false, visible = true, t = fix ? +fix[1] : 0, last = 0;
    function tick(now) {
      if (!running) return;
      if (last) t += Math.min((now - last) / 1000, 0.1);
      last = now; frame(t); requestAnimationFrame(tick);
    }
    function update() {
      var should = visible && !document.hidden && !reduce && !fix;
      if (should && !running) { running = true; last = 0; requestAnimationFrame(tick); }
      if (!should) running = false;
    }
    size(); colors(); frame(reduce && !fix ? 4 : t);
    window.addEventListener('resize', function () { size(); frame(t); });
    document.addEventListener('visibilitychange', update);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; update(); }).observe(cv);
    update();
  }

  document.querySelectorAll('canvas.pxnet').forEach(PixelNet);
})();
