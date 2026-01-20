# קטלוג מוצרים - Hebrew Product Catalog

קטלוג מוצרים פשוט ומהיר בעברית, ללא צורך בהתקנות או build process.

## ✨ תכונות

- 🎨 ממשק משתמש מודרני ונקי (RTL - עברית)
- 📦 ניהול מוצרים וגלריות תמונות
- 🖼️ העלאת תמונות מהמחשב או מקישורים (כולל Yupoo)
- 💾 שמירה מקומית ב-LocalStorage (ללא צורך בשרת)
- 🔒 מצב צפייה ללקוחות ומצב עריכה למנהל
- 💧 ווטרמרק מותאם אישית על התמונות
- 📱 WhatsApp שיתוף ישיר
- 📲 מתאים לכל המכשירים (Responsive)
- ⚡ מהיר וקל - קובץ HTML יחיד ללא תלויות

## 🚀 התקנה מהירה

### אופציה 1: Render (מומלץ - חינם)

1. Fork את הפרויקט או העלה ל-GitHub שלך
2. התחבר ל-[Render.com](https://render.com)
3. לחץ "New" > "Static Site"
4. חבר את ה-Repository
5. Render יזהה אוטומטית את `render.yaml`
6. לחץ "Create Static Site"
7. האתר יהיה זמין תוך דקות! 🎉

### אופציה 2: Vercel

```bash
# התקן Vercel CLI
npm i -g vercel

# Deploy
cd yopo
vercel
```

### אופציה 3: Netlify

```bash
# התקן Netlify CLI
npm i -g netlify-cli

# Deploy
cd yopo
netlify deploy --prod
```

### אופציה 4: GitHub Pages

1. לך ל-Settings > Pages
2. בחר branch: `claude/hebrew-product-catalog-IyD1A`
3. בחר `/` (root) כתיקייה
4. שמור - האתר יהיה זמין ב-`https://[username].github.io/yopo`

### אופציה 5: הרצה מקומית

פשוט פתח את `index.html` בדפדפן! ✅

## 📖 איך להשתמש?

### למנהל:

1. פתח את האתר (הגישה המלאה היא ברירת המחדל)
2. לחץ "➕ מוצר חדש" כדי להוסיף מוצר
3. הוסף תמונה ראשית, שם, מחיר, פרטים וקישור
4. לחץ על מוצר כדי להוסיף עוד תמונות
5. לחץ "⚙️ הגדרות" כדי להגדיר:
   - שם הקטלוג
   - ווטרמרק (טקסט והצגה/הסתרה)
   - מספר WhatsApp

### ללקוחות:

1. לחץ על "🔗 קישור ללקוחות" בפינה השמאלית העליונה
2. העתק את הקישור ושלח ללקוחות
3. הלקוחות יראו את הקטלוג במצב צפייה בלבד
4. הם יוכלו לצפות במוצרים ולהיכנס לקישורי הרכישה

## 🎨 התאמה אישית

ניתן לערוך את הקובץ `index.html` ישירות:

- **צבעים**: חפש את ה-gradient colors בסגנון (למשל `#e91e63`, `#9c27b0`)
- **פונטים**: שנה את `font-family: 'Heebo'` לפונט אחר
- **ווטרמרק**: התאם את ה-CSS של `.watermark`

## 📦 מבנה הפרויקט

```
yopo/
├── index.html       # הקובץ היחיד - כל האפליקציה!
├── render.yaml      # הגדרות Render
├── .gitignore       # Git ignore
└── README.md        # התיעוד הזה
```

## 🔧 טכנולוגיות

- HTML5
- CSS3 (עם עיצוב מודרני)
- Vanilla JavaScript
- LocalStorage API
- FileReader API
- Google Fonts (Heebo)

## 📝 רישיון

MIT License - חופשי לשימוש אישי ומסחרי.

## 💡 עצות

- **גיבוי**: הנתונים נשמרים ב-LocalStorage של הדפדפן. מומלץ לגבות מעת לעת (Export/Import יתווסף בעתיד)
- **תמונות**: ניתן להעלות תמונות מהמחשב או לשלב קישורים מ-Yupoo
- **ביצועים**: המערכת מהירה מאוד כי הכל מקומי, ללא שרתים
- **אבטחה**: מצב הצפייה מבוסס על query parameter - לא מדובר באבטחה חזקה

## 🆘 תמיכה

לשאלות ובעיות, פתח Issue ב-GitHub.

---

Made with ❤️ for small businesses
