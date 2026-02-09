import { Link, Outlet } from "react-router-dom";


export default function App() {
  return (
      <div style={{ fontFamily: "Arial, sans-serif" }}>
      <header
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          background: "#670626",
          padding: "1rem"
        }}
      >
        <h1 style={{ margin: 0, color: "white"}}>Sistem Peminjaman Ruangan</h1>

        <nav style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Link to="/room-loans">
           <button >Back</button>
          </Link>

          <Link to="/room-loans/create">
            <button>Tambah</button>
          </Link>
        </nav>
      </header>

      {/* <hr style={{ margin: "1rem 0" }} /> */}

      {/* 🔽 semua halaman (list, create, detail) dirender di sini */}
      <Outlet />
    </div>
  );
}
