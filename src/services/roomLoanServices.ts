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

export type UpdateStatusRequest = {
  status: "Pending" | "Approved" | "Rejected";
};

export async function getRoomLoans(): Promise<RoomLoan[]> {
  const res = await fetch(`${API_BASE_URL}/RoomLoans`);
  if (!res.ok) throw new Error("Failed to fetch room loans");
  return res.json();
}

export async function getRoomLoanById(id: number): Promise<RoomLoan> {
  const res = await fetch(`${API_BASE_URL}/RoomLoans/${id}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch room loan detail");
  }

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
    const text = await res.text();
    throw new Error(text || "Failed to create room loan");
  }

  return res.json();
}

// ✅ FIX: kirim body sebagai object { status: "Approved" }
export async function updateRoomLoanStatus(
  id: number,
  status: UpdateStatusRequest["status"],
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/RoomLoans/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update status");
  }
}

// 🗑️ DELETE room loan
export async function deleteRoomLoan(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/RoomLoans/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to delete room loan");
  }
}
