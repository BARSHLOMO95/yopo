import React, { useState, useEffect } from 'react';
import {
  doc, setDoc, onSnapshot, collection, deleteDoc, addDoc
} from 'firebase/firestore';
import {
  signInAnonymously, onAuthStateChanged
} from 'firebase/auth';
import {
  Edit2, Check, Image as ImageIcon,
  Trash2, Upload, Plus, ChevronRight, LayoutGrid, X, ExternalLink, ShoppingCart, Maximize2, Lock, LogOut
} from 'lucide-react';
import { db, auth, appId } from './firebase';

// הגדרת פרטי מנהל - שנה את זה לפי הצורך שלך!
const ADMIN_EMAIL = "barshlomo97@gmail.com";
const ADMIN_PASS = "Barbar@@1997";

// --- פונקציה לדחיסת תמונות ---
const compressImage = (base64Str, maxWidth = 800, quality = 0.6) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
  });
};

const App = () => {
  const [categories, setCategories] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]); // תמונות של הקטגוריה הנוכחית
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isCatalogAdmin') === 'true');
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', pass: '' });
  const [loading, setLoading] = useState(true);

  // --- התחברות אוטומטית ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        setError("שגיאה בהתחברות: " + err.message);
      }
    };
    initAuth();
    return onAuthStateChanged(auth, setUser);
  }, []);

  // --- האזנה לשינויים בקטגוריות ---
  useEffect(() => {
    if (!user) return;
    const categoriesCol = collection(db, 'artifacts', appId, 'public', 'data', 'categories');
    return onSnapshot(categoriesCol, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setCategories(cats);
      setLoading(false);
    }, (err) => {
      setError("שגיאה בטעינה: " + err.message);
      setLoading(false);
    });
  }, [user]);

  // --- האזנה למוצרים של הקטגוריה הנבחרת ---
  useEffect(() => {
    if (!user || !currentCategoryId) {
      setCategoryItems([]);
      return;
    }
    const itemsCol = collection(db, 'artifacts', appId, 'public', 'data', 'categories', currentCategoryId, 'items');
    return onSnapshot(itemsCol, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      // מיון לפי זמן הוספה
      setCategoryItems(items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    });
  }, [user, currentCategoryId]);

  // --- פעולות Cloud ---
  const saveCategoryMetadata = async (catId, data) => {
    if (!isAdmin || !user) return;
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'categories', catId);
      await setDoc(docRef, data, { merge: true });
    } catch (err) {
      setError("שגיאה בשמירה: " + err.message);
    }
  };

  const deleteCategory = async (catId) => {
    if (!isAdmin || !user) return;
    if (!confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו?')) return;
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'categories', catId);
      await deleteDoc(docRef);
      setCurrentCategoryId(null);
    } catch (err) {
      setError("שגיאה במחיקה: " + err.message);
    }
  };

  const addProductToCloud = async (catId, imageUrl) => {
    if (!isAdmin || !user) return;
    try {
      const itemsCol = collection(db, 'artifacts', appId, 'public', 'data', 'categories', catId, 'items');
      await addDoc(itemsCol, {
        url: imageUrl,
        createdAt: Date.now()
      });
    } catch (err) {
      setError("שגיאה בהעלאת תמונה: " + err.message);
    }
  };

  const deleteProduct = async (prodId) => {
    if (!isAdmin || !user || !currentCategoryId) return;
    if (!confirm('האם אתה בטוח שברצונך למחוק תמונה זו?')) return;
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'categories', currentCategoryId, 'items', prodId);
      await deleteDoc(docRef);
    } catch (err) {
      setError("שגיאה במחיקה: " + err.message);
    }
  };

  // --- Handlers ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.email === ADMIN_EMAIL && loginForm.pass === ADMIN_PASS) {
      setIsAdmin(true);
      localStorage.setItem('isCatalogAdmin', 'true');
      setShowLoginModal(false);
      setLoginForm({ email: '', pass: '' });
      setError(null);
    } else {
      setError("פרטי התחברות שגויים");
    }
  };

  const handleMultipleUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0 || !currentCategoryId) return;
    setIsUploading(true);

    for (const file of files) {
      try {
        const base64 = await new Promise((r) => {
          const reader = new FileReader();
          reader.onloadend = () => r(reader.result);
          reader.readAsDataURL(file);
        });
        const compressed = await compressImage(base64, 1000, 0.6);
        await addProductToCloud(currentCategoryId, compressed);
      } catch (err) {
        console.error("Upload error:", err);
        setError("שגיאה בהעלאת אחת התמונות");
      }
    }
    setIsUploading(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-400 animate-pulse">
      מתחבר למסד הנתונים...
    </div>
  );

  const currentCategory = categories.find(c => c.id === currentCategoryId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentCategoryId(null); setIsEditing(false); }}>
          <div className="bg-black p-2 rounded-xl text-white"><LayoutGrid size={22} /></div>
          <h1 className="text-xl font-black">THE GALLERY</h1>
        </div>

        <div className="flex gap-2">
          {!isAdmin ? (
            <button onClick={() => setShowLoginModal(true)} className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold bg-white text-slate-600 border border-slate-200 shadow-sm">
              <Lock size={16} /> ניהול
            </button>
          ) : (
            <>
              <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold shadow-sm transition-all ${isEditing ? 'bg-emerald-500 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                {isEditing ? <><Check size={18} /> שמור</> : <><Edit2 size={16} /> עריכה</>}
              </button>
              <button onClick={() => { setIsAdmin(false); setIsEditing(false); localStorage.removeItem('isCatalogAdmin'); }} className="p-2 text-slate-400"><LogOut size={20} /></button>
            </>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 text-red-700 flex items-center justify-between rounded-l-xl font-bold">
            <span>{String(error)}</span>
            <button onClick={() => setError(null)}><X size={18} /></button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-bold text-slate-400">
           <button onClick={() => setCurrentCategoryId(null)} className={!currentCategoryId ? 'text-black font-black' : 'hover:text-slate-600'}>דף הבית</button>
           {currentCategoryId && <><ChevronRight size={14} /> <span className="text-black">{currentCategory?.name}</span></>}
        </nav>

        {!currentCategoryId ? (
          /* --- רשימת קטגוריות --- */
          <section>
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-black italic tracking-tighter uppercase">Categories</h2>
               {isEditing && (
                 <button onClick={() => saveCategoryMetadata(`cat-${Date.now()}`, { name: 'קטגוריה חדשה', thumbnail: '', globalLink: '' })} className="bg-black text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={18} /> הוסף קטגוריה</button>
               )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div key={cat.id} onClick={() => !isEditing && setCurrentCategoryId(cat.id)} className={`group bg-white rounded-3xl overflow-hidden border-2 transition-all duration-300 ${isEditing ? 'border-dashed border-indigo-200' : 'border-white hover:shadow-2xl hover:-translate-y-1 cursor-pointer shadow-sm'}`}>
                  <div className="aspect-video bg-slate-100 relative">
                    {cat.thumbnail ? <img src={cat.thumbnail} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon size={48} /></div>}
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4 backdrop-blur-sm">
                        <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-bold text-xs">שנה תמונה<input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                          if (!e.target.files[0]) return;
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            const compressed = await compressImage(reader.result, 800, 0.6);
                            saveCategoryMetadata(cat.id, { thumbnail: compressed });
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }} /></label>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    {isEditing ? (
                      <div className="flex gap-2 w-full">
                        <input type="text" value={cat.name} onChange={(e) => saveCategoryMetadata(cat.id, { name: e.target.value })} className="flex-1 bg-slate-50 p-2 rounded-lg border font-bold" />
                        <button onClick={(e) => { e.stopPropagation(); deleteCategory(cat.id); }} className="p-2 text-red-500"><Trash2 size={20} /></button>
                      </div>
                    ) : (
                      <h3 className="text-lg font-black">{cat.name}</h3>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          /* --- מוצרים בקטגוריה --- */
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
               <h2 className="text-4xl font-black">{currentCategory?.name}</h2>
               {isEditing && (
                 <label className="cursor-pointer bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg active:scale-95">
                   <Upload size={20} /> העלאה מרובה
                   <input type="file" multiple accept="image/*" className="hidden" onChange={handleMultipleUpload} />
                 </label>
               )}
            </div>

            <div className="mb-10">
              {isEditing ? (
                <div className="bg-white p-5 rounded-2xl border border-indigo-100">
                  <label className="text-[10px] font-black text-slate-400 uppercase">קישור רכישה</label>
                  <input type="text" value={currentCategory?.globalLink || ''} onChange={(e) => saveCategoryMetadata(currentCategory.id, { globalLink: e.target.value })} className="w-full bg-slate-50 p-3 rounded-xl outline-none" placeholder="https://..." />
                </div>
              ) : currentCategory?.globalLink && (
                <a href={currentCategory.globalLink.startsWith('http') ? currentCategory.globalLink : `https://${currentCategory.globalLink}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 shadow-xl transition-all">
                  <ShoppingCart size={24} /> לחץ כאן לרכישה <ExternalLink size={20} />
                </a>
              )}
            </div>

            {isUploading && (
              <div className="mb-8 p-6 bg-slate-900 text-white rounded-3xl flex items-center gap-4 animate-pulse font-bold">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                מעלה תמונות לענן...
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryItems.map((item) => (
                <div key={item.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 aspect-[3/2]">
                  <img src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[1px]">
                    {!isEditing ? (
                      <button onClick={() => setSelectedImage(item.url)} className="bg-white text-black p-4 rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-all"><Maximize2 size={24} /></button>
                    ) : (
                      <button onClick={() => deleteProduct(item.id)} className="bg-red-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all"><Trash2 size={24} /></button>
                    )}
                  </div>
                </div>
              ))}
              {categoryItems.length === 0 && !isUploading && (
                <div className="col-span-full py-20 text-center text-slate-300 font-bold border-4 border-dashed border-slate-100 rounded-[3rem]">
                   הקטגוריה ריקה. העלה תמונות במצב עריכה.
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 animate-in fade-in" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 text-white"><X size={40} /></button>
          <img src={selectedImage} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} alt="" />
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <form onSubmit={handleLogin} className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-900 mb-4"><Lock size={30} /></div>
              <h3 className="text-2xl font-black">כניסת מנהל</h3>
            </div>
            <div className="space-y-4">
              <input type="email" value={loginForm.email} onChange={(e) => setLoginForm({...loginForm, email: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-black" placeholder="אימייל" required />
              <input type="password" value={loginForm.pass} onChange={(e) => setLoginForm({...loginForm, pass: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-black" placeholder="סיסמה" required />
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all">התחברות</button>
              <button type="button" onClick={() => setShowLoginModal(false)} className="w-full py-2 font-bold text-slate-400">ביטול</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
