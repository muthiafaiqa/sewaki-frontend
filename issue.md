# Rencana Migrasi Tailwind CSS (SewaKi Frontend)

Dokumen ini berisi langkah-langkah detail untuk mengimplementasikan Tailwind CSS pada proyek Vue.js ini. Instruksi ini ditujukan untuk diikuti secara berurutan oleh model AI untuk mempercepat proses pengembangan antarmuka pengguna (UI).

## Konteks Proyek
- **Framework:** Vue 3 + Vite
- **Sistem CSS Saat Ini:** Menggunakan Vanilla CSS dengan CSS Variables yang didefinisikan dalam `src/styles/tokens.css` dan diimpor melalui `src/style.css`.
- **Tujuan:** Mengganti styling manual dengan Tailwind CSS secara bertahap tanpa merusak tampilan saat ini.

---

## Langkah-langkah Implementasi

### Tahap 1: Instalasi & Konfigurasi Awal
1. **Instalasi Dependencies**
   Jalankan perintah berikut di terminal untuk menginstal Tailwind CSS beserta dependensi yang dibutuhkan:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

2. **Inisialisasi Konfigurasi**
   Jalankan perintah berikut untuk membuat file `tailwind.config.js` dan `postcss.config.js`:
   ```bash
   npx tailwindcss init -p
   ```

3. **Konfigurasi Path pada `tailwind.config.js`**
   Ubah isi `tailwind.config.js` agar Tailwind dapat memindai kelas-kelas yang digunakan di dalam file sumber proyek:
   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: [
       "./index.html",
       "./src/**/*.{vue,js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

### Tahap 2: Integrasi Token Desain (Theme Configuration)
Proyek ini memiliki token desain berupa CSS variables di dalam `src/styles/tokens.css`. Agar Tailwind mengikuti panduan desain proyek, Anda perlu memasukkan nilai-nilai tersebut ke dalam bagian `theme.extend` di `tailwind.config.js`.

Pindahkan nilai-nilai (Colors, Border Radius, Box Shadow, dan Spacing) dari `src/styles/tokens.css` ke dalam objek `theme` Tailwind. Contoh:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#111111',
        active: '#242424',
        disabled: '#e5e7eb',
      },
      ink: '#111111',
      body: '#374151',
      // Lanjutkan untuk warna lainnya seperti muted, canvas, surface-soft, dll.
    },
    borderRadius: {
      'xs': '4px',
      'sm': '6px',
      'md': '8px',
      // Lanjutkan untuk border-radius lainnya...
    },
    boxShadow: {
      'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
      'md': '0 4px 12px rgba(0, 0, 0, 0.08)',
    }
  }
}
```

### Tahap 3: Modifikasi File CSS Utama
1. Buka file `src/style.css`.
2. Hapus atau beri komentar pada reset global (`html`, `body`, dll.) karena Tailwind sudah menyediakannya (Preflight).
3. Tambahkan Tailwind directives di bagian paling atas file tersebut:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
4. *Catatan:* Biarkan impor file css lama (`@import './styles/tokens.css';`, dll.) untuk sementara agar komponen yang belum dimigrasi tidak berantakan.

### Tahap 4: Refactor Komponen Vue (Iteratif)
Pilih komponen-komponen Vue di dalam direktori `src/components/` atau `src/views/` secara bertahap (satu per satu atau per modul) dan lakukan langkah berikut:
1. Ganti styling dari tag `<style scoped>` (Vanilla CSS) ke utilitas kelas (class utilities) milik Tailwind CSS pada tag template HTML-nya.
2. Manfaatkan kelas yang sudah disesuaikan pada `tailwind.config.js` (misalnya: `text-body`, `bg-canvas`, `rounded-md`, dll).
3. Setelah satu komponen berhasil diubah 100% menggunakan Tailwind, hapus blok `<style>` lamanya jika sudah kosong/tidak digunakan.

### Tahap 5: Pembersihan (Cleanup)
Setelah seluruh komponen Vue sepenuhnya beralih ke Tailwind CSS:
1. Hapus file CSS lama yang sudah tidak terpakai di folder `src/styles/` (misalnya: `components.css`, `utilities.css`, `typography.css`, dan `tokens.css`).
2. Pastikan file `src/style.css` hanya berisi directives `@tailwind` dan style khusus yang memang tidak bisa digantikan oleh Tailwind.

---
**Catatan untuk AI Model:** Lakukan langkah ini secara bertahap dan pastikan untuk tidak merusak *layout* atau fungsionalitas UI selama masa transisi. Jika ada keraguan pada class yang spesifik, buat perbandingan dengan CSS variabel aslinya.
