# Gemini Cookie Exporter (Chrome Extension)

Ekstensi browser resmi pendamping **go-gemini-web2api** untuk mengekstrak cookie sesi Google Gemini (`__Secure-1PSID`, `__Secure-1PSIDTS`, `SAPISID`, `__Secure-1PSIDCC`) secara instan dengan 1-klik tanpa perlu inspect DevTools manual.

---

## 🚀 Cara Install Ekstensi di Chrome / Edge / Brave

1. Buka browser (Google Chrome, Microsoft Edge, atau Brave).
2. Buka halaman ekstensi browser:
   - **Google Chrome**: Ketik `chrome://extensions` di address bar lalu Enter.
   - **Microsoft Edge**: Ketik `edge://extensions` di address bar lalu Enter.
   - **Brave**: Ketik `brave://extensions` di address bar lalu Enter.
3. Aktifkan **Developer mode** (Mode pengembang) di pojok kanan atas.
4. Klik tombol **Load unpacked** (Muat yang belum dibongkar).
5. Pilih folder:
   ```
   c:\Users\NCN0C\Music\go-gemini-web2api\extension
   ```
6. Ekstensi **"Gemini Cookie Exporter for Web2API"** akan langsung terpasang! Pin ikon ekstensi di toolbar browser agar mudah diakses.

---

## 📖 Cara Penggunaan

1. Buka dan login ke akun Google Anda di [gemini.google.com](https://gemini.google.com).
2. Klik ikon ekstensi **Gemini Exporter** di toolbar browser.
3. Ekstensi akan otomatis mendeteksi cookie:
   - ✅ `__Secure-1PSID` (Session Cookie)
   - ✅ `__Secure-1PSIDTS` (Timestamp Token — wajib untuk anti-expiry auto refresh)
   - ✅ `SAPISID` (Digunakan untuk hashing auth SAPISIDHASH)
   - ✅ `__Secure-1PSIDCC` (Security Client Context)
4. Pilih format yang Anda inginkan:
   - **Raw String**: Salin string cookie langsung untuk disematkan.
   - **.env Format**: Salin baris konfigurasi `GEMINI_COOKIE="..."` dan `GEMINI_COOKIE_REFRESH_MIN=9`.
   - **cookie.txt**: Klik tombol **"Download cookie.txt"** untuk langsung menyimpan file cookie.
5. Jalankan server **go-gemini-web2api**:
   ```sh
   # Menggunakan file cookie.txt
   ./go-gemini-web2api.exe -cookie-file cookie.txt

   # Atau via .env
   # Masukkan string cookie ke GEMINI_COOKIE di file .env lalu:
   ./go-gemini-web2api.exe
   ```
6. Ekstensi juga menyediakan tombol **"Cek Server (127.0.0.1:8081)"** untuk memeriksa apakah server web2api Anda sedang online.
