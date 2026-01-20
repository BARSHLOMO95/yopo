# צעדים מדויקים להגדרת Firebase

## 🔥 1. כנס ל-Firebase Console
- גלוש ל: https://console.firebase.google.com/
- התחבר עם Google

## 🆕 2. צור פרויקט
- לחץ "Add project" / "הוסף פרויקט"
- שם הפרויקט: yopo-catalog (או כל שם אחר)
- Google Analytics: לא חובה, אפשר לכבות
- לחץ "Create project"

## 📊 3. הפעל Firestore Database
- בתפריט שמאל: Build > Firestore Database
- לחץ "Create database"
- מיקום: europe-west1 (בחר אירופה)
- **חשוב:** בחר "Start in test mode"
- לחץ "Enable"

## 🔓 4. הפעל Anonymous Authentication
- בתפריט שמאל: Build > Authentication
- לחץ "Get started"
- בחר "Anonymous"
- הפעל את הכפתור (toggle)
- לחץ "Save"

## 🌐 5. צור Web App והעתק את הפרטים
- לחץ על ⚙️ (Project Settings) ליד "Project Overview"
- גלול למטה ל-"Your apps"
- לחץ על </> (Web icon)
- שם האפליקציה: yopo-web
- לחץ "Register app"

## 📋 6. תראה משהו כזה - העתק את זה:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",              // ← העתק את זה
  authDomain: "yopo.firebaseapp.com", // ← ואת זה
  projectId: "yopo",                  // ← ואת זה
  storageBucket: "yopo.appspot.com",  // ← ואת זה
  messagingSenderId: "123456789",     // ← ואת זה
  appId: "1:123:web:abc"              // ← ואת זה
};
```

## ✅ סיימת את Firebase! עכשיו עבור לשלב הבא...
