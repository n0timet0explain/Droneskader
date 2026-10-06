# Droneskader – STØD Medical

3D-værktøj der viser hvordan skader fra HE-FRAG-ladninger (FPV-droner, nedkastede bomblets, RGD-5) ser ud på og i den menneskelige krop. Se `CLAUDE.md` for afgrænsning og principper.

## Kør
```
npm install
npm run dev     # udvikling
npm run build   # dist/index.html – én selvstændig fil, kører offline
```

## Struktur
- `src/main.js` – UI, panelerne og klik på kroppen
- `src/scene.js` – 3D-scene, anatomiske lag og valg af punkt
- `src/i18n.js` – dansk/engelsk
- `src/data/regions.js` – kropsregioner, strukturer under huden og klassificering af et punkt
- `src/data/munitions.js` – HE-FRAG-ladninger (RAP-009 + RGD-5)
- `src/styles.css` – STØD Medical Tactical Minimalism
- `tools/build-body.mjs` – bygger `src/assets/body.glb` fra MakeHuman-kilderne
- `tools/region-map.mjs` – ASCII-kort til at tjekke regionsgrænserne

## Anatomiske lag
| Lag | Status | Kilde |
|---|---|---|
| Hud | Indlæst | MakeHuman basismesh + mande-targets (CC0) |
| Muskler, kar og nerver, organer, skelet | Mangler | Planlagt: Z-Anatomy / BodyParts3D (CC BY-SA) |

Lag indlæses fra GLB-noder med `extras.layer` = `skin | muscle | vessels | organs | skeleton`.

## Licenser for assets
- MakeHuman basismesh og targets: CC0 (Data Collection AB m.fl.), `assets/models/`
- STØD Medical-logo: STØD Medical
- Fonte: Barlow, Barlow Condensed, IBM Plex Mono (SIL OFL) via Fontsource
