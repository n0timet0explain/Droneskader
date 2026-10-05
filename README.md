# Droneskader – 3D førstehjælpstræner

Interaktiv 3D-model, der viser hvordan fragmenter fra en FPV-drone rammer kroppen, hvordan soldaterudrustning ændrer skadesmønstret, og hvilken førstehjælp (MARCH/TCCC) hver skade kræver.

## Kør
```
npm install
npm run dev     # udvikling
npm run build   # dist/index.html – én selvstændig fil, kører offline
```

## Struktur
- `src/body.js` – 3D-figur og opslag fra ramt punkt til klinisk region
- `src/gear.js` – udrustning (hjelm, briller, vest, plader …) og presets
- `src/regions.js` – medicinsk indhold pr. region + IFAK-udstyr
- `src/main.js` – scene, simulering og UI

> Illustrativ model – ikke en ballistisk simulering. Medicinsk indhold skal fagligt valideres.
