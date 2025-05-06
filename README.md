# Dokumentáció

![unnamed](https://github.com/user-attachments/assets/74eca3c8-3380-4d09-997c-41992c157c3a)

## Áttekintés
Ez az alkalmazás egy interaktív kriptovaluta-árfigyelő eszköz, amely lehetővé teszi a felhasználó számára, hogy különböző kriptovaluták árfolyamait követhesse nyomon valós időben. Az adatokat diagramokon jeleníti meg, és támogatja az időintervallum és valuta váltását.

---

## Felhasználói Funkciók
1. **Kriptovaluta választása**: Legördülő menüből választható (pl. BTC, ETH).
2. **Időintervallum beállítása**: Gombokkal választható (pl. 1 perc, 1 óra, 1 hét).
3. **Valuta váltása**: USD vagy HUF között váltás.

4. **Árfolyam-diagram**: Interaktív vonaldiagram az árak változásáról.
5. **Automatikus frissítés**: Az árak minden másodpercben, a diagram 30 másodpercenként frissül.

---

## Fejlesztői Áttekintés
### HTML
- **Betöltő képernyő**: Troll karaktert ábrázoló kép (`#loading-screen`).
- **Fejléc**: Kriptovaluta választó, időintervallum és valuta gombok.
- **Fő tartalom**: Kriptovaluta ikon, név, ár és diagram (`<canvas>`).

### CSS 

- **Általános stílus**: Sötét téma (`#121212` háttér, fehér szöveg), középre igazított elrendezés.
- **Gombok**: Sötét háttér, hover effekt, aktív gomb zöld kiemelés (`#00ffaa`).
- **Diagram**: Fix magasság (325px), rugalmas szélesség.
- **Média-lekérdezés**: Kis képernyőkön csökkentett méretű elemek.

### JavaScript

- **Adatforrások**:
  - Binance API: Kriptovaluta árfolyamok.
  - ExchangeRate-API: USDT-HUF átváltási arány.
- **Fő funkciók**:
  - `initChart(data)`: Diagram inicializálása/frissítése.
  - `fetchCryptoData(crypto, interval)`: Adatok lekérése.
  - `updateCryptoPrice(crypto)`: Valós idejű árfrissítés.
  - Automatikus frissítés: Ár és diagram dinamikus frissítése.

---

## Külső Függőségek
- **Chart.js**: Diagramok megjelenítése.
- **Axios**: API-kkal való kommunikáció.
- **CSS**: Stílusok a `styles.css` fájlban.
- **Manifest**: Webalkalmazás beállításai a `manifest.json` fájlban.

Az alkalmazás rugalmas, könnyen használható, és modern webes technológiákat alkalmaz.
