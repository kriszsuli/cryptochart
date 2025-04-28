// Itt választom ki az elemeket a domból ❤️
const cryptoSelect = document.getElementById('crypto-select'); // Kriptovaluta választó ❤️
const intervalButtons = document.querySelectorAll('.interval-buttons button'); // Időintervallum gombok ❤️
const currencyButtons = document.querySelectorAll('.currency-toggle button'); // Valuta váltó gombok ❤️
const cryptoIcon = document.getElementById('crypto-icon'); // Kripto ikon ❤️
const cryptoName = document.getElementById('crypto-name'); // Kripto neve ❤️
const cryptoPrice = document.getElementById('crypto-price'); // Jelenlegi ár ❤️
const priceChartCanvas = document.getElementById('price-chart'); // Diagram canvas ❤️
const priceChart = priceChartCanvas.getContext('2d'); // Canvas rajzoló kontextus ❤️

// Globális változók inicializálása ❤️
let currentCrypto = 'BTCUSDT'; // Alapértelmezett kriptovaluta ❤️
let currentInterval = '1m'; // Alapértelmezett időintervallum ❤️
let currentCurrency = 'USD'; // Alapértelmezett valuta ❤️
let chart; // Chart.js példány tárolása ❤️
let usdtToHufRate = 1; // USDT-HUF átváltási arány ❤️
let updateIntervalId; // Automatikus frissítés időzítője ❤️

// Diagram inicializálása ❤️
function initChart(data) {
  if (chart) chart.destroy(); // Töröljük a régi diagramot, ha létezik❤️

  // Új diagram létrehozása ❤️
  chart = new Chart(priceChart, {
    type: 'line', // Vonaldiagram ❤️
    data: {
      labels: data.map((item) => formatTimestamp(item[0])), // Dátumok formázása ❤️
      datasets: [
        {
          label: 'Árfolyam', // Diagram címkéje ❤️
          data: data.map((item) => convertPrice(item[1])), // Árak konvertálása ❤️
          borderColor: '#00ffaa', // Vonalszín ❤️
          backgroundColor: 'rgba(0, 255, 170, 0.2)', // Háttérszín ❤️
          borderWidth: 2, // Vonal vastagsága ❤️
          fill: true, // Kitöltés engedélyezése ❤️
        },
      ],
    },
    options: {
      responsive: true, // Reagáljon a méretváltozásokra ❤️
      maintainAspectRatio: false, // Arányt ne tartsa fenn ❤️
      animation: { duration: 500 }, // Animáció időtartama ❤️
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.1)' } }, // X tengely rács színe ❤️
        y: { grid: { color: 'rgba(255, 255, 255, 0.1)' } }, // Y tengely rács színe ❤️
      },
    },
  });
}

// Kriptovaluta adatok lekérése ❤️
async function fetchCryptoData(crypto, interval) {
  try {
    const response = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=${crypto}&interval=${interval}`
    );
    const data = response.data.slice(-20); // Utolsó 20 adatpont ❤️
    return data.map((item) => [item[0], parseFloat(item[4])]); // Timestamp és záróár ❤️
  } catch (error) {
    console.error('Hiba az adatok lekérése közben:', error);
    return [];
  }
}

// Jelenlegi ár frissítése ❤️
async function updateCryptoPrice(crypto) {
  try {
    const response = await axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${crypto}`
    );
    const price = parseFloat(response.data.price); // Ár lekérése ❤️
    cryptoPrice.textContent = `${convertPrice(price)} ${currentCurrency}`; // Ár megjelenítése ❤️
  } catch (error) {
    console.error('Hiba az árfolyam frissítése közben:', error);
    cryptoPrice.textContent = 'Hiba az ár betöltésekor';
  }
}

// Kriptovaluta ikon frissítése ❤️
function updateCryptoIcon(crypto) {
  const icons = {
    BTCUSDT: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    ETHUSDT: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    BNBUSDT: 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png',
    SOLUSDT: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    ADAUSDT: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
    DOTUSDT: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
    DOGEUSDT: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
    LTCUSDT: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
    PEPEUSDT: 'https://assets.coingecko.com/coins/images/29850/standard/pepe-token.jpeg?1696528776',
    NOTUSDT: 'https://assets.coingecko.com/coins/images/33453/standard/rFmThDiD_400x400.jpg?1701876350',
    LUNCUSDT: 'https://assets.coingecko.com/coins/images/15861/standard/abracadabra-3.png?1696515477',
    SPELLUSDT: 'https://assets.coingecko.com/coins/images/8284/standard/01_LunaClassic_color.png?1696508486',
  };
  cryptoIcon.src = icons[crypto] || 'https://via.placeholder.com/60'; // Placeholder ha nincs ikon ❤️
  cryptoName.textContent = crypto.split('USDT')[0]; // Kripto név megjelenítése ❤️
}

// Időbélyeg formázása ❤️
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  if (currentInterval === '1w' || currentInterval === '1M') {
    return date.toLocaleDateString('hu-HU'); // Hét vagy hónap esetén dátum ❤️
  }
  return date.toLocaleTimeString('hu-HU'); // Egyéb esetben idő ❤️
}

// Ár konvertálása a kiválasztott valutára ❤️
function convertPrice(price) {
  // Kriptovaluta kódja alapján ellenőrizzük, hogy melyik valuta érintett
  const highPrecisionCoins = ['SPELLUSDT', 'LUNCUSDT', 'NOTUSDT', 'PEPEUSDT'];

  if (highPrecisionCoins.includes(currentCrypto)) {
    // Ha az érintett valuta, akkor 10 tizedesjegyig formázzuk
    if (currentCurrency === 'HUF') {
      return (price * usdtToHufRate).toFixed(10); // HUF-ra konvertálás, 10 tizedesjegy
    }
    return price.toFixed(10); // USD esetén 10 tizedesjegy
  } else {
    // Minden más valuta marad a régi formázáson
    if (currentCurrency === 'HUF') {
      return (price * usdtToHufRate).toFixed(2); // HUF-ra konvertálás, 2 tizedesjegy
    }
    return price.toFixed(2); // USD esetén 2 tizedesjegy
  }
}

// USDT-HUF átváltási arány lekérése ❤️
async function fetchUsdtToHufRate() {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    const usdToHuf = response.data.rates.HUF; // USD-HUF árfolyam ❤️
    usdtToHufRate = usdToHuf; // Átváltási arány beállítása ❤️
  } catch (error) {
    console.error('Hiba az USDT-HUF árfolyam lekérése közben:', error);
    usdtToHufRate = 350; // Alapértelmezett érték ❤️
  }
}

// Automatikus frissítés indítása ❤️
function startAutoUpdate() {
  if (updateIntervalId) clearInterval(updateIntervalId); // Régi időzítő törlése ❤️
  updateIntervalId = setInterval(() => {
    fetchCryptoData(currentCrypto, currentInterval).then(initChart); // Adatok frissítése ❤️
    updateCryptoPrice(currentCrypto); // Ár frissítése ❤️
  }, 30000); // 30 másodpercenként ❤️
}

// Valós idejű árfrissítés indítása ❤️
function startRealTimePriceUpdate() {
  setInterval(() => {
    updateCryptoPrice(currentCrypto); // Ár frissítése minden 1 másodpercben ❤️
  }, 1000);
}

// Eseményfigyelők hozzáadása ❤️
cryptoSelect.addEventListener('change', (e) => {
  currentCrypto = e.target.value; // Kiválasztott kriptovaluta ❤️
  updateCryptoIcon(currentCrypto); // Ikon frissítése ❤️
  updateCryptoPrice(currentCrypto); // Ár frissítése ❤️
  fetchCryptoData(currentCrypto, currentInterval).then(initChart); // Diagram frissítése ❤️
  startAutoUpdate(); // Automatikus frissítés újraindítása ❤️
});

intervalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentInterval = button.dataset.interval; // Kiválasztott intervallum ❤️
    fetchCryptoData(currentCrypto, currentInterval).then(initChart); // Diagram frissítése ❤️
    startAutoUpdate(); // Automatikus frissítés újraindítása ❤️
  });
});

currencyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currencyButtons.forEach((btn) => btn.classList.remove('active')); // Aktív gomb eltávolítása ❤️
    button.classList.add('active'); // Új aktív gomb beállítása ❤️
    currentCurrency = button.id.split('-')[1].toUpperCase(); // Kiválasztott valuta ❤️
    fetchCryptoData(currentCrypto, currentInterval).then(initChart); // Diagram frissítése ❤️ 
    updateCryptoPrice(currentCrypto); // Ár frissítése ❤️
  });
});

// Betöltő kép eltüntetése ❤️
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  setTimeout(() => {
    loadingScreen.classList.add('hidden'); // Elrejtjük a betöltő képet ❤️
  }, 100); // 0.1 másodperc múlva ❤️
}

// Kezdeti betöltés ❤️
fetchUsdtToHufRate().then(() => {
  updateCryptoIcon(currentCrypto); // Ikon beállítása ❤️
  updateCryptoPrice(currentCrypto); // Ár beállítása ❤️
  fetchCryptoData(currentCrypto, currentInterval).then(initChart); // Diagram inicializálása ❤️
  startAutoUpdate(); // Automatikus frissítés indítása ❤️
  startRealTimePriceUpdate(); // Valós idejű frissítés indítása ❤️

  // Betöltő kép eltüntetése ❤️
  hideLoadingScreen();
});