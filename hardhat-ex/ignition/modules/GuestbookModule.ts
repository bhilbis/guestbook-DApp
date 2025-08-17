import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// Nama Module ID harus sama dengan nama file untuk konsistensi
const GuestbookModule = buildModule("GuestbookModule", (m) => {
  // m.contract() adalah perintah untuk mendeploy sebuah kontrak.
  // Parameter pertama "Guestbook" HARUS SAMA PERSIS dengan nama kontrak di file .sol Anda (contract Guestbook { ... })
  // Parameter kedua adalah array untuk argumen constructor, karena Guestbook tidak punya, kita beri array kosong [].
  const guestbook = m.contract("Guestbook", []);

  // Mengembalikan hasil deploy agar bisa digunakan di tempat lain jika perlu
  return { guestbook };
});

export default GuestbookModule;