# Room Loan Frontend

Frontend aplikasi **Sistem Peminjaman Ruangan** yang dikembangkan menggunakan **React + TypeScript** dengan bundler **Vite**.

Frontend ini bertanggung jawab untuk:

- Menampilkan data peminjaman
- Mengelola input user
- Berkomunikasi dengan backend melalui REST API
- Menampilkan response dan error

---

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Fetch API / Axios (sesuaikan jika pakai salah satu)

---

## Fitur

- Menampilkan daftar peminjaman ruangan
- Menambah peminjaman
- Mengubah status peminjaman
- Menghapus peminjaman
- Validasi form
- Loading state
- Error handling
- Integrasi dengan backend ASP.NET Core API

---

## Struktur Folder
frontend/
├── public/
├── src/
│ ├── assets/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── styles/
│ ├── types/
│ ├── App.tsx
│ ├── main.tsx
│ └── index.css
├── index.html
├── package.json
├── vite.config.ts
└── README.md


---

## Routing

Routing menggunakan **React Router** dan didefinisikan di `main.tsx`.

Contoh route:

- `/room-loans` → Daftar peminjaman
- `/room-loans/create` → Tambah peminjaman
- `/room-loans/:id` → Detail peminjaman

---

## Integrasi Backend

Frontend terhubung ke backend melalui REST API.

Base URL API diatur di file service (misalnya `roomLoanServices.ts`).

Pastikan backend berjalan sebelum menjalankan frontend.

---

## Prasyarat

- Node.js (versi terbaru direkomendasikan)
- npm atau npx

---

## Cara Menjalankan Project

1. Masuk ke folder frontend:



cd frontend


2. Install dependency:



npm install


3. Jalankan development server:



npx vite


4. Buka browser:



http://localhost:5173


---

## Workflow Git

Branch yang digunakan:

- `main` → branch rilis
- `develop` → branch pengembangan
- `feature/*` → pengembangan fitur

Setiap fitur:
1. Dibuat di branch `feature/*`
2. Dibuat Pull Request ke `develop`
3. Setelah diuji → merge ke `main`

---

## Catatan

- Pastikan backend berjalan sebelum menggunakan aplikasi.
- Semua komunikasi data menggunakan format JSON.
- Versi awal frontend siap digunakan bersama backend v1.0.0.
