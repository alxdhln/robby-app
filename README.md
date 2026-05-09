# RoBby — Tracker Nou-Născut

Aplicație web progresivă (PWA) pentru urmărirea activității zilnice a nou-născutului. Funcționează direct din browser, fără instalare, și poate fi adăugată pe ecranul principal al telefonului ca aplicație nativă.

---

## Pornire rapidă

### Python
```
python server.py
```
Deschide: http://localhost:8080

### Node.js
```
npx serve .
```

### VS Code
Instalează extensia **Live Server** → click dreapta pe `index.html` → *Open with Live Server*

### Fișier direct
Deschide `index.html` direct din browser (fără server local funcționalitățile de bază funcționează).

---

## Instalare ca aplicație mobilă (PWA)

**iPhone (Safari):** Distribuie → Adaugă pe ecranul principal

**Android (Chrome):** Meniu → Adaugă pe ecranul principal

---

## Ecrane și funcționalități

### 🏠 Acasă
- Cronometru „Următoarea hrănire" — calculat automat pe baza ultimei mese și intervalului recomandat pentru vârstă
- Rezumat zilnic: număr mese, ml total formulă, treabă mică, treabă mare, medicație
- Alertă banner pentru vaccinuri scadente
- Acces rapid la Medicație

### 🍼 Hrănire
- Tipuri: sân, formulă, mixt
- Înregistrare cantitate în ml (pentru formulă)
- Selector marcă formulă cu autocompletare (memorată în Setări)
- Câmp notițe opțional
- Afișare oră exactă a înregistrării

### 💧 Treabă mică
- Selector culoare urină: Galbenă deschis, Galbenă, Galbenă închis, Portocalie, Roz / Roșiatică, Incoloră, Maro închis
- Avertismente automate pentru culori care necesită atenție medicală (toast galben = consultați medicul, toast roșu = urgent)
- Câmp notițe opțional

### 💩 Treabă mare
- Selector culoare scaun
- Selector consistență: normală, lichidă, tare, cu mucus
- Câmp notițe opțional

### 💊 Medicație
- Înregistrare medicament: nume, doză, unitate (ml / mg / picături)
- Marcare Vitamina D (afișată separat în jurnal)
- Înregistrare temperatură corporală (°C)
- Câmp notițe opțional

### 📏 Creștere
- Înregistrare greutate (kg), înălțime (cm), perimetru cranian (cm)
- Grafice cu curbele de creștere OMS (P3 / P15 / P50 / P85 / P97) pentru greutate, înălțime și perimetru cranian
- Navigare pe ferestre de 6 luni (0–6 luni / 6–12 luni) cu butoane ‹ ›
- Toate punctele de măsurare afișate individual pe grafic, cu etichete de valoare
- Poziționare percentilă automată pentru ultima măsurătoare (ex: „între P50 și P85")
- Listă completă a măsurătorilor cu opțiune de ștergere

### 💉 Vaccinuri
- Calendar vaccinal conform schemei naționale românești (10 vaccinuri, 0–12 luni):
  - Hepatita B doza 1 — la naștere
  - BCG (tuberculoză) — la naștere
  - Hepatita B doza 2 + Hexavalent doza 1 + Pneumococic doza 1 — 2 luni
  - Hexavalent doza 2 + Pneumococic doza 2 — 4 luni
  - Hexavalent doza 3 + Pneumococic doza 3 — 11 luni
  - ROR (rujeolă-rubeolă-oreion) doza 1 — 12 luni
- Marcare vaccinuri efectuate (cu dată)
- Banner alertă pe ecranul principal când un vaccin se apropie de scadență

### 📊 Raport
- Vizualizare activitate pe: Zi / Săptămână / Lună
- Jurnal cronologic cu toate evenimentele zilei selectate
- Export PDF complet pentru medic (3 pagini):
  - **Pagina 1** — antet albastru cu datele bebelușului, grilă rezumat (6 carduri: hrăniri, treabă mică, treabă mare, medicație, vaccin următor, ultima greutate), jurnal activitate cu cercuri colorate pe tip eveniment
  - **Pagina 2** — 3 grafice de bare: ml formulă/zi, treabă mică/zi, treabă mare/zi (ultimele 7 zile)
  - **Pagina 3** *(opțional)* — grafic evoluție greutate cu curbele OMS, tabel măsurători cu percentilă, casetă explicativă „Despre percentile"
- Footer pe fiecare pagină cu data generării și numerotarea paginilor

### 📈 Statistici
- Grafice de bare pentru ultimele 7 zile: ml formulă, număr treabă mică, număr treabă mare
- Navigare pe luni

### ⚙️ Setări
- **Bebeluș** — nume, dată naștere, sex; suport mai mulți bebeluși
- **Formula implicită** — marcă memorată, pre-completată automat la hrănire
- **Notificări:**
  - Alertă hrănire (configurabil: după câte ore)
  - Reminder Vitamina D (la ora setată)
  - Alertă vaccin scadent (cu câte zile înainte)
- **Rapoarte** — perioadă implicită (Zi / Săptămână / Lună), control includere grafice și creștere în PDF
- **Aspect** — temă Baby Blue / Cotton Pink, mod întunecat (Dark Mode)
- Resetare date aplicație

---

## Teme vizuale

| Temă | Culoare principală |
|---|---|
| Baby Blue (implicit) | Albastru #4A90D9 |
| Cotton Pink | Roz #C95B87 |

Ambele teme suportă **mod întunecat** (fundal #121A24, text deschis).

---

## Date locale

Toate datele sunt stocate local în `localStorage` al browserului. Nu există cont, nu există server, nu există date trimise în afara dispozitivului.

---

## Structura proiectului

```
index.html   — markup complet (single-page app)
css/app.css  — stiluri complete
js/app.js    — logică completă (fără dependențe externe în afara jsPDF)
manifest.json
service-worker.js
```

---

*Realizat cu drag pentru părinții de nou-născuți.*
