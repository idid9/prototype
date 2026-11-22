# Product Requirements Document (PRD)
## TourFlow — Saudi Arabia Tourism Digital Growth Platform

| Atribut Dokumen | Detail |
| :--- | :--- |
| **Nama Produk** | TourFlow — Saudi Arabia Tourism Digital Growth Platform |
| **Versi Dokumen** | 1.0 (Complete Feature Specification) |
| **Status** | Production Prototype / Active Build |
| **Tipe Aplikasi** | Web Application (React SPA + Firebase Cloud Firestore + Google Maps Platform) |
| **Bahasa Antarmuka** | Bilingual — English (LTR) & العربية / Arabic (RTL) |
| **Mata Uang Operasional** | SAR (Saudi Riyal / ريال سعودي) |

---

## Daftar Isi
1. [Ringkasan Eksekutif & Visi Produk](#1-ringkasan-eksekutif--visi-produk)
2. [Latar Belakang Masalah & Proposisi Nilai](#2-latar-belakang-masalah--proposisi-nilai)
3. [Target Pengguna & Persona](#3-target-pengguna--persona)
4. [Tujuan Bisnis & Metrik Keberhasilan (KPI)](#4-tujuan-bisnis--metrik-keberhasilan-kpi)
5. [Arsitektur Sistem & Tech Stack](#5-arsitektur-sistem--tech-stack)
6. [Spesifikasi Fitur — Portal Pengunjung (Visitor Portal)](#6-spesifikasi-fitur--portal-pengunjung-visitor-portal)
7. [Spesifikasi Fitur — Dashboard Operator & Admin (12 Modul)](#7-spesifikasi-fitur--dashboard-operator--admin-12-modul)
8. [Sistem Lintas Fitur (Cross-Cutting Capabilities)](#8-sistem-lintas-fitur-cross-cutting-capabilities)
9. [Alur Pengguna Utama (User Flows)](#9-alur-pengguna-utama-user-flows)
10. [Model Data & Skema Database (13 Koleksi Firestore)](#10-model-data--skema-database-13-koleksi-firestore)
11. [Persyaratan Non-Fungsional (NFR)](#11-persyaratan-non-fungsional-nfr)
12. [Batasan Saat Ini & Roadmap Pengembangan](#12-batasan-saat-ini--roadmap-pengembangan)

---

## 1. Ringkasan Eksekutif & Visi Produk

**TourFlow** adalah platform digital pariwisata B2B2C untuk Arab Saudi yang selaras dengan visi **Saudi Vision 2030**. Platform ini menggabungkan dua pengalaman terintegrasi dalam satu ekosistem waktu nyata (*real-time*):

1. **Portal Pengunjung (Public Visitor Portal — B2C):** Mempermudah wisatawan domestik maupun internasional — khususnya turis yang **sudah memiliki tiket pesawat dan reservasi hotel** — untuk menemukan destinasi wisata secara cepat, mengecek ketersediaan **pemandu wisata / operator lokal UMKM bersertifikat** di tiap hub wisata melalui **Google Maps interaktif**, menghitung rute perjalanan dari hotel ke destinasi, serta mengirim permintaan pemesanan (*booking inquiry*) secara langsung tanpa pembayaran di muka (*no prepayment*) dengan eskalasi cepat ke WhatsApp Concierge.
2. **Dashboard Operator & Admin (Operator Console — B2B SaaS):** Pusat kendali 12 modul bagi pengelola platform dan operator lokal untuk mengelola katalog pengalaman wisata, destinasi, *pipeline* reservasi, CRM pelanggan, basis data *email subscriber*, kampanye promo & voucher, konten kuis interaktif, analitik konversi & *revenue intelligence*, CMS seluruh teks/foto situs, hingga kustomisasi visual **Glassy Theme Studio** yang tersinkronisasi secara *real-time* lintas perangkat via Firebase Firestore.

---

## 2. Latar Belakang Masalah & Proposisi Nilai

### Masalah Utama
* **Bagi Wisatawan ("Flight & Hotel Ready"):** Turis yang sudah tiba atau telah memesan tiket pesawat dan hotel di Arab Saudi sering kesulitan menemukan tempat wisata terdekat yang memiliki **pemandu lokal UMKM tepercaya** (berlisensi Kementerian Pariwisata Saudi / *Saudi Rawi*), mengetahui estimasi waktu tempuh dari hotel mereka, serta menghubungi pemandu tanpa perantara agen besar berbiaya tinggi.
* **Bagi Operator & Pemandu Lokal UMKM:** Banyak operator lokal kecil belum memiliki etalase digital dwibahasa (EN/AR), sistem CRM pencatatan *lead*, alat pengelolaan kupon/promo, maupun cara cepat memperbarui paket wisata dan tampilan situs secara *real-time* tanpa bantuan tim developer.

### Proposisi Nilai TourFlow
* **Map-First Local UMKM Guide Discovery:** Peta online terintegrasi Google Maps yang langsung menampilkan jumlah pemandu lokal UMKM aktif di tiap destinasi, ulasan Google, harga mulai dalam SAR, rute berkendara dari hotel/GPS, dan tautan langsung ke Google Maps / Directions.
* **Zero-Friction Inquiry & Concierge Handoff:** Pemesanan tanpa kartu kredit di awal (*direct inquiry*), dukungan kode voucher otomatis, referensi booking instan, dan tombol langsung ke WhatsApp Concierge.
* **All-in-One Real-Time Growth Engine:** Perubahan apa pun di Dashboard Admin (tambah paket, ubah harga, terbitkan promo, ganti tema, ubah teks UI, ubah bahasa default) langsung terlihat di Portal Pengunjung tanpa memuat ulang halaman (*<20 ms* lokal / *real-time Firestore snapshot*).

---

## 3. Target Pengguna & Persona

| Persona | Karakteristik | Kebutuhan Utama |
| :--- | :--- | :--- |
| **Wisatawan Independen (Flight & Hotel Ready)** | Turis internasional & domestik (GCC, Eropa, Asia, lokal Saudi) yang sudah memesan penerbangan & hotel di Riyadh, Jeddah, AlUla, Diriyah, atau Red Sea. | Cepat menemukan spot wisata yang punya pemandu lokal UMKM, melihat jarak/waktu tempuh dari hotel di Google Maps, memilih bahasa EN/AR, dan booking paket secara transparan dalam SAR. |
| **Operator Wisata UMKM / Admin Platform** | Pemilik tur lokal berlisensi, tim concierge, dan pengelola pemasaran TourFlow. | Mengelola paket & destinasi dwibahasa, memantau *lead* masuk & progres konfirmasi (CRM), membuat kupon/kampanye musiman, menjangkau *email subscribers*, memantau analitik *funnel*, dan mengubah konten/tampilan situs secara mandiri. |

---

## 4. Tujuan Bisnis & Metrik Keberhasilan (KPI)

1. **Conversion Rate (Inquiry-to-Confirmed Booking):** Persentase permintaan (*inquiry*) yang berhasil dikonfirmasi/diselesaikan oleh operator (`CONFIRMED` / `COMPLETED`).
2. **Discovery-to-Inquiry Funnel Velocity:** Rasio konversi 5 tahap: *Page Views → Interactive Search/Filters → Experience Detail Views → Inquiries Submitted → Confirmed Bookings*.
3. **Map-to-Guide Engagement:** Jumlah klik hub destinasi di Live Map, penggunaan *Hotel Route Planner*, dan navigasi dari peta menuju katalog atau halaman detail pemandu lokal.
4. **Weighted Pipeline & Realized Revenue (SAR):** Proyeksi pendapatan tertimbang berdasarkan tahap CRM (`NEW` 25%, `CONTACTED` 45%, `PENDING` 70%, `CONFIRMED`/`COMPLETED` 100%) dan pendapatan terkonfirmasi.
5. **Subscriber Acquisition & Outreach Rate:** Pertumbuhan database email dari *"Join the Saudi Tourism Movement"* serta tingkat tindak lanjut (*Contacted rate*).

---

## 5. Arsitektur Sistem & Tech Stack

### 5.1 Frontend & UI Layer
* **Framework:** React 19 + TypeScript + Vite 8 (Single Page Application).
* **Styling & Motion:** Tailwind CSS v4 (`@tailwindcss/vite`), animasi transisi `motion/react`, efek perayaan `canvas-confetti`, ikon `lucide-react`.
* **Tipografi:** `Manrope` (UI Latin), `Playfair Display` (Heading Editorial Serif), `IBM Plex Sans Arabic` (Antarmuka & RTL Arab).

### 5.2 Integrasi Peta Online (Google Maps Platform)
* **Library:** `@vis.gl/react-google-maps` + `@types/google.maps`.
* **API Aktif:**
  * **Maps JavaScript API** (`mapId="DEMO_MAP_ID"`, `<AdvancedMarker>`, `<Pin>`, `<InfoWindow>`, Polyline rute).
  * **Places API (New):** `Place.searchByText` (resolusi dinamis koordinat, rating Google, alamat resmi, & *placeId* tanpa koordinat *hardcoded*), `AutocompleteSuggestion.fetchAutocompleteSuggestions` + `AutocompleteSessionToken` (pencarian hotel/titik awal hemat kuota).
  * **Routes API:** `Route.computeRoutes` (perhitungan rute berkendara `DRIVING`, jarak km, durasi tempuh, & poligon jalur pada peta).
  * **Google Maps Deep Links:** URL resmi `google.com/maps/search/?api=1` dan `google.com/maps/dir/?api=1` untuk navigasi langsung di aplikasi Google Maps pengguna.
* **Proteksi Kuota (Two-Tier Quota Defense):** Deteksi `window.gm_authFailure`, pencegatan error kuota, *fallback* UI aman, serta *sticky amber banner* global bila kunci demo melebihi kuota.

### 5.3 Data Persistence & Real-Time Synchronization (Dual-Mode Engine)
* **Primary Cloud Sync:** Firebase Cloud Firestore (named database melalui `firebase-applet-config.json`, `experimentalAutoDetectLongPolling: true`) dengan `onSnapshot` *real-time listeners* untuk 13 koleksi.
* **Local Cache & Cross-Tab Sync:** `localStorage` fallback/cache + `BroadcastChannel` (`tourflow_realtime_sync`, `tourflow_auth_sync`, `tourflow_theme_sync`, `tourflow_lang_sync`) sehingga perubahan antar tab browser tersinkronisasi instan bahkan dalam mode offline/demo.
* **Optimasi Media Client-Side (`imageUpload.ts`):** Kompresi otomatis gambar unggahan perangkat via HTML5 Canvas ke format `WebP` (fallback `JPEG`) dengan penurunan kualitas & skala adaptif agar tetap nyaman di bawah batas dokumen Firestore (maks. input 15 MB, target Data URL ≤ 600 KB, batas *firestore.rules* 750 KB).

---

## 6. Spesifikasi Fitur — Portal Pengunjung (Visitor Portal)

### 6.1 Navigasi Utama (`VisitorNavbar`)
* **Brand Wordmark Dinamis:** Otomatis menampilkan nama bisnis dari pengaturan atau *override* CMS (`nav.brandName`), mendukung EN (`TourFlow`) dan AR (`تورفلو`).
* **Menu Navigasi (6 Tautan Utama):** `Explore`, `Destinations`, `Live Map`, `Experiences`, `Discover Match`, `About Us` (dengan *smooth scroll* ke setiap *section*).
* **Language Switcher (`EN ↔ العربية`):** Mengubah seluruh copy UI, arah layout (`LTR ↔ RTL`), serta memuat ulang layer Google Maps agar label nama tempat di peta ikut berubah ke bahasa aktif sambil mempertahankan posisi scroll / halaman detail pengalaman.
* **Akses Portal Operator:** Tombol ikon kunci untuk membuka modal login admin atau langsung masuk ke Dashboard jika sesi sudah aktif.
* **Primary CTA:** Tombol *"Book Experience"* menuju katalog pengalaman.
* **Responsif Mobile:** Menu *hamburger drawer* dengan akses penuh navigasi, ganti bahasa, dan akses operator.

### 6.2 Hero Section & Auto-Slideshow (`HeroSection`)
* **Full-Viewport Visual Stage (`92vh`):** Mendukung hingga **6 foto slide** yang dikelola dari Admin CMS.
* **Kontrol Slideshow:** *Auto-slide* dengan interval yang dapat diatur (2–30 detik), tombol panah Prev/Next, dan indikator titik (*dot pagination*) manual.
* **Trust Badge:** Tag resmi *"Saudi Vision 2030 Partner"*.
* **Search Console 5 Kolom (Glassmorphic):**
  1. Pilihan **Destination** (seluruh destinasi berstatus `published`).
  2. Pilihan **Category** (6 kategori pengalaman).
  3. Pemilih **Travel Date** (*date picker*).
  4. Jumlah **Guests** (1–20 tamu).
  5. Tombol **Find Experiences** (menerapkan filter ke katalog, melacak event `search`, dan menggulir otomatis ke `#experiences`).
* **Pintasan Turis Siap Jalan (Live Map Shortcut):** Tombol cepat *"Flights & hotel ready? Find local UMKM tour guides on the Live Map"* yang langsung menuju modul peta interaktif (`#map-explorer`).

### 6.3 Destinasi Unggulan (`FeaturedDestinations`)
* **Grid Asimetris Responsif:** Menampilkan seluruh destinasi dengan status `published: true` (layout 12 kolom: 2 kartu utama 7+5 kolom di baris pertama, sisanya 4 kolom per kartu).
* **Informasi Kartu:** Foto sampul, tag provinsi/wilayah, judul & deskripsi bilingual, jumlah pengalaman `PUBLISHED` secara *real-time*.
* **Dual Action:**
  * Klik kartu → menyaring katalog pengalaman berdasarkan destinasi tersebut dan gulir ke `#experiences`.
  * Tombol **"View on Map" / "على الخريطة"** → langsung menyorot pin destinasi terkait pada **Live Saudi Destination Map** (`#map-explorer`).

### 6.4 Peta Destinasi Online & Pencari Pemandu Lokal UMKM (`DestinationMapExplorer`)
Fitur inti bagi wisatawan yang sudah memiliki tiket pesawat dan hotel untuk menemukan spot wisata dengan pemandu lokal UMKM secara cepat:
* **Direktori Hub Destinasi (Panel Kiri):**
  * Kolom pencarian cepat nama kota/wilayah/pengalaman.
  * Toggle filter **"Local Guides Available Only"** (menyaring hanya hub yang memiliki pemandu lokal aktif).
  * Tombol **"All Saudi Hubs"** untuk mereset kamera peta agar mencakup seluruh destinasi (`fitBounds`).
  * Kartu tiap destinasi menampilkan badge kesiapan pemandu lokal UMKM (jumlah paket/pemandu aktif & harga mulai dalam SAR) serta **2 rekomendasi pengalaman lokal teratas** yang bisa langsung diklik ke halaman detail.
* **Peta Interaktif Google Maps (Panel Kanan):**
  * Resolusi lokasi dinamis via **Places API (New)** (`Place.searchByText`) sesuai bahasa aktif (`en` / `ar`).
  * `<AdvancedMarker>` + `<Pin>` kustom yang menampilkan jumlah pemandu lokal UMKM pada tiap pin destinasi.
  * `<InfoWindow>` kaya informasi saat pin dipilih: nama destinasi, rating & jumlah ulasan Google, alamat resmi Google Places, jumlah pemandu lokal UMKM & harga terendah (SAR), tombol **"Browse Local Guides Here"** (filter katalog), **"Google Maps"** (buka lokasi di Google Maps), dan **"Directions"** (navigasi langsung).
* **Perencana Rute dari Hotel (Hotel / Origin Route Planner):**
  * Input *autocomplete* hotel/titik berangkat berbasis **Places Autocomplete API (New)** dengan `AutocompleteSessionToken`.
  * Tombol **"My Location"** opsional berbasis GPS browser (*user-consent geolocation*).
  * Perhitungan rute berkendara via **Routes API** (`Route.computeRoutes` — `DRIVING`), menampilkan garis jalur (**Polyline**) di atas peta beserta ringkasan **jarak tempuh (km)** dan **estimasi waktu perjalanan (menit/jam)**.
  * Tautan deep-link **"Directions"** membawa titik awal hotel ke Google Maps untuk navigasi belokan demi belokan (*turn-by-turn*).

### 6.5 Katalog Pengalaman Terkurasi (`ExperienceCatalog`)
* **Visibility Gate:** Hanya menampilkan pengalaman berstatus `PUBLISHED` yang terhubung pada destinasi berstatus `published: true`.
* **Kontrol Pencarian & Penyaringan:**
  * Pencarian kata kunci (judul EN/AR, destinasi, deskripsi).
  * 7 Tab Kategori: `All`, `Desert Adventure`, `Cultural Experiences`, `City Tours`, `Nature & Outdoor`, `Luxury Experiences`, `Family Activities`.
  * Filter Destinasi Aktif (*chip* indikator dengan tombol reset cepat).
  * Pengurutan (*Sort*): `Featured First`, `Price: Low to High`, `Price: High to Low`.
* **Kartu Pengalaman:** Foto sampul, badge *Featured*, kategori, durasi, lokasi, rating bintang, harga per orang dalam SAR, dan tombol lihat detail/pesan.
* **Empty State:** Pesan informatif dengan tombol *"Reset Filters"* jika tidak ada hasil yang cocok.

### 6.6 Halaman Detail Pengalaman & Alur Booking Inquiry (`ExperienceDetailPage`)
* **Galeri Foto Interaktif:** Gambar utama resolusi tinggi dengan navigasi *thumbnail* galeri (hingga 4 foto tambahan).
* **Aksi Bagikan (Share):** Tombol salin tautan ke clipboard dengan umpan balik visual.
* **Informasi Lengkap Pengalaman (Bilingual):**
  * Deskripsi editorial, *Highlights*, *What's Included*, *What's Not Included*, durasi, kapasitas maksimal tamu, dan badge verifikasi **Saudi Ministry of Tourism**.
* **Peta Titik Temu Tersemat (`ExperienceLocationMap`):**
  * Peta Google Maps tersemat (`h-[260px]`) yang meresolusi alamat *Meeting Point* pengalaman secara dinamis (dengan *fallback* ke destinasi utama).
  * Dilengkapi pin lokasi, alamat resmi, dan tombol **"Open in Google Maps"** serta **"Directions from Hotel"**.
* **Kartu Pemesanan & Kalkulator Harga Sticky:**
  * Input: Nama lengkap, Email, Nomor Telepon/WhatsApp, Negara asal, Tanggal kunjungan, Jumlah tamu, Pesan/permintaan khusus.
  * **Kode Voucher / Kupon Promo Live:** Validasi langsung terhadap koleksi `coupons` aktif dari Admin (mendukung diskon persentase `%` dan nominal tetap `SAR`), lengkap dengan rincian subtotal, potongan diskon, dan total akhir dalam SAR.
  * **Pengiriman Inquiry:** Menyimpan dokumen ke koleksi `inquiries`, memperbarui/membuat profil pelanggan di `customers`, mencatat `analyticsEvents` (`inquiry_submit`), mencatat `activityLogs`, dan menaikkan `usedCount` kupon bila digunakan.
  * **Konfirmasi Instan & WhatsApp Concierge Handoff:** Menampilkan Nomor Referensi Booking unik (mis. `INQ-...`) serta tombol langsung membuka **WhatsApp** dengan pesan ringkasan pesanan yang sudah terisi otomatis (*pre-filled*).

### 6.7 Modul Interaktif: Matcher & Kuis Pengetahuan Saudi (`InteractiveQuiz`)
Tersedia dalam dua mode yang dapat dipilih pengunjung dengan efek perayaan `canvas-confetti`:
1. **Experience Matcher (Pencocok Pengalaman):** Kuesioner 3 langkah (gaya perjalanan, preferensi wilayah/suasana, durasi/anggaran) yang merekomendasikan kartu pengalaman `PUBLISHED` paling cocok dan bisa langsung dibuka detailnya.
2. **Saudi Knowledge Game (Kuis Pengetahuan Arab Saudi):**
   * Menampilkan pertanyaan aktif dari koleksi `quizzes` yang dikelola Admin secara dwibahasa.
   * Pilihan ganda dengan skor *real-time*, umpan balik jawaban benar/salah, dan kotak **Fakta Sejarah / Penjelasan** (*Explanation*).
   * Layar hasil akhir lengkap dengan total skor, tombol **Bagikan Hasil (Copy to Clipboard)**, dan **Main Ulang (Retake)**.

### 6.8 Bagian Pemasaran, Kepercayaan & Newsletter (`MarketingSections`)
* **Active Promotional Campaign Banners:** Menampilkan kartu kampanye aktif (`promotions` dengan `active: true`) lengkap dengan gambar banner, badge, deskripsi bilingual, dan tombol CTA yang dapat membuka detail pengalaman tertaut, menyaring destinasi, atau menuju section target.
* **4 Pilar Komitmen Operator Lokal:** Sorotan nilai jual (pemandu lokal bersertifikat, harga transparan SAR, akses autentik, dukungan concierge).
* **Metrik Kepercayaan & Testimoni Terverifikasi:** Ringkasan rating rata-rata langsung dari katalog pengalaman, total ulasan, serta 3 kartu testimoni wisatawan.
* **About Section & Platform KPIs:** Headline & cerita brand (dikelola di Website CMS) beserta 4 angka bukti sosial (*Certified Operators*, *Curated Experiences*, *Travelers Welcomed*, *Satisfaction Rate %*).
* **Newsletter Capture ("Join the Saudi Tourism Movement"):** Formulir pendaftaran email pengunjung yang langsung menyimpan data ke koleksi `newsletterSubscribers` (mencatat email, sumber, bahasa aktif, status `ACTIVE`) dan langsung muncul di tab Admin *Subscribers*.

### 6.9 Footer Pengunjung (`VisitorFooter`)
* Identitas brand & bio singkat (CMS-editable), badge Vision 2030, daftar tautan cepat seluruh destinasi berstatus `published`, detail kontak concierge (email `mailto:`, telepon, alamat kantor bilingual), hak cipta, dan indikator mata uang operasional (`SAR`).

---

## 7. Spesifikasi Fitur — Dashboard Operator & Admin (12 Modul)

### 7.0 Autentikasi & Navigasi Shell Admin
* **Modal Login Admin (`AdminLoginModal`):** Proteksi akses dashboard menggunakan kode akses demo (`12341234` dengan tombol bantu *"Fill Demo Code"*), toggle lihat/sembunyikan kata sandi, validasi error, serta sinkronisasi status login lintas tab via `localStorage` & `BroadcastChannel`.
* **Admin Sidebar (`AdminSidebar`):** Sidebar dapat diciutkan (*collapsible*), mendukung RTL/LTR, menampilkan **badge angka real-time** untuk jumlah Inquiry berstatus `NEW` dan jumlah Subscriber berstatus `ACTIVE`, tombol pintas kembali ke **Visitor Website**, dan tombol **Sign Out**.
* **Admin Header (`AdminHeader`):** Breadcrumb nama tab aktif, tombol ganti bahasa cepat (`EN ↔ AR` yang juga menyinkronkan `defaultLanguage` platform), dan profil admin aktif.

### 7.1 Tab 1 — Overview (`OverviewTab`)
* **Executive Hero Banner:** Ringkasan ruang kerja dengan tombol cepat **"+ New Experience"**.
* **6 KPI Stat Cards Real-Time:** Total Inquiries (dengan jumlah yang butuh tindakan awal), New Leads, Confirmed Bookings (dengan % *conversion rate*), Estimated Pipeline (SAR total vs terkonfirmasi), Published Packages (lintas destinasi aktif), dan Audience Page Views.
* **CRM Revenue Intelligence Chart (`RevenueIntelligenceChart`):**
  * **Pipeline Forecasting & Stage Velocity:** Grafik batang teranimasi untuk 5 tahap (`NEW` 25%, `CONTACTED` 45%, `PENDING` 70%, `CONFIRMED` 100%, `COMPLETED` 100%), menampilkan *Weighted Forecast* (SAR), *Realized Revenue* (SAR), *Active Gross Pipeline*, dan *Forecast Confidence %*.
  * **Category Mix & Telemetry:** Top 4 kategori pengalaman berdasarkan total nilai pipeline + jumlah transaksi, serta ringkasan sinyal aktivitas langsung (*Portal Visits*, *Package Views*, *Filter Searches*).
* **Tabel Recent Inquiries:** 6 permintaan terbaru dengan status warna adaptif dan tautan *"View All"*.
* **System & Operator Activity Feed:** 6 catatan aktivitas sistem/admin terbaru lengkap dengan stempel waktu.

### 7.2 Tab 2 — Experiences Catalog (`ExperiencesTab`)
* **Filter & Pencarian:** Pencarian judul/destinasi/kategori, filter status (`All`, `PUBLISHED`, `DRAFT`, `ARCHIVED`), dan filter per destinasi.
* **Tabel Manajemen Paket:** Thumbnail, judul, badge *Featured*, destinasi, kategori, harga SAR, durasi, status publikasi, serta aksi cepat:
  * **Preview on Website** (membuka langsung halaman detail pengalaman di Portal Pengunjung).
  * **Duplicate as Draft** (kloning paket dengan 1 klik).
  * **Edit** & **Delete** (dengan dialog konfirmasi penghapusan).
* **Modal Create / Edit Experience:**
  * Judul, deskripsi, durasi, dan *Meeting Point* dwibahasa (EN/AR).
  * URL Slug, pemilihan Destinasi, Kategori (6 opsi), Harga SAR (min. 50), Status publikasi, dan *checkbox Featured Homepage Carousel*.
  * **Unggah Foto Sampul & Galeri:** Unggah langsung dari perangkat dengan kompresi otomatis (`ImageUploadField` & multi-file upload hingga 4 foto galeri), ditambah 5 tombol *Quick Sample Photos* bawaan.
  * Input multi-baris (*one per line*) untuk **Highlights**, **What's Included**, dan **What's Not Included**.

### 7.3 Tab 3 — Destinations Hub (`DestinationsTab`)
* **Grid Kartu Destinasi:** Foto sampul, nama & wilayah EN/AR, deskripsi ringkas, jumlah pengalaman `PUBLISHED` secara live, dan badge status (`PUBLISHED` / `HIDDEN`).
* **Aksi Cepat per Destinasi:** Toggle *Publish/Unpublish* instan, tombol **Preview on Google Maps** (tautan eksternal langsung ke lokasi), dan tombol **Edit**.
* **Modal Create / Edit Destination:** Nama (EN/AR), Wilayah/Provinsi (EN/AR), Slug, Deskripsi editorial (EN/AR), unggah foto sampul dari perangkat, dan status *Published*.

### 7.4 Tab 4 — Bookings & Inquiries (`InquiriesTab`)
* **Pipeline 6 Status:** `NEW`, `CONTACTED`, `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED` dengan tab filter jumlah per status + kotak pencarian multi-kolom (nama, email, ID, pengalaman, negara).
* **Inline Status Update:** Dropdown ubah status langsung di tabel yang otomatis menyinkronkan statistik CRM pelanggan (`confirmedBookings`), Revenue Intelligence, dan Activity Logs secara *real-time*.
* **Ekspor Laporan CSV:** Mengunduh daftar inquiry terfilter ke file `.csv` (`tourflow_inquiries_YYYY-MM-DD.csv`).
* **Modal Details & Notes:** Menampilkan profil lengkap pemesan (`mailto:`, telepon, negara, tanggal, jumlah tamu, pesan khusus), pemilih tombol status instan, serta **Internal Operator Notes** (catatan privat internal yang tidak pernah tampil di portal pengunjung).

### 7.5 Tab 5 — Customers CRM (`CustomersTab`)
* **Direktori Pelanggan:** Otomatis terbentuk dan diperbarui setiap ada inquiry masuk. Dilengkapi pencarian (nama, email, negara, telepon) dan filter per negara asal.
* **Ekspor CSV Direktori Pelanggan:** Unduh file `tourflow_customers_YYYY-MM-DD.csv`.
* **Modal Profil Pelanggan:** Statistik pribadi (*Total Inquiries*, *Confirmed Bookings*, negara asal), riwayat lengkap seluruh inquiry terkait email pelanggan, serta editor **Concierge Profile Notes** (preferensi VIP, diet, bahasa) tersimpan *real-time*.

### 7.6 Tab 6 — Newsletter Email Subscribers (`SubscribersTab`)
* **KPI Strip:** Total Captured Emails, Ready to Connect (`ACTIVE`), dan Contacted (`CONTACTED`).
* **Filter & Pencarian:** Pencarian email/sumber/catatan/subjek, filter status (`ACTIVE`, `CONTACTED`, `UNSUBSCRIBED`), dan filter bahasa (`en` / `ar`).
* **Manajemen Baris:** Tombol salin email 1 klik, ganti status inline, hapus dengan konfirmasi, serta ekspor CSV (`tourflow_newsletter_subscribers_YYYY-MM-DD.csv`).
* **Direct Outreach Composer (Single & Bulk Connect):**
  * Mendukung pengiriman ke **1 subscriber** atau **massal (`Connect All`)** menggunakan BCC.
  * **3 Template Pesan Siap Pakai (Bilingual EN/AR):** *Welcome Greeting*, *Seasonal Offers*, dan *VIP Consultation*.
  * Catatan outreach privat per subscriber.
  * 3 Kanal Aksi: **Copy Message & Mark Contacted**, **Open in Gmail** (compose web link), dan **Send via Email App** (`mailto:`), yang otomatis mencatat `lastSubject`, `lastContactedAt`, dan mengubah status menjadi `CONTACTED`.

### 7.7 Tab 7 — Promotions & Coupons (`PromotionsTab`)
* **Manajemen Banner Kampanye:** Grid kampanye dengan toggle *Publish/Pause* 1 klik dan modal Create/Edit (judul EN/AR, badge tag EN/AR, unggah gambar banner, deskripsi EN/AR, label & link CTA, status aktif).
* **Manajemen Kode Kupon / Voucher:** Formulir pembuatan cepat kode voucher (kode huruf kapital otomatis, tipe diskon `% Off` atau `SAR Off`, nominal diskon), tabel monitoring tanggal kedaluwarsa & jumlah penukaran (*redemptions*), serta tombol *Activate / Pause* instan yang langsung berlaku pada halaman detail pengalaman.

### 7.8 Tab 8 — Interactive Content (`InteractiveTab`)
* **Manajemen Bank Soal Kuis:** Daftar seluruh pertanyaan *Saudi Knowledge Game* dengan indikator kategori, status `ACTIVE`/`INACTIVE`, sorotan jawaban benar, dan teks fakta sejarah.
* **CRUD Lengkap:** Tambah, ubah, aktifkan/nonaktifkan, dan hapus pertanyaan.
* **Modal Editor Bilingual:** Kategori, status aktif, teks pertanyaan (EN/AR), 2 hingga 4 opsi jawaban (EN/AR) dengan *radio button* penentu jawaban benar, serta penjelasan sejarah (EN/AR).

### 7.9 Tab 9 — Analytics & Funnel Insights (`AnalyticsTab`)
* **5-Stage Visitor-to-Booking Conversion Funnel:** Visualisasi progres bar persentase konversi dari `page_view` → `search` → `experience_view` → `inquiry` → `confirmed booking`, disertai total *tracked events*.
* **Reset Data Analytics:** Tombol reset dengan dialog konfirmasi untuk mengosongkan seluruh catatan telemetri ke `0` secara sinkron di semua perangkat.
* **Destination Inventory & Demand:** Daftar destinasi beserta jumlah paket aktif di tiap wilayah.
* **Top Experiences by Traveler Rating:** Daftar pengalaman terbaik lengkap dengan harga SAR dan rating bintang.

### 7.10 Tab 10 — Website Content & CMS (`WebsiteContentTab`)
* **Hero Section CMS:** Edit Headline & Deskripsi (EN/AR).
* **Hero Photo & Auto-Slideshow Manager:**
  * Kelola hingga **6 slide foto** melalui unggah multi-file dari perangkat (terkompresi otomatis), input URL gambar, atau 5 preset foto Arab Saudi 1-klik.
  * Pengaturan toggle **Auto-Slide ON/OFF** dan interval durasi (preset `3s / 5s / 7s / 10s / 15s` atau input kustom `2–30 detik`).
  * Aksi per slide: *Replace* foto, *Set as Primary (Slide 1)*, geser urutan (kiri/kanan sesuai LTR/RTL), hapus slide, serta indikator anggaran ukuran sinkronisasi cloud (`KB / 700 KB`).
* **About Section & Brand Proof:** Headline & deskripsi *About* (EN/AR) serta 4 angka statistik platform (*Operators*, *Experiences*, *Travelers Welcomed*, *Satisfaction Rate %*).
* **Contact & WhatsApp Concierge Channels:** Email concierge, nomor telepon, nomor WhatsApp hotline, dan alamat kantor (EN/AR).
* **All Website Components & UI Copy Editor:**
  * Editor teks UI penuh mencakup **10 grup section** (`nav`, `hero`, `destinations`, `map`, `experiences`, `quiz`, `marketing`, `about`, `details`, `footer`) dengan ~70+ kunci copy dwibahasa (EN/AR).
  * Pencarian global lintas semua kunci copy, penghitung item yang telah dikustomisasi, serta tombol **Reset per Field** dan **Reset per Section** kembali ke teks bawaan.

### 7.11 Tab 11 — Glassy & Theme Studio (`AppearanceSettingsTab`)
* **Live Realtime Visitor Panel Preview:** Panel pratinjau langsung di bagian atas yang menampilkan mini *Visitor Navbar*, *Commitment Icons*, *Experience Card*, dan *Quiz Container* di atas wallpaper aktif dengan indikator parameter (`Blur px · Translucency % · Glow %`).
* **Kontrol 1 — Blur Intensity & Glass Text Contrast:**
  * Pilihan Tone Berpasangan Terproteksi Kontras: **Smoked Dark** (teks *Warm Sand Ivory* `#FAF0DC`) vs **Crystal Light** (teks *Saudi Emerald Ink* `#0B3B30`).
  * Toggle Master **Glassy On / Solid**.
  * Slider **Blur Intensity** (`0px–64px`, step 2px) dan **Glass Transparency** (`10%–86%`).
  * **Granular Visitor Section Scope (6 Target):** Pilihan aktif/nonaktif efek kaca secara terpisah untuk `Navbar`, `Filter Bar`, `Experience Cards`, `Quiz Matcher`, `Ratings & Reasons`, dan `About Section` (dengan tombol *Apply to All / Clear All*).
* **Kontrol 2 — Glassy Icon Theme & Accent Styling:**
  * 3 Gaya Ikon: `Frosted Glass`, `Solid Accent`, dan `Glow Outline`.
  * 5 Preset Warna Aksen Saudi (`Desert Champagne`, `Saudi Emerald`, `Red Sea Turquoise`, `Royal Jacaranda`, `Taif Rose`) + **Custom Hex Color Picker** dengan penyesuaian kontras teks otomatis berbasis luminansi.
  * Slider **Icon & Glass Border Glow** (`0%–100%`) yang turut mengkalibrasi opasitas bingkai kaca.
* **Kontrol 3 — Website Wallpaper & Backdrop:**
  * 5 Preset Latar Belakang (*Luxury Lounge Interior*, *Dark Oasis Emerald*, *Ambient Warm Sand*, *Modern Executive Mesh*, *AlUla Dawn Horizon*) yang otomatis memasangkan tone kaca dan warna teks paling kontras.
  * Unggah **Custom Website Wallpaper** dari perangkat (diterapkan serentak pada Admin Console & Visitor Portal).
* **Reset Default Theme:** Mengembalikan seluruh pengaturan tema ke konfigurasi standar.

### 7.12 Tab 12 — Platform Settings (`SettingsTab`)
* **Monitor Arsitektur Database:** Informasi status *Dual-Mode Real-Time Engine*, status *Firestore Rules*, dan kontrol akses.
* **Konfigurasi Identitas & Operasional:** Nama platform bisnis, email operasional, telepon kantor, WhatsApp hotline, mata uang operasional (`SAR`), alamat kantor terdaftar, dan **Platform Default Language (`en` / `ar`)** yang tersinkronisasi lintas perangkat.
* **Notification Routing Flags:** Toggle preferensi notifikasi email & penerusan WhatsApp concierge saat inquiry baru masuk.
* **Reset Demo Seed Data:** Memulihkan seluruh data contoh awal (5 destinasi, katalog pengalaman, promosi, kupon, kuis, inquiry, pelanggan, subscriber, konten CMS) dengan dialog konfirmasi.

---

## 8. Sistem Lintas Fitur (Cross-Cutting Capabilities)

### 8.1 Lokalisasi Dwibahasa Penuh (EN LTR & AR RTL) + Sinkronisasi Bahasa Peta
* Mengatur atribut HTML `dir="ltr"` / `dir="rtl"` dan `lang="en"` / `lang="ar"` secara otomatis.
* Memisahkan **Preferensi Manual Pengunjung** (`tourflow_lang_manual`) dari **Default Language Admin** di Firestore agar pilihan bahasa pengunjung tidak tertimpa saat membuka ulang situs, sementara pengaturan admin tetap berlaku bagi pengunjung baru.
* **Sinkronisasi Bahasa Google Maps:** Karena Google Maps JS API mengunci bahasa *tile* dan label tempat saat inisialisasi skrip pertama kali, pergantian bahasa pada halaman yang memuat peta akan menyimpan konteks tampilan (posisi scroll atau ID pengalaman yang sedang dibuka) ke `sessionStorage`, lalu melakukan *clean reload* agar nama kota, jalan, dan tempat di peta ikut berubah ke bahasa Inggris atau Arab dengan mulus.

### 8.2 Adaptive Contrast & Glassmorphism Engine (V4)
* Menggunakan CSS custom properties dinamis (`--glass-blur`, `--glass-bg-opacity`, `--glass-border-opacity`, `--glass-glow-strength`, `--tourflow-accent`, serta token semantik `--tf-heading`, `--tf-text`, `--tf-muted`, `--tf-surface-subtle`, `--tf-modal-bg`).
* Mencegah kombinasi tak terbaca (misal teks gelap di kaca gelap) dengan mengikat pasangan `glassSurfaceTone` dan `textColorMode`.

---

## 9. Alur Pengguna Utama (User Flows)

### 9.1 Alur Wisatawan "Flight & Hotel Ready" Mencari Pemandu Lokal via Live Map
```text
[Pengunjung buka TourFlow]
        │
        ▼
[Klik tombol "Flights & hotel ready? Find local UMKM tour guides on the Live Map" di Hero]
   (atau pilih "View on Map" pada kartu Destinasi Unggulan)
        │
        ▼
[Masuk ke #map-explorer (Live Saudi Destination Map)]
        ├─► Opsional: Aktifkan filter "Local Guides Available Only" / cari kota
        ├─► Opsional: Ketik nama Hotel di Route Planner (Places Autocomplete) atau klik "My Location"
        ▼
[Klik Pin Destinasi / Kartu Hub pada Direktori]
        │
        ▼
[Tampil InfoWindow (Rating Google, Alamat, Jumlah Pemandu UMKM, Harga Mulai SAR)]
        ├─► Jika Hotel/GPS diisi: Routes API gambar jalur berkendara + tampilkan Jarak (km) & ETA
        ├─► Klik "Directions" / "Google Maps" ──► Buka navigasi turn-by-turn di Google Maps
        └─► Klik Pengalaman Lokal / "Browse Local Guides Here" ──► Katalog / Halaman Detail Pengalaman
```

### 9.2 Alur Booking Pengalaman dengan Voucher & WhatsApp Concierge
```text
[Halaman Detail Pengalaman (ExperienceDetailPage)]
        │
        ├─► Lihat Galeri Foto, Highlights, Inclusions/Exclusions & Peta Meeting Point
        ├─► Isi Formulir Inquiry (Nama, Email, Telepon, Negara, Tanggal, Jumlah Tamu)
        ├─► Opsional: Masukkan Kode Promo ──► Validasi live terhadap koleksi `coupons` ──► Diskon SAR otomatis
        ▼
[Klik "Submit Booking Inquiry"]
        │
        ├─► Simpan ke Firestore `inquiries` (status: NEW)
        ├─► Upsert profil ke `customers` + tambah counter kupon + log `analyticsEvents` & `activityLogs`
        ▼
[Tampil Layar Sukses + Booking Reference ID]
        │
        └─► Klik "Chat on WhatsApp Concierge" ──► Buka WhatsApp dengan pesan ringkasan otomatis
```

### 9.3 Alur Operasional Admin Real-Time
```text
[Admin klik ikon Kunci di Navbar] ──► [Login di AdminLoginModal] ──► [Dashboard Admin (12 Tab)]
        │
        ├─► Kelola Inquiry baru (Badge NEW) ──► Tambah Internal Note ──► Ubah status ke CONFIRMED
        │       └──► Otomatis update KPI Overview, Revenue Intelligence Chart & Profil CRM Customer
        ├─► Tambah/Edit Experience atau Promo atau Copy CMS atau Tema Glassy
        │       └──► Firestore onSnapshot & BroadcastChannel langsung update Portal Pengunjung (<20ms lokal)
        └─► Kelola Subscribers baru ──► Kirim Outreach via Template (Gmail / Mailto / Copy) ──► Status CONTACTED
```

---

## 10. Model Data & Skema Database (13 Koleksi Firestore)

Seluruh 13 koleksi divalidasi secara ketat pada sisi server oleh `firestore.rules` (whitelist field, validasi tipe & panjang string, validasi enum, batas ukuran gambar 750 KB, serta aturan *default-deny* untuk path tak dikenal):

| # | Koleksi Firestore | Deskripsi & Field Utama | Kebijakan Akses & Keamanan |
| :--- | :--- | :--- | :--- |
| 1 | `themeConfig` | Dokumen `global`: konfigurasi Glassy V4 (`isGlassyEnabled`, `glassSurfaceTone`, `textColorMode`, `iconThemeStyle`, `blurRadius`, `cardTranslucency`, `borderOpacity`, `glowStrength`, `glassSheen`, `backgroundPreset`, `customBgUrl`, `accentPreset`, `customAccentHex`, `visitorGlassy`). | Publik bisa baca; tulis tervalidasi skema; `delete: false`. |
| 2 | `experiences` | Katalog paket wisata bilingual (`title`/`Ar`, `slug`, `destinationId`, 6 `category`, `price` SAR, `duration`/`Ar`, `description`/`Ar`, `coverImage`, `gallery[]`, `highlights`/`inclusions`/`exclusions`, `meetingPoint`/`Ar`, `featured`, `status`: `DRAFT \| PUBLISHED \| ARCHIVED`, `rating`, `reviewsCount`, `maxGuests`). | Publik baca; CRUD tervalidasi skema & enum. |
| 3 | `destinations` | Hub destinasi Saudi (`name`/`Ar`, `slug`, `description`/`Ar`, `coverImage`, `region`/`Ar`, `experienceCount`, `featured`, `published`). | Publik baca; CRUD tervalidasi skema. |
| 4 | `inquiries` | Permintaan booking (`customerName`, `email`, `phone`, `country`, `experienceId`, `experienceTitle`, `preferredDate`, `guests` 1–100, `message`, `status`: `NEW \| CONTACTED \| PENDING \| CONFIRMED \| COMPLETED \| CANCELLED`, `internalNotes[]`, `estimatedValue`). | Pengunjung bisa `create` inquiry baru (`NEW`); admin mengelola status & catatan internal. |
| 5 | `customers` | Profil CRM (`name`, `email`, `phone`, `country`, `totalInquiries`, `confirmedBookings`, `lastInteraction`, `notes`). | Tervalidasi skema; catatan concierge privat untuk operator. |
| 6 | `promotions` | Banner kampanye (`title`/`Ar`, `description`/`Ar`, `bannerImage`, `destinationId`, `linkedExperienceId`, `ctaText`/`Ar`, `ctaLink`, `badge`/`Ar`, `active`). | Publik baca; manajemen kampanye tervalidasi. |
| 7 | `coupons` | Voucher promo (`code`, `discountType`: `percentage \| fixed`, `discountAmount`, `expiryDate`, `usageLimit`, `usedCount`, `active`). | Publik baca (untuk validasi checkout); update `usedCount` & status aktif. |
| 8 | `quizzes` | Soal kuis interaktif (`question`/`Ar`, `options[]`/`Ar`, `correctIndex`, `explanation`/`Ar`, `category`, `active`). | Publik baca; CRUD tervalidasi. |
| 9 | `websiteContent` | Dokumen `global`: Hero headline/description/slideshow (`heroImages[]` maks 6, `heroSlideshowEnabled`, `heroSlideIntervalSec` 2–30), About & `stats`, kontak & WhatsApp, `componentTexts`/`Ar` (hingga 160 kunci). | Publik baca; update tervalidasi; `delete: false`. |
| 10 | `settings` | Dokumen `global`: identitas bisnis, `currency: 'SAR'`, `defaultLanguage: 'en' \| 'ar'`, `supportedLanguages`, `socialLinks`, flag notifikasi email & WhatsApp. | Publik baca; update tervalidasi; `delete: false`. |
| 11 | `analyticsEvents` | Telemetri funnel (`type`: `page_view \| experience_view \| search \| inquiry_submit \| booking_confirm`, `path`, `metadata`, `timestamp`). | Append-only (`update: false`); dapat di-reset admin. |
| 12 | `activityLogs` | Audit trail operasional (`action`, `details`, `adminUser`, `timestamp`). | Pencatatan otomatis setiap aksi penting. |
| 13 | `newsletterSubscribers` | Basis data email pengunjung (`email`, `source`, `language`, `status`: `ACTIVE \| CONTACTED \| UNSUBSCRIBED`, `notes`, `lastSubject`, `lastContactedAt`). | Pengunjung bisa `create` (subscribe); admin mengelola outreach & hapus. |

*(Catatan: Koleksi `/admins/{adminId}` juga telah disiapkan pada `firestore.rules` untuk perluasan RBAC berbasis Firebase Auth di tahap produksi.)*

---

## 11. Persyaratan Non-Fungsional (NFR)

1. **Responsivitas Multi-Perangkat:** Mendukung tampilan penuh pada desktop (*wide screen*), tablet, dan ponsel (*mobile-first grids*, tabel dengan *horizontal scroll*, *mobile drawer*, dan *touch-friendly controls*).
2. **Performa & Kompresi Aset:**
   * Aset gambar lokal di-bundle oleh Vite; unggahan pengguna dikompresi otomatis ke WebP/JPEG agar menjaga ukuran dokumen Firestore dan kecepatan muat.
   * Penggunaan `AutocompleteSessionToken` pada Google Places Autocomplete untuk efisiensi panggilan API.
3. **Aksesibilitas & Kontras Visual:**
   * Pasangan tema warna terproteksi (*Smoked Dark + Warm Sand Ivory* dan *Crystal Light + Saudi Emerald Ink*) mencegah teks berbaur dengan latar belakang.
   * Perhitungan luminansi otomatis untuk tombol aksen kustom.
   * Atribut `aria-label`, dukungan keyboard (Escape/Enter pada form & modal), serta dukungan RTL penuh.
4. **Keamanan & Integritas Data:**
   * Validasi skema sisi server di `firestore.rules`, sanitasi nilai `undefined` sebelum penulisan (`stripUndefined`), dan proteksi tanpa `window.alert`/`window.open` berbahaya.
   * Kepatuhan atribusi & *ToS* Google Maps (`internalUsageAttributionIds`, tanpa *scraping* atau penyimpanan permanen data koordinat/place Google ke database lokal).
5. **Ketahanan (Resilience):**
   * *Fallback* otomatis ke `localStorage` & seed data apabila koneksi Firestore sementara tidak tersedia.
   * *Two-tier Google Maps quota defense* agar aplikasi tetap fungsional dan informatif walau kuota peta demo terlampaui.

---

## 12. Batasan Saat Ini & Roadmap Pengembangan

### Batasan Versi Prototipe Saat Ini
* **Autentikasi Admin:** Saat ini menggunakan kode akses demo (`12341234`) pada sisi klien untuk kemudahan evaluasi dan demo; belum mewajibkan login Firebase Authentication penuh untuk semua mutasi admin.
* **Pembayaran:** Model pemesanan saat ini adalah *Direct Booking Inquiry* (tanpa *payment gateway* daring); pembayaran diselesaikan langsung bersama operator lokal melalui koordinasi WhatsApp/email.
* **Notifikasi Otomatis:** Flag notifikasi Email & WhatsApp tersimpan di konfigurasi, sedangkan pengiriman pesan email di tab *Subscribers* menggunakan *client handoff* (`Gmail compose` / `mailto:`), belum memakai server SMTP/Cloud Functions otomatis.

### Roadmap Pengembangan Tahap Berikutnya (Phase 2 & 3)
1. **Production RBAC & Multi-Tenant Operator Portal:** Aktivasi penuh Firebase Auth (Google Sign-In / Email-Password + koleksi `/admins`) dan pemisahan peran *Super Admin* vs *Local UMKM Operator* (masing-masing operator hanya mengelola paket & inquiry miliknya).
2. **Integrasi Payment Gateway Saudi:** Dukungan pembayaran langsung dalam SAR menggunakan **Mada**, **Apple Pay**, **STC Pay**, dan kartu kredit internasional (*Stripe / Moyasar / HyperPay*).
3. **Kalender Ketersediaan & Slot Real-Time:** Manajemen kuota kursi harian per pemandu lokal UMKM dan pencegahan *overbooking*.
4. **Automated Transactional Notifications:** Cloud Functions untuk pengiriman otomatis email konfirmasi booking (PDF voucher) dan WhatsApp Business API notification.
5. **Verified Traveler Reviews & Guide Profiles:** Halaman profil khusus tiap pemandu lokal UMKM (lisensi Kementerian Pariwisata, bahasa yang dikuasai, rating, & ulasan pasca-perjalanan terverifikasi).
