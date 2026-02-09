import { useState } from "react";
import RoomLoanListPage from "./pages/RoomLoanListPage";
import RoomLoanCreatePage from "./pages/RoomLoanCreatePage";

type Page = "list" | "create";

export default function App() {
  const [page, setPage] = useState<Page>("list");

  return (
    <div style={{ padding: "1rem" }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Sistem Peminjaman Ruangan</h1>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => setPage("list")}>Daftar</button>
          <button onClick={() => setPage("create")}>Tambah</button>
        </div>
      </header>

      <hr style={{ margin: "1rem 0" }} />

      {page === "list" ? <RoomLoanListPage /> : <RoomLoanCreatePage />}
    </div>
  );
}
