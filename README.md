# RoBby - Tracker Nou-Născut

## Pornire rapidă

### Opțiunea 1: Python (recomandat)
```
python server.py
```
Deschide: http://localhost:8080

### Opțiunea 2: Node.js (dacă e instalat)
```
npx serve .
```

### Opțiunea 3: VS Code
Instalează extensia "Live Server" și click dreapta pe `index.html` → "Open with Live Server"

---

## Funcționalități

- 🍼 Tracking mese (ml, tip lapte, oră)
- 💧 Tracking urină (cantitate, culoare)
- 💩 Tracking scaun (culoare, consistență)
- 📊 Raport zilnic cu navigare pe zile
- 📄 Export PDF pentru doctor (prin print browser)
- ⏰ Reminder hrănire bazat pe vârstă
- 🎨 Teme: Baby Blue / Cotton Pink
- 👨‍👩‍👧 Sincronizare între părinți (necesită Firebase gratuit)

## Sincronizare Firebase (opțional)

1. Mergeți pe https://firebase.google.com
2. Creați proiect nou (gratuit)
3. Activați **Realtime Database** → modul test
4. În Setări app → copiați configurația în secțiunea Firebase din app
5. Creați un cod familie → trimiteți celuilalt părinte
6. Celălalt părinte introduce codul → datele se sincronizează automat

## Instalare ca aplicație mobilă (PWA)

### iPhone (Safari):
Share → Add to Home Screen → Add

### Android (Chrome):
Meniu → Add to Home Screen
