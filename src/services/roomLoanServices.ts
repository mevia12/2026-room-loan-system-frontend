const API_BASE_URL = "http://localhost:5204/api";

export type RoomLoan = {
  id: number;
  roomName: string;
  borrowerName: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt?: string;
};

export type CreateRoomLoanRequest = {
  roomName: string;
  borrowerName: string;
  startTime: string; // ISO
  endTime: string; // ISO
};

export async function getRoomLoans(): Promise<RoomLoan[]> {
  const res = await fetch(`${API_BASE_URL}/RoomLoans`);
  if (!res.ok) throw new Error("Failed to fetch room loans");
  return res.json();
}

export async function createRoomLoan(
  payload: CreateRoomLoanRequest,
): Promise<RoomLoan> {
  const res = await fetch(`${API_BASE_URL}/RoomLoans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // ambil detail error (kalau backend kirim)
    const text = await res.text();
    throw new Error(text || "Failed to create room loan");
  }

  return res.json();
}
