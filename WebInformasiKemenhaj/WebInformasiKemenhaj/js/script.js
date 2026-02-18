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


/* ======================================================
   BERITA TERKINI (INDEX)
   - Klik berita highlight → langsung ke detailberita.html
====================================================== */
document.querySelectorAll(".news-direct").forEach(item => {
  item.addEventListener("click", () => {

    localStorage.setItem("judulBerita", item.dataset.judul);
    localStorage.setItem("isiBerita", item.dataset.isi);
    localStorage.setItem("gambarBerita", item.dataset.gambar); // TAMBAH

    window.location.href = "detailberita.html";
  });
});



/* ======================================================
   BERITA LAINNYA (INDEX)
   - Klik berita → popup modal + gambar
====================================================== */
document.querySelectorAll(".news-popup").forEach(item => {
  item.addEventListener("click", () => {
    modalJudul.innerText = item.dataset.judul;
    modalDeskripsi.innerText = item.dataset.isi;
    modalImage.src = item.dataset.gambar;

    localStorage.setItem("judulBerita", item.dataset.judul);
    localStorage.setItem("isiBerita", item.dataset.isi);
    localStorage.setItem("gambarBerita", item.dataset.gambar);

    modal.classList.add("show");
  });
});


/* ======================================================
   MODAL CLOSE
====================================================== */
if (closeModal) {
  closeModal.onclick = () => modal.classList.remove("show");
}

window.onclick = e => {
  if (e.target === modal) modal.classList.remove("show");
};


/* ======================================================
   DETAIL BERITA (detailberita.html)
   - Ambil judul, isi, & gambar dari localStorage
====================================================== */
const detailJudul = document.getElementById("detailJudul");
const detailIsi = document.getElementById("detailIsi");
const detailImage = document.getElementById("detailImage");

if (detailJudul && detailIsi) {
  detailJudul.innerText =
    localStorage.getItem("judulBerita") || "Judul Berita";

  detailIsi.innerText =
    localStorage.getItem("isiBerita") || "Konten berita belum tersedia.";

  if (detailImage) {
    detailImage.src =
      localStorage.getItem("gambarBerita") || "assets/images/default.jpg";
  }
}


/* ======================================================
   PAKET (INDEX)
   - Klik button → halaman detail paket
====================================================== */
document.querySelectorAll(".btn-paket").forEach(btn => {
  btn.addEventListener("click", () => {
    localStorage.setItem("namaPaket", btn.dataset.paket);
    localStorage.setItem("deskripsiPaket", btn.dataset.deskripsi);
    localStorage.setItem("gambarPaket", btn.dataset.gambar);

    window.location.href = btn.dataset.target;
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
const paketJudul = document.getElementById("paketJudul");
const paketDeskripsi = document.getElementById("paketDeskripsi");
const paketImage = document.getElementById("paketImage");


if (paketJudul && paketDeskripsi && paketImage) {

  paketJudul.innerText =
    localStorage.getItem("namaPaket") || "Detail Paket";

  paketDeskripsi.innerText =
    localStorage.getItem("deskripsiPaket") || "-";

  paketImage.src =
    localStorage.getItem("gambarPaket") || "assets/images/default.jpg";
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
const hiddenCards = document.querySelectorAll(".berita-card.hidden");

let isOpen = false;

if (toggleBtn && iconToggle) {
  toggleBtn.addEventListener("click", () => {

    // TAMPILKAN / SEMBUNYIKAN 6 BERITA TAMBAHAN
    hiddenCards.forEach(card => {
      card.style.display = isOpen ? "none" : "block";
    });

    // GANTI ICON SAJA (JANGAN innerHTML)
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

// ===============================
// LOAD DATA SAMBUTAN
// ===============================

document.addEventListener("DOMContentLoaded", function () {

  // Contoh data (nanti diganti dari API Admin)
  const dataSambutan = {
    nama: "Dr. Subhan, M.Si",
    jabatan: "Kepala Kemenhaj Kota Malang",
    judul: "Sambutan Kepala Kemenhaj",
    isi: "Kami berkomitmen memberikan pelayanan terbaik kepada jamaah secara profesional dan transparan.",
    visi: "Terwujudnya pelayanan haji dan umrah yang aman dan terpercaya.",
    misi: [
      "Meningkatkan kualitas layanan",
      "Mengembangkan sistem digital",
      "Pelayanan yang transparan"
    ],
    foto: "images/logo-kemenhaj.png"
  };


  // SET DATA KE HTML
  document.getElementById("sambutanNama").innerText = dataSambutan.nama;
  document.getElementById("sambutanJabatan").innerText = dataSambutan.jabatan;
  document.getElementById("sambutanJudul").innerText = dataSambutan.judul;
  document.getElementById("sambutanIsi").innerText = dataSambutan.isi;
  document.getElementById("sambutanVisi").innerText = dataSambutan.visi;

  document.getElementById("sambutanFoto").src = dataSambutan.foto;


  // SET MISI
  const misiList = document.getElementById("sambutanMisi");
  misiList.innerHTML = "";

  dataSambutan.misi.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    misiList.appendChild(li);
  });

});

