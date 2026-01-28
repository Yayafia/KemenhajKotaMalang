/* ======================================================
   SCRIPT GLOBAL – DIGUNAKAN DI SEMUA HALAMAN
====================================================== */


/* ======================================================
   BERITA TERKINI (INDEX)
   - Klik berita → langsung ke detailberita.html
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
const modalImage = document.getElementById("modalImage");

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
const detailImage = document.getElementById("detailImage");

if (detailJudul && detailIsi && detailImage) {
  detailJudul.innerText =
    localStorage.getItem("judulBerita") || "Judul Berita";

  detailIsi.innerText =
    localStorage.getItem("isiBerita") || "Konten berita belum tersedia.";

  detailImage.src =
    localStorage.getItem("gambarBerita") || "assets/images/default.jpg";
}

