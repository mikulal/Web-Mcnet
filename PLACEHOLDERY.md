# Placeholdery čekající na doplnění

Generováno skriptem `node src/build.mjs`. Po doplnění údajů v `data/*.json` spusť build znovu, tento seznam se aktualizuje.

## Firemní údaje (data/firma.json)

- `telefon`: +420 [TELEFON]
- `email`: [EMAIL]
- `datova_schranka`: [ID DATOVÉ SCHRÁNKY]
- `opravneni_ticr`: [TIČR – rozsah a číslo oprávnění]
- `linkedin`: [URL PROFILU LINKEDIN]
- `naceneni_pracovnich_dnu`: [n]
- `doklady.0.platnost`: [platnost]
- `doklady.1.platnost`: [datum výpisu]
- `doklady.2.platnost`: [limit] Kč · [platnost]
- `doklady.3.platnost`: [datum]
- `doklady.4.platnost`: [datum]
- `og_image`: chybí vlastní fotka pro Open Graph (např. /img/og.jpg, 1200×630)

## Reference (data/reference.json)

Detailní stránky se generují až s `"detail": true`. Zatím: 0 z 7.

### Optická trasa Dětmarovice, SO 06
- `objednatel`: [OBJEDNATEL / INVESTOR]
- `sektor`: [sektor]
- `doba_realizace`: [od – do]
- `rozsah`: [km] trasy · [n] vl. SM G.652D
- `rozsah_detail.0`: [délka trasy km]
- `rozsah_detail.1`: [počet vláken, typ kabelu]
- `rozsah_detail.2`: [počet svarů]
- `rozsah_detail.3`: [ukončení – vany, rozvaděče]

### Věznice Vinařice – datové kabely MaR, II. etapa
- `doba_realizace`: [od – do]
- `rozsah`: [n] linek · měření Cat6
- `rozsah_detail.0`: [počet linek]
- `rozsah_detail.1`: [kategorie, typ kabelu]
- `rozsah_detail.2`: [počet rozvaděčů]

### Síťová infrastruktura, Matiční gymnázium Ostrava
- `doba_realizace`: [od – do]
- `rozsah_detail.2`: aktivní prvky – [počet a typ]

### Areál Fifejdy – optická páteř
- `objednatel`: [OBJEDNATEL]
- `tabulka_objednatel`: [OBJEDNATEL]
- `sektor`: [sektor]
- `doba_realizace`: [od – do]
- `rok`: [rok]
- `rozsah`: [rozsah]
- `rozsah_detail.0`: [délka páteře]
- `rozsah_detail.1`: [počet vláken, typ kabelu]
- `rozsah_detail.2`: [počet propojených objektů]

### SUŠ Ostrava, Poděbradova – strukturovaná kabeláž
- `objednatel`: [OBJEDNATEL]
- `tabulka_objednatel`: [OBJEDNATEL]
- `doba_realizace`: [od – do]
- `rok`: [rok]
- `rozsah`: [n] portů Cat6A · [n] vl.
- `rozsah_detail.0`: [počet portů Cat6A]
- `rozsah_detail.1`: [optika – počet vláken]
- `rozsah_detail.2`: [počet rozvaděčů]

### IBC Ostrava – optické propoje
- `objednatel`: [OBJEDNATEL / INVESTOR]
- `sektor`: [sektor]
- `doba_realizace`: [od – do]
- `rok`: [rok]
- `rozsah`: [rozsah]
- `rozsah_detail.0`: [počet propojů]
- `rozsah_detail.1`: [počet vláken, typ]
- `rozsah_detail.2`: [počet svarů]

### KŘP MSK, Frýdek-Místek – DPS
- `objednatel`: [OBJEDNATEL]
- `tabulka_objednatel`: [OBJEDNATEL]
- `doba_realizace`: [od – do]
- `rozsah`: DPS · [rozsah]
- `rozsah_detail.1`: [profese a rozsah]

## Výskyt na stránkách

| Placeholder | Stránky |
|---|---|
| `[EMAIL]` | / |
| `[Foto: rozvaděč po předání]` | / |
| `[Foto: svářečka v terénu / výkop s HDPE]` | / |
| `[Foto: ukončená optická vana, 48 vl., vlastní stavba]` | / |
| `[ID DATOVÉ SCHRÁNKY]` | / |
| `[OBJEDNATEL]` | / |
| `[TELEFON]` | / |
| `[km]` | / |
| `[n]` | / |
| `[rok]` | / |
| `[rozsah]` | / |
