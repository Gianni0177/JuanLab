// carica i tre JSON in parallelo e popola la griglia con toggle now/future
(async function () {
  const grid = document.getElementById('abyss-grid');
  if (!grid) return;

  let enemyList, dataNow, dataFuture;
  try {
    [enemyList, dataNow, dataFuture] = await Promise.all([
      fetch('assets/data/enemies.json').then(r => r.json()),
      fetch('assets/data/abyss_now.json').then(r => r.json()),
      fetch('assets/data/abyss_future.json').then(r => r.json()),
    ]);
  } catch {
    grid.innerHTML = '<p class="abyss-error">Impossibile caricare i dati. Usa GitHub Pages o Live Server.</p>';
    return;
  }

  // mappa id -> { image_path, name }  (id = filename senza prefisso e senza estensione)
  const lookup = {};
  for (const e of enemyList) {
    const filename = e.image_path.split('/').pop();                  // UI_MonsterIcon_Foo.webp
    const id = filename.replace('UI_MonsterIcon_', '').replace(/\.\w+$/, '');
    lookup[id] = { image_path: e.image_path, name: e.name };
  }

  function renderSlots(slots) {
    grid.innerHTML = '';
    for (const slot of slots) {
      const slotEl = document.createElement('div');
      slotEl.className = 'abyss-slot';

      const label = document.createElement('p');
      label.className = 'slot-label';
      label.textContent = slot.label;
      slotEl.appendChild(label);

      const enemiesEl = document.createElement('div');
      enemiesEl.className = 'slot-enemies';

      if (!slot.enemies.length) {
        enemiesEl.innerHTML = '<span class="slot-empty">Nessun nemico configurato</span>';
      }

      for (const e of slot.enemies) {
        const meta  = lookup[e.id] ?? { image_path: '', name: e.id };
        const hp    = (e.hp ?? 0).toLocaleString('it-IT');
        const tips  = e.info?.length
          ? `<ul>${e.info.map(t => `<li>${t}</li>`).join('')}</ul>`
          : '<em style="color:#666">Nessun consiglio</em>';

        const card = document.createElement('div');
        card.className = 'enemy-card';
        card.innerHTML = `
          <span class="enemy-level">Lvl. ${e.level ?? '?'}</span>
          <div class="enemy-img-wrap">
            <img src="${meta.image_path}" alt="${meta.name}" loading="lazy" />
            <span class="tooltip-name">${meta.name}</span>
          </div>
          <span class="enemy-hp">${hp} HP</span>
          <span class="enemy-qty">x${e.quantity ?? 1}</span>
          <span class="enemy-info">ⓘ<span class="tooltip-info">${tips}</span></span>`;

        enemiesEl.appendChild(card);
      }

      slotEl.appendChild(enemiesEl);
      grid.appendChild(slotEl);
    }
  }

  // toggle
  let active = 'now';
  document.querySelectorAll('[data-abyss]').forEach(btn => {
    btn.addEventListener('click', () => {
      active = btn.dataset.abyss;
      document.querySelectorAll('[data-abyss]').forEach(b => b.removeAttribute('aria-current'));
      btn.setAttribute('aria-current', 'true');
      renderSlots(active === 'now' ? dataNow : dataFuture);
    });
  });

  // render iniziale
  document.querySelector('[data-abyss="now"]')?.setAttribute('aria-current', 'true');
  renderSlots(dataNow);
}());
