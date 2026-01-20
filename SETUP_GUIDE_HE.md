# מדריך הקמה מהיר - THE GALLERY

## ✅ מה עשינו עד כה

הקמנו את כל הפרויקט:
- ✓ התקנו React + Vite
- ✓ התקנו Firebase לניהול הנתונים
- ✓ התקנו Tailwind CSS לעיצוב
- ✓ יצרנו את כל הקבצים הדרושים
- ✓ התקנו את כל החבילות

## 🔥 מה נשאר לעשות?

### שלב 1: צור פרויקט Firebase (חינם לחלוטין)

1. **כנס ל-Firebase Console:**
   - גלוש ל: https://console.firebase.google.com/
   - התחבר עם חשבון Google שלך

2. **צור פרויקט חדש:**
   - לחץ על "הוסף פרויקט" (Add project)
   - תן שם לפרויקט, למשל: "yopo-catalog"
   - (אופציונלי) תוכל לבטל את Google Analytics אם לא צריך

3. **הפעל Firestore Database:**
   - בתפריט השמאלי, לחץ על "Build" > "Firestore Database"
   - לחץ "Create database"
   - בחר מיקום: `europe-west1` (או אירופה אחרת)
   - **חשוב:** בחר במצב "Start in test mode" (לפיתוח - לאחר מכן תוכל לשנות)
   - לחץ "Enable"

4. **הפעל Authentication:**
   - בתפריט השמאלי, לחץ על "Build" > "Authentication"
   - לחץ "Get started"
   - בטאב "Sign-in method", לחץ על "Anonymous"
   - הפעל את ה-toggle ל-"Enabled"
   - לחץ "Save"

### שלב 2: קבל את פרטי ההתחברות

1. **חזור לעמוד הראשי של הפרויקט**
   - לחץ על הגלגל ⚙️ ליד "Project Overview"
   - בחר "Project settings"

2. **צור אפליקציית Web:**
   - גלול למטה ל-"Your apps"
   - לחץ על הסמל `</>` (Web)
   - תן שם: "yopo-web"
   - לחץ "Register app"

3. **העתק את הפרטים:**
   תראה משהו כזה:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyD...",
     authDomain: "yopo-catalog.firebaseapp.com",
     projectId: "yopo-catalog",
     storageBucket: "yopo-catalog.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

### שלב 3: הגדר משתני סביבה

1. **צור קובץ `.env` בשורש הפרויקט:**
   ```bash
   cp .env.example .env
   ```

2. **ערוך את הקובץ `.env` ומלא את הערכים:**
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyD...  (העתק מ-apiKey)
   VITE_FIREBASE_AUTH_DOMAIN=yopo-catalog.firebaseapp.com  (העתק מ-authDomain)
   VITE_FIREBASE_PROJECT_ID=yopo-catalog  (העתק מ-projectId)
   VITE_FIREBASE_STORAGE_BUCKET=yopo-catalog.appspot.com  (העתק מ-storageBucket)
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789  (העתק מ-messagingSenderId)
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef  (העתק מ-appId)
   VITE_APP_ID=catalog-app
   ```

### שלב 4: שנה את פרטי המנהל

ערוך את `src/App.jsx` בשורות 18-19 ושנה:
```javascript
const ADMIN_EMAIL = "barshlomo97@gmail.com";  // ← שנה לאימייל שלך
const ADMIN_PASS = "Barbar@@1997";  // ← שנה לסיסמה שלך
```

### שלב 5: הרץ את האתר!

```bash
npm run dev
```

פתח דפדפן וגלוש ל: **http://localhost:3000**

---

## 🎯 איך להשתמש באתר?

### למשתמש רגיל:
- גלוש בין קטגוריות
- צפה בתמונות
- לחץ על תמונה כדי להגדיל
- לחץ על כפתור הרכישה כדי לעבור לחנות

### למנהל (אתה):
1. לחץ על "ניהול" בפינה השמאלית העליונה
2. התחבר עם הפרטים ששינית
3. לחץ "עריכה"
4. עכשיו תוכל:
   - ➕ להוסיף קטגוריה חדשה
   - 📝 לערוך שם קטגוריה
   - 🖼️ להעלות תמונה ראשית לקטגוריה
   - 🔗 להוסיף קישור לרכישה
   - 📸 להעלות מוצרים (תמונות מרובות)
   - 🗑️ למחוק קטגוריות ותמונות

---

## 🚀 העלאה לאינטרנט (Production)

### אופציה 1: Vercel (מומלץ - חינם)
```bash
npm run build
npm install -g vercel
vercel
```

### אופציה 2: Netlify (חינם)
```bash
npm run build
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### אופציה 3: Firebase Hosting
```bash
npm run build
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

**חשוב:** אם אתה מעלה לאינטרנט, אל תשכח:
1. להעתיק את משתני הסביבה (.env) לפלטפורמת ההעלאה
2. לשנות את Firestore Rules למצב production (בקונסול של Firebase)

---

## ❓ בעיות נפוצות

### "שגיאה בטעינה" כשנכנס לאתר
- בדוק שמילאת את כל הערכים ב-`.env`
- וודא שהפעלת Firestore ו-Anonymous Authentication ב-Firebase

### "שגיאה בהעלאת תמונה"
- וודא שאתה במצב עריכה (לחצת על "עריכה")
- בדוק את גודל התמונה (עדיף מתחת ל-5MB)

### לא מצליח להתחבר כמנהל
- וודא ששינית את `ADMIN_EMAIL` ו-`ADMIN_PASS` ב-`src/App.jsx`
- הפעל מחדש את השרת (`npm run dev`)

---

## 📞 צריך עזרה?

אם נתקעת, בדוק את:
- קובץ README.md למידע מפורט יותר באנגלית
- הקונסול של הדפדפן (F12) לשגיאות
- Firebase Console לבדיקת הנתונים

בהצלחה! 🎉
