# JuanLab

Sito personale pubblicato su **GitHub Pages** — dark theme, stelle cadenti, e una sezione dedicata allo **Spyral Abyss** di Genshin Impact.

🌐 **[juanlab live](https://Gianni0177.github.io/JuanLab/)**

---

## Struttura

```
JuanLab/
├── index.html                  # Home page
├── abyss.html                  # Pagina dello Spyral Abyss
├── README.md                   # Documentazione del progetto
├── favicon.png                 # Icona del sito
├── assets/
│   ├── css/
│   │   ├── abyss.css           # Stili della pagina Abyss
│   │   └── style.css           # Stili generali del sito
│   ├── data/
│   │   ├── enemies.json        # Dizionario dei nemici
│   │   └── abyss/
│   │       ├── index.json      # Elenco dei periodi disponibili
│   │       ├── 2026-07-16.json # Dati Abyss di un periodo
│   │       └── 2026-08-16.json # Dati Abyss di un altro periodo
│   ├── img/
│   │   ├── enemies/            # Icone dei nemici
│   │   ├── memes/              # Immagini meme / extra
│   │   ├── pg/                 # Immagini dei personaggi
│   │   ├── favicon.png         # Icona locale
│   │   └── hero.png            # Immagine hero
│   └── js/
│       ├── abyss.js            # Logica della griglia Abyss
│       └── main.js             # Animazioni e script globali
```

---

## Avvio locale

**Con Live Server** (VS Code): tasto destro su `index.html` → *Open with Live Server*

**Con Python**:
```bash
python -m http.server 8080
# → http://localhost:8080
```

> ⚠️ Aprire `index.html` direttamente come file (`file://`) non funziona — `fetch()` richiede un server HTTP.

---

## Aggiornare l'Abyss

Aggiungi o modifica un file JSON nella cartella `assets/data/abyss/`, ad esempio `2026-08-16.json`, e assicurati che sia referenziato anche in `assets/data/abyss/index.json`.

Schema base:

```jsonc
{
  "period": "16 Ago – 16 Set 2026",
  "gimmick": "Descrizione del buff globale...",
  "buff_first": "Buff Prima Metà...",
  "buff_second": "Buff Seconda Metà...",
  "slots": [
    {
      "slot": 1,
      "label": "Piano 12-1 Prima Metà",
      "enemies": [
        { "id": "NomeNemico", "level": 95, "hp": 1192502, "quantity": 1 }
      ]
    }
  ]
}
```

L'`id` corrisponde al nome del file presente in `assets/img/enemies/`, senza prefisso o estensione.

---

## Pubblicare le modifiche

```bash
git add .
git commit -m "descrizione modifica"
git push
```

GitHub Pages si aggiorna entro 1–2 minuti dal push.
