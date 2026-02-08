const API_BASE_URL = "http://localhost:5204/api"; // nanti bisa kamu sesuaikan

export async function getRoomLoans() {
  const response = await fetch(`${API_BASE_URL}/roomloans`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data peminjaman");
  }

  return response.json();
}
