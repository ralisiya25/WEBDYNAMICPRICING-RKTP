# 📊 Rendang Koro Smart - Sistem Scan Label TTI

## 📁 Struktur Proyek
- `index.html` → Halaman utama website
- `style.css` → Tampilan dan desain website
- `script.js` → Logika deteksi warna dan evaluasi kualitas
- `README.md` → Panduan penggunaan

## ⚙️ Cara Menjalankan
1. Ekstrak file ZIP ke dalam satu folder.
2. Pastikan semua file (`index.html`, `style.css`, `script.js`) berada di folder yang sama.
3. Klik dua kali `index.html` untuk membuka website di browser.

> Jika browser memblokir akses kamera saat membuka file lokal, jalankan folder lewat Live Server (Visual Studio Code) atau serve lewat server lokal sederhana.

## 📸 Cara Menggunakan Sistem
1. Pilih kamera (depan atau belakang) sesuai kebutuhan.
2. Arahkan kamera ke label TTI produk.
3. Klik tombol **"🔍 Scan Warna"**.
4. Sistem akan membaca warna label dan menampilkan:
   - Nilai RGB hasil scan
   - Status kualitas produk (Sangat Layak, Masih Layak, Tidak Layak)
   - Harga yang disesuaikan secara otomatis

## 🧠 Teknologi yang Digunakan
- JavaScript + HTML5 Canvas API untuk analisis warna
- Metode **Delta E (Color Distance)** untuk membandingkan hasil scan dengan warna referensi TTI
- LocalStorage untuk menyimpan riwayat hasil scan
- CSV Export untuk analisis data

## 📊 Warna Referensi TTI
| Status | Warna | RGB Perkiraan |
|--------|-------|---------------|
| Sangat Layak | Merah kecoklatan | (75, 9, 12) |
| Masih Layak | Merah kekuningan | (101, 7, 5) |
| Tidak Layak | Kuning terang | (245, 197, 66) |

## ✅ Tips Agar Hasil Akurat
- Lakukan scan di tempat terang dan stabil.
- Jarak kamera ± 10–15 cm dari label.
- Pastikan label memenuhi sebagian besar area kamera.

---
*Website ini dirancang untuk mendukung penelitian penerapan smart packaging dengan TTI berbasis PVA dan kurkumin pada produk rendang tempe koro pedang.*
