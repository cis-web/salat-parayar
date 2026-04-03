# ⏰ ئەپی ئاگادارکەر — Alarm App

## تایبەتمەندییەکان
- ✅ UI ی جوان و ڕەسەن بە زمانی کوردی
- ✅ دانانی کاتی alarm بە هەڵبژاردنی کاتژمێر و خولەک
- ✅ ناوی alarm دیاری بکە
- ✅ دووبارەکردنەوە (هەر ڕۆژ، ڕۆژی دیاریکراو)
- ✅ ٤ جۆر دەنگی ئامادەکراو
- ✅ **دەنگی خۆت باربکە** (MP3, WAV, OGG)
- ✅ Snooze بەرپرسیاری ٥ خولەک
- ✅ Vibration لە موبایل
- ✅ Local Notifications بۆ Capacitor

---

## ⚙️ نصبکردن و بڕینەسەر موبایل

### پێشمەرجەکان
- Node.js نصب بکە: https://nodejs.org
- Android Studio (بۆ Android): https://developer.android.com/studio
- Xcode (بۆ iOS، تەنیا Mac): Mac پێویستە

### هەنگاوەکان

```bash
# ١. داگرتنی پاکەیجەکان
npm install

# ٢. زیادکردنی Android
npx cap add android

# ٣. هاوکێشکردن
npx cap sync

# ٤. کردنەوە لە Android Studio
npx cap open android
```

لە Android Studio:
- کلیک بکە لەسەر ▶️ Run
- ئیتر ئەپەکە لە موبایلەکەت دادەمەزرێت!

---

## 🔊 کێشەی دەنگ لە Background

ئەمە **کێشەی سیستەمی موبایل** e، نەک کێشەی کۆد:

| بار | دەنگ کار دەکات؟ |
|-----|----------------|
| ئەپ کراوەیە (پێشەوە) | ✅ بەڵێ |
| ئەپ لە پشت (background) | ⚠️ پێویستی بە Native Plugin |
| موبایل قفڵە | ❌ نا بەبێ Foreground Service |

### چارەسەری تەواو بۆ Background:
بۆ ئەوەی دەنگ لە background کار بکات، پلاگینی `@capacitor-community/background-runner` زیاد بکە:

```bash
npm install @capacitor-community/background-runner
npx cap sync
```

یان بەکاربهێنە **Foreground Service** لە Android (لە `android/app/src/main/java/...` فایلی Java دروست بکە)

---

## 📁 پرۆژەی فایلەکان
```
alarm-app/
├── index.html          ← ئەپی سەرەکی
├── capacitor.config.json
├── package.json
└── README.md
```
