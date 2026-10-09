const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const pricing = {
  small: {
    standard: 50000,
    premium: 80000,
  },
  medium: {
    standard: 75000,
    premium: 120000,
  },
  large: {
    standard: 100000,
    premium: 150000,
  },
};

const addOns = {
  deep: 15000,
  hydraulic: 25000,
};

app.get("/api/pricing", (req, res) => {
  res.json({ pricing, addOns });
});

app.post("/api/booking", (req, res) => {
  const {
    nama,
    mobil,
    layanan,
    addOn,
    tanggal,
    jam,
    metodePembayaran,
  } = req.body;

  const base = pricing[mobil]?.[layanan] ?? 0;
  const extra = addOn && addOn !== "none" ? addOns[addOn] || 0 : 0;
  const total = base + extra;

  const booking = {
    id: `UM-${Date.now()}`,
    nama: nama || "Pelanggan",
    mobil,
    layanan,
    addOn: addOn || "none",
    tanggal,
    jam,
    metodePembayaran: metodePembayaran || "cashless",
    total,
  };

  res.json({ message: "Booking berhasil dibuat", booking });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
