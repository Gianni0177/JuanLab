// popola la griglia Abyss leggendo assets/data/enemies.json
(async function () {
  const grid = document.getElementById('abyss-grid');
  if (!grid) return;

  let slots;
  try {
    const res = await fetch('assets/data/enemies.json');
    if (!res.ok) throw new Error(res.status);
    slots = await res.json();
  } catch {
    grid.innerHTML = '<p class="abyss-error">Impossibile caricare i dati. Apri la pagina via server (GitHub Pages o Live Server).</p>';
    return;
  }

  for (const slot of slots) {
    const slotEl = document.createElement('div');
    slotEl.className = 'abyss-slot';

    const label = document.createElement('p');
    label.className = 'slot-label';
    label.textContent = slot.label;
    slotEl.appendChild(label);

    const enemiesEl = document.createElement('div');
    enemiesEl.className = 'slot-enemies';

    for (const e of slot.enemies) {
      const hp    = e.hp.toLocaleString('it-IT');
      const tips  = e.info.map(t => `<li>${t}</li>`).join('');

      const card  = document.createElement('div');
      card.className = 'enemy-card';
      card.innerHTML = `
        <span class="enemy-level">Lvl. ${e.level}</span>
        <div class="enemy-img-wrap">
          <img src="${e.image_path}" alt="${e.name}" loading="lazy" />
          <span class="tooltip-name">${e.name}</span>
        </div>
        <span class="enemy-hp">${hp} HP</span>
        <span class="enemy-qty">x${e.quantity}</span>
        <span class="enemy-info">ⓘ<span class="tooltip-info"><ul>${tips}</ul></span></span>`;

      enemiesEl.appendChild(card);
    }

    slotEl.appendChild(enemiesEl);
    grid.appendChild(slotEl);
  }
}());
