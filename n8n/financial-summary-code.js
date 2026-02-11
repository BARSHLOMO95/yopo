// n8n Code Node - Morning Financial Summary (Hebrew)
// שים קוד זה בתוך Code Node ב-n8n
// API-ים בשימוש: Yahoo Finance (מט"ח, מדדים, סחורות), CoinGecko (קריפטו)

const YAHOO_SYMBOLS = {
  // מט"ח
  'USDILS=X': { name: 'דולר/שקל', category: 'forex' },
  'EURILS=X': { name: 'יורו/שקל', category: 'forex' },
  // מדדים
  '^IXIC':    { name: 'נאסד"ק', category: 'indices' },
  '^GSPC':    { name: 'S&P 500', category: 'indices' },
  '^TA35.TA': { name: 'ת"א 35', category: 'indices' },
  '^TA125.TA':{ name: 'ת"א 125', category: 'indices' },
  // סחורות
  'GC=F':     { name: 'זהב', category: 'commodities' },
  'CL=F':     { name: 'נפט', category: 'commodities' },
};

const CRYPTO_IDS = {
  'bitcoin':  { name: 'ביטקוין', symbol: 'BTC' },
  'ethereum': { name: 'אתריום', symbol: 'ETH' },
};

// ---------- Helper Functions ----------

function formatNumber(num, decimals = 2) {
  if (num == null || isNaN(num)) return 'N/A';
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function getArrow(change) {
  if (change == null || isNaN(change)) return '➡️';
  return change >= 0 ? '📈' : '📉';
}

function formatChange(change) {
  if (change == null || isNaN(change)) return 'N/A';
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

function getHebrewDay(dayIndex) {
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  return days[dayIndex];
}

function getHebrewMonth(monthIndex) {
  const months = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
  ];
  return months[monthIndex];
}

function getHebrewDate() {
  const now = new Date();
  const day = getHebrewDay(now.getDay());
  const date = now.getDate();
  const month = getHebrewMonth(now.getMonth());
  const year = now.getFullYear();
  return `יום ${day}, ${date} ב${month} ${year}`;
}

// ---------- Data Fetching ----------

async function fetchYahooQuotes(symbols) {
  const symbolList = symbols.join(',');
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolList)}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Yahoo Finance API error: ${response.status}`);
  }

  const data = await response.json();
  return data.quoteResponse?.result || [];
}

async function fetchCryptoData(ids) {
  const idList = ids.join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${idList}&vs_currencies=usd&include_24hr_change=true`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  return response.json();
}

// ---------- Main Logic ----------

// שליפת נתונים מ-Yahoo Finance
const yahooSymbols = Object.keys(YAHOO_SYMBOLS);
const yahooQuotes = await fetchYahooQuotes(yahooSymbols);

// מיפוי תוצאות
const quoteMap = {};
for (const quote of yahooQuotes) {
  quoteMap[quote.symbol] = {
    price: quote.regularMarketPrice,
    change: quote.regularMarketChangePercent,
  };
}

// שליפת נתוני קריפטו
const cryptoIds = Object.keys(CRYPTO_IDS);
const cryptoData = await fetchCryptoData(cryptoIds);

// ---------- Build Message ----------

const dateStr = getHebrewDate();

// מט"ח
const forexLines = Object.entries(YAHOO_SYMBOLS)
  .filter(([, meta]) => meta.category === 'forex')
  .map(([symbol, meta]) => {
    const q = quoteMap[symbol] || {};
    return `${getArrow(q.change)} ${meta.name}: ${formatNumber(q.price, 3)} (${formatChange(q.change)})`;
  });

// מדדים
const indexLines = Object.entries(YAHOO_SYMBOLS)
  .filter(([, meta]) => meta.category === 'indices')
  .map(([symbol, meta]) => {
    const q = quoteMap[symbol] || {};
    return `${getArrow(q.change)} ${meta.name}: ${formatNumber(q.price)} (${formatChange(q.change)})`;
  });

// סחורות
const commodityLines = Object.entries(YAHOO_SYMBOLS)
  .filter(([, meta]) => meta.category === 'commodities')
  .map(([symbol, meta]) => {
    const q = quoteMap[symbol] || {};
    return `${getArrow(q.change)} ${meta.name}: ${formatNumber(q.price)} (${formatChange(q.change)})`;
  });

// קריפטו
const cryptoLines = Object.entries(CRYPTO_IDS).map(([id, meta]) => {
  const c = cryptoData[id] || {};
  const price = c.usd;
  const change = c.usd_24h_change;
  return `${getArrow(change)} ${meta.name}: ${formatNumber(price)} (${formatChange(change)})`;
});

// הרכבת ההודעה המלאה
const message = `☀️ סקירת בוקר פיננסית
${dateStr}

💱 מט"ח:
${forexLines.join('\n')}

📊 מדדים:
${indexLines.join('\n')}

🏆 סחורות:
${commodityLines.join('\n')}

₿ קריפטו:
${cryptoLines.join('\n')}

נוצר אוטומטית | סקירה זו אינה מהווה המלצת השקעה`;

// החזרת התוצאה ל-n8n
return [{ json: { message, timestamp: new Date().toISOString() } }];
