# JuanLab

Sito personale pubblicato su **GitHub Pages** — dark theme, stelle cadenti, e una sezione dedicata allo **Spyral Abyss** di Genshin Impact.

🌐 **[juanlab live](https://Gianni0177.github.io/JuanLab/)**

---

## Struttura

```
JuanLab/
├── index.html              # Home
├── abyss.html              # Spyral Abyss tracker
├── favicon.png
├── assets/
│   ├── css/
│   │   ├── style.css       # Tema globale (override Pico CSS)
│   │   └── abyss.css       # Stili pagina Abyss
│   ├── js/
│   │   ├── main.js         # Animazione stelle canvas
│   │   └── abyss.js        # Logica griglia Abyss
│   ├── img/
│   │   ├── enemies/        # Icone nemici (.webp)
│   │   └── ...
│   └── data/
│       ├── enemies.json    # Dizionario nemici (id → nome + immagine)
│       ├── abyss_now.json  # Floor corrente
│       └── abyss_future.json # Floor prossima
└── docker-compose.yml      # Server locale nginx
```

---

## Avvio locale

**Con Docker** (consigliato):
```bash
docker compose up
# → http://localhost:8080
```

**Con Live Server** (VS Code): tasto destro su `index.html` → *Open with Live Server*

**Con Python**:
```bash
python -m http.server 8080
# → http://localhost:8080
```

> ⚠️ Aprire `index.html` direttamente come file (`file://`) non funziona — `fetch()` richiede un server HTTP.

---

## Aggiornare l'Abyss

Modifica `assets/data/abyss_now.json` o `abyss_future.json`:

```jsonc
{
  "period": "1 Ago – 15 Ago 2026",
  "gimmick": "Descrizione del buff globale...",
  "buff_first": "Buff Prima Metà...",
  "buff_second": "Buff Seconda Metà...",
  "slots": [
    {
      "slot": 1,
      "label": "Piano 12-1 Prima Metà",
      "enemies": [
        { "id": "Wayob_Bisonsaurus", "level": 95, "hp": 1192502, "quantity": 1, "info": ["tip"] }
      ]
    }
    // ... 5 slot restanti
  ]
}
```

L'`id` corrisponde al filename in `assets/img/enemies/` senza prefisso `UI_MonsterIcon_` e senza estensione.

---

## Pubblicare le modifiche

```bash
git add .
git commit -m "descrizione modifica"
git push
```

GitHub Pages si aggiorna entro 1–2 minuti dal push.
