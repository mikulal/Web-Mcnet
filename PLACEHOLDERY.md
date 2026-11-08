# Placeholdery čekající na doplnění

Generováno skriptem `node src/build.mjs`. Po doplnění údajů v `data/*.json` spusť build znovu, tento seznam se aktualizuje.

## Firemní údaje (data/firma.json)

- `opravneni_ticr`: [TIČR – rozsah a číslo oprávnění]
- `linkedin`: [URL PROFILU LINKEDIN]
- `naceneni_pracovnich_dnu`: [n]
- `doklady.0.platnost`: [platnost]
- `doklady.1.platnost`: [datum výpisu]
- `doklady.2.platnost`: [limit] Kč · [platnost]
- `doklady.3.platnost`: [datum]
- `doklady.4.platnost`: [datum]

## Reference (data/reference.json)

Detailní stránky se generují až s `"detail": true`. Zatím: 3 z 11.

### Optická trasa kotelna SO06 – dočasný velín, Teplárna TAS Dětmarovice
- vše vyplněno

### Slaboproudé kabeláže, rozšíření prostor IBC Ostrava
- vše vyplněno

### Dodávka a zprovoznění aktivních prvků, Matiční gymnázium Ostrava
- vše vyplněno

### Rekonstrukce síťové infrastruktury, SUŠ Ostrava
- vše vyplněno

### Páteřní rozvody MaR, Městská nemocnice Ostrava Fifejdy
- `rozsah_detail.2`: [délka páteře, počet propojených objektů]

### DPS stavební připravenosti, ÚO Policie ČR Karviná
- vše vyplněno

### Optická trasa SO06 – SO09, Teplárna TAS Dětmarovice
- `objednatel`: [INVESTOR]

### Optická trasa SO04 – SO09, Teplárna TAS Dětmarovice
- `objednatel`: [INVESTOR]

### KŘP MSK, Frýdek-Místek – DPS
- `objednatel`: [OBJEDNATEL]
- `tabulka_objednatel`: [OBJEDNATEL]
- `doba_realizace`: [od – do]
- `rozsah`: DPS · [rozsah]
- `rozsah_detail.1`: [profese a rozsah]

### Instalace přístupových bodů Wi‑Fi, CS-Cont Zlaté Hory
- `sektor`: [sektor]

### Rekonstrukce rozvodů NN a SLP, OO PČR Frýdlant nad Ostravicí
- `rozsah_detail.1`: [počet linek, rozvaděčů]

## Mimo data – k doplnění nebo rozhodnutí

- **Fotky ze staveb** (`public/img/`, WebP + JPEG, max. 1600 px): úvod 3×, služby 3×, Pro zhotovitele 1×, každá reference 1–2×. Zatím šedé bloky s popiskem.
- **PDF doklady** do `public/doklady/` s názvy z `firma.json` → po buildu se z „připravujeme“ stanou odkazy.
- **Další reference** „dle seznamu od Luboše“ – doplnit do `data/reference.json`.
- **Doba uložení nerealizovaných poptávek** na /ochrana-osobnich-udaju; text stránky nechat zkontrolovat (příjemci údajů).
- **Staré URL www.mcnet.cz** pro `public/_redirects` (dnes tam běží jen stránka „Vaše IP adresa“, bez sitemap).
- **HPE partnerství**: `hpe_partner` je `false`, web zmiňuje jen produkty HPE Aruba, ne partnerství.
- **NAP**: adresa je z ARES ve tvaru „J. Opletala 924“ (starý prototyp měl „Jana Opletala 924“) – stejný zápis použít v Google Business Profile a na firmy.cz.

## Výskyt na stránkách

| Placeholder | Stránky |
|---|---|
| `[Foto: OTDR měření na optické vaně]` | /sluzby/mereni-a-dokumentace |
| `[INVESTOR]` | /reference/detmarovice-so04-so09, /reference/detmarovice-so06-so09 |
| `[OBJEDNATEL]` | /pro-zadavatele/obce-a-urady, /reference/, /sluzby/projekce-slaboproudu |
| `[TIČR – rozsah a číslo oprávnění]` | /doklady |
| `[doba uložení nerealizovaných poptávek]` | /ochrana-osobnich-udaju |
| `[n]` | /, /pro-zhotovitele |
| `[rozsah]` | /reference/ |
