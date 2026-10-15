# COSMOS — Koinotni kashf eting
React + Vite + Tailwind 4 + React Three Fiber. Interfeys o'zbek tilida.
## Ishga tushirish
    npm install
    npm run dev     # http://localhost:5173
    npm run build
## Bo'limlar
Bosh sahifa, Quyosh tizimi (3D), Sayyoralar va Oy, Galaktikalar, Kosmik missiyalar, O'quv markazi (maqolalar, lug'at, viktorina), NASA APOD yangiliklari, global qidiruv (Ctrl+K).
## NASA kaliti
`.env.example` ni `.env` ga nusxalang va `VITE_NASA_API_KEY` ni kiriting. `VITE_` o'zgaruvchilari brauzerda ochiq bo'ladi; maxfiy kalitlar uchun server proksi ishlating.
## Deploy
GitHub'ga yuklab, Vercel'da import qiling (Vite). `vercel.json` marshrutlarni SPA ga yo'naltiradi.
## Cheklovlar
Masshtab ko'rgazmali. Teksturalar threex.planets omboridan. Missiya holatlari statik. Brauzerda sinovdan o'tkazilmagan; faqat build tekshirilgan. Missiya kartochkalarida rasm yo'q, "harakatni kamaytirish" rejimi hali yo'q.
## Tekshiruv ro'yxati
Barcha menyu havolalari; Quyosh tizimida sayyorani bosish va aylantirish; Tiklash tugmasi; qidiruv (Ctrl+K, strelkalar, Enter); APOD xatosi (kalitsiz/offline); mobil menyu; Tab bilan klaviatura.
