# MCnet.cz – nový firemní web

Statický web firmy MCnet, s.r.o. (optické a datové sítě, Frýdek-Místek). Nasazení na Cloudflare Pages, doména www.mcnet.cz. Tento soubor je kompletní zadání: pozicování, obsah, design, SEO, technika. Při nejasnosti se drž tohoto souboru, ne vlastních představ o „moderním webu“.

## 1. Pozicování a cílovka

**Jedna věta:** Optické a datové sítě jako hotová subdodávka pro stavební zakázky a veřejné zadavatele v Moravskoslezském kraji a okolí.

**Komu web mluví (v tomto pořadí):**
1. Stavbyvedoucí / nákupčí zhotovitele stavby, který má v balíku optiku nebo slaboproud a potřebuje spolehlivého subdodavatele.
2. Elektromontážní firmy, které nemají vlastní optiku (vzor: TRIMR) – přebíráme sváry, měření a předání na už položených trasách.
3. Veřejní zadavatelé a jejich projektanti (školy, nemocnice, obce, policie, věznice) – kontrolují kvalifikaci a reference.

**Co web NEdělá:** necílí na jednotlivce, drobný servis, jednorázové sváry, „překopnutý kabel“. To patří značce Fajbr. Na webu MCnet se Fajbr zmiňuje jen jednou větou na úvodu a v patičce (servisní značka pro drobné zakázky v optice: svařování, ukončení, měření OTDR, opravy, celá ČR) s odkazem na https://fajbr.cz, nikde jinde. Nikdy nepoužívej klíčová slova typu „svařování optiky Ostrava“, „oprava optického kabelu“, „ceník sváru“.

**Hlavní odlišení od konkurence:** nikdo v regionu nemá sekci „Pro zhotovitele“ ani doklady pro kvalifikaci do VZ ke stažení. Konkurence (SITEL, Global Elektronic, ceníkové weby) mluví k investorovi, operátorovi nebo koncovému zákazníkovi. My mluvíme k zhotoviteli.

## 2. Tón textů

- Věcný, technický, krátké věty. Jako technická zpráva, ne jako marketing.
- Konkrétní čísla místo přívlastků: „48 vl. SM G.652D, 2,3 km, předáno 06/2026“, ne „rozsáhlá optická trasa“.
- Test: zakryj logo a přečti text. Pokud by seděl na web konkurence, přepiš ho.
- Zakázané fráze: „komplexní řešení“, „profesionální přístup“, „spokojenost zákazníka“, „inovativní“, „špičkové technologie“, „jsme tu pro vás“, „na míru“, „partner pro vaše sítě“.
- Vykání, 1. osoba množného čísla („dodáváme“, „měříme“). Žádné vykřičníky.
- Bez datovaných „aktualit“ a bez blogu. Obsahové stránky jsou bez data, aby web nikdy nevypadal opuštěně.

## 3. Struktura webu a URL

Všechny URL malými písmeny, bez diakritiky, bez koncovky .html (Cloudflare Pages: soubor `sluzby/opticke-trasy.html` → URL `/sluzby/opticke-trasy`).

```
/                                   Úvod
/sluzby/                            Přehled služeb
/sluzby/opticke-trasy               Optické trasy a páteře
/sluzby/strukturovana-kabelaz       Strukturovaná kabeláž
/sluzby/mereni-a-dokumentace        Měření a dokumentace
/sluzby/projekce-slaboproudu        Projekce slaboproudu (studie, DPS)
/sluzby/aktivni-prvky               Aktivní prvky (HPE Aruba, Cisco, Dell, Ubiquiti, MikroTik)
/reference/                         Seznam referencí (tabulka)
/reference/<slug>                   Jedna reference (viz formát níže)
/pro-zhotovitele                    Jak probíhá subdodávka
/doklady                            Doklady ke stažení
/kontakt                            Kontakt
/pro-zadavatele/skoly               Datové sítě pro školy
/pro-zadavatele/zdravotnictvi       Kabeláž ve zdravotnictví (B2ca, požární úseky)
/pro-zadavatele/prumyslove-arealy   Areálové optické sítě
/pro-zadavatele/obce-a-urady        Obce, úřady, bezpečnostní složky
/know-how/vykaz-vymer-opticka-trasa Co má obsahovat výkaz výměr pro optickou trasu
/know-how/protokoly-a-predani       Měřicí protokoly a dokumentace skutečného provedení
/know-how/optika-ve-verejne-zakazce Optika jako subdodávka ve VZ – kvalifikace a předání
/know-how/kabely-b2ca               Kabely B2ca a požární bezpečnost datových rozvodů
```

Navigace (hlavička): Služby · Reference · Pro zhotovitele · Doklady · telefon (mono). Patička navíc: Pro zadavatele, Know-how, Kontakt, právní.

## 4. Obsah stránek

### Úvod `/`
Přesně podle schváleného návrhu (artboard „Homepage – desktop“ v Claude Design, soubor `design/Main.dc.html` v tomto repu je jeho export). Pořadí sekcí:
1. Hero – pouze text, bez obrázku a bez tabulky: eyebrow, H1 „Optickou část stavby odevzdáme hotovou. Včetně protokolů.“, podtitulek, 2 tlačítka („Poslat výkaz výměr k nacenění“ → /kontakt, „Prohlédnout reference“ → /reference/).
2. Pás dvou fotek ze staveb (7/12 + 5/12).
3. Vybrané realizace – tabulka 6 řádků (č. · Stavba · Objednatel/zhotovitel · Rozsah · Rok), odkaz „Všechny reference“.
4. Co dodáváme – 5 sloupců (od 8. 11. 2026 projekce a aktivní prvky zvlášť), každý s názvem, 2 větami a řádkem technické specifikace v mono.
5. Pro zhotovitele – 4 kroky (nacenění z výkazu výměr → koordinace se stavbou → realizace vlastními lidmi → předání s dokumentací).
6. Doklady ke stažení – seznam PDF.
7. Kontakt – tmavý blok s výzvou „Pošlete výkaz výměr. Ozveme se do dvou pracovních dnů.“, e-mail, telefon, adresa, IČO, DIČ, datová schránka.
8. Patička.

### Reference `/reference/<slug>` – formát jedné reference
Vzor: britské case studies (NM Cabling, Mr Cable), délka 120–180 slov.
- H1: název stavby (např. „Optická trasa Dětmarovice, SO 06“)
- Hlavička v mono tabulce: Objednatel · Zhotovitel (pokud subdodávka) · Sektor · Doba realizace · Rok · Rozsah (čísla)
- 3–4 odstavce prózy: zadání, omezení stavby (za provozu, památkově chráněný objekt, výškové práce, koordinace s dalšími profesemi), co jsme dodali, co bylo předáno (protokoly, DSP).
- 1–2 vlastní fotky s popiskem.
- Odkazy na 2 související reference.
- Title: „<Název stavby> – reference MCnet“, meta description 140–155 znaků s městem a rozsahem.

Reference k zpracování (data doplní Luboš, do té doby `[PLACEHOLDER]`, nikdy vymyšlená čísla). Zdroj pravdy je `data/reference.json`; podklady ve složce `iCloudDrive\Projekty\08-Mcnet` (krycí listy OTDR, nabídky, osvědčení, Realizované stavby.docx). Upřesněno Lubošem 8. 11. 2026:
- Teplárna TAS Dětmarovice – tři optické trasy (2026): kotelna SO06 – dočasný velín pro ČEZ ESL, s.r.o.; SO06 – SO09 pro DELAUDA, s.r.o.; SO04 – SO09 pro SYSTHERM, s.r.o.
- Páteřní rozvody MaR, Městská nemocnice Ostrava Fifejdy (přes VAE a.s., 2022–2024)
- Rekonstrukce síťové infrastruktury SUŠ Ostrava pro Moravskoslezský kraj (přes VAE Energo, 2025)
- IBC Ostrava – slaboproudé kabeláže, přímo pro Moravskoslezský kraj (ne optické propoje, ne přes TRIMR)
- Síťová infrastruktura Matiční gymnázium Ostrava – studie, DPS, aktivní prvky (2026)
- KŘP MSK Frýdek-Místek – DPS (2026)
- Rekonstrukce rozvodů NN a SLP, OO PČR Frýdlant nad Ostravicí (2021, z Realizovaných staveb)
- Věznici Vinařice MCnet nerealizoval – neuvádět.
- Dodávka a zprovoznění aktivních prvků, Matiční gymnázium Ostrava (VZMR, 10/2026) – uvádět jen realizaci, ne studii
- DPS stavební připravenosti, ÚO Policie ČR Karviná, Havířská 1511 (KŘP MSK, 09/2024)
- Instalace 11 AP Wi‑Fi, CS-Cont Zlaté Hory (objednatel ICZ a.s., 2022)
- Na úvodu z Dětmarovic jen trasa pro ČEZ.
- Fotky: zatím 4 vlastní fotky převzaté z webu Fajbr (public/img), seznam v FOTKY v src/build.mjs.
- Další dle seznamu od Luboše

### Pro zhotovitele `/pro-zhotovitele`
Rozvedené 4 kroky z úvodu + odstavec „Přebíráme optiku na už položených trasách“ (sváry, měření, předání pro elektrofirmy) + co potřebujeme k nacenění (výkaz výměr nebo PD, termín, místo, kontakt na stavbyvedoucího) + co dodáváme k předání (seznam dokladů). Jedno CTA: e-mail s výkazem.

### Doklady `/doklady`
Seznam PDF s datem platnosti: oprávnění TIČR, výpis z OR, pojištění odpovědnosti, seznam referencí pro kvalifikaci (§ 79 ZZVZ), firemní profil. Soubory ve složce `/public/doklady/`, názvy `mcnet-ticr-opravneni.pdf` atd. Dokud soubor neexistuje, položka je šedá s textem „připravujeme“, ne nefunkční odkaz.

### Pro zadavatele (4 stránky)
Každá 300–500 slov: specifika sektoru (normy, požární bezpečnost, provoz za chodu, bezpečnostní režim), co typicky obsahuje zakázka, 1–2 reference ze seznamu, CTA. Konkrétní normy: ČSN EN 50173-1, ČSN EN 50174-2, ČSN 73 0810, ČSN 73 0835 (zdravotnictví), vyhl. 131/2024 Sb. (DPS), třídy reakce na oheň dle ČSN EN 13501-6 (B2ca-s1,d1,a1).

### Know-how (4 stránky)
Odborné stránky bez data, 500–900 slov, strukturované H2/H3, bez marketingu. Píšou se z pohledu rozpočtáře nebo nákupčího, který má konkrétní problém. Na konci jedna věta s odkazem na službu.

## 5. Design

Vychází z artboardu v `design/Main.dc.html`. Převeď na čistý HTML/CSS, zachovej:

**Barvy**
- Pozadí: `#F3F1EC` (papír), karty/vložené bloky `#FBFAF7`
- Text: `#1C1B19`, sekundární text `#3B3934`, popisky `#5A574F`
- Linky: `#C9C4B9` (tenké), `#1C1B19` (sekční)
- Akcent: `#B3431A` (cihlová) – pouze čísla řádků, hover, drobné zvýraznění. Nikdy jako velké plochy.
- Tmavý blok (kontakt, patička): `#1C1B19`, text `#F3F1EC` / `#C9C4B9`

**Typografie**
- IBM Plex Sans 400/500/600 pro text, IBM Plex Mono 400/500 pro čísla, specifikace, popisky, telefon, IČO.
- Fonty self-hostované ve `/public/fonts/` (woff2, pouze latin-ext), ne Google Fonts CDN (GDPR, rychlost).
- H1 54px/1.08, H2 32px, H3 20px, text 15–16px/1.5, mono 12–13px. Letter-spacing nadpisů −0.02em.

**Layout**
- Max šířka 1180px, 12sloupcový grid, gap 24px, boční padding 32px (mobil 16px).
- Sekce oddělené linkami, ne barevnými plochami. Žádné stíny, žádné zaoblené rohy (radius 0), žádné gradienty, žádné ikonky, žádné animace, žádný parallax.
- Tabulky a seznamy jako ve výkazu: linka nad každým řádkem, mono čísla.
- Tlačítka: hranatá, 48px vysoká, plná tmavá nebo obrysová.
- Mobil: grid na 1 sloupec, tabulka referencí se přeskládá na řádky (label: hodnota), navigace do jednoduchého menu bez JS animací.

**Fotky**
- Výhradně vlastní fotky ze staveb (rozvaděče, vany, sváry, výkopy, měření). Žádné fotobanky, žádné AI obrázky.
- Formát WebP + JPEG fallback, max 1600px šířka, `loading="lazy"` mimo hero, vždy `alt` s konkrétním popisem („Ukončená optická vana 48 vl., Dětmarovice SO 06“).
- Dokud fotka chybí: šedý blok `#DCD8CF` s mono popiskem co tam má být. Nikdy stock.

**Co je zakázané (znaky AI webu)**
Inter/Roboto, fialové/modré gradienty, karty s levým barevným okrajem, tři ikonky ve sloupcích, „hero“ s ilustrací, animovaný canvas, countery „500+ projektů“, hvězdičky recenzí, emoji, chatbot bublina, cookie lišta přes půl obrazovky.

## 6. SEO a technika

**Základ**
- Čistý statický HTML/CSS, minimum JS (pouze mobilní menu). Žádný framework, žádný build krok nutný k náhledu – `index.html` musí jít otevřít přímo.
- Každá stránka: unikátní `<title>` (do 60 znaků, končí „| MCnet“), `<meta name="description">` 140–155 znaků, `<link rel="canonical">`, `lang="cs"`, Open Graph (title, description, image = vlastní fotka).
- `robots.txt`: `User-agent: * / Allow: /` + odkaz na sitemap. Výslovně NEblokovat GPTBot, ClaudeBot, PerplexityBot, Google-Extended – chceme být doporučeni v AI vyhledávání.
- `sitemap.xml` generovaný ze všech stránek, `lastmod` jen pokud je reálný.
- Jedna H1 na stránku, hierarchie H2/H3 bez přeskakování.

**Strukturovaná data (JSON-LD)**
- Všechny stránky: `Organization` + `LocalBusiness` (name MCnet, s.r.o., legalName, address, telephone, email, vatID CZ25394720, areaServed Moravskoslezský kraj, sameAs LinkedIn).
- Služby: `Service` s `provider` → Organization.
- Reference: `Article` nebo `CreativeWork` s `about` → `Place`.
- Breadcrumbs: `BreadcrumbList` na všech podstránkách.

**Konzistence NAP (name, address, phone)**
Název, adresa a telefon musí být písmeno po písmeni stejné na webu, v Google Business Profile, na firmy.cz a v ARES. Napsat je jednou do `data/firma.json` a vkládat odsud.

**Výkon**
- Cíl Lighthouse ≥ 95 ve všech kategoriích na mobilu.
- Fonty `font-display: swap`, preload pro Plex Sans 400/600.
- Obrázky s explicitními `width`/`height`.
- Žádné externí skripty kromě případně Cloudflare Web Analytics (bez cookies, bez lišty).

**Formulář**
Kontakt řeší `mailto:` a telefon. Pokud bude formulář, pak Cloudflare Pages Function → e-mail, pole: firma, jméno, telefon, e-mail, zpráva, příloha (výkaz výměr, PDF/XLSX do 10 MB). Souhlas GDPR jednou větou s odkazem na /ochrana-osobnich-udaju.

**Přesměrování**
`_redirects` pro Cloudflare Pages: všechny URL starého webu www.mcnet.cz → nejbližší nová stránka (301). Seznam starých URL doplnit před nasazením (`site:mcnet.cz` v Googlu nebo Search Console).

## 7. Firemní údaje (zdroj pravdy `data/firma.json`)

```
Název:           MCnet, s.r.o.
IČO:             25394720
DIČ:             CZ25394720
Sídlo:           J. Opletala 924, 738 01 Frýdek-Místek (dle ARES)
Telefon:         +420 777 701 721
Datová schránka: [DOPLNIT]
Kontakty:        Ing. Luboš Mikula, Ph.D. – optické sítě (není jednatel, neuvádět „jednatel“); Josef Mikula – realizace staveb
E-maily:         info@mcnet.cz (poptávky), faktury@mcnet.cz, ucetni@mcnet.cz, lmikula@mcnet.cz
Oprávnění:       TIČR – [DOPLNIT rozsah a číslo]
Partnerství:     HPE (po dokončení registrace)
Působnost:       Moravskoslezský kraj, Olomoucký kraj, dle zakázky celá ČR
```

Placeholdery v hranatých závorkách nikdy nenahrazuj odhadem. Pokud chybí, nech je a vypiš je v závěrečném souhrnu.

## 8. Nasazení

- Repo: GitHub `mikulal/Web-Mcnet` (nová větev `redesign-2026`, po schválení merge do `main`).
- Cloudflare Pages: build command žádný, output directory `public/` (nebo kořen, podle struktury). Custom domain `www.mcnet.cz` + redirect `mcnet.cz` → `www`.
- Před přepnutím DNS: preview URL `*.pages.dev`, kontrola Lighthouse, kontrola všech odkazů (žádný 404), kontrola robots.txt a sitemap, validace JSON-LD (Rich Results Test).
- Po přepnutí: Google Search Console – ověřit doménu, odeslat sitemap, zkontrolovat přesměrování. Google Business Profile – sjednotit NAP a přidat odkaz na web.

## 9. Postup práce v Claude Code

1. Načíst `design/Main.dc.html` a převést homepage na `public/index.html` + `public/css/style.css`. Žádné nové designové prvky navíc.
2. Založit `data/firma.json`, `data/reference.json` (pole pro každou referenci dle formátu v bodu 4) a šablonový přístup: jednoduchý generátor (Node, bez závislostí, nebo ruční HTML – preferuj ruční HTML, pokud je stránek < 25).
3. Služby (4 stránky), Pro zhotovitele, Doklady, Kontakt.
4. Reference – nejdřív tabulka, pak detaily těch, k nimž jsou data.
5. Pro zadavatele (4), Know-how (4).
6. robots.txt, sitemap.xml, _redirects, JSON-LD, OG.
7. Lighthouse na mobilu, oprava.
8. Souhrn: seznam placeholderů, které čekají na doplnění.

Po každém kroku commit. Nic nevymýšlej: chybí-li fakt, placeholder a zápis do souhrnu.
