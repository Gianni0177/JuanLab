(function () {
  const canvas = document.getElementById('stars');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const changelogContent = document.getElementById('changelog-content');
  const changelogToggle = document.getElementById('changelog-toggle');
  let W = 0;
  let H = 0;
  let stars = [];
  let meteors = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random() * 0.6 + 0.2,
    }));
  }

  function makeMeteor() {
    const fromTop = Math.random() < 0.6;
    return {
      x: fromTop ? Math.random() * W * 1.4 : W + 10,
      y: fromTop ? -10 : Math.random() * H * 0.4,
      len: Math.random() * 180 + 80,
      spd: Math.random() * 5 + 4,
      ang: (Math.random() * 30 + 20) * (Math.PI / 180),
      life: 1,
      fade: Math.random() * 0.01 + 0.008,
    };
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? ''
      : date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function renderChangelog(commits) {
    if (!changelogContent) return;
    changelogContent.innerHTML = `
      <div class="readme-card">
        <ul>
          ${commits.map((commit) => {
            const message = (commit.commit?.message || commit.message || '').split('\n')[0];
            const date = formatDate(commit.commit?.author?.date || commit.date || '');
            const sha = (commit.sha || '').slice(0, 7);
            return `
              <li>
                <div class="changelog-item__meta">${escapeHtml(date)}</div>
                <strong>${escapeHtml(message)}</strong>
                <div class="changelog-item__hash">${escapeHtml(sha)}</div>
              </li>
            `;
          }).join('')}
        </ul>
        <a class="changelog-link" href="https://github.com/Gianni0177/JuanLab/commits/main" target="_blank" rel="noreferrer">Vedi tutti</a>
      </div>
    `;
  }

  function toggleChangelog() {
    if (!changelogContent || !changelogToggle) return;
    const isExpanded = changelogContent.hidden === false;
    changelogContent.hidden = isExpanded;
    changelogToggle.setAttribute('aria-expanded', String(!isExpanded));
    changelogToggle.textContent = isExpanded ? 'Mostra' : 'Nascondi';
  }

  async function loadChangelog() {
    const fallbackCommits = [
      { sha: '2ce3040', date: '2026-08-10T00:00:00Z', commit: { message: 'update readme', author: { date: '2026-08-10T00:00:00Z' } } },
      { sha: 'cfe632c', date: '2026-08-10T00:00:00Z', commit: { message: 'Added tips', author: { date: '2026-08-10T00:00:00Z' } } },
      { sha: 'febb037', date: '2026-08-10T00:00:00Z', commit: { message: 'Added enemy assets and changed abyss functionality', author: { date: '2026-08-10T00:00:00Z' } } },
      { sha: '147234e', date: '2026-08-10T00:00:00Z', commit: { message: 'Update README.md', author: { date: '2026-08-10T00:00:00Z' } } }
    ];

    try {
      const response = await fetch('https://api.github.com/repos/Gianni0177/JuanLab/commits?per_page=8');
      if (!response.ok) throw new Error('Commit history unavailable');
      const commits = await response.json();
      const filteredCommits = commits.filter((commit) => {
        const message = (commit.commit?.message || commit.message || '').split('\n')[0];
        return !message.toLowerCase().startsWith('merge ');
      }).slice(0, 5);
      renderChangelog(filteredCommits);
    } catch (error) {
      renderChangelog(fallbackCommits);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fill();
    }

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
      m.x += Math.cos(m.ang) * m.spd;
      m.y += Math.sin(m.ang) * m.spd;
      m.life -= m.fade;
      if (m.life <= 0 || m.x > W + 200 || m.y > H + 200) {
        meteors.splice(i, 1);
      }
    }

    if (Math.random() < 0.012) meteors.push(makeMeteor());
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  if (changelogToggle) {
    changelogToggle.addEventListener('click', toggleChangelog);
  }
  loadChangelog();
  draw();
}());
