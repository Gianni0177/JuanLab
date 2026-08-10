// carica index.json + enemies.json, determina la rotazione attiva per data
(async function () {
  const grid = document.getElementById('abyss-grid');
  const meta  = document.getElementById('abyss-meta');
  const toggleEl = document.querySelector('.abyss-toggle');
  if (!grid) return;

  let enemyList, abyssIndex;
  try {
    [enemyList, abyssIndex] = await Promise.all([
      fetch('assets/data/enemies.json').then(r => r.json()),
      fetch('assets/data/abyss/index.json').then(r => r.json()),
    ]);
  } catch {
    grid.innerHTML = '<p class="abyss-error">Impossibile caricare i dati. Usa GitHub Pages o Live Server.</p>';
    return;
  }

  // carica tutti i file abyss elencati nell'index
  const abyssData = await Promise.all(
    abyssIndex.map(e => fetch(`assets/data/abyss/${e.file}`).then(r => r.json()))
  );

  // determina quale rotazione è attiva oggi
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let activeIdx = abyssIndex.findIndex(e => {
    const from = new Date(e.from);
    const to   = new Date(e.to);
    to.setHours(23, 59, 59);
    return today >= from && today <= to;
  });
  if (activeIdx < 0) activeIdx = 0;

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
      const m    = lookup[e.id] ?? { image_path: '', name: e.id };
      const hp   = (e.hp ?? 0).toLocaleString('it-IT');
      const tips = e.info?.length
        ? `<ul>${e.info.map(t => `<li>${t}</li>`).join('')}</ul>`
        : '<em style="color:#555">Nessun consiglio</em>';

      const card = document.createElement('div');
      card.className = 'enemy-card';
      card.innerHTML = `
        <span class="enemy-level">Lvl. ${e.level ?? '?'}</span>
        <div class="enemy-img-wrap">
          <img src="${m.image_path}" alt="${m.name}" loading="lazy" />
          <span class="tooltip-name">${m.name}</span>
        </div>
        <span class="enemy-hp">${hp} HP</span>
        <span class="enemy-qty">x${e.quantity ?? 1}</span>
        <span class="enemy-info">ⓘ<span class="tooltip-info">${tips}</span></span>`;
      enemiesEl.appendChild(card);
    }

    slotEl.appendChild(enemiesEl);
    return slotEl;
  }

  let countdownInterval = null;

  function startCountdown(entry, isActive) {
    clearInterval(countdownInterval);
    const el = document.getElementById('abyss-countdown');
    if (!el || !entry) return;

    const end = new Date(isActive ? entry.to : entry.from);
    end.setHours(4, 0, 0, 0);
    if (isActive) end.setDate(end.getDate() + 1);
    const label = isActive ? 'Finisce tra' : 'Inizia tra';

    countdownInterval = setInterval(() => {
      const diff = end - Date.now();
      if (diff <= 0) {
        el.textContent = isActive ? 'Rotazione scaduta' : 'Rotazione iniziata';
        clearInterval(countdownInterval);
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      el.textContent = `${label} ${d}g ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
    }, 1000);
  }

  function render(data, toDateStr) {
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
        <div class="abyss-total">HP totali Abyss: <strong>${totalAll}</strong></div>
        <div id="abyss-countdown" class="abyss-countdown"></div>`;
    }

    grid.innerHTML = '';
    const slots = data.slots ?? [];
    const rows  = [[slots[0], slots[1]], [slots[2], slots[3]], [slots[4], slots[5]]];

    rows.forEach((pair, i) => {
      const defined = pair.filter(Boolean);
      const rowHp   = totalHp(defined).toLocaleString('it-IT');
      const rowWrap = document.createElement('div');
      rowWrap.className = 'abyss-row';
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

  // genera toggle dinamico da index
  if (toggleEl) {
    abyssIndex.forEach((entry, i) => {
      const btn = document.createElement('button');
      btn.className = 'outline';
      btn.textContent = entry.label;
      if (i === activeIdx) btn.setAttribute('aria-current', 'true');
      btn.addEventListener('click', () => {
        toggleEl.querySelectorAll('button[data-idx]').forEach(b => b.removeAttribute('aria-current'));
        btn.setAttribute('aria-current', 'true');
        render(abyssData[i], abyssIndex[i].to);
        startCountdown(abyssIndex[i], i === activeIdx);
      });
      btn.dataset.idx = i;
      toggleEl.insertBefore(btn, document.getElementById('btn-download'));
    });
  }

  render(abyssData[activeIdx], abyssIndex[activeIdx].to);
  startCountdown(abyssIndex[activeIdx], true);

  // download
  document.getElementById('btn-download')?.addEventListener('click', async () => {
    const btn    = document.getElementById('btn-download');
    const stars  = document.getElementById('stars');
    const toggle = document.querySelector('.abyss-toggle');
    const target = document.querySelector('main.container');
    btn.disabled = true;
    btn.textContent = 'Generazione...';
    stars.style.display  = 'none';
    toggle.style.display = 'none';
    target.style.padding = '2rem 3rem';
    try {
      const canvas = await html2canvas(target, { backgroundColor: '#060810', scale: 2, useCORS: true, logging: false });
      const link = document.createElement('a');
      link.download = 'spyral-abyss.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download fallito:', err);
      alert('Download non riuscito. Apri la pagina via Live Server o GitHub Pages.');
    } finally {
      stars.style.display  = '';
      toggle.style.display = '';
      target.style.padding = '';
      btn.disabled = false;
      btn.textContent = '\u2193 Scarica immagine';
    }
  });
}());

