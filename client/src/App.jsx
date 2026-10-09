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

const services = [
  {
    title: "Standard Wash",
    subtitle: "30 menit",
    description: "Cuci mobil cepat, bersih, dan tetap detail. Cocok untuk harian.",
    highlight: "Mulai dari Rp 50.000",
  },
  {
    title: "Premium Wash",
    subtitle: "60 menit",
    description: "Cuci lebih detail, lebih halus, dan tampil lebih kinclong.",
    highlight: "Mulai dari Rp 80.000",
  },
  {
    title: "Deep Cleansing",
    subtitle: "Extra care",
    description: "Membersihkan bagian detail yang sulit dijangkau untuk hasil maksimal.",
    highlight: "+Rp 15.000",
  },
];

const benefits = [
  "Proses cepat 30–60 menit",
  "Teknisi berpengalaman",
  "Peralatan modern dan aman",
  "Booking online tanpa ribet",
];

const steps = [
  "Pilih ukuran mobil dan jenis layanan",
  "Pilih tanggal & jam booking",
  "Bayar virtual dan lihat konfirmasi",
];

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
    <div className="page-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">U</div>
          <div>
            <p className="brand-name">Umbah Umbah</p>
            <small>Auto Wash</small>
          </div>
        </div>

        <nav className="nav">
          <a href="#services">Layanan</a>
          <a href="#pricing">Harga</a>
          <a href="#booking">Booking</a>
        </nav>

        <button className="nav-button">Pesan Sekarang</button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="mini-label">Auto Wash Service</span>
            <h1>Cuci mobil otomatis yang cepat, bersih, dan praktis.</h1>
            <p>
              Booking online dari rumah. Pilih paket, tentukan tanggal, dan nikmati hasil
              cuci mobil yang kinclong tanpa antre.
            </p>

            <div className="hero-actions">
              <a href="#booking" className="primary-btn">Booking Sekarang</a>
              <a href="#pricing" className="secondary-btn">Lihat Harga</a>
            </div>

            <div className="stats-row">
              <div>
                <strong>2.000+</strong>
                <span>Mobil selesai</span>
              </div>
              <div>
                <strong>4.9/5</strong>
                <span>Rating pelanggan</span>
              </div>
              <div>
                <strong>30-60</strong>
                <span>Menit proses</span>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="card-glow" />
            <p className="card-title">Paket Populer</p>
            <h3>Premium Wash</h3>
            <ul>
              <li>Interior & exterior detail</li>
              <li>Waterless shine finishing</li>
              <li>Hydraulic treatment</li>
            </ul>
            <div className="card-price">
              <span>Mulai</span>
              <strong>Rp 80.000</strong>
            </div>
          </div>
        </section>

        <section id="services" className="section-block">
          <div className="section-head">
            <span className="mini-label dark">Layanan Kami</span>
            <h2>Pilih sesuai kebutuhan mobilmu</h2>
          </div>

          <div className="service-grid">
            {services.map((item) => (
              <article key={item.title} className="service-card">
                <div className="service-icon">✦</div>
                <p className="service-type">{item.subtitle}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <strong>{item.highlight}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="feature-band">
          <div className="section-head left">
            <span className="mini-label dark">Kenapa pilih kami</span>
            <h2>Lebih cepat, lebih bersih, lebih aman</h2>
          </div>

          <div className="benefits-grid">
            {benefits.map((item) => (
              <div key={item} className="benefit-item">
                ✓ {item}
              </div>
            ))}
          </div>
        </section>

        <section className="steps-block">
          <div className="section-head">
            <span className="mini-label dark">Cara order</span>
            <h2>3 langkah mudah</h2>
          </div>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={step} className="step-card">
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="section-block pricing-block">
          <div className="section-head">
            <span className="mini-label dark">Harga</span>
            <h2>Daftar paket cuci mobil</h2>
          </div>

          <div className="pricing-grid">
            <div className="price-card price-card-main">
              <p>Small</p>
              <h3>Rp 50.000</h3>
              <small>Standard</small>
            </div>
            <div className="price-card price-card-main">
              <p>Medium</p>
              <h3>Rp 75.000</h3>
              <small>Standard</small>
            </div>
            <div className="price-card price-card-main">
              <p>Large</p>
              <h3>Rp 100.000</h3>
              <small>Standard</small>
            </div>
            <div className="price-card">
              <p>Small</p>
              <h3>Rp 80.000</h3>
              <small>Premium</small>
            </div>
            <div className="price-card">
              <p>Medium</p>
              <h3>Rp 120.000</h3>
              <small>Premium</small>
            </div>
            <div className="price-card">
              <p>Large</p>
              <h3>Rp 150.000</h3>
              <small>Premium</small>
            </div>
          </div>

          <div className="addon-row">
            <span>Deep Cleansing</span>
            <strong>+Rp 15.000</strong>
            <span>Hydraulic</span>
            <strong>+Rp 25.000</strong>
          </div>
        </section>

        <section id="booking" className="booking-wrap">
          <div className="booking-card">
            <form onSubmit={handleSubmit}>
              <div className="booking-head">
                <span className="mini-label dark">Booking online</span>
                <h2>Pesan cuci mobil</h2>
              </div>

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
                  <select id="layanan" name="layanan" value={form.layanan} onChange={handleChange}>
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
          </div>

          <aside className="receipt">
            <div className="receipt-head">
              <span className="mini-label dark">Konfirmasi</span>
              <h3>Booking detail</h3>
            </div>

            {booking ? (
              <div className="receipt-body">
                <p><strong>Order ID:</strong> {booking.id}</p>
                <p><strong>Nama:</strong> {booking.nama}</p>
                <p><strong>Mobil:</strong> {booking.mobil}</p>
                <p><strong>Layanan:</strong> {layananLabel[booking.layanan] || booking.layanan}</p>
                <p><strong>Tambahan:</strong> {booking.addOn === "none" ? "Tidak ada" : booking.addOn}</p>
                <p><strong>Tanggal:</strong> {booking.tanggal}</p>
                <p><strong>Jam:</strong> {booking.jam}</p>
                <p className="total-line"><strong>Total:</strong> Rp {formatRupiah(booking.total)}</p>
              </div>
            ) : (
              <div className="receipt-empty">
                <p>Silakan isi form booking di samping untuk melihat estimasi dan konfirmasi pesanan.</p>
              </div>
            )}
          </aside>
        </section>

        <section className="testimonial-block">
          <div className="section-head">
            <span className="mini-label dark">Testimoni</span>
            <h2>Yang pelanggan bilang</h2>
          </div>

          <div className="testimonial-grid">
            <blockquote>
              “Prosesnya cepat, hasilnya kinclong, dan mobil terasa lebih bersih dari sebelumnya.”
              <footer>— Raka, Jakarta</footer>
            </blockquote>
            <blockquote>
              “Booking online gampang banget. Nggak perlu antre dan harganya juga jelas.”
              <footer>— Dinda, Bandung</footer>
            </blockquote>
          </div>
        </section>
      </main>
    </div>
  );
}

