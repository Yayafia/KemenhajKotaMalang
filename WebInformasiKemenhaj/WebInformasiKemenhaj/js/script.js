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

if (paketJudul && paketDeskripsi) {
  paketJudul.innerText =
    localStorage.getItem("namaPaket") || "Detail Paket";

  paketDeskripsi.innerText =
    localStorage.getItem("deskripsiPaket") || "-";
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



