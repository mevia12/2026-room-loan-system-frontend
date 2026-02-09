import { useState } from "react";
import { createRoomLoan } from "../services/roomLoanServices";

type FormState = {
  roomName: string;
  borrowerName: string;
  startTime: string; // datetime-local string
  endTime: string; // datetime-local string
};

export default function RoomLoanCreatePage() {
  const [form, setForm] = useState<FormState>({
    roomName: "",
    borrowerName: "",
    startTime: "",
    endTime: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const { roomName, borrowerName, startTime, endTime } = form;

    // ===============================
    // VALIDASI FRONTEND (sebelum hit API)
    // ===============================
    if (!roomName.trim() || roomName.trim().length < 3) {
      setError("Nama ruangan wajib diisi (minimal 3 karakter).");
      return;
    }

    if (!borrowerName.trim() || borrowerName.trim().length < 3) {
      setError("Nama peminjam wajib diisi (minimal 3 karakter).");
      return;
    }

    if (!startTime) {
      setError("Waktu mulai wajib diisi.");
      return;
    }

    if (!endTime) {
      setError("Waktu selesai wajib diisi.");
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError("Format waktu tidak valid.");
      return;
    }

    if (end <= start) {
      setError("Waktu selesai harus lebih besar dari waktu mulai.");
      return;
    }

    // ===============================
    // HIT API
    // ===============================
    setLoading(true);
    try {
      const payload = {
        roomName: roomName.trim(),
        borrowerName: borrowerName.trim(),
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      };

      await createRoomLoan(payload);

      setSuccessMsg("Berhasil menambah peminjaman!");
      setForm({
        roomName: "",
        borrowerName: "",
        startTime: "",
        endTime: "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menambah peminjaman.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 520 }}>
      <h2>Tambah Peminjaman</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 12, marginTop: 16 }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          Room Name
          <input
            name="roomName"
            value={form.roomName}
            onChange={handleChange}
            placeholder="Contoh: Ruang Rapat A"
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Borrower Name
          <input
            name="borrowerName"
            value={form.borrowerName}
            onChange={handleChange}
            placeholder="Contoh: Mevi"
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Start Time
          <input
            name="startTime"
            type="datetime-local"
            value={form.startTime}
            onChange={handleChange}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          End Time
          <input
            name="endTime"
            type="datetime-local"
            value={form.endTime}
            onChange={handleChange}
          />
        </label>

        {error && <div style={{ color: "crimson" }}>{error}</div>}
        {successMsg && <div style={{ color: "green" }}>{successMsg}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>

      <p style={{ marginTop: 16, fontSize: 14, opacity: 0.8 }}>
        Catatan: Status & CreatedAt di-set oleh backend.
      </p>
    </div>
  );
}
