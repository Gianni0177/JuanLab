# JuanLab

Sito personale su GitHub Pages con tema dark, sfondo animato e pagine dedicate a:

- Spyral Abyss
- Imaginarium Theater
- Stygian Onslaught

Live: [https://gianni0177.github.io/JuanLab/](https://gianni0177.github.io/JuanLab/)

## Pagine principali

- Home: `index.html`
- Spyral Abyss: `abyss.html`
- Imaginarium Theater: `theater.html`
- Stygian Onslaught: `stygian.html`

## Struttura progetto

```text
JuanLab/
├── index.html
├── abyss.html
├── theater.html
├── stygian.html
├── README.md
└── assets/
    ├── css/
    │   ├── style.css
    │   ├── abyss.css
  │   ├── theater.css
  │   └── stygian.css
    ├── js/
    │   ├── home.js
    │   ├── main.js
    │   ├── abyss.js
  │   ├── theater.js
  │   └── stygian.js
    ├── data/
    │   ├── enemies.json
    │   ├── enemies.txt
    │   ├── abyss/
    │   │   ├── index.json
    │   │   ├── 2026-07-16.json
    │   │   └── 2026-08-16.json
    │   └── theater/
    │       ├── index.json
    │       ├── 2026-08-01.json
  │       └── 2026-09-01.json
  │   └── stygian/
  │       ├── index.json
  │       └── 2026-05-19.json
    └── img/
        ├── hero.png
        ├── favicon.png
        ├── enemies/
        ├── characters/
        ├── elements/
        └── memes/
```

## Avvio locale

Con Live Server (VS Code):

1. Apri `index.html`
2. Click destro
3. Open with Live Server

Con Python:

```bash
python -m http.server 8080
```

Apri poi `http://localhost:8080`.

Nota: l'apertura diretta in `file://` non funziona correttamente perché i file JSON vengono caricati con `fetch()`.

## Aggiornare Spyral Abyss

1. Crea o modifica un file in `assets/data/abyss/` (es. `2026-08-16.json`)
2. Aggiorna `assets/data/abyss/index.json` con periodo e nome file

Schema minimo:

```json
{
  "period": "Periodo live: 16 Agosto 2026 ~ 16 Settembre 2026",
  "gimmick": "Descrizione buff globale",
  "buff_first": "Descrizione buff prima meta",
  "buff_second": "Descrizione buff seconda meta",
  "slots": [
    {
      "slot": 1,
      "label": "Piano 12-1 Prima meta",
      "enemies": [
        { "id": "Fungus_Raptor", "level": 100, "hp": 1192502, "quantity": 1 }
      ]
    }
  ]
}
```

`id` deve corrispondere alla chiave usata dal progetto per i nemici (derivata dalle icone in `assets/img/enemies/` e dal lookup in `assets/data/enemies.json`).

## Aggiornare Imaginarium Theater

1. Crea o modifica un file in `assets/data/theater/` (es. `2026-09-01.json`)
2. Aggiorna `assets/data/theater/index.json`

Campi principali:

- `period`
- `fixed_buff`
- `mechanics` (`recommended_elements`, `opening_characters`, `guest_stars`)
- `selected_mode`
- `modes` (`lunar`, `visionary`, `hard`, `normal`, `easy`)
- `strategies`

Per avere la sezione Strategie presente ma vuota, usa:

```json
"strategies": []
```

Esempio singola strategia:

```json
"strategies": [
  {
    "title": "Gestione energia",
    "points": [
      "Priorita ai personaggi con ricarica alta",
      "Conserva i pg di punta per gli atti boss"
    ]
  }
]
```

## Aggiornare Stygian Onslaught

1. Crea o modifica un file in `assets/data/stygian/`
2. Aggiorna `assets/data/stygian/index.json`

Campi principali:

- `version`
- `period`
- `description`
- `selected_difficulty`
- `overview`
- `difficulties`

Ogni difficolta contiene un array `bosses`, e ogni boss usa `enemy_id` per recuperare nome e immagine da `assets/data/enemies.json`.

Schema minimo:

```json
{
  "version": "v6.7",
  "selected_difficulty": "6",
  "overview": {
    "title": "Panoramica rotazione",
    "description": "Note generali sulla rotazione",
    "points": []
  },
  "difficulties": {
    "6": {
      "label": "Difficolta 6",
      "notes": "Focus generale",
      "bosses": [
        {
          "enemy_id": "Monitor_02",
          "hp": 14480438,
          "level": 100,
          "advantages": ["Cryo ed Electro"],
          "disadvantages": ["Personaggi melee"],
          "resistances": {
            "pyro": "10%",
            "hydro": "10%",
            "dendro": "10%",
            "electro": "10%",
            "anemo": "10%",
            "cryo": "10%",
            "geo": "10%",
            "physical": "10%"
          },
          "mechanics": [
            {
              "title": "Nome meccanica",
              "description": "Descrizione breve"
            }
          ]
        }
      ]
    }
  }
}
```

## Aggiornare info nemici

File: `assets/data/enemies.json`

Regole utili:

- `name` e icona devono essere coerenti
- `info` deve essere un array di stringhe
- se non hai consigli, usa `"info": [""]` oppure `"info": []`
- usa sempre doppi apici standard `"` (evita virgolette tipografiche)

## Deploy

```bash
git add .
git commit -m "Aggiornamento contenuti"
git push
```

GitHub Pages pubblica di solito entro 1-2 minuti.
