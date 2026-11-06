// ===== Data layanan =====
const services = {
  sampah: {
    icon: "🚛",
    title: "Armada Sampah",
    desc: "Layanan pengangkutan sampah rumah tangga secara rutin agar lingkungan desa bersih dan nyaman.",
    list: ["Pengangkutan terjadwal tiap hari rabu dan sabtu", "Iuran bulanan terjangkau", "Armada dan petugas dari warga desa"]
  },
  pam: {
    icon: "💧",
    title: "PAM Desa",
    desc: "Penyediaan air bersih untuk rumah tangga dengan sistem pemasangan dan tagihan yang tertib.",
    list: ["Pemasangan sambungan baru", "Tarif sesuai pemakaian", "Layanan pengaduan gangguan air"]
  },
  ppob: {
    icon: "📲",
    title: "PPOB",
    desc: "Pusat pembayaran online di desa, tanpa perlu pergi jauh ke kota.",
    list: ["Token listrik dan tagihan PLN", "Pulsa dan paket data", "BPJS, PDAM", "Pajak kendaraan bermotor (E-samsat)"]
  },
  peternakan: {
    icon: "🐄",
    title: "Peternakan",
    desc: "Unit usaha ternak milik desa yang mengelola pembibitan, penggemukan, dan pemasaran.",
    list: ["Penjualan hewan ternak", "Pembinaan peternak warga", "Kerja sama pemasaran hasil ternak"]
  },
  pertanian: {
    icon: "🌾",
    title: "Pertanian",
    desc: "Ketahanan Pangan.",
    list: ["Melakukan penanaman sayuran/ubi", "Perawatan lahan pertanian", "Pendampingan panen sayuran"]
  }
};



// ===== Elemen =====
const navbar = document.getElementById("navbar");
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
const progress = document.getElementById("scrollProgress");
const modal = document.getElementById("modal");

// ===== Navbar & scroll progress =====
function onScroll() {
  navbar.classList.toggle("scrolled", window.scrollY > 30);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";

  // highlight menu aktif
  let current = "beranda";
  document.querySelectorAll("main section[id]").forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navLinks.querySelectorAll("a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + current);
  });
}
window.addEventListener("scroll", onScroll);
onScroll();

// ===== Menu mobile =====
burger.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ===== Reveal on scroll =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 0.08 + "s";
  revealObserver.observe(el);
});

// ===== Counter animasi =====
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || "";
      const duration = 1500;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString("id-ID") + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll(".counter").forEach((c) => counterObserver.observe(c));

// ===== Modal layanan =====
function openModal(key) {
  const s = services[key];
  if (!s) return;

  // Jika kamu mau pakai gambar sebagai ikon (seperti pertanian.png), 
  // ganti textContent menjadi innerHTML, tapi pastikan yang dikirim dari objek services adalah tag <img>
  document.getElementById("mIcon").textContent = s.icon;
  document.getElementById("mTitle").textContent = s.title;
  document.getElementById("mDesc").textContent = s.desc;
  document.getElementById("mList").innerHTML = s.list.map((i) => `<li>${i}</li>`).join("");
  modal.dataset.service = s.title;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
document.querySelectorAll(".service-card[data-service]").forEach((card) =>
  card.addEventListener("click", () => openModal(card.dataset.service))
);
document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
document.getElementById("mCta").addEventListener("click", () => {
  const select = document.getElementById("layananPilih");
  [...select.options].forEach((o) => { if (o.text === modal.dataset.service) select.value = o.text; });
  closeModal();
});

// ===== Form -> Email (Langsung ke Web Gmail) =====
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const layanan = document.getElementById("layananPilih").value;
  const pesan = document.getElementById("pesan").value.trim();

  // Email tujuan
  const emailTujuan = "bumdesaamanahsembawa@gmail.com";

  // Format subject dan isi pesan
  const subject = encodeURIComponent(`Pesan Layanan dari: ${nama} - ${layanan}`);
  const body = encodeURIComponent(`Nama Lengkap: ${nama}\nLayanan yang Dipilih: ${layanan}\n\nPesan:\n${pesan}`);

  // Link khusus untuk langsung membuka halaman "Compose" (Tulis Pesan) di Gmail
  const gmailWebLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailTujuan}&su=${subject}&body=${body}`;

  // Buka halaman web Gmail di tab browser baru
  window.open(gmailWebLink, '_blank');
});