// punto di ingresso JS — aggiunta logica qui

(function () {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');

  let W, H, stars, meteors;

  // ── Setup ────────────────────────────────────────────────────────────

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = Array.from({ length: 180 }, () => ({
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.2 + 0.2,
      a:    Math.random() * 0.6 + 0.2,
    }));
  }

  function makeMeteor() {
    // nasce sul bordo superiore o destro
    const fromTop  = Math.random() < 0.6;
    return {
      x:    fromTop ? Math.random() * W * 1.4 : W + 10,
      y:    fromTop ? -10 : Math.random() * H * 0.4,
      len:  Math.random() * 180 + 80,
      spd:  Math.random() * 5 + 4,
      // angolo tra 20° e 50° sotto l'orizzontale
      ang:  (Math.random() * 30 + 20) * (Math.PI / 180),
      life: 1,            // opacità corrente
      fade: Math.random() * 0.01 + 0.008,
    };
  }

  // ── Loop ─────────────────────────────────────────────────────────────

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // stelle statiche
    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fill();
    }

    // meteore
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      const dx = Math.cos(m.ang) * m.len;
      const dy = Math.sin(m.ang) * m.len;

      const grad = ctx.createLinearGradient(m.x, m.y, m.x - dx, m.y - dy);
      grad.addColorStop(0, `rgba(255,255,255,${m.life})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - dx, m.y - dy);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      m.x  += Math.cos(m.ang) * m.spd;
      m.y  += Math.sin(m.ang) * m.spd;
      m.life -= m.fade;

      if (m.life <= 0 || m.x > W + 200 || m.y > H + 200) {
        meteors.splice(i, 1);
      }
    }

    // spawn casuale
    if (Math.random() < 0.012) meteors.push(makeMeteor());

    requestAnimationFrame(draw);
  }

  // ── Init ─────────────────────────────────────────────────────────────

  meteors = [];
  resize();
  window.addEventListener('resize', resize);
  draw();
}());
