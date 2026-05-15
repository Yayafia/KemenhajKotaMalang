/* ======================================================
   SCRIPT GLOBAL – CLEAN & SIDEBAR FIX
======================================================*/

/* ===============================
   STORAGE
=============================== */
let beritaList = JSON.parse(localStorage.getItem("dataBeritaKemenhaj")) || [];
let sambutanData = JSON.parse(localStorage.getItem("sambutanData")) || null;
// ✅ mode edit berita
let editIndex = null;

// KEY untuk slider
const STORAGE_SLIDER = "heroSliderImages";

// Default slider images
const defaultSliderImages = [
    "assets/images/hero-default-1.jpg",
    "assets/images/hero-default-2.jpg", 
    "assets/images/hero-default-3.jpg"
];

/* ===============================
   DOM READY (SATU SAJA!)
=============================== */
document.addEventListener("DOMContentLoaded", function () {

    const jenis = document.getElementById("inputJenis");
    const posisi = document.getElementById("inputPosisi");
    const yt = document.getElementById("inputYoutube");

    function cekYoutube() {
        if (jenis.value === "terkini" && posisi.value === "1") {
            yt.disabled = false;

            // 🔥 TAMBAHAN: NONAKTIFKAN INPUT LAIN
            document.getElementById("inputIsi").disabled = true;
            document.getElementById("inputFoto").disabled = true;

        } else {
            yt.disabled = true;
            yt.value = "";

            // 🔥 TAMBAHAN: AKTIFKAN KEMBALI
            document.getElementById("inputIsi").disabled = false;
            document.getElementById("inputFoto").disabled = false;
        }
    }

    if (jenis && posisi && yt) {
        jenis.addEventListener("change", cekYoutube);
        posisi.addEventListener("change", cekYoutube);

        // 🔥 TAMBAHAN: langsung cek saat pertama load
        cekYoutube();
    }

});

    /* ======================================================
       SIDEBAR ADMIN NAVIGATION
    ====================================================== */
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".admin-section");
    const title = document.getElementById("admin-title");

    navItems.forEach(item => {
        item.addEventListener("click", function (e) {
            const target = this.getAttribute("data-target");

            // kalau logout tidak punya data-target
            if (!target) return;

            e.preventDefault();

            // hapus active semua
            navItems.forEach(nav => nav.classList.remove("active"));

            // aktifkan yg diklik
            this.classList.add("active");

            // sembunyikan semua section
            sections.forEach(sec => sec.classList.remove("active"));

            // tampilkan section sesuai target
            const activeSection = document.getElementById("section-" + target);

            if (activeSection) {
                activeSection.classList.add("active");

                // Jika section yang aktif adalah berita, render slider list
                if (target === "news") {
                    renderSliderList();
                }
            }

            // ubah judul header
            if (title) {
                switch (target) {
                    case "dash":
                        title.innerText = "Ringkasan Statistik";
                        break;
                    case "news":
                        title.innerText = "Kelola Berita";
                        break;
                    case "reg":
                        title.innerText = "Kelola Paket";
                        break;
                    case "msg":
                        title.innerText = "Kelola Informasi";
                        break;
                }
            }
        });
    });

    /* ===============================
       INIT DASHBOARD
    =============================== */
    updateDashboardStats();
    renderBeritaTable();
    loadBeritaIndex();
    
    // Render sambutan di tabel admin
    renderSambutanTable();

    // Init slider (pastikan localStorage punya default)
    initSliderStorage();


/* ===============================
   INIT SLIDER STORAGE
=============================== */
function initSliderStorage() {
    let sliderImages = JSON.parse(localStorage.getItem(STORAGE_SLIDER));
    if (!sliderImages || sliderImages.length === 0) {
        localStorage.setItem(STORAGE_SLIDER, JSON.stringify(defaultSliderImages));
    }
}

/* ===============================
   UPDATE DASHBOARD
=============================== */
function updateDashboardStats() {
    const totalBerita = document.getElementById("totalBerita");
    if (totalBerita) totalBerita.innerText = beritaList.length;
}

/* ===============================
   MODAL CONTROL
=============================== */
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("show");
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("show");
}

window.addEventListener("click", function (e) {
    document.querySelectorAll(".modal").forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove("show");
        }
    });
});

/* ===============================
   RENDER TABLE BERITA (ADMIN)
=============================== */
function renderBeritaTable() {
    const table = document.getElementById("tableBerita");
    if (!table) return;

    table.innerHTML = "";

    beritaList.forEach((item, index) => {
        table.innerHTML += `
        <tr>
            <td>
                <img src="${item.gambar}" width="60" height="60" style="object-fit:cover; border-radius:5px;">
            </td>
            <td>${item.judul}</td>
            <td>${item.jenis}</td>
            <td>${item.isi.substring(0, 50)}...</td>
            <td>
                <button class="btn-edit" onclick="editBerita(${index})">Edit</button>
                <button class="btn-delete" onclick="hapusBerita(${index})">Hapus</button>
            </td>
        </tr>`;
    });
}

/* ===============================
   EDIT BERITA
=============================== */
function editBerita(index) {
    const data = beritaList[index];

    document.getElementById("inputJudul").value = data.judul;
    document.getElementById("inputIsi").value = data.isi;
    document.getElementById("inputJenis").value = data.jenis;
    document.getElementById("inputPosisi").value = data.posisi || "";
    document.getElementById("inputYoutube").value = data.youtube || "";

    editIndex = index;

    openModal("adminModal");
}

/* ===============================
   HAPUS BERITA
=============================== */
function hapusBerita(index) {
    if (!confirm("Hapus berita?")) return;

    beritaList.splice(index, 1);

    localStorage.setItem("dataBeritaKemenhaj", JSON.stringify(beritaList));

    renderBeritaTable();
    updateDashboardStats();
}

/* ===============================
   LOAD BERITA KE INDEX
=============================== */
function loadBeritaIndex() {
    const highlight = document.getElementById("newsHighlight");
    const lainnya = document.getElementById("beritaGrid");

    if (highlight) {
        const terkini = beritaList.find(x => x.jenis == "terkini");

        if (terkini) {

            // 🔥 JIKA ADA VIDEO
            if (terkini.youtube && terkini.youtube !== "") {

                // convert youtube ke embed
                let videoURL = terkini.youtube.replace("watch?v=", "embed/");

                highlight.innerHTML = `
                    <iframe 
                        src="${videoURL}?autoplay=1&mute=1&loop=1&playlist=${videoURL.split('/').pop()}" 
                        frameborder="0"
                        allow="autoplay; encrypted-media"
                        allowfullscreen
                        style="width:100%; height:100%; border-radius:16px;">
                    </iframe>

                    <div class="news-overlay">
                        <span>${terkini.kategori || "Berita"}</span>
                        <h3>${terkini.judul}</h3>
                    </div>
                `;

            } else {

                // 🔥 fallback ke gambar
                highlight.innerHTML = `
                    <img src="${terkini.gambar}">
                    <div class="news-overlay">
                        <span>${terkini.kategori}</span>
                        <h3>${terkini.judul}</h3>
                    </div>
                `;
            }
        }
    }

    if (lainnya) {
        lainnya.innerHTML = "";
        beritaList
            .filter(x => x.jenis == "lainnya")
            .forEach(item => {
                lainnya.innerHTML += `
                    <div class="berita-card">
                        <img src="${item.gambar}">
                        <h3>${item.judul}</h3>
                        <p>${item.tanggal}</p>
                    </div>
                `;
            });
    }
}

/* ======================================================
   SAMBUTAN MODAL CONTROL
====================================================== */

// buka popup sambutan
function openSambutanModal() {
    // Kosongkan form dulu
    document.getElementById("sambutanNama").value = "";
    document.getElementById("sambutanIsi").value = "";
    document.getElementById("sambutanVisi").value = "";
    document.getElementById("sambutanMisi").value = "";
    document.getElementById("sambutanFotoInput").value = "";
    
    document.getElementById("sambutanModal").classList.add("show");
}

// tutup popup sambutan
function closeSambutanModal() {
    document.getElementById("sambutanModal").classList.remove("show");
}

/* ======================================================
   SAVE SAMBUTAN KE LOCAL STORAGE
====================================================== */
function saveSambutan() {
    const nama = document.getElementById("sambutanNama").value;
    const isi = document.getElementById("sambutanIsi").value;
    const visi = document.getElementById("sambutanVisi").value;
    const misiInput = document.getElementById("sambutanMisi").value;
    const file = document.getElementById("sambutanFotoInput").files[0];

    // Validasi
    if (!nama || !isi || !visi) {
        alert("Nama, Sambutan, dan Visi harus diisi!");
        return;
    }

    // Split by new line dan filter yang kosong
    const misi = misiInput.split("\n").filter(line => line.trim() !== "");

    function simpan(fotoBase64) {
        const data = {
            nama: nama,
            isi: isi,
            visi: visi,
            misi: misi,
            foto: fotoBase64
        };

        // Simpan ke localStorage
        localStorage.setItem("sambutanData", JSON.stringify(data));
        
        // Update tabel
        renderSambutanTable();
        
        // Tutup modal
        closeSambutanModal();
        
        alert("Sambutan berhasil disimpan!");
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = e => simpan(e.target.result);
        reader.readAsDataURL(file);
    } else {
        // Jika tidak ada file, pakai logo default
        simpan("images/logo-kemenhaj.png");
    }
}

/* ======================================================
   TAMPILKAN SAMBUTAN DI TABLE ADMIN
====================================================== */
function renderSambutanTable() {
    const tbody = document.querySelector("#sambutanTable tbody");
    if (!tbody) return;

    const data = JSON.parse(localStorage.getItem("sambutanData"));

    tbody.innerHTML = "";

    if (!data) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Belum ada data sambutan</td></tr>`;
        return;
    }

    // Tampilkan misi dengan format yang benar
    let misiText = '';
    if (data.misi && data.misi.length > 0) {
        misiText = data.misi.length + ' misi';
    } else {
        misiText = '-';
    }

    tbody.innerHTML = `
        <tr>
            <td>
                <img src="${data.foto}" width="60" height="60" style="object-fit:cover; border-radius:5px;">
            </td>
            <td>${data.nama}</td>
            <td>${data.isi.substring(0, 50)}...</td>
            <td>${data.visi.substring(0, 50)}...</td>
            <td>${misiText}</td>
            <td>
                <button class="btn-edit" onclick="editSambutan()">Edit</button>
                <button class="btn-delete" onclick="hapusSambutan()">Hapus</button>
            </td>
        </tr>
    `;
}

/* ======================================================
   HAPUS SAMBUTAN
====================================================== */
function hapusSambutan() {
    if (!confirm("Hapus sambutan?")) return;

    localStorage.removeItem("sambutanData");
    renderSambutanTable();
    alert("Sambutan berhasil dihapus!");
}

/* ======================================================
   EDIT SAMBUTAN
====================================================== */
function editSambutan() {
    const data = JSON.parse(localStorage.getItem("sambutanData"));

    if (!data) return;

    document.getElementById("sambutanNama").value = data.nama;
    document.getElementById("sambutanIsi").value = data.isi;
    document.getElementById("sambutanVisi").value = data.visi;
    document.getElementById("sambutanMisi").value = data.misi ? data.misi.join("\n") : "";

    openSambutanModal();
}

// ... (LANJUTAN DENGAN FUNGSI BERITA, SLIDER, DLL YANG SUDAH ADA)

/* ======================================================
   HANDLE FORM SUBMIT BERITA
====================================================== */

const form =
document.getElementById("mainForm");

if(form){

form.addEventListener("submit", function(e){

e.preventDefault();

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

// VALIDASI CERDAS
if (!judul) {
    alert("Judul wajib diisi");
    return;
}

// KHUSUS VIDEO (kotak 1)
if (jenis === "terkini" && posisi === "1") {

    if (!youtube) {
        alert("Link Youtube wajib diisi untuk Kotak 1");
        return;
    }

} else {

    // selain video → isi wajib
    if (!isi) {
        alert("Isi berita wajib diisi");
        return;
    }
}

function simpan(gambar){

const data = {
judul,
isi,
jenis,
posisi,
youtube,
gambar: (jenis === "terkini" && posisi === "1") ? "" : gambar,
tanggal: new Date().toLocaleDateString('id-ID')
};

if(editIndex !== null){
beritaList[editIndex] = data;
}else{
beritaList.unshift(data); // berita terbaru di atas
}

localStorage.setItem(
"dataBeritaKemenhaj",
JSON.stringify(beritaList)
);

renderBeritaTable();

closeModal("adminModal");
document.getElementById("mainForm").reset();
editIndex = null;

alert("Berita berhasil disimpan!");

}

if(file){

const reader = new FileReader();

reader.onload =
e=>simpan(e.target.result);

reader.readAsDataURL(file);

}else{

simpan("assets/images/default.jpg");

}

});
}


/* ======================================================
   FUNGSI UNTUK SLIDER HERO - DENGAN URUTAN
====================================================== */

/* ======================================================
   FUNGSI UNTUK SLIDER HERO - DENGAN URUTAN
====================================================== */

// Buka modal slider
function openSliderModal() {
    const modal = document.getElementById("sliderModal");
    if (modal) {
        modal.classList.add("show");
    } else {
        alert("Modal slider tidak ditemukan!");
    }
}

// Tutup modal slider
function closeSliderModal() {
    const modal = document.getElementById("sliderModal");
    if (modal) {
        modal.classList.remove("show");
        document.getElementById("sliderForm").reset();
    }
}

// Render daftar gambar slider di admin
function renderSliderList() {
    const sliderList = document.getElementById("sliderList");
    if (!sliderList) return;
    
    let sliderImages = JSON.parse(localStorage.getItem(STORAGE_SLIDER));
    if (!sliderImages || sliderImages.length === 0) {
        sliderImages = defaultSliderImages;
        localStorage.setItem(STORAGE_SLIDER, JSON.stringify(sliderImages));
    }
    
    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">';
    
    sliderImages.forEach((img, index) => {
        html += `
            <div style="background: #fff; border-radius: 8px; padding: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <div style="position: relative;">
                    <img src="${img}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 5px;">
                    <span style="position: absolute; top: 5px; left: 5px; background: #c9a961; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">Slide ${index + 1}</span>
                </div>
                <div style="margin-top: 10px;">
                    <!-- Dropdown untuk mengubah urutan -->
                    <select class="slider-order-select" onchange="changeSliderOrder(${index}, this.value)" style="width: 100%; padding: 6px; margin-bottom: 8px; border-radius: 5px; border: 1px solid #ddd;">
                        <option value="1" ${index === 0 ? 'selected' : ''}>Slide 1 (Pertama)</option>
                        <option value="2" ${index === 1 ? 'selected' : ''}>Slide 2</option>
                        <option value="3" ${index === 2 ? 'selected' : ''}>Slide 3</option>
                        <option value="4" ${index === 3 ? 'selected' : ''}>Slide 4</option>
                        <option value="5" ${index === 4 ? 'selected' : ''}>Slide 5</option>
                    </select>
                    
                    <div style="display: flex; gap: 5px;">
                        <button class="btn-edit" style="flex: 1;" onclick="moveSliderUp(${index})" ${index === 0 ? 'disabled' : ''}>▲ Naik</button>
                        <button class="btn-edit" style="flex: 1;" onclick="moveSliderDown(${index})" ${index === sliderImages.length - 1 ? 'disabled' : ''}>▼ Turun</button>
                        <button class="btn-delete" style="flex: 1;" onclick="deleteSliderImage(${index})">Hapus</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    sliderList.innerHTML = html;
}

// Mengubah urutan slide melalui dropdown
function changeSliderOrder(currentIndex, newPosition) {
    let sliderImages = JSON.parse(localStorage.getItem(STORAGE_SLIDER)) || defaultSliderImages;
    
    // Konversi ke index (newPosition - 1 karena array mulai dari 0)
    const targetIndex = parseInt(newPosition) - 1;
    
    if (targetIndex === currentIndex) return; // Posisi sama, tidak perlu diubah
    if (targetIndex < 0 || targetIndex >= sliderImages.length) return; // Index tidak valid
    
    // Hapus gambar dari posisi saat ini
    const [image] = sliderImages.splice(currentIndex, 1);
    
    // Sisipkan di posisi baru
    sliderImages.splice(targetIndex, 0, image);
    
    localStorage.setItem(STORAGE_SLIDER, JSON.stringify(sliderImages));
    renderSliderList();
    
    // Update slider di index jika terbuka
    updateSliderFromAdmin();
}

// Pindahkan slide ke atas
function moveSliderUp(index) {
    if (index === 0) return;
    
    let sliderImages = JSON.parse(localStorage.getItem(STORAGE_SLIDER)) || defaultSliderImages;
    
    // Tukar dengan gambar di atasnya
    [sliderImages[index - 1], sliderImages[index]] = [sliderImages[index], sliderImages[index - 1]];
    
    localStorage.setItem(STORAGE_SLIDER, JSON.stringify(sliderImages));
    renderSliderList();
    
    // Update slider di index jika terbuka
    updateSliderFromAdmin();
}

// Pindahkan slide ke bawah
function moveSliderDown(index) {
    let sliderImages = JSON.parse(localStorage.getItem(STORAGE_SLIDER)) || defaultSliderImages;
    
    if (index === sliderImages.length - 1) return;
    
    // Tukar dengan gambar di bawahnya
    [sliderImages[index], sliderImages[index + 1]] = [sliderImages[index + 1], sliderImages[index]];
    
    localStorage.setItem(STORAGE_SLIDER, JSON.stringify(sliderImages));
    renderSliderList();
    
    // Update slider di index jika terbuka
    updateSliderFromAdmin();
}

// Hapus gambar slider
function deleteSliderImage(index) {
    let sliderImages = JSON.parse(localStorage.getItem(STORAGE_SLIDER)) || defaultSliderImages;
    
    if (sliderImages.length <= 1) {
        alert("Minimal harus ada 1 gambar di slider!");
        return;
    }
    
    if (confirm("Yakin ingin menghapus gambar ini?")) {
        sliderImages.splice(index, 1);
        localStorage.setItem(STORAGE_SLIDER, JSON.stringify(sliderImages));
        renderSliderList();
        
        // Update slider di index jika terbuka
        updateSliderFromAdmin();
        alert("Gambar berhasil dihapus!");
    }
}

// Update slider di halaman index
function updateSliderFromAdmin() {
    // Cek apakah window index terbuka (untuk iframe/popup)
    if (window.opener && !window.opener.closed) {
        if (typeof window.opener.updateSliderDOM === 'function') {
            window.opener.updateSliderDOM();
        }
    }
}

// Handle form submit slider
document.addEventListener("DOMContentLoaded", function() {
    const sliderForm = document.getElementById("sliderForm");
    if (sliderForm) {
        sliderForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const file = document.getElementById("sliderImageInput").files[0];
            const position = parseInt(document.getElementById("sliderPosition").value);
            
            if (!file) {
                alert("Pilih gambar terlebih dahulu!");
                return;
            }
            
            // Cek ukuran file (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran file maksimal 2MB!");
                return;
            }
            
            // Cek tipe file
            if (!file.type.match('image.*')) {
                alert("File harus berupa gambar!");
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                let sliderImages = JSON.parse(localStorage.getItem(STORAGE_SLIDER)) || defaultSliderImages;
                
                // Tambah gambar di posisi yang dipilih (position - 1 karena array mulai dari 0)
                const targetIndex = Math.min(position - 1, sliderImages.length);
                sliderImages.splice(targetIndex, 0, e.target.result);
                
                // Batasi maksimal 5 gambar
                if (sliderImages.length > 5) {
                    sliderImages = sliderImages.slice(0, 5);
                    alert("Maksimal 5 gambar, hanya 5 gambar pertama yang disimpan.");
                }
                
                localStorage.setItem(STORAGE_SLIDER, JSON.stringify(sliderImages));
                
                renderSliderList();
                closeSliderModal();
                
                // Update slider di index jika terbuka
                updateSliderFromAdmin();
                
                alert("Gambar berhasil ditambahkan!");
            };
            
            reader.readAsDataURL(file);
        });
    }
});



/* ======================================================
   KELOLA PAKET
====================================================== */

const STORAGE_PAKET = "dataPaketKemenhaj";

/* ===============================
   AMBIL DATA PAKET
=============================== */
function getAllPaket() {
    return JSON.parse(localStorage.getItem(STORAGE_PAKET)) || [];
}

/* ===============================
   SIMPAN DATA PAKET
=============================== */
function saveAllPaket(data) {
    localStorage.setItem(STORAGE_PAKET, JSON.stringify(data));
}

/* ===============================
   BUKA MODAL PAKET
=============================== */
function openModalPaket() {

    const modal =
        document.getElementById("paketModal");

    if (modal) {
        modal.classList.add("show");
    }
}

/* ===============================
   RENDER TABLE PAKET ADMIN
=============================== */
function renderPaketAdmin() {

    const table = document.getElementById("table-paket");

    if (!table) return;

    const data = getAllPaket();

    table.innerHTML = "";

    if (data.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    Belum ada paket
                </td>
            </tr>
        `;

        return;
    }

    data.forEach((item, index) => {

        table.innerHTML += `
            <tr>

                <td>
                    <img src="${item.gambar}"
                         style="
                         width:70px;
                         height:70px;
                         object-fit:cover;
                         border-radius:8px;">
                </td>

                <td>${item.judul}</td>

                <td>${item.jenis}</td>

                <td>Kotak ${item.posisi}</td>

                <td>
                    <button class="btn-delete"
                            onclick="hapusPaket(${index})">
                        Hapus
                    </button>
                </td>

            </tr>
        `;
    });

    updateStatPaket();
}

/* ===============================
   HAPUS PAKET
=============================== */
function hapusPaket(index) {

    if (!confirm("Hapus paket?")) return;

    let data = getAllPaket();

    data.splice(index, 1);

    saveAllPaket(data);

    renderPaketAdmin();
}

/* ===============================
   UPDATE TOTAL PAKET DASHBOARD
=============================== */
function updateStatPaket() {

    const stat = document.getElementById("stat-paket");

    if (!stat) return;

    stat.innerText = getAllPaket().length;
}

/* ===============================
   SUBMIT FORM PAKET
=============================== */
function submitPaketForm(e) {

    e.preventDefault();

    const judul =
        document.getElementById("paketJudul").value;

    const isi =
        document.getElementById("paketIsi").value;

    const jenis =
        document.getElementById("paketJenis").value;

    const posisi =
        document.getElementById("paketPosisi").value;

    const fasilitas =
        document.getElementById("paketFasilitas").value;

    const file =
        document.getElementById("paketFoto").files[0];

    // VALIDASI
    if (!judul || !isi || !jenis || !posisi) {

        alert("Lengkapi data paket!");

        return;
    }

    const simpanData = (gambar) => {

        let semuaPaket = getAllPaket();

        semuaPaket.push({

            judul: judul,
            isi: isi,
            jenis: jenis,
            posisi: posisi,
            fasilitas: fasilitas,

            gambar: gambar
        });

        saveAllPaket(semuaPaket);

        renderPaketAdmin();

        updateStatPaket();

        closeModal("paketModal");

        document.getElementById("formPaket").reset();

        alert("Paket berhasil ditambahkan!");
    };

    // UPLOAD GAMBAR
    if (file) {

        const reader = new FileReader();

        reader.onload = function(ev) {

            simpanData(ev.target.result);
        };

        reader.readAsDataURL(file);

    } else {

        simpanData("images/logo-kemenhaj.png");
    }
}

/* ===============================
   EVENT FORM PAKET
=============================== */

const formPaket =
    document.getElementById("formPaket");

if (formPaket) {

    formPaket.addEventListener(
        "submit",
        submitPaketForm
    );
}

/* ===============================
   INIT
=============================== */

renderPaketAdmin();

updateStatPaket();

/* ======================================================
   SIMPAN VIDEO PANDUAN
====================================================== */
function simpanVideoPanduan() {

    const videoHaji =
        document.getElementById("videoHaji").value;

    const videoUmrah =
        document.getElementById("videoUmrah").value;

    // Haji jadi array
    const arrHaji =
        videoHaji
        .split("\n")
        .filter(v => v.trim() !== "");

    localStorage.setItem(
        "videoPanduanHaji",
        JSON.stringify(arrHaji)
    );

    localStorage.setItem(
        "videoPanduanUmrah",
        videoUmrah
    );

    alert("Video panduan berhasil disimpan!");
}

/* ======================================================
   LOAD VIDEO KE INPUT ADMIN
====================================================== */
window.addEventListener("DOMContentLoaded", () => {

    const videoHaji =
        JSON.parse(
            localStorage.getItem("videoPanduanHaji")
        ) || [];

    const videoUmrah =
        localStorage.getItem("videoPanduanUmrah");

    if(document.getElementById("videoHaji")){
        document.getElementById("videoHaji").value =
            videoHaji.join("\n");
    }

    if(document.getElementById("videoUmrah")){
        document.getElementById("videoUmrah").value =
            videoUmrah || "";
    }

});


/* ======================================================
   LOAD PENGADUAN USER KE ADMIN
====================================================== */

function loadPengaduanAdmin() {

  const table =
    document.getElementById("table-messages");

  if (!table) return;

  const data =
    JSON.parse(localStorage.getItem("dataPengaduanJamaah")) || [];

  table.innerHTML = "";

  if (data.length === 0) {

    table.innerHTML = `
      <tr>
        <td colspan="3">Belum ada pengaduan.</td>
      </tr>
    `;

    return;
  }

  data.reverse().forEach(item => {

    table.innerHTML += `
      <tr>
        <td>${item.nama}</td>
        <td>${item.kategori}</td>
        <td>${item.pesan}</td>
      </tr>
    `;

  });
}

loadPengaduanAdmin();
/* ======================================================
   UPDATE TOTAL PESAN MASUK DASHBOARD
====================================================== */

function updateTotalPesan() {

    const totalPesan =
        document.getElementById("totalPesan");

    if (!totalPesan) return;

    const dataPengaduan =
        JSON.parse(
            localStorage.getItem("dataPengaduanJamaah")
        ) || [];

    totalPesan.innerText =
        dataPengaduan.length;
}

/* PANGGIL FUNCTION */
updateTotalPesan();