import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getRoomLoanById,
  updateRoomLoanStatus,
  type RoomLoan,
} from "../services/roomLoanServices";
import "../index.css";

export default function RoomLoanDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [data, setData] = useState<RoomLoan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      setLoading(true);
      const res = await getRoomLoanById(id);
      setData(res);
    } catch {
      setError("Gagal mengambil detail dari server");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!Number.isFinite(id) || id <= 0) {
      setLoading(false);
      setError("ID tidak valid");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Detail Peminjaman</h2>

        <div
          style={{
            marginTop: 12,
            padding: 12,
            border: "1px solid #fca5a5",
            background: "#fee2e2",
            borderRadius: 8,
          }}
        >
          {error}
        </div>

        <div style={{ marginTop: 16 }}>
          <Link to="/room-loans">← Kembali ke daftar</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Detail Peminjaman</h2>
        <Link to="/room-loans">← Kembali</Link>
      </div>

      {!loading && !error && data && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            border: "1px solid #e2e8f0",
            borderRadius: 12,
          }}
        >
          <p>
            <b>ID:</b> {data.id}
          </p>
          <p>
            <b>Ruangan:</b> {data.roomName}
          </p>
          <p>
            <b>Peminjam:</b> {data.borrowerName}
          </p>
          <p>
            <b>Mulai:</b> {new Date(data.startTime).toLocaleString()}
          </p>
          <p>
            <b>Selesai:</b> {new Date(data.endTime).toLocaleString()}
          </p>
          <p>
            <b>Status:</b> {data.status}
          </p>

          {/* 🔽 UI Ubah Status */}
          <div
            style={{
              marginTop: 12,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <label>
              <b>Ubah Status:</b>
            </label>

            <select
              value={data.status}
              onChange={(e) =>
                setData({ ...data, status: e.target.value as any })
              }
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button className="btn-save"
              onClick={async () => {
                try {
                  setError(null);
                  await updateRoomLoanStatus(data.id, data.status as any);
                  await load();
                } catch (err: any) {
                  setError(err?.message || "Gagal update status");
                }
              }}
            >
              Save Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
