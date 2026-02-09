import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getRoomLoans,
  updateRoomLoanStatus,
  deleteRoomLoan,
} from "../services/roomLoanServices";
import SearchBar from "../components/SearchBar";

type RoomLoan = {
  id: number;
  roomName: string;
  borrowerName: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt?: string;
};

type StatusValue = "Pending" | "Approved" | "Rejected";

function formatDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export default function RoomLoanListPage() {
  const [roomLoans, setRoomLoans] = useState<RoomLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [draftStatus, setDraftStatus] = useState<Record<number, StatusValue>>(
    {},
  );

  const [savingId, setSavingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getRoomLoans();
      const list = Array.isArray(data) ? data : [];
      setRoomLoans(list);

      const map: Record<number, StatusValue> = {};
      for (const x of list) {
        map[x.id] = (x.status || "Pending") as StatusValue;
      }
      setDraftStatus(map);
    } catch {
      setError("Gagal mengambil data dari server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleSaveStatus(id: number) {
    const status = draftStatus[id];
    if (!status) return;

    setSavingId(id);
    setToast(null);
    try {
      await updateRoomLoanStatus(id, status);
      setToast(`Status ID ${id} berhasil diupdate ke ${status}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal update status.");
    } finally {
      setSavingId(null);
    }
  }

  // 🔴 DELETE HANDLER
  async function handleDelete(id: number) {
    const ok = window.confirm("Yakin mau hapus data ini?");
    if (!ok) return;

    try {
      await deleteRoomLoan(id);
      await load(); // refresh table setelah delete
    } catch (e) {
      setError("Gagal hapus data");
    }
  }

  return (
    <div className="container">
      <h1 className="page-title">Daftar Peminjaman</h1>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <p style={{ margin: 0, color: "#555" }}>
          Data diambil dari backend (ASP.NET) melalui API.
        </p>

        <SearchBar
          onSearch={(keyword) => {
            const filtered = roomLoans.filter(
              (x) =>
                x.roomName.toLowerCase().includes(keyword.toLowerCase()) ||
                x.borrowerName.toLowerCase().includes(keyword.toLowerCase()),
            );
            setRoomLoans(filtered);
          }}
        />

        <button
          onClick={load}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Refresh <i className="fa fa-refresh" aria-hidden="true"></i>
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        {toast && (
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: "#e7f7ee",
              border: "1px solid #b7e8c8",
              marginBottom: 12,
            }}
          >
            {toast}
          </div>
        )}

        {loading && <p>Loading...</p>}

        {!loading && error && (
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: "#fdecec",
              border: "1px solid #f5b8b8",
            }}
          >
            <b>Error:</b> {error}
          </div>
        )}

        {!loading && !error && roomLoans.length > 0 && (
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ruangan</th>
                  <th>Peminjam</th>
                  <th>Mulai</th>
                  <th>Selesai</th>
                  <th>Status</th>
                  <th>Ubah Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {roomLoans.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.roomName}</td>
                    <td>{item.borrowerName}</td>
                    <td>{formatDateTime(item.startTime)}</td>
                    <td>{formatDateTime(item.endTime)}</td>

                    <td>
                      <span
                        className={
                          "badge " +
                          (item.status === "Approved"
                            ? "badge-approved"
                            : item.status === "Rejected"
                              ? "badge-rejected"
                              : "badge-pending")
                        }
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <select
                          value={draftStatus[item.id] ?? "Pending"}
                          onChange={(e) =>
                            setDraftStatus((prev) => ({
                              ...prev,
                              [item.id]: e.target.value as StatusValue,
                            }))
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>

                        <button
                          onClick={() => handleSaveStatus(item.id)}
                          disabled={savingId === item.id}
                        >
                          {savingId === item.id ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </td>

                    <td style={{ display: "flex", gap: 8 }}>
                      <Link
                        to={`/room-loans/${item.id}`}
                        style={{
                          display: "inline-block",
                          padding: "6px 12px",
                          border: "1px solid #22c55e",
                          borderRadius: 6,
                          color: "#166534",
                          textDecoration: "none",
                          fontWeight: 500,
                          background: "#dcfce7",
                        }}
                      >
                        Update
                      </Link>

                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          padding: "6px 12px",
                          border: "1px solid #ef4444",
                          borderRadius: 6,
                          background: "#fee2e2",
                          color: "#991b1b",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ marginTop: 10, color: "#666" }}>
              Total: <b>{roomLoans.length}</b> data
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
