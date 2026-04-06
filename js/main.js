/* ── Network canvas ── */
function initCanvas(canvasId, wrapperId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const wrap = document.getElementById(wrapperId);
  const ctx = canvas.getContext('2d');
  let W, H, nodes, animId;

  function resize() {
    W = wrap.offsetWidth; H = wrap.offsetHeight;
    canvas.width = W; canvas.height = H;
  }
  function initNodes() {
    nodes = [];
    for (let i = 0; i < 32; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .2, vy: (Math.random() - .5) * .2,
        r: Math.random() * 1.2 + .8,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: .008 + Math.random() * .008
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(59,143,224,${(1-dist/150)*.07})`;
          ctx.lineWidth = .6; ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      n.pulse += n.pulseSpeed;
      const glow = .5 + .5 * Math.sin(n.pulse);
      const alpha = .1 + glow * .18;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI*2);
      ctx.fillStyle = `rgba(59,143,224,${alpha*.15})`; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(59,143,224,${alpha})`; ctx.fill();
      n.x += n.vx; n.y += n.vy;
      if (n.x < -20) n.x = W+20; if (n.x > W+20) n.x = -20;
      if (n.y < -20) n.y = H+20; if (n.y > H+20) n.y = -20;
    }
    animId = requestAnimationFrame(draw);
  }
  resize(); initNodes(); draw();
  window.addEventListener('resize', () => { cancelAnimationFrame(animId); resize(); initNodes(); draw(); });
}

/* ── Reference filter ── */
function initFilter() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sector = btn.dataset.filter;
      document.querySelectorAll('.proj-card').forEach(card => {
        card.classList.toggle('hidden', sector !== 'vse' && card.dataset.sector !== sector);
      });
    });
  });
}

/* ── Scroll reveal ── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  els.forEach(el => io.observe(el));
}

/* ── Active nav link ── */
function initNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') && path.includes(a.getAttribute('href').replace(/^\//, '').split('/')[0])) {
      a.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCanvas('netCanvas', 'heroWrap');
  initFilter();
  initScrollReveal();
  initNav();
});
