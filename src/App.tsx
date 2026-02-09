import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div style={{ padding: "1rem" }}>
      <header
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>Sistem Peminjaman Ruangan</h1>

        <nav style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Link to="/room-loans">
            <button>Daftar</button>
          </Link>

          <Link to="/room-loans/create">
            <button>Tambah</button>
          </Link>
        </nav>
      </header>

      <hr style={{ margin: "1rem 0" }} />

      {/* 🔽 semua halaman (list, create, detail) dirender di sini */}
      <Outlet />
    </div>
  );
}
