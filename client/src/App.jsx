import { useEffect, useMemo, useState } from "react";

const initialForm = {
  nama: "",
  mobil: "small",
  layanan: "standard",
  addOn: "none",
  tanggal: "",
  jam: "",
  metodePembayaran: "e-wallet",
};

const formatRupiah = (value) => new Intl.NumberFormat("id-ID").format(value);

export default function App() {
  const [pricing, setPricing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/pricing")
      .then((res) => res.json())
      .then((data) => setPricing(data))
      .catch((err) => console.error("Fetch pricing error:", err));
  }, []);

  const total = useMemo(() => {
    if (!pricing) return 0;
    const base = pricing.pricing[form.mobil][form.layanan];
    const extra = form.addOn && form.addOn !== "none" ? pricing.addOns[form.addOn] || 0 : 0;
    return base + extra;
  }, [pricing, form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      setBooking(data.booking);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!pricing) {
    return <div className="page loading">Loading pricing...</div>;
  }

  const layananLabel = {
    standard: "Standard (30 menit)",
    premium: "Premium (60 menit)",
  };

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-badge">AUTO WASH</div>
        <div className="hero-text">
          <p className="tag">Umbah Umbah</p>
          <h1>Cuci Mobil Praktis, Cepat, & Nyaman</h1>
          <p>
            Booking online tanpa ribet. Pilih layanan, tanggal, dan bayarkan dengan
            simulasi checkout virtual.
          </p>
        </div>
      </header>

      <main className="content">
        <section className="booking-card">
          <form onSubmit={handleSubmit}>
            <h2>Booking Cuci Mobil</h2>

            <div className="field">
              <label htmlFor="nama">Nama Pemesan</label>
              <input
                id="nama"
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Masukkan nama"
                required
              />
            </div>

            <div className="grid">
              <div className="field">
                <label htmlFor="mobil">Ukuran Mobil</label>
                <select id="mobil" name="mobil" value={form.mobil} onChange={handleChange}>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="layanan">Layanan</label>
                <select
                  id="layanan"
                  name="layanan"
                  value={form.layanan}
                  onChange={handleChange}
                >
                  <option value="standard">Standard (30 menit)</option>
                  <option value="premium">Premium (60 menit)</option>
                </select>
              </div>
            </div>

            <div className="grid">
              <div className="field">
                <label htmlFor="addOn">Extra Service</label>
                <select id="addOn" name="addOn" value={form.addOn} onChange={handleChange}>
                  <option value="none">Tidak ada</option>
                  <option value="deep">Deep Cleansing</option>
                  <option value="hydraulic">Hydraulic</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="metodePembayaran">Metode Pembayaran</label>
                <select
                  id="metodePembayaran"
                  name="metodePembayaran"
                  value={form.metodePembayaran}
                  onChange={handleChange}
                >
                  <option value="e-wallet">E-Wallet</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="cashless">Cashless</option>
                </select>
              </div>
            </div>

            <div className="grid">
              <div className="field">
                <label htmlFor="tanggal">Tanggal</label>
                <input
                  id="tanggal"
                  type="date"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="jam">Jam</label>
                <input
                  id="jam"
                  type="time"
                  name="jam"
                  value={form.jam}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="summary-box">
              <p>Total estimasi</p>
              <h3>Rp {formatRupiah(total)}</h3>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Memproses..." : "Pesan Sekarang"}
            </button>
          </form>
        </section>

        <aside className="price-card">
          <h3>Daftar Harga</h3>
          <ul>
            <li><span>Small + Standard</span><strong>Rp 50.000</strong></li>
            <li><span>Small + Premium</span><strong>Rp 80.000</strong></li>
            <li><span>Medium + Standard</span><strong>Rp 75.000</strong></li>
            <li><span>Medium + Premium</span><strong>Rp 120.000</strong></li>
            <li><span>Large + Standard</span><strong>Rp 100.000</strong></li>
            <li><span>Large + Premium</span><strong>Rp 150.000</strong></li>
          </ul>

          <div className="extra">
            <p>Deep Cleansing: +Rp 15.000</p>
            <p>Hydraulic: +Rp 25.000</p>
          </div>
        </aside>
      </main>

      {booking && (
        <section className="receipt">
          <h2>Booking Selesai</h2>
          <p>
            <strong>Order ID:</strong> {booking.id}
          </p>
          <p>
            <strong>Nama:</strong> {booking.nama}
          </p>
          <p>
            <strong>Mobil:</strong> {booking.mobil}
          </p>
          <p>
            <strong>Layanan:</strong> {layananLabel[booking.layanan] || booking.layanan}
          </p>
          <p>
            <strong>Tambahan:</strong> {booking.addOn === "none" ? "Tidak ada" : booking.addOn}
          </p>
          <p>
            <strong>Tanggal:</strong> {booking.tanggal}
          </p>
          <p>
            <strong>Jam:</strong> {booking.jam}
          </p>
          <p>
            <strong>Total:</strong> Rp {formatRupiah(booking.total)}
          </p>
        </section>
      )}
    </div>
  );
}
