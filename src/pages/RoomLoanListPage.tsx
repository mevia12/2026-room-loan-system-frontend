import { useEffect, useState } from "react";
import { getRoomLoans } from "../services/roomLoanServices";

type RoomLoan = {
  id: number;
  roomName: string;
  borrowerName: string;
  startTime: string;
  endTime: string;
  status: string;
};

export default function RoomLoanListPage() {
  const [roomLoans, setRoomLoans] = useState<RoomLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getRoomLoans();
        setRoomLoans(data);
      } catch (err) {
        setError("Gagal mengambil data dari server");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Daftar Peminjaman</h2>

      {roomLoans.length === 0 ? (
        <p>Belum ada data peminjaman</p>
      ) : (
        <ul>
          {roomLoans.map((loan) => (
            <li key={loan.id}>
              {loan.roomName} — {loan.borrowerName} ({loan.status})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
