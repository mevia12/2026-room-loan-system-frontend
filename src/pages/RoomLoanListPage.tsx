import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getRoomLoans,
  updateRoomLoanStatus,
} from "../services/roomLoanServices";

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

function StatusBadge({ status }: { status: string }) {
  const normalized = (status || "").toLowerCase();

  const style: React.CSSProperties = useMemo(() => {
    const base: React.CSSProperties = {
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      border: "1px solid #ddd",
    };

    if (normalized === "approved")
      return { ...base, background: "#e7f7ee", borderColor: "#b7e8c8" };
    if (normalized === "rejected")
      return { ...base, background: "#fdecec", borderColor: "#f5b8b8" };
    return { ...base, background: "#fff7e6", borderColor: "#ffd8a8" };
  }, [normalized]);

  return <span style={style}>{status || "Pending"}</span>;
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

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Daftar Peminjaman</h1>
          <p style={{ margin: "6px 0 0", color: "#555" }}>
            Data diambil dari backend (ASP.NET) melalui API.
          </p>
        </div>

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
          Refresh
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
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f6f6f6" }}>
                  <th style={th}>ID</th>
                  <th style={th}>Ruangan</th>
                  <th style={th}>Peminjam</th>
                  <th style={th}>Mulai</th>
                  <th style={th}>Selesai</th>
                  <th style={th}>Status</th>
                  <th style={th}>Ubah Status</th>
                  <th style={th}>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {roomLoans.map((item) => (
                  <tr key={item.id}>
                    <td style={td}>{item.id}</td>
                    <td style={td}>{item.roomName}</td>
                    <td style={td}>{item.borrowerName}</td>
                    <td style={td}>{formatDateTime(item.startTime)}</td>
                    <td style={td}>{formatDateTime(item.endTime)}</td>
                    <td style={td}>
                      <StatusBadge status={item.status} />
                    </td>

                    <td style={td}>
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

                    {/* 🔹 AKSI (Detail) */}
                    <td style={td}>
                      <Link
                        to={`/room-loans/${item.id}`}
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          cursor: "pointer",
                          position: "relative",
                          zIndex: 10,
                          pointerEvents: "auto",
                        }}
                      >
                        Detail
                      </Link>
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

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "1px solid #ddd",
  fontSize: 13,
};

const td: React.CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid #eee",
  fontSize: 14,
};
