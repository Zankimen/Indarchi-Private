# Modul Presensi (Attendance Module)

Modul ini mengelola sistem presensi untuk pekerja di setiap proyek.

## Fitur

### 1. Kalender Presensi Bulanan

- Tampilan kalender yang menampilkan presensi pekerja per bulan
- Warna-warni untuk setiap status (Hadir, Izin, Sakit, Alpha)
- Navigasi antar bulan dengan mudah
- Menampilkan jam masuk dan jam keluar untuk setiap hari

**Route:** `/projects/{project_id}/presensi`

### 2. Absen Mobile-Friendly

- Interface sederhana dan responsif untuk mobile device
- Menampilkan jam real-time
- GPS/Location tracking untuk validasi lokasi
- Tombol Clock In dan Clock Out yang jelas
- Status presensi hari ini

**Route:** `/projects/{project_id}/presensi/mark`

## Database Schema

Tabel `presensi` memiliki kolom:

- `id`: Primary key
- `user_id`: Foreign key ke tabel users
- `project_id`: Foreign key ke tabel projects
- `tanggal`: Tanggal presensi
- `jam_masuk`: Waktu masuk
- `jam_keluar`: Waktu keluar
- `lokasi_masuk`: Alamat lokasi masuk
- `lokasi_keluar`: Alamat lokasi keluar
- `latitude_masuk`: Koordinat latitude masuk
- `longitude_masuk`: Koordinat longitude masuk
- `latitude_keluar`: Koordinat latitude keluar
- `longitude_keluar`: Koordinat longitude keluar
- `status`: Status presensi (hadir, izin, sakit, alpha)
- `keterangan`: Catatan tambahan
- `timestamps`: Created at & Updated at

Constraint: Unique combination of `user_id`, `project_id`, dan `tanggal` (satu presensi per user per project per hari)

## API Endpoints

### GET /projects/{project_id}/presensi

Menampilkan kalender presensi bulanan

- Query params: `year`, `month`, `user_id`

### GET /projects/{project_id}/presensi/mark

Menampilkan halaman absen untuk pekerja

### POST /projects/{project_id}/presensi/clock-in

Absen masuk

- Body: `latitude`, `longitude`, `lokasi`

### POST /projects/{project_id}/presensi/clock-out

Absen keluar

- Body: `latitude`, `longitude`, `lokasi`

### GET /projects/{project_id}/presensi/list

Menampilkan daftar presensi (untuk admin)

### PUT /projects/{project_id}/presensi/{id}

Update data presensi

- Body: `status`, `keterangan`, `jam_masuk`, `jam_keluar`

### DELETE /projects/{project_id}/presensi/{id}

Hapus data presensi

## Cara Menggunakan

### Untuk Pekerja (Kuli):

1. Buka halaman `/projects/{project_id}/presensi/mark`
2. Klik tombol "Dapatkan Lokasi" untuk mengaktifkan GPS
3. Klik tombol "Absen Masuk" pada saat tiba
4. Klik tombol "Absen Keluar" pada saat pulang

### Untuk Admin/Manager:

1. Buka halaman `/projects/{project_id}/presensi` untuk melihat kalender
2. Navigasi antar bulan untuk melihat riwayat presensi
3. Buka halaman `/projects/{project_id}/presensi/list` untuk mengelola data presensi

## Instalasi

1. Jalankan migration:

```bash
php artisan migrate
```

2. Pastikan module Presensi sudah aktif di `modules_statuses.json`

## Teknologi

- Backend: Laravel 11 dengan Inertia.js
- Frontend: React dengan Tailwind CSS
- UI Components: Radix UI (shadcn/ui)
- Icons: Lucide React
