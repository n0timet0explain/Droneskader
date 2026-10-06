# Droneskader – STØD Medical

3D-værktøj (Windows) der viser hvordan skader fra FPV-droner ser ud på den menneskelige krop.
Målgruppe: medlemmer af STØD Medical.

## Klinisk korrekthed går forud for alt

- Skader skal vises **klinisk korrekt og realistisk**, ikke stiliseret. Vi kan ikke hjælpe nogen, hvis vi kun kender stiliserede sår.
- Teamet har set videoer af rigtige sårede og ved, at indholdet er voldsomt. Mild det ikke ned, tilføj ingen advarsler og sløre ingenting.
- Er en skade usikker eller ikke dokumenteret, så skriv det, frem for at forenkle den.
- Al medicinsk tekst har en valideringsstatus (kladde / til review / valideret). En ekstern fagperson validerer.

## Afgrænsning

- Første fokus: **at forstå skaderne** (mekanisme og hvordan de ser ud på kroppen).
- Ladninger: **kun spræng-splint (HE-FRAG) for nu**, dvs. OFBCh-1.7 til -4 (FPV) og OFSP-0.5 til -2.5 (nedkastede bomblets) samt en typisk russisk håndgranat (kun RGD-5) som improviseret droneammunition. Håndgranater er ikke med i RAP-009 og kræver egen kilde. Kumulativ/EFP, termobarisk, brandstiftende og retningsbestemt anti-drone-splint (OFBCh-0.4/0.5/0.8) er udenfor scope.
- MARCH/TCCC-førstehjælp og udstyrskatalog bliver, men kommer i anden række.
- Ingen gap-analyse af udstyr i dette værktøj.

## Rammer

- Grundlag: TCCC. Udrustning: dansk standard (konkrete modeller bekræftes af teamet).
- Sprog: dansk og engelsk. TCCC-termer altid på engelsk med dansk forklaring.
- Ladninger: tag udgangspunkt i de rigtige sprænghovedklasser i Confluence RAP-009. Skadesmekanik i RAP-002 og SYN-005. Klinisk kilde: Ryan's Ballistic Trauma.
- Design: STØD Medical "Tactical Minimalism" (ingen afrundede hjørner, ingen emoji, ingen kursiv, labels i versaler, dæmpede signalfarver). Fonte pakkes lokalt, så appen kører offline.

## Arbejdsgang

- Opret **ingen arbejdsblade eller Confluence-sider** for dette projekt, før brugeren siger til.
- Anatomimodellen (Z-Anatomy, CC BY-SA 4.0) bygges med `node tools/build-anatomy.mjs <Z-Anatomy/Resources/Models/FBX>`. Kreditering skal blive i appen og README.
