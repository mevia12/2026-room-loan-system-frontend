# Room Loan Backend API

Backend API untuk **Sistem Peminjaman Ruangan** yang dikembangkan menggunakan **ASP.NET Core Web API**.  
Backend ini bertanggung jawab untuk mengelola data peminjaman ruangan, status peminjaman, serta menyediakan endpoint API yang dapat diakses oleh frontend.

---

## Tech Stack

- ASP.NET Core (.NET 8)
- Entity Framework Core
- SQL Server
- Swagger (OpenAPI)

---

## Fitur yang Diimplementasikan

- CRUD peminjaman ruangan
- Pengelolaan status peminjaman (`Pending`, `Approved`, `Rejected`)
- Validasi input request pada backend
- Database migration menggunakan Entity Framework Core
- Testing API menggunakan Swagger UI

---

## Struktur Folder

RoomLoan.Api/
├─ Controllers/ # Controller API
├─ Data/ # DbContext
├─ Dtos/ # Data Transfer Object
├─ Models/ # Entity / Model
├─ Migrations/ # EF Core migrations
├─ Program.cs # Entry point aplikasi
├─ appsettings.json # Konfigurasi aplikasi
└─ RoomLoan.Api.csproj

---

## Prasyarat

Sebelum menjalankan project, pastikan sudah terinstall:

- .NET SDK 8
- SQL Server (Express atau LocalDB)
- (Opsional) SQL Server Management Studio (SSMS)

---

## Konfigurasi Database

Atur connection string di file `appsettings.json`.

Contoh menggunakan SQL Server Express:

````json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=RoomLoanDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
Atau menggunakan LocalDB:

{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=RoomLoanDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}

Cara Menjalankan Project
1. Masuk ke folder project backend:
    cd RoomLoan.Api
2. Restore dependency:
    dotnet restore
3. Jalankan migration database:
    dotnet ef database update
4. Jalankan aplikasi:
    dotnet run
5. Swagger UI dapat diakses melalui:
    https://localhost:{port}/swagger
    atau
    http://localhost:{port}/swagger
Port akan ditampilkan di terminal saat aplikasi dijalankan.

Daftar Endpoint API
1. Base URL:
    /api/roomloans
Endpoint yang tersedia:
1. GET /api/roomloans — Menampilkan semua peminjaman
2. GET /api/roomloans/{id} — Menampilkan detail peminjaman
3. POST /api/roomloans — Menambahkan peminjaman baru
4. PUT /api/roomloans/{id}/status — Mengubah status peminjaman
5. DELETE /api/roomloans/{id} — Menghapus data peminjaman

Validasi Backend
1. RoomName dan BorrowerName wajib diisi
2. Panjang minimal dan maksimal string dibatasi
3. EndTime harus lebih besar dari StartTime
4. Status peminjaman hanya menerima:
    - Pending
    - Approved
    - Rejected
Request tidak valid akan menghasilkan response 400 Bad Request.

Workflow Git
Pengembangan dilakukan menggunakan workflow Git sebagai berikut:
1. main : branch utama / rilis
2. develop : branch pengembangan
3. feature/* : branch fitur
4. Setiap fitur dikembangkan di branch terpisah dan digabungkan melalui Pull Request ke develop
5. Issue dihubungkan dengan Pull Request menggunakan keyword Closes #issue_number

Catatan
1. Pengujian API dilakukan menggunakan Swagger UI
2. Backend ini disiapkan untuk diintegrasikan dengan frontend berbasis React + TypeScript

---

## 🔥 LANGKAH SETELAH INI (JANGAN DILEWATI)
Setelah copas README di repo backend:

```bash
git add README.md
git commit -m "docs: add backend README"
git push
Lalu:
3. buat PR ke develop
4. merge PR
5. pindahkan Issue backend → Done di Project Board
````
