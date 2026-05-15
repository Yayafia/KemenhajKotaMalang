/* ======================================================
   SCRIPT GLOBAL – DIGUNAKAN DI SEMUA HALAMAN
====================================================== */

/* ======================================================
   VARIABEL MODAL BERITA (GLOBAL)
====================================================== */
const modal = document.getElementById("modalBerita");
const modalJudul = document.getElementById("modalJudul");
const modalDeskripsi = document.getElementById("modalDeskripsi");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");

// Close modal when clicking X
if (closeModal) {
    closeModal.addEventListener("click", () => {
        modal.classList.remove("show");
    });
}

/* ======================================================
   TAMBAHAN CLOSE MODAL SAAT KLIK DI LUAR POPUP
====================================================== */
if (modal) {
    modal.addEventListener("click", (e) => {
        // Jika klik area luar modal-content
        if (e.target === modal) {
            modal.classList.remove("show");
        }
    });
}

/* ======================================================
   HERO SLIDER - DENGAN GAMBAR DARI LOCALSTORAGE
====================================================== */
// Key untuk menyimpan gambar slider
const STORAGE_SLIDER = "heroSliderImages";

// Default images (jika belum ada di localStorage)
const defaultSliderImages = [
  "assets/images/hero-default-1.jpg",
  "assets/images/hero-default-2.jpg", 
  "assets/images/hero-default-3.jpg"
];

/* ======================================================
   INIT SLIDER - Memuat gambar dari localStorage
====================================================== */
function initHeroSlider() {
  // Ambil gambar dari localStorage atau pakai default
  let sliderImages = JSON.parse(localStorage.getItem(STORAGE_SLIDER));
  
  if (!sliderImages || sliderImages.length === 0) {
    sliderImages = defaultSliderImages;
    localStorage.setItem(STORAGE_SLIDER, JSON.stringify(sliderImages));
  }
  
  // Buat slide sesuai jumlah gambar
  createSliderSlides(sliderImages);
  
  // Start slider auto play
  startSlider();
}

/* ======================================================
   CREATE SLIDER SLIDES - Membuat elemen slide dinamis
====================================================== */
function createSliderSlides(images) {
  const sliderContainer = document.querySelector('.slider-container');
  const dotsContainer = document.querySelector('.slider-dots');
  
  if (!sliderContainer || !dotsContainer) return;
  
  // Kosongkan container
  sliderContainer.innerHTML = '';
  dotsContainer.innerHTML = '';
  
  // Buat slide untuk setiap gambar
  images.forEach((img, index) => {
    // Buat slide
    const slide = document.createElement('div');
    slide.className = `slide ${index === 0 ? 'active' : ''}`;
    slide.style.backgroundImage = `url('${img}')`;
    sliderContainer.appendChild(slide);
    
    // Buat dot
    const dot = document.createElement('span');
    dot.className = `dot ${index === 0 ? 'active' : ''}`;
    dotsContainer.appendChild(dot);
  });
}

/* ======================================================
   SLIDER FUNCTIONALITY
====================================================== */
let currentSlide = 0;
let slideInterval;

function startSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  
  if (!slides.length) return;
  
  // Reset current slide ke 0
  currentSlide = 0;
  
  // Hentikan interval sebelumnya jika ada
  if (slideInterval) clearInterval(slideInterval);
  
  // Auto slide setiap 5 detik
  slideInterval = setInterval(() => {
    nextSlide();
  }, 5000);
  
  // Event listener untuk tombol prev/next
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  
  if (prevBtn) {
    // Hapus event listener lama dengan clone node
    const newPrevBtn = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    newPrevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      resetInterval();
    });
  }
  
  if (nextBtn) {
    const newNextBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    newNextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      resetInterval();
    });
  }
  
  // Event listener untuk dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetInterval();
    });
  });
}

function nextSlide() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  
  if (!slides.length) return;
  
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  
  currentSlide = (currentSlide + 1) % slides.length;
  
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function prevSlide() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  
  if (!slides.length) return;
  
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  
  if (!slides.length) return;
  
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  
  currentSlide = index;
  
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function resetInterval() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      nextSlide();
    }, 5000);
  }
}

/* ======================================================
   UPDATE SLIDER DOM - Dipanggil dari admin
====================================================== */
function updateSliderDOM() {
  const sliderImages = JSON.parse(localStorage.getItem(STORAGE_SLIDER)) || defaultSliderImages;
  
  // Buat ulang slide sesuai jumlah gambar terbaru
  createSliderSlides(sliderImages);
  
  // Reset slider
  currentSlide = 0;
  
  // Hentikan interval lama
  if (slideInterval) {
    clearInterval(slideInterval);
  }
  
  // Start ulang slider
  startSlider();
}

/* ======================================================
   FUNGSI UNTUK FORMAT TANGGAL INDONESIA
====================================================== */
function formatTanggalIndonesia(tanggal) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(tanggal).toLocaleDateString('id-ID', options);
}

/* ======================================================
   FUNGSI UNTUK BUKA DETAIL BERITA
====================================================== */
function openDetailBerita(judul, isi, gambar, tanggal) {
    // Simpan ke localStorage
    localStorage.setItem("judulBerita", judul);
    localStorage.setItem("isiBerita", isi);
    localStorage.setItem("gambarBerita", gambar);
    localStorage.setItem("tanggalBerita", tanggal || formatTanggalIndonesia(new Date()));
    
    // Redirect ke halaman detail
    window.location.href = "detailberita.html";
}

/* ======================================================
   FUNGSI UNTUK BUKA MODAL BERITA
====================================================== */
function openModalBerita(judul, isi, gambar, tanggal) {
    // Set modal content
    modalJudul.innerText = judul;
    modalDeskripsi.innerText = isi;
    modalImage.src = gambar;
    
    // Simpan ke localStorage untuk detail page
    localStorage.setItem("judulBerita", judul);
    localStorage.setItem("isiBerita", isi);
    localStorage.setItem("gambarBerita", gambar);
    localStorage.setItem("tanggalBerita", tanggal || formatTanggalIndonesia(new Date()));
    
    // Tampilkan modal
    modal.classList.add("show");
}

// SATU-SATUNYA EVENT LISTENER
document.addEventListener("DOMContentLoaded", function() {
  if (document.querySelector('.hero-slider')) {
    initHeroSlider();
  }
  
  renderBeritaIndex();
  loadSambutan();
  
  // Event listener untuk berita utama (kotak besar - KHUSUS VIDEO)
  document.querySelectorAll(".news-main").forEach(item => {
    item.addEventListener("click", function() {
        // Kotak besar tidak bisa diklik karena khusus video
        // Tidak melakukan apa-apa
    });
  });
  
  // Event listener untuk berita samping (3 kotak kecil)
  document.querySelectorAll(".news-card").forEach(item => {
    item.addEventListener("click", function() {
        const judul = this.dataset.judul;
        const isi = this.dataset.isi;
        const gambar = this.dataset.gambar;
        const tanggal = this.dataset.tanggal;
        
        if (judul && isi) {
            openDetailBerita(judul, isi, gambar, tanggal);
        }
    });
  });
  
  // Event listener untuk berita lainnya (grid)
  document.querySelectorAll(".news-popup").forEach(item => {
    item.addEventListener("click", function() {
        const judul = this.dataset.judul;
        const isi = this.dataset.isi;
        const gambar = this.dataset.gambar;
        const tanggal = this.dataset.tanggal;
        
        if (judul && isi) {
            openModalBerita(judul, isi, gambar, tanggal);
        }
    });
  });

});

/* ======================================================
   RENDER BERITA KE INDEX.HTML
====================================================== */
function renderBeritaIndex() {
    const data = JSON.parse(localStorage.getItem("dataBeritaKemenhaj")) || [];
    
    // Render video di kotak besar (khusus posisi 1)
    renderVideoUtama(data);
    
    // Render berita terkini (3 kotak kecil di samping)
    renderBeritaTerkini(data);
    
    // Render berita lainnya (grid)
    renderBeritaLainnya(data);
    // 🔥 TAMBAHKAN INI
    setTimeout(() => {
      initAutoPlayVideo();
    }, 300);
}

function renderVideoUtama(data) {
    const newsMain = document.querySelector(".news-main");
    if (!newsMain) return;
    
    // Cari berita dengan jenis "terkini" dan posisi "1" (khusus video)
    const videoBerita = data.find(item => item.jenis === "terkini" && item.posisi === "1");
    
    if (videoBerita && videoBerita.youtube) {
        // Tampilkan video YouTube
        const videoId = videoBerita.youtube.replace("https://youtu.be/", "").replace("https://www.youtube.com/watch?v=", "");
        newsMain.innerHTML = `
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" 
                    frameborder="0" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
            <div class="news-overlay">
                <span class="badge">Video</span>
                <h3>${videoBerita.judul}</h3>
            </div>
        `;
        // ✅ TAMBAH INI (PENTING)
    initAutoPlayVideo();
    } else {
        // Tampilkan default jika tidak ada video
        newsMain.innerHTML = `
            <img src="assets/images/berita-utama.jpg">
            <div class="news-overlay">
                <span class="badge">Pengumuman</span>
                <h3>Penyesuaian Biaya Haji Tahun 1446 H / 2025 M</h3>
            </div>
        `;
    }
}

/* ======================================================
   AUTO PLAY VIDEO SAAT MASUK VIEWPORT (FIX FINAL)
====================================================== */
function initAutoPlayVideo() {
  const iframe = document.querySelector(".news-main iframe");

  if (!iframe) return;

  const videoId = iframe.src.split("/embed/")[1]?.split("?")[0];
  if (!videoId) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1`;
      } else {
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
      }
    });
  }, {
    threshold: 0.6
  });

  observer.observe(iframe);
}

function renderBeritaTerkini(data) {
    const newsSide = document.querySelector(".news-side");
    if (!newsSide) return;
    
    // Filter berita dengan jenis "terkini" (kecuali yang posisi 1 untuk video)
    const beritaTerkini = data.filter(item => item.jenis === "terkini" && item.posisi !== "1").slice(0, 3);
    
    newsSide.innerHTML = "";
    
    if (beritaTerkini.length === 0) {
        // Tampilkan default jika tidak ada data
        newsSide.innerHTML = `
            <div class="news-card" data-judul="Persiapan Manasik Haji Nasional" data-isi="Kementerian Haji dan Umrah mempersiapkan manasik nasional." data-gambar="assets/images/berita-2.jpg" data-tanggal="${formatTanggalIndonesia('2026-01-20')}">
                <span class="badge small">Info</span>
                <h4>Persiapan Manasik Haji Nasional</h4>
                <p>${formatTanggalIndonesia('2026-01-20')}</p>
            </div>
            <div class="news-card" data-judul="Pembukaan Pendaftaran Umrah Resmi" data-isi="Pendaftaran umrah resmi telah dibuka melalui sistem nasional." data-gambar="assets/images/berita-3.jpg" data-tanggal="${formatTanggalIndonesia('2026-01-18')}">
                <span class="badge small">Umrah</span>
                <h4>Pembukaan Pendaftaran Umrah Resmi</h4>
                <p>${formatTanggalIndonesia('2026-01-18')}</p>
            </div>
            <div class="news-card" data-judul="Peningkatan Sistem SISKOHAT" data-isi="Peningkatan sistem untuk layanan jamaah haji." data-gambar="assets/images/berita-1.jpg" data-tanggal="${formatTanggalIndonesia('2026-01-15')}">
                <span class="badge small">Layanan</span>
                <h4>Peningkatan Sistem SISKOHAT</h4>
                <p>${formatTanggalIndonesia('2026-01-15')}</p>
            </div>
        `;
    } else {
        beritaTerkini.forEach(item => {
            const tanggal = item.tanggal || formatTanggalIndonesia(new Date());
            newsSide.innerHTML += `
                <div class="news-card" data-judul="${item.judul}" data-isi="${item.isi}" data-gambar="${item.gambar}" data-tanggal="${tanggal}">
                    <span class="badge small">${item.jenis}</span>
                    <h4>${item.judul}</h4>
                    <p>${tanggal}</p>
                </div>
            `;
        });
    }
    
    // Re-attach event listener
    document.querySelectorAll(".news-card").forEach(item => {
        item.addEventListener("click", function() {
            const judul = this.dataset.judul;
            const isi = this.dataset.isi;
            const gambar = this.dataset.gambar;
            const tanggal = this.dataset.tanggal;
            
            if (judul && isi) {
                openDetailBerita(judul, isi, gambar, tanggal);
            }
        });
    });
}

function renderBeritaLainnya(data) {
    const grid = document.getElementById("beritaGrid");
    if (!grid) return;
    
    // Filter berita dengan jenis "lainnya"
    const beritaLainnya = data.filter(item => item.jenis === "lainnya");
    
    grid.innerHTML = "";
    
    if (beritaLainnya.length === 0) {
        // Tampilkan default jika tidak ada data
        grid.innerHTML = `
            <div class="berita-card news-popup visible" data-judul="Pendaftaran Umrah Resmi Dibuka" data-isi="Pendaftaran umrah melalui sistem resmi SISKOHAT." data-gambar="assets/images/berita-1.jpg" data-tanggal="${formatTanggalIndonesia('2026-02-01')}">
                <div class="berita-image">
                    <img src="assets/images/berita-1.jpg">
                    <span class="badge">Pengumuman</span>
                </div>
                <div class="berita-content">
                    <h3>Penyesuaian Biaya Haji 2025</h3>
                    <p>Pemerintah menetapkan penyesuaian biaya.</p>
                    <span class="berita-tanggal">${formatTanggalIndonesia('2026-02-01')}</span>
                </div>
            </div>
            <div class="berita-card news-popup visible" data-judul="Jadwal Manasik Nasional" data-isi="Manasik haji nasional bertahap." data-gambar="assets/images/berita-2.jpg" data-tanggal="${formatTanggalIndonesia('2026-01-28')}">
                <div class="berita-image">
                    <img src="assets/images/berita-2.jpg">
                    <span class="badge">Manasik</span>
                </div>
                <div class="berita-content">
                    <h3>Manasik Nasional</h3>
                    <p>Persiapan manasik haji.</p>
                    <span class="berita-tanggal">${formatTanggalIndonesia('2026-01-28')}</span>
                </div>
            </div>
            <div class="berita-card news-popup visible" data-judul="Pendaftaran Umrah" data-isi="Umrah resmi dibuka." data-gambar="assets/images/berita-3.jpg" data-tanggal="${formatTanggalIndonesia('2026-01-25')}">
                <div class="berita-image">
                    <img src="assets/images/berita-3.jpg">
                    <span class="badge">Umrah</span>
                </div>
                <div class="berita-content">
                    <h3>Umrah Dibuka</h3>
                    <p>Pendaftaran umrah nasional.</p>
                    <span class="berita-tanggal">${formatTanggalIndonesia('2026-01-25')}</span>
                </div>
            </div>
        `;
        
        // Tambahkan 6 berita hidden untuk toggle
        for (let i = 0; i < 6; i++) {
            const tanggal = new Date();
            tanggal.setDate(tanggal.getDate() - i);
            grid.innerHTML += `
                <div class="berita-card news-popup hidden" data-judul="Berita Lainnya ${i+1}" data-isi="Konten berita lainnya..." data-gambar="assets/images/berita-3.jpg" data-tanggal="${formatTanggalIndonesia(tanggal)}">
                    <div class="berita-image">
                        <img src="assets/images/berita-3.jpg">
                        <span class="badge">Info</span>
                    </div>
                    <div class="berita-content">
                        <h3>Berita Lainnya ${i+1}</h3>
                        <p>Konten berita lainnya...</p>
                        <span class="berita-tanggal">${formatTanggalIndonesia(tanggal)}</span>
                    </div>
                </div>
            `;
        }
    } else {
        beritaLainnya.forEach((item, index) => {
            const visibility = index < 3 ? "visible" : "hidden";
            const tanggal = item.tanggal || formatTanggalIndonesia(new Date());
            grid.innerHTML += `
                <div class="berita-card news-popup ${visibility}" data-judul="${item.judul}" data-isi="${item.isi}" data-gambar="${item.gambar}" data-tanggal="${tanggal}">
                    <div class="berita-image">
                        <img src="${item.gambar}">
                        <span class="badge">${item.jenis}</span>
                    </div>
                    <div class="berita-content">
                        <h3>${item.judul}</h3>
                        <p>${item.isi.substring(0, 100)}...</p>
                        <span class="berita-tanggal">${tanggal}</span>
                    </div>
                </div>
            `;
        });
    }
    
    // Re-attach event listener untuk berita lainnya
    document.querySelectorAll(".news-popup").forEach(item => {
        item.addEventListener("click", function() {
            const judul = this.dataset.judul;
            const isi = this.dataset.isi;
            const gambar = this.dataset.gambar;
            const tanggal = this.dataset.tanggal;
            
            if (judul && isi) {
                openModalBerita(judul, isi, gambar, tanggal);
            }
        });
    });
}

/* ======================================================
   DETAIL BERITA (detailberita.html)
====================================================== */
const detailJudul = document.getElementById("detailJudul");
const detailIsi = document.getElementById("detailIsi");
const detailImage = document.getElementById("detailImage");
const detailTanggal = document.getElementById("detailTanggal");

if (detailJudul && detailIsi && detailImage && detailTanggal) {
    // Ambil data dari localStorage
    const judul = localStorage.getItem("judulBerita") || "Judul Berita";
    const isi = localStorage.getItem("isiBerita") || "Konten berita belum tersedia.";
    const gambar = localStorage.getItem("gambarBerita") || "assets/images/default.jpg";
    const tanggal = localStorage.getItem("tanggalBerita") || formatTanggalIndonesia(new Date());
    
    // Tampilkan di halaman
    detailJudul.innerText = judul;
    detailIsi.innerText = isi;
    detailImage.src = gambar;
    detailTanggal.innerText = tanggal;
}

/* ======================================================
   PAKET (INDEX)
   - Klik button → halaman detail paket
====================================================== */
document.querySelectorAll(".btn-paket").forEach(btn => {
  btn.addEventListener("click", () => {

    localStorage.setItem(
      "namaPaket",
      btn.dataset.paket
    );

    localStorage.setItem(
      "deskripsiPaket",
      btn.dataset.deskripsi
    );

    localStorage.setItem(
      "gambarPaket",
      btn.dataset.gambar
    );

    localStorage.setItem(
      "fasilitasPaket",
      btn.dataset.fasilitas || ""
    );

    window.location.href =
      btn.dataset.target;

  });
});

/* ======================================================
   NAVBAR – DROPDOWN PANDUAN (KLIK)
====================================================== */
const btnPanduan = document.getElementById("btnPanduan");
const menuPanduan = document.getElementById("menuPanduan");

if (btnPanduan && menuPanduan) {
  btnPanduan.addEventListener("click", e => {
    e.preventDefault();
    menuPanduan.classList.toggle("show");
  });

  document.addEventListener("click", e => {
    if (!btnPanduan.contains(e.target) && !menuPanduan.contains(e.target)) {
      menuPanduan.classList.remove("show");
    }
  });
}

/* ======================================================
   DETAIL PAKET (HAJI & UMRAH)
====================================================== */

const paketJudul =
document.getElementById("paketJudul");

const paketDeskripsi =
document.getElementById("paketDeskripsi");

const paketImage =
document.getElementById("paketImage");

const listFasilitas =
document.getElementById("listFasilitas");

if (
  paketJudul &&
  paketDeskripsi &&
  paketImage
) {

  paketJudul.innerText =
    localStorage.getItem("namaPaket")
    || "Detail Paket";

  paketDeskripsi.innerText =
    localStorage.getItem("deskripsiPaket")
    || "-";

  paketImage.src =
    localStorage.getItem("gambarPaket")
    || "assets/images/default.jpg";

  /* =========================================
     LOAD FASILITAS
  ========================================= */

  const fasilitas =
    localStorage.getItem("fasilitasPaket") || "";

  if (listFasilitas) {

    listFasilitas.innerHTML = "";

    if (fasilitas) {

      let dataFasilitas = [];

      // Jika pakai enter
      if (fasilitas.includes("\n")) {

        dataFasilitas =
          fasilitas.split("\n");

      }

      // Jika pakai koma
      else {

        dataFasilitas =
          fasilitas.split(",");

      }

      dataFasilitas.forEach(item => {

        if (item.trim() !== "") {

          listFasilitas.innerHTML += `
            <li>${item.trim()}</li>
          `;

        }

      });

    }

    else {

      listFasilitas.innerHTML = `
        <li>Fasilitas belum tersedia.</li>
      `;

    }

  }

}

/* ======================================================
   NAVBAR – SCROLL KE BERITA LAINNYA (INDEX)
====================================================== */
const navBerita = document.getElementById("navBerita");

if (navBerita) {
  navBerita.addEventListener("click", e => {
    e.preventDefault();
    document
      .getElementById("beritaLainnya")
      .scrollIntoView({ behavior: "smooth" });
  });
}

/* ======================================================
   NAVBAR – SCROLL KE PAKET HAJI & UMRAH (INDEX)
====================================================== */
const navPaket = document.getElementById("navPaket");

if (navPaket) {
  navPaket.addEventListener("click", e => {
    e.preventDefault();
    document
      .getElementById("paketHaji")
      .scrollIntoView({ behavior: "smooth" });
  });
}

/* ======================================================
   NAVBAR FIXED SAAT SCROLL (KHUSUS INDEX)
====================================================== */
const navbar = document.querySelector(".navbar");

if (navbar && window.location.pathname.includes("index")) {
  navbar.classList.add("fixed");
  document.body.classList.add("has-fixed-navbar");
}

/* ======================================================
   TOGGLE BERITA LAINNYA (6 → 12 → 6)
====================================================== */
const toggleBtn = document.getElementById("toggleBerita");
const iconToggle = document.getElementById("iconToggle");

let isOpen = false;

if (toggleBtn && iconToggle) {
  toggleBtn.addEventListener("click", () => {
    const hiddenCards = document.querySelectorAll(".berita-card.hidden");

    // TAMPILKAN / SEMBUNYIKAN BERITA TAMBAHAN
    hiddenCards.forEach(card => {
      card.style.display = isOpen ? "none" : "block";
    });

    // GANTI ICON
    if (isOpen) {
      iconToggle.textContent = "⬇";
      toggleBtn.lastChild.textContent = " Berita Lainnya";
    } else {
      iconToggle.textContent = "⬆";
      toggleBtn.lastChild.textContent = " Tutup Berita";
    }

    isOpen = !isOpen;
  });
}

/* ======================================================
   KELOLA BERITA SYSTEM (ADMIN → INDEX)
   LOCAL STORAGE BASED CMS
====================================================== */

const STORAGE_BERITA = "dataBeritaKemenhaj";

/* ======================================================
   LOAD BERITA DARI STORAGE
====================================================== */
function getAllBerita() {
  return JSON.parse(localStorage.getItem(STORAGE_BERITA)) || [];
}

function saveAllBerita(data) {
  localStorage.setItem(STORAGE_BERITA, JSON.stringify(data));
}

/* ======================================================
   TAMBAH BERITA BARU
====================================================== */
function tambahBerita(dataBaru) {

  const semuaBerita = getAllBerita();

  dataBaru.id = Date.now();

  semuaBerita.push(dataBaru);

  saveAllBerita(semuaBerita);

  renderBeritaIndex();
}

/* ======================================================
   EDIT BERITA
====================================================== */
function editBerita(id, dataEdit) {

  let semuaBerita = getAllBerita();

  semuaBerita = semuaBerita.map(b =>
    b.id === id ? {...b, ...dataEdit} : b
  );

  saveAllBerita(semuaBerita);

  renderBeritaIndex();
}

/* ======================================================
   HAPUS BERITA
====================================================== */
function hapusBerita(id) {

  let semuaBerita = getAllBerita();

  semuaBerita = semuaBerita.filter(b => b.id !== id);

  saveAllBerita(semuaBerita);

  renderBeritaIndex();
}


/* ======================================================
   HANDLE UPLOAD FOTO → BASE64
====================================================== */
function convertToBase64(file, callback) {

  const reader = new FileReader();

  reader.onload = function(e) {
    callback(e.target.result);
  };

  reader.readAsDataURL(file);
}


/* ======================================================
   HANDLE FORM SUBMIT BERITA
====================================================== */
function submitFormBerita() {

  const judul =
    document.getElementById("inputJudul").value;

  const isi =
    document.getElementById("inputIsi").value;

  const jenis =
    document.getElementById("inputJenis").value;

  const posisi =
    document.getElementById("inputPosisi").value;

  const youtube =
    document.getElementById("inputYoutube").value;

  const file =
    document.getElementById("inputFoto").files[0];

  if (!judul || !isi || !jenis) {
    alert("Lengkapi data!");
    return;
  }

  if(file){
    convertToBase64(file, function(base64){

      tambahBerita({
        judul,
        isi,
        jenis,
        posisi,
        youtube,
        gambar: base64,
        tanggal: formatTanggalIndonesia(new Date()) // Tambah tanggal otomatis
      });

    });
  }
  else{

    tambahBerita({
      judul,
      isi,
      jenis,
      posisi,
      youtube,
      gambar: "assets/images/default.jpg",
      tanggal: formatTanggalIndonesia(new Date()) // Tambah tanggal otomatis
    });

  }

}

/* ======================================================
   HANDLE PILIH JENIS BERITA
====================================================== */
const inputJenis =
document.getElementById("inputJenis");

const inputYoutube =
document.getElementById("inputYoutube");

const inputPosisi =
document.getElementById("inputPosisi");

if(inputJenis){

  inputJenis.addEventListener("change", function(){

    if(this.value === "terkini"){

      inputYoutube.style.display = "block";

      if(inputYoutube.value)
        inputPosisi.value = "1";

    }
    else{

      inputYoutube.style.display = "none";

    }

  });

}

/* ======================================================
   LOAD SAMBUTAN KE INDEX
====================================================== */
function loadSambutan() {
    const data = JSON.parse(localStorage.getItem("sambutanData"));
    
    // Element-elemen di index.html
    const namaElem = document.getElementById("sambutanNama");
    const isiElem = document.getElementById("sambutanIsi");
    const visiElem = document.getElementById("sambutanVisi");
    const misiElem = document.getElementById("sambutanMisi");
    const fotoElem = document.getElementById("sambutanFoto");
    const jabatanElem = document.getElementById("sambutanJabatan");
    
    if (!data) {
        // Jika tidak ada data, tampilkan default
        if (namaElem) namaElem.innerText = "Nama Kepala";
        if (isiElem) isiElem.innerText = "Sambutan belum tersedia.";
        if (visiElem) visiElem.innerText = "Visi belum diatur.";
        if (misiElem) {
            misiElem.innerHTML = "<li>Misi belum diatur.</li>";
        }
        if (fotoElem) fotoElem.src = "images/logo-kemenhaj.png";
        if (jabatanElem) jabatanElem.innerText = "Kepala Kementrian Haji Kota Malang";
        return;
    }
    
    // Tampilkan data dari localStorage
    if (namaElem) namaElem.innerText = data.nama;
    if (isiElem) isiElem.innerText = data.isi;
    if (visiElem) visiElem.innerText = data.visi;
    
    // Tampilkan misi (array)
    if (misiElem) {
        misiElem.innerHTML = "";
        if (data.misi && data.misi.length > 0) {
            data.misi.forEach(item => {
                misiElem.innerHTML += `<li>${item}</li>`;
            });
        } else {
            misiElem.innerHTML = "<li>Misi belum diatur.</li>";
        }
    }
    
    // Tampilkan foto
    if (fotoElem) fotoElem.src = data.foto;
    
    // Jabatan tetap (karena tidak diinput admin)
    if (jabatanElem) jabatanElem.innerText = "Kepala Kementrian Haji Kota Malang";
}

/* ======================================================
   LOAD PAKET KE HOME
====================================================== */

function loadPaketHome() {

  const data =
    JSON.parse(localStorage.getItem("dataPaketKemenhaj")) || [];

  /* =========================================
     ELEMENT HOME HAJI
  ========================================= */

  const paketCards =
    document.querySelectorAll("#paketHaji .package-card");

  const hajiCard1 = paketCards[0];
  const hajiCard2 = paketCards[1];

  /* =========================================
     ELEMENT HOME UMRAH
  ========================================= */

  const paketUmrahCards =
    document.querySelectorAll("#paketUmrah .package-card");

  const umrahCard1 = paketUmrahCards[0];
  const umrahCard2 = paketUmrahCards[1];

  /* =========================================
     FILTER DATA HAJI
  ========================================= */

  const dataHaji =
    data.filter(item => item.jenis === "haji");

  const dataUmrah =
    data.filter(item => item.jenis === "umrah");

  /* =========================================
     RENDER HAJI
  ========================================= */

  dataHaji.forEach(item => {

    const posisi =
      item.posisi || "1";

    const targetCard =
      posisi === "2"
        ? hajiCard2
        : hajiCard1;

    if (!targetCard) return;

    const title =
      targetCard.querySelector("h3");

    const desc =
      targetCard.querySelector("p");

    const button =
      targetCard.querySelector(".btn-paket");

    // JANGAN TAMPILKAN GAMBAR DI HOME
    const image =
      targetCard.querySelector("img");

    if (image) {
      image.style.display = "none";
    }

    if (title) {
      title.innerText = item.judul;
    }

    if (desc) {
      desc.innerText =
        item.isi.substring(0, 100) + "...";
    }

    if (button) {

      button.innerText = "Lihat Detail";

      button.dataset.paket =
        item.judul;

      button.dataset.deskripsi =
        item.isi;

      button.dataset.gambar =
        item.gambar;

      button.dataset.fasilitas =
        item.fasilitas || "";

    }

  });

  /* =========================================
     RENDER UMRAH
  ========================================= */

  dataUmrah.forEach(item => {

    const posisi =
      item.posisi || "1";

    const targetCard =
      posisi === "2"
        ? umrahCard2
        : umrahCard1;

    if (!targetCard) return;

    const title =
      targetCard.querySelector("h3");

    const desc =
      targetCard.querySelector("p");

    const button =
      targetCard.querySelector(".btn-paket");

    // JANGAN TAMPILKAN GAMBAR DI HOME
    const image =
      targetCard.querySelector("img");

    if (image) {
      image.style.display = "none";
    }

    if (title) {
      title.innerText = item.judul;
    }

    if (desc) {
      desc.innerText =
        item.isi.substring(0, 100) + "...";
    }

    if (button) {

      button.innerText = "Lihat Detail";

      button.dataset.paket =
        item.judul;

      button.dataset.deskripsi =
        item.isi;

      button.dataset.gambar =
        item.gambar;

      button.dataset.fasilitas =
        item.fasilitas || "";

    }

  });

}

loadPaketHome();



/* ======================================================
   VIDEO PANDUAN HAJI & UMRAH
====================================================== */

/* ================= AMBIL ID YOUTUBE ================= */
function getYoutubeId(url) {

  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

  const match = url.match(regExp);

  return (match && match[2].length === 11)
    ? match[2]
    : null;
}

/* ======================================================
   SLIDER VIDEO PANDUAN HAJI
====================================================== */

let currentPanduan = 0;

function renderSliderPanduan() {

  const container =
    document.getElementById("panduanSliderHaji");

  if (!container) return;

  const videos =
    JSON.parse(
      localStorage.getItem("videoPanduanHaji")
    ) || [];

  if (videos.length === 0) {

    container.innerHTML = `
      <div class="panduan-video-item active">
        <iframe
          src="https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1"
          frameborder="0"
          allowfullscreen>
        </iframe>
      </div>
    `;

    return;
  }

  container.innerHTML = "";

  videos.forEach((video, index) => {

    const idVideo =
      getYoutubeId(video);

    container.innerHTML += `
      <div class="panduan-video-item ${index === 0 ? "active" : ""}">
        <iframe
          src="https://www.youtube.com/embed/${idVideo}?autoplay=1&mute=1"
          frameborder="0"
          allowfullscreen>
        </iframe>
      </div>
    `;
  });

}

function showPanduan(index) {

  const items =
    document.querySelectorAll(".panduan-video-item");

  if (!items.length) return;

  items.forEach(item =>
    item.classList.remove("active")
  );

  items[index].classList.add("active");
}

function nextPanduanVideo() {

  const items =
    document.querySelectorAll(".panduan-video-item");

  if (!items.length) return;

  currentPanduan++;

  if (currentPanduan >= items.length) {
    currentPanduan = 0;
  }

  showPanduan(currentPanduan);
}

function prevPanduanVideo() {

  const items =
    document.querySelectorAll(".panduan-video-item");

  if (!items.length) return;

  currentPanduan--;

  if (currentPanduan < 0) {
    currentPanduan = items.length - 1;
  }

  showPanduan(currentPanduan);
}

renderSliderPanduan();


/* ================= VIDEO UMRAH ================= */
const iframeUmrah =
  document.getElementById("iframeUmrah");

if (iframeUmrah) {

  const videoUmrah =
    localStorage.getItem("videoPanduanUmrah");

  if (videoUmrah) {

    const idVideo =
      getYoutubeId(videoUmrah);

    iframeUmrah.src =
      `https://www.youtube.com/embed/${idVideo}?autoplay=1&mute=1&loop=1&playlist=${idVideo}`;
  }
}


/* ======================================================
   PENGADUAN JEMAAH
====================================================== */

const STORAGE_PENGADUAN = "dataPengaduanJamaah";

function getPengaduan() {
  return JSON.parse(localStorage.getItem(STORAGE_PENGADUAN)) || [];
}

function savePengaduan(data) {
  localStorage.setItem(STORAGE_PENGADUAN, JSON.stringify(data));
}

function renderPengaduan() {

  const container = document.getElementById("listPengaduan");

  if (!container) return;

  const data = getPengaduan();

  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = `
      <div class="syarat-card">
        <h4>Belum Ada Pengaduan</h4>
        <p>Pengaduan pengguna akan muncul di sini.</p>
      </div>
    `;

    return;
  }

  data.reverse().forEach(item => {

    container.innerHTML += `
      <div class="syarat-card" style="margin-bottom:20px;">
        <h4>${item.nama}</h4>
        <p><strong>Kategori:</strong> ${item.kategori}</p>
        <p>${item.pesan}</p>
      </div>
    `;

  });
}

const formPengaduan = document.getElementById("formPengaduan");

if (formPengaduan) {

  renderPengaduan();

  formPengaduan.addEventListener("submit", function(e) {

    e.preventDefault();

    const nama =
      document.getElementById("namaPengadu").value;

    const kategori =
      document.getElementById("kategoriPengaduan").value;

    const pesan =
      document.getElementById("detailPengaduan").value;

    const semuaPengaduan = getPengaduan();

    semuaPengaduan.push({
      nama,
      kategori,
      pesan
    });

    savePengaduan(semuaPengaduan);

    alert("Pengaduan berhasil dikirim!");

    formPengaduan.reset();

    renderPengaduan();

  });
}