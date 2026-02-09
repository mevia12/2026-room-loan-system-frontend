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

  function validate(): string | null {
    if (!form.roomName.trim()) return "Room name wajib diisi.";
    if (!form.borrowerName.trim()) return "Borrower name wajib diisi.";
    if (!form.startTime) return "Start time wajib diisi.";
    if (!form.endTime) return "End time wajib diisi.";

    const start = new Date(form.startTime);
    const end = new Date(form.endTime);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
      return "Format tanggal tidak valid.";
    if (end <= start) return "End time harus lebih besar dari start time.";

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      // datetime-local -> ISO (backend enak bacanya)
      const payload = {
        roomName: form.roomName.trim(),
        borrowerName: form.borrowerName.trim(),
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      };

      await createRoomLoan(payload);

      setSuccessMsg("Berhasil menambah peminjaman!");
      setForm({ roomName: "", borrowerName: "", startTime: "", endTime: "" });
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
