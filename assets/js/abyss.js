// carica i tre JSON in parallelo e popola la griglia con toggle now/future
(async function () {
  const grid = document.getElementById('abyss-grid');
  const meta  = document.getElementById('abyss-meta');
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

  // mappa id -> { image_path, name }
  const lookup = {};
  for (const e of enemyList) {
    const filename = e.image_path.split('/').pop();
    const id = filename.replace('UI_MonsterIcon_', '').replace(/\.\w+$/, '');
    lookup[id] = { image_path: e.image_path, name: e.name };
  }

  function totalHp(slots) {
    return slots.reduce((sum, slot) =>
      sum + (slot.enemies ?? []).reduce((s, e) => s + (e.hp ?? 0) * (e.quantity ?? 1), 0)
    , 0);
  }

  function buildSlotEl(slot) {
    const slotEl = document.createElement('div');
    slotEl.className = 'abyss-slot';

    const label = document.createElement('p');
    label.className = 'slot-label';
    label.textContent = slot.label;
    slotEl.appendChild(label);

    if (slot.buff) {
      const buff = document.createElement('p');
      buff.className = 'slot-buff';
      buff.textContent = slot.buff;
      slotEl.appendChild(buff);
    }

    const enemiesEl = document.createElement('div');
    enemiesEl.className = 'slot-enemies';
    const enemies = slot.enemies ?? [];

    if (!enemies.length) {
      enemiesEl.innerHTML = '<span class="slot-empty">Nessun nemico configurato</span>';
    }

    for (const e of enemies) {
      const meta = lookup[e.id] ?? { image_path: '', name: e.id };
      const hp   = (e.hp ?? 0).toLocaleString('it-IT');
      const tips = e.info?.length
        ? `<ul>${e.info.map(t => `<li>${t}</li>`).join('')}</ul>`
        : '<em style="color:#555">Nessun consiglio</em>';

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
    return slotEl;
  }

  function render(data) {
    // sezione gimmick / periodo
    if (meta) {
      const makeBuff = (label, text) => text
        ? `<div class="abyss-buff"><span class="buff-half">${label}</span>${text}</div>`
        : '';
      const totalAll = totalHp(data.slots ?? []).toLocaleString('it-IT');
      meta.innerHTML = `
        <div class="abyss-period">${data.period ?? ''}</div>
        ${makeBuff('Buff stagionale', data.gimmick)}
        ${makeBuff('Prima met\u00e0', data.buff_first)}
        ${makeBuff('Seconda met\u00e0', data.buff_second)}
        <div class="abyss-total">HP totali Abyss: <strong>${totalAll}</strong></div>`;
    }

    // griglia: raggruppa slot a coppie (Camera 1, 2, 3)
    grid.innerHTML = '';
    const slots = data.slots ?? [];
    const rows  = [[slots[0], slots[1]], [slots[2], slots[3]], [slots[4], slots[5]]];

    rows.forEach((pair, i) => {
      const defined = pair.filter(Boolean);
      const rowHp   = totalHp(defined).toLocaleString('it-IT');

      const rowWrap = document.createElement('div');
      rowWrap.className = 'abyss-row';

      // header di riga con Camera N e HP totali
      rowWrap.innerHTML = `
        <div class="row-header">
          <span class="row-label">Camera ${i + 1}</span>
          <span class="row-hp">${rowHp} HP totali</span>
        </div>`;

      const rowSlots = document.createElement('div');
      rowSlots.className = 'row-slots';
      defined.forEach(slot => rowSlots.appendChild(buildSlotEl(slot)));
      rowWrap.appendChild(rowSlots);
      grid.appendChild(rowWrap);
    });
  }

  // toggle
  document.querySelectorAll('[data-abyss]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-abyss]').forEach(b => b.removeAttribute('aria-current'));
      btn.setAttribute('aria-current', 'true');
      render(btn.dataset.abyss === 'now' ? dataNow : dataFuture);
    });
  });

  document.querySelector('[data-abyss="now"]')?.setAttribute('aria-current', 'true');
  render(dataNow);

  // download griglia come PNG
  document.getElementById('btn-download')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-download');
    const stars = document.getElementById('stars');
    btn.disabled = true;
    btn.textContent = 'Generazione...';
    // nasconde il canvas stelle durante la cattura
    stars.style.display = 'none';
    try {
      const canvas = await html2canvas(document.querySelector('main.container'), {
        backgroundColor: '#060810',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = 'spyral-abyss.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download fallito:', err);
      alert('Download non riuscito. Apri la pagina via Live Server o GitHub Pages.');
    } finally {
      stars.style.display = '';
      btn.disabled = false;
      btn.textContent = '\u2193 Scarica immagine';
    }
  });
}());

