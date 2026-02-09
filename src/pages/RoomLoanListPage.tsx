import { useEffect, useMemo, useState } from "react";
import { getRoomLoans } from "../services/roomLoanServices";

type RoomLoan = {
  id: number;
  roomName: string;
  borrowerName: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  status: string;
  createdAt?: string;
};

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
    return { ...base, background: "#fff7e6", borderColor: "#ffd8a8" }; // Pending default
  }, [normalized]);

  return <span style={style}>{status || "Pending"}</span>;
}

export default function RoomLoanListPage() {
  const [roomLoans, setRoomLoans] = useState<RoomLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getRoomLoans();
      setRoomLoans(Array.isArray(data) ? data : []);
    } catch {
      setError("Gagal mengambil data dari server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
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

        {!loading && !error && roomLoans.length === 0 && (
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: "#f6f6f6",
              border: "1px solid #e5e5e5",
            }}
          >
            Belum ada data peminjaman.
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
                </tr>
              </thead>
              <tbody>
                {roomLoans.map((x) => (
                  <tr key={x.id}>
                    <td style={td}>{x.id}</td>
                    <td style={td}>{x.roomName}</td>
                    <td style={td}>{x.borrowerName}</td>
                    <td style={td}>{formatDateTime(x.startTime)}</td>
                    <td style={td}>{formatDateTime(x.endTime)}</td>
                    <td style={td}>
                      <StatusBadge status={x.status} />
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
