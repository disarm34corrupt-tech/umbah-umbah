# Umbah Umbah

Website booking cuci mobil otomatis untuk layanan standard dan premium.

## Teknologi
- React + Vite
- Express.js
- Node.js

## Fitur
- Pilih ukuran mobil: Small / Medium / Large
- Pilih layanan: Standard / Premium
- Pilih extra service: Deep Cleansing / Hydraulic
- Booking tanggal dan jam
- Simulasi checkout virtual
- Total harga otomatis

## Cara menjalankan

### 1. Install dependency root
```bash
npm install
npm install express cors
```

### 2. Install dependency frontend
```bash
cd client
npm install
```

### 3. Jalankan project
```bash
cd ..
npm run dev
```

Frontend akan berjalan di http://localhost:3000
Backend akan berjalan di http://localhost:5000

## Struktur project
- `server/index.js` = API backend
- `client/src/App.jsx` = halaman booking
- `client/src/index.css` = styling
