# Desain Fitur Filter Jarak Terdekat (Katalog Frontend)

Fitur ini memungkinkan pengguna untuk menyaring barang sewaan berdasarkan jarak terdekat dari lokasi GPS pengguna yang telah disimpan di profil.

## Spesifikasi Teknis

### 1. Komponen Filter (`ProductFilter.vue`)
* **Tambahan UI**:
  * Baris filter baru untuk pencarian terdekat.
  * Switch toggle bertuliskan `📍 Cari yang Terdekat dari Saya`.
  * Dropdown/Select Radius Jarak dengan opsi:
    * `5` (5 KM)
    * `10` (10 KM)
    * `25` (25 KM)
    * `all` (Semua Jarak)
  * Radius dropdown dinonaktifkan (`disabled`) jika Switch Terdekat tidak aktif.
* **Emisi Data**:
  * Event `@filter-change` memancarkan:
    ```javascript
    {
      search: String,
      category: String,
      nearMe: Boolean,
      radius: String // '5', '10', '25', atau 'all'
    }
    ```

### 2. Logika Utama Katalog (`index.vue`)
* **State Baru**:
  ```javascript
  const currentUser = ref(null);
  const showGpsModal = ref(false);
  ```
* **Alur Validasi & Pemuatan Profil**:
  * Jika filter `nearMe` aktif:
    1. Cek token login. Jika tidak ada token, arahkan pengguna ke halaman login (`/login`).
    2. Jika `currentUser` belum dimuat, panggil `GET /api/auth/profile` untuk mengambil detail profil pengguna (termasuk koordinat).
    3. Periksa ketersediaan `latitude` dan `longitude` di dalam data profil pengguna.
    4. Jika koordinat kosong/tidak valid:
       * Set filter `nearMe` kembali ke `false` (reset UI switch).
       * Set `showGpsModal = true` untuk menampilkan popup peringatan.
    5. Jika koordinat tersedia dan radius bukan `"all"`:
       * Panggil API `GET /api/items?latitude=${lat}&longitude=${lng}&radius=${selectedRadius}`.
  * Jika filter `nearMe` tidak aktif atau radius bernilai `"all"`:
    * Panggil API secara standar `GET /api/items`.

### 3. Airbnb-style Alert Modal (`BaseModal` Integration)
* **Pesan Peringatan**: "Mohon aktifkan lokasi GPS Anda di halaman Profil terlebih dahulu untuk menggunakan fitur ini."
* **Tombol Aksi**:
  * **"Buka Profil"**: Mengarahkan ke `/profile`.
  * **"Batal"**: Menutup modal.
