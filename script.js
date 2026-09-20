// ======================================
// KERANJANG
// ======================================

let keranjang = [];
let pesananTerakhir = null;
let sudahDisimpan = false;


// ======================================
// SCROLL KE MENU
// ======================================

function scrollToMenu() {

    const menu = document.getElementById("menu");

    menu.scrollIntoView({
        behavior: "smooth"
    });

}


// ======================================
// SCROLL KE KERANJANG
// ======================================

function scrollToCart() {

    const cart = document.getElementById("cart");

    cart.scrollIntoView({
        behavior: "smooth"
    });

}


// ======================================
// SCROLL KE KATEGORI
// ======================================

function scrollToCategory(id) {

    const category = document.getElementById(id);

    category.scrollIntoView({
        behavior: "smooth"
    });

}


// ======================================
// TAMBAH BARANG
// ======================================

function tambahKeranjang(nama, harga) {

    const barangAda = keranjang.find(
        barang => barang.nama === nama
    );


    if (barangAda) {

        barangAda.jumlah++;

    } else {

        keranjang.push({
            nama: nama,
            harga: harga,
            jumlah: 1
        });

    }


    tampilkanKeranjang();

}


// ======================================
// TAMPILKAN KERANJANG
// ======================================

function tampilkanKeranjang() {

    const cartItems =
        document.getElementById("cart-items");

    const cartCount =
        document.getElementById("cart-count");

    const cartTotal =
        document.getElementById("cart-total");


    // Kalau kosong
    if (keranjang.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Keranjang kamu masih kosong 🥺
            </p>
        `;

        cartCount.textContent = "0";

        cartTotal.textContent = "Rp0";

        return;
    }


    cartItems.innerHTML = "";


    let total = 0;

    let jumlahBarang = 0;


    // Menampilkan barang
    keranjang.forEach((barang, index) => {

        const subtotal =
            barang.harga * barang.jumlah;


        total += subtotal;

        jumlahBarang += barang.jumlah;


        const item =
            document.createElement("div");


        item.className = "cart-item";


        item.innerHTML = `

            <div class="cart-info">

                <strong>
                    ${barang.nama}
                </strong>

                <small>
                    ${formatRupiah(barang.harga)}
                    / item
                </small>

            </div>


            <div class="quantity">

                <button
                    onclick="kurangiBarang(${index})">

                    −

                </button>


                <span>
                    ${barang.jumlah}
                </span>


                <button
                    onclick="tambahJumlah(${index})">

                    +

                </button>

            </div>


            <strong class="subtotal">

                ${formatRupiah(subtotal)}

            </strong>

        `;


        cartItems.appendChild(item);

    });


    // Jumlah barang navbar
    cartCount.textContent = jumlahBarang;


    // Total harga
    cartTotal.textContent =
        formatRupiah(total);

}


// ======================================
// TAMBAH JUMLAH
// ======================================

function tambahJumlah(index) {

    keranjang[index].jumlah++;

    tampilkanKeranjang();

}


// ======================================
// KURANGI JUMLAH
// ======================================

function kurangiBarang(index) {

    keranjang[index].jumlah--;


    if (keranjang[index].jumlah <= 0) {

        keranjang.splice(index, 1);

    }


    tampilkanKeranjang();

}


// ======================================
// FORMAT RUPIAH
// ======================================

function formatRupiah(angka) {

    return "Rp" +
        angka.toLocaleString("id-ID");

}


// ==========================================
// CHECKOUT
// ==========================================

function checkout() {

    // Kalau keranjang kosong
    if (keranjang.length === 0) {
        alert("Keranjang kamu masih kosong 🤎");
        return;
    }

    // Tampilkan checkout
    const checkoutSection = document.getElementById("checkout-section");

    checkoutSection.style.display = "block";

    // Sembunyikan struk kalau sebelumnya ada
    document.getElementById("receipt-section").style.display = "none";

    // Tampilkan isi checkout
    tampilkanCheckout();

    // Scroll ke checkout
    checkoutSection.scrollIntoView({
        behavior: "smooth"
    });
}



// ==========================================
// BUAT BUKTI PESANAN
// ==========================================

function buatBuktiPesanan(event) {

    event.preventDefault();

    // Ambil data
    const nama = document.getElementById("nama").value;

    const jenisPesanan = document.querySelector(
        'input[name="jenisPesanan"]:checked'
    ).value;

    const pembayaran = document.querySelector(
        'input[name="pembayaran"]:checked'
    ).value;

    const catatan = document.getElementById("catatan").value;

    // Nomor pesanan
    const nomorPesanan = "DSC-" + Date.now().toString().slice(-5);

    // Tanggal
    const sekarang = new Date();

    const tanggal = sekarang.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    // Masukkan informasi ke struk
    document.getElementById("receipt-number").textContent = nomorPesanan;

    document.getElementById("receipt-date").textContent = tanggal;

    document.getElementById("receipt-name").textContent = nama;

    document.getElementById("receipt-type").textContent = jenisPesanan;

    document.getElementById("receipt-payment").textContent = pembayaran;


    // Catatan
    const noteContainer = document.getElementById(
        "receipt-note-container"
    );

    if (catatan.trim() !== "") {

        document.getElementById("receipt-note").textContent = catatan;

        noteContainer.style.display = "block";

    } else {

        noteContainer.style.display = "none";

    }


    // Tampilkan item di struk
    const receiptItems = document.getElementById("receipt-items");

    receiptItems.innerHTML = "";

    let total = 0;

    keranjang.forEach((barang) => {

        const subtotal = barang.harga * barang.jumlah;

        total += subtotal;

        receiptItems.innerHTML += `
            <div class="receipt-item">

                <div>
                    <strong>${barang.nama}</strong>

                    <small>
                        ${barang.jumlah} × ${formatRupiah(barang.harga)}
                    </small>
                </div>

                <strong>
                    ${formatRupiah(subtotal)}
                </strong>

            </div>
        `;
    });


    // Total
    document.getElementById("receipt-total").textContent =
        formatRupiah(total);

        // Simpan data pesanan terakhir
    const detailPesanan = keranjang
        .map(barang => `${barang.nama} x${barang.jumlah}`)
        .join(" | ");

    pesananTerakhir = {
        nomorPesanan: nomorPesanan,
        nama: nama,
        pesanan: detailPesanan,
        jenisPesanan: jenisPesanan,
        pembayaran: pembayaran,
        total: total,
        catatan: catatan
    };

    sudahDisimpan = false;


    document.getElementById("checkout-section").style.display = "none";

if (pembayaran === "QRIS") {

    // Hitung total
    let total = 0;

    keranjang.forEach((barang) => {
        total += barang.harga * barang.jumlah;
    });

    // Masukkan total ke popup QRIS
    document.getElementById("qris-total").textContent = formatRupiah(total);

    // Tampilkan QRIS
    const qrisSection = document.getElementById("qris-section");

    qrisSection.style.display = "flex";

} else {

    // Kalau CASH langsung tampilkan struk
    const receiptSection = document.getElementById("receipt-section");

    receiptSection.style.display = "flex";

    receiptSection.scrollIntoView({
        behavior: "smooth"
    });
}

}


function pembayaranSelesai() {

    // Tutup popup QRIS
    document.getElementById("qris-section").style.display = "none";

    // Tampilkan struk
    const receiptSection = document.getElementById("receipt-section");

    receiptSection.style.display = "flex";

    receiptSection.scrollIntoView({
        behavior: "smooth"
    });
}


// ==========================================
// KEMBALI KE KERANJANG
// ==========================================

function kembaliKeKeranjang() {

    document.getElementById("checkout-section").style.display =
        "none";

    document.getElementById("receipt-section").style.display =
        "none";

    document.getElementById("cart").scrollIntoView({
        behavior: "smooth"
    });
}


// ==========================================
// KEMBALI KE MENU
// ==========================================

function kembaliKeMenu() {

    document.getElementById("receipt-section").style.display =
        "none";

    document.getElementById("checkout-section").style.display =
        "none";

    // Kosongkan form
    document.getElementById("checkout-form").reset();

    // Kosongkan keranjang
    keranjang = [];

    tampilkanKeranjang();

    // Kembali ke menu
    document.getElementById("menu").scrollIntoView({
        behavior: "smooth"
    });
}


// ======================================
// TAMPILKAN PESANAN DI CHECKOUT
// ======================================

function tampilkanCheckout() {

    const checkoutItems =
        document.getElementById(
            "checkout-items"
        );


    const checkoutTotal =
        document.getElementById(
            "checkout-total"
        );


    checkoutItems.innerHTML = "";


    let total = 0;


    keranjang.forEach((barang) => {

        const subtotal =
            barang.harga * barang.jumlah;


        total += subtotal;


        const item =
            document.createElement("div");


        item.className =
            "checkout-item";


        item.innerHTML = `

            <div>

                <strong>
                    ${barang.nama}
                </strong>

                <small>
                    ${barang.jumlah} ×
                    ${formatRupiah(barang.harga)}
                </small>

            </div>


            <strong>
                ${formatRupiah(subtotal)}
            </strong>

        `;


        checkoutItems.appendChild(item);

    });


    checkoutTotal.textContent =
        formatRupiah(total);

}



function scrollToHome() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function kirimKeWhatsApp() {

    const nomorWhatsApp = "6281281010218";

    // Pastikan data pesanan ada
    if (!pesananTerakhir) {
        alert("Data pesanan tidak ditemukan 🤎");
        return;
    }

    // Buat isi pesan
    let pesan = "";

    pesan += "Halo, saya ingin mengirim bukti pesanan dari Dimsum & Cheese Co.\n\n";

    pesan += "🧀 *BUKTI PESANAN*\n";
    pesan += `No. Pesanan: ${pesananTerakhir.nomorPesanan}\n`;
    pesan += `Tanggal: ${document.getElementById("receipt-date").textContent}\n`;
    pesan += `Nama: ${pesananTerakhir.nama}\n`;
    pesan += `Jenis: ${pesananTerakhir.jenisPesanan}\n`;
    pesan += `Pembayaran: ${pesananTerakhir.pembayaran}\n\n`;

    pesan += "*Pesanan:*\n";

    keranjang.forEach((barang) => {

        const subtotal =
            barang.harga * barang.jumlah;

        pesan += `- ${barang.nama} x${barang.jumlah} = ${formatRupiah(subtotal)}\n`;
    });

    pesan += `\n*Total: ${formatRupiah(pesananTerakhir.total)}*\n`;

    if (pesananTerakhir.catatan.trim() !== "") {
        pesan += `Catatan: ${pesananTerakhir.catatan}\n`;
    }

    pesan += "\nTerima kasih 🤎";

    // Encode pesan supaya aman untuk URL WhatsApp
    const pesanEncoded = encodeURIComponent(pesan);

    const urlWhatsApp =
        `https://wa.me/${nomorWhatsApp}?text=${pesanEncoded}`;

    // Buka WhatsApp
    window.open(urlWhatsApp, "_blank");

    // Tutup popup struk
    document.getElementById("receipt-section").style.display = "none";

    // Kosongkan keranjang
    keranjang = [];

    // Reset data pesanan
    pesananTerakhir = null;
    sudahDisimpan = false;

    // Update keranjang
    tampilkanKeranjang();

    // Kembali ke atas website
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
