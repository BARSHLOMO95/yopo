# סקירת בוקר פיננסית - n8n Workflow

וורקפלו ל-n8n שמייצר סקירת בוקר פיננסית יומית בעברית.

## מה כלול

| קובץ | תיאור |
|---|---|
| `financial-summary-workflow.json` | וורקפלו מלא לייבוא ל-n8n |
| `financial-summary-code.js` | קוד עצמאי ל-Code Node (אם מעדיפים לבנות ידנית) |

## מקורות נתונים

- **Yahoo Finance API** - מט"ח (USD/ILS, EUR/ILS), מדדים (NASDAQ, S&P 500, ת"א 35, ת"א 125), סחורות (זהב, נפט)
- **CoinGecko API** - קריפטו (ביטקוין, אתריום)

שני ה-API-ים **חינמיים** ולא דורשים מפתח.

## התקנה

### אפשרות 1: ייבוא וורקפלו (מומלץ)

1. פתח את n8n
2. לחץ על **Import Workflow** (או `Ctrl+O`)
3. בחר את הקובץ `financial-summary-workflow.json`
4. חבר את ה-Output node ליעד שלך (Telegram / WhatsApp / Slack / Email)
5. הפעל את הוורקפלו

### אפשרות 2: בנייה ידנית

1. צור וורקפלו חדש ב-n8n
2. הוסף **Schedule Trigger** - מוגדר ל-07:00 ימים א'-ה' (`0 7 * * 0-4`)
3. הוסף 2 **HTTP Request** nodes (Yahoo Finance + CoinGecko) - מחוברים במקביל ל-Trigger
4. הוסף **Merge** node - מקבל את שני ה-HTTP Request outputs
5. הוסף **Code** node - העתק את הקוד מ-`financial-summary-code.js`
6. חבר את ה-Code node ליעד שלך

## מבנה הוורקפלו

```
Schedule Trigger (07:00, Sun-Thu)
    ├── Yahoo Finance API ──┐
    │                       ├── Merge → Code (Format) → Output
    └── CoinGecko API ──────┘
```

## חיבור ליעד

ה-Output node מכיל את ההודעה המפורמטת ב-`{{ $json.message }}`.

### דוגמאות חיבור:

**Telegram:**
- הוסף Telegram node אחרי ה-Output
- הגדר Bot Token ו-Chat ID
- שים `{{ $json.message }}` בשדה Text

**WhatsApp (via Twilio):**
- הוסף Twilio node
- הגדר את מספר ה-WhatsApp
- שים `{{ $json.message }}` בשדה Body

**Email:**
- הוסף Send Email node
- שים `{{ $json.message }}` בשדה Body
- Subject: `☀️ סקירת בוקר פיננסית`

**Slack:**
- הוסף Slack node
- בחר ערוץ
- שים `{{ $json.message }}` בשדה Text

## דוגמת פלט

```
☀️ סקירת בוקר פיננסית
יום שלישי, 3 בפברואר 2026

💱 מט"ח:
📉 דולר/שקל: 3.100 (-0.71%)
📈 יורו/שקל: 3.664 (+0.14%)

📊 מדדים:
📈 נאסד"ק: 23,592.11 (+0.56%)
📈 S&P 500: 6,976.44 (+0.54%)
📈 ת"א 35: 4,112.06 (+1.83%)
📈 ת"א 125: 4,098.60 (+1.74%)

🏆 סחורות:
📈 זהב: 4,949.20 (+7.07%)
📈 נפט: 62.43 (+0.47%)

₿ קריפטו:
📉 ביטקוין: 78,183.62 (-0.64%)
📉 אתריום: 2,295.54 (-2.08%)

נוצר אוטומטית | סקירה זו אינה מהווה המלצת השקעה
```

## התאמה אישית

### הוספת מטבעות קריפטו
בקוד, הוסף ל-`CRYPTO_IDS`:
```js
'solana': { name: 'סולאנה', symbol: 'SOL' },
```

### הוספת מדדים/מט"ח
בקוד, הוסף ל-`YAHOO_SYMBOLS`:
```js
'^DJI': { name: 'דאו ג׳ונס', category: 'indices' },
'GBPILS=X': { name: 'לירה/שקל', category: 'forex' },
```
וגם עדכן את רשימת הסימבולים ב-HTTP Request node של Yahoo Finance.

### שינוי זמן הפעלה
ערוך את ה-Schedule Trigger. הביטוי `0 7 * * 0-4` אומר:
- דקה 0, שעה 7
- כל יום (`*`), כל חודש (`*`)
- ימים 0-4 (ראשון עד חמישי)

## הערות

- Yahoo Finance API הוא לא-רשמי ועלול להשתנות. אם מפסיק לעבוד, אפשר להחליף ל-Alpha Vantage או Finnhub (דורשים מפתח חינמי).
- CoinGecko מגביל ל-~30 קריאות בדקה בתוכנית החינמית.
- הנתונים מוצגים לפי הזמן האחרון הזמין (pre-market / after-hours / last close).
