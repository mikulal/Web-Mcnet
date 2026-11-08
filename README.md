# Web MCnet – www.mcnet.cz

Statický web MCnet, s.r.o. Zadání: [CLAUDE.md](CLAUDE.md), schválený návrh úvodu: [design/Main.dc.html](design/Main.dc.html).

## Struktura

```
data/firma.json        firemní údaje (NAP), doklady – jediný zdroj
data/reference.json    reference; detailní stránka se generuje s "detail": true
src/pages/**/*.html    obsah stránek (hlavička <!--meta {json} -->, tokeny {{...}})
src/templates/         šablona detailu reference
src/build.mjs          generátor (Node 18+, bez závislostí)
public/                hotový web – výstup pro Cloudflare Pages
tools/serve.mjs        lokální náhled s čistými URL
PLACEHOLDERY.md        co čeká na doplnění (generuje build)
```

## Úpravy

1. Uprav `data/*.json` nebo `src/pages/…`.
2. `node src/build.mjs` – přegeneruje `public/`, `sitemap.xml`, `llms.txt` a `PLACEHOLDERY.md`, zkontroluje délky title a description, jednu H1, pořadí nadpisů a interní odkazy. Upozornění vrací exit code 1.
3. Náhled: `node tools/serve.mjs` → http://localhost:8788/
4. Commit včetně `public/`.

Soubory v `public/` (HTML) needitovat ručně, build je přepíše. CSS, JS, fonty, `_redirects`, `_headers` a `robots.txt` v `public/` se needitují buildem.

Tokeny v obsahu: `{{firma.klic}}`, `{{adresa}}`, `{{tel}}`, `{{email}}`, `{{email_btn}}`, `{{tel_btn}}`, `{{ref_table:home|all}}`, `{{ref_list:slug,slug}}`, `{{ref_sluzba:sluzba}}`, `{{doklady}}`, `{{foto:popisek|trida}}`.

## Nasazení (Cloudflare Pages)

- Build command: žádný. Output directory: `public`.
- Větev `redesign-2026` → preview `*.pages.dev`; po schválení merge do `main`.
- Custom domain `www.mcnet.cz`, přesměrování `mcnet.cz` → `www` přes Redirect Rule.
- Před přepnutím DNS: Lighthouse, kontrola odkazů, Rich Results Test, doplnit staré URL do `public/_redirects`.
