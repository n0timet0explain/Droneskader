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
- `src/data/descriptions.json` – første afsnit af Z-Anatomys beskrivelse pr. struktur (genereret)
- `tools/build-anatomy.mjs` – bygger `src/assets/anatomy.glb` og `descriptions.json` fra Z-Anatomy

## Anatomiske lag
Alle lag kommer fra **Z-Anatomy** (baseret på BodyParts3D) og deler samme koordinatsystem: meter, y op, ansigt mod +z, anatomisk stilling.

| Lag | Indhold | Farve |
|---|---|---|
| `skin` | 250 hudregioner med anatomiske navne + øjnenes overflade | Hud |
| `muscle` | Skeletmuskler (fascier fjernet) | Rød |
| `vessels` | Arterier og vener (`kind: artery/vein`) | Rød / blå |
| `nerves` | Hjerne, rygmarv, perifere nerver, sanseorganer | Gul |
| `organs` | Indre organer + hjertet | Organfarve |
| `skeleton` | Knogler, brusk, ledbånd | Knogle |

Hver node har `extras = { layer, kind, name, side }`. Klik på huden slår hudregionens navn op i `src/data/regions.js`.

### Genopbyg modellen
```
git clone --depth 1 https://github.com/LluisV/Z-Anatomy /tmp/z-anatomy   # ca. 1,6 GB
node tools/build-anatomy.mjs /tmp/z-anatomy/Resources/Models/FBX
```
Scriptet konverterer FBX med FBX2glTF, fjerner etiketter, muskelfæster, fascier og hår, forenkler geometrien (meshoptimizer) og komprimerer med `EXT_meshopt_compression`.

## Licenser
- **Anatomi** (`src/assets/anatomy.glb`, `src/data/descriptions.json`): afledt af [Z-Anatomy](https://github.com/LluisV/Z-Anatomy) af Lluís Vinent Juanico og Z-Anatomy-projektet, **CC BY-SA 4.0**. Beskrivelserne stammer fra Wikipedia (CC BY-SA). Ændringer: konverteret til glTF, filtreret, forenklet og komprimeret. De afledte filer deles under samme licens.
- STØD Medical-logo: STØD Medical
- Fonte: Barlow, Barlow Condensed, IBM Plex Mono (SIL OFL) via Fontsource
