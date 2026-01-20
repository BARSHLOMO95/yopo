# THE GALLERY - קטלוג מוצרים

אתר קטלוג מוצרים מתקדם עם אפשרות להעלאת תמונות ולינקים לרכישה, בנוי עם React ו-Firebase.

## תכונות

- ✨ ממשק משתמש מודרני ומעוצב (RTL)
- 📁 ניהול קטגוריות עם תמונות תצוגה
- 🖼️ העלאה מרובה של תמונות
- 🗜️ דחיסה אוטומטית של תמונות
- 🔗 קישורים לרכישה לכל קטגוריה
- 🔒 מצב ניהול מאובטח
- 📱 Responsive - מתאים לכל המכשירים
- ⚡ מהיר ואופטימלי

## התקנה

### 1. שכפל את הפרויקט

```bash
git clone <repository-url>
cd yopo
```

### 2. התקן תלויות

```bash
npm install
```

### 3. הגדר Firebase

#### א. צור פרויקט Firebase:
1. כנס ל-[Firebase Console](https://console.firebase.google.com/)
2. לחץ על "Add project" וצור פרויקט חדש
3. הפעל **Firestore Database**:
   - לך ל-Build > Firestore Database
   - לחץ "Create database"
   - בחר במיקום (לדוגמה: europe-west1)
   - התחל במצב Test mode (או Production - תוכל לשנות לאחר מכן)

4. הגדר **Authentication**:
   - לך ל-Build > Authentication
   - לחץ "Get started"
   - הפעל "Anonymous" sign-in

#### ב. קבל את פרטי ההתחברות:
1. לך ל-Project Settings (הגלגל ליד Project Overview)
2. גלול למטה ל-"Your apps"
3. לחץ על "Web" (סמל </>)
4. תן שם לאפליקציה ולחץ "Register app"
5. העתק את ה-`firebaseConfig`

#### ג. הגדר משתני סביבה:
1. העתק את הקובץ `.env.example` ל-`.env`:
   ```bash
   cp .env.example .env
   ```

2. מלא את הערכים בקובץ `.env` עם הפרטים מ-Firebase:
   ```env
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   VITE_APP_ID=catalog-app
   ```

### 4. שנה את פרטי המנהל

ערוך את הקובץ `src/App.jsx` ושנה את פרטי ההתחברות של המנהל:

```javascript
const ADMIN_EMAIL = "your-email@example.com";
const ADMIN_PASS = "your-secure-password";
```

**חשוב:** זוהי דרך פשוטה לאימות. לאתר production מומלץ להשתמש ב-Firebase Authentication מלא.

### 5. הרץ את הפרויקט

```bash
npm run dev
```

האתר יהיה זמין ב: `http://localhost:3000`

## שימוש

### כמשתמש רגיל:
- גלוש בין קטגוריות
- צפה בתמונות
- לחץ על כפתור "לחץ כאן לרכישה" כדי לעבור לחנות

### כמנהל:
1. לחץ על כפתור "ניהול" בפינה השמאלית העליונה
2. התחבר עם פרטי המנהל
3. לחץ על "עריכה" כדי להיכנס למצב עריכה
4. כעת תוכל:
   - להוסיף קטגוריות חדשות
   - לערוך שמות קטגוריות
   - להעלות תמונות תצוגה לקטגוריות
   - למחוק קטגוריות
   - להעלות תמונות מוצרים (העלאה מרובה)
   - להוסיף/לערוך קישורי רכישה
   - למחוק תמונות

## פריסה (Deployment)

### Vercel:
```bash
npm run build
vercel
```

### Netlify:
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Firebase Hosting:
```bash
npm run build
firebase init hosting
firebase deploy
```

## מבנה הפרויקט

```
yopo/
├── src/
│   ├── App.jsx          # הקומפוננטה הראשית
│   ├── firebase.js      # הגדרות Firebase
│   ├── main.jsx         # נקודת כניסה
│   └── index.css        # Tailwind CSS
├── public/              # קבצים סטטיים
├── .env.example         # דוגמה למשתני סביבה
├── package.json         # תלויות
├── vite.config.js       # הגדרות Vite
└── tailwind.config.js   # הגדרות Tailwind
```

## טכנולוגיות

- **React 18** - ספריית UI
- **Vite** - Build tool מהיר
- **Firebase** - Backend (Firestore + Authentication)
- **Tailwind CSS** - עיצוב
- **Lucide React** - אייקונים

## אבטחה

**שים לב:** הקוד הנוכחי משתמש באימות פשוט (username/password) שמאוחסן בקוד. זה מתאים לפיתוח ולאתרים פרטיים בלבד.

לאתר production מומלץ:
1. להשתמש ב-Firebase Authentication עם Email/Password
2. להגדיר Firestore Security Rules נכונות
3. לא לאחסן סיסמאות בקוד

### דוגמה ל-Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/{document=**} {
      allow read: true;
      allow write: if request.auth != null;
    }
  }
}
```

## תמיכה

לבעיות או שאלות, פתח issue בגיטהאב.

## רישיון

MIT License - חופשי לשימוש מסחרי ופרטי.
