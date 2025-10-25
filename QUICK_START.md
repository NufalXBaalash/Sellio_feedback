# 🚀 دليل البدء السريع - SELLIOai Feedback Landing

## التشغيل السريع

```bash
# 1. الانتقال للمجلد
cd SELLIOai-feedback-landing

# 2. تثبيت المتطلبات
npm install

# 3. تشغيل خادم التطوير
npm run dev
```

## الوصول للتطبيق

- **الصفحة الرئيسية**: http://localhost:3001
- **صفحة الإدارة**: http://localhost:3001/admin

## الميزات

✅ **صفحة جمع الآراء** - تصميم جميل مع ألوان SELLIOai  
✅ **حفظ البيانات** - في ملف CSV تلقائياً  
✅ **تصدير البيانات** - من صفحة الإدارة  
✅ **رابط MVP** - للعملاء لتجربة SELLIOai  
✅ **دعم العربية** - كامل مع اتجاه RTL

## هيكل البيانات

البيانات تُحفظ في `data/feedback.csv`:

| Email          | IsUseful | Feedback   | Timestamp            |
| -------------- | -------- | ---------- | -------------------- |
| user@email.com | yes      | رأي إيجابي | 2024-01-01T12:00:00Z |

## النشر

```bash
# بناء المشروع
npm run build

# تشغيل الإنتاج
npm start
```

يمكن نشر المشروع على Vercel أو أي منصة تدعم Next.js.
