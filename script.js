/* script.js */

document.addEventListener('DOMContentLoaded', () => {
    // ... kode yang lain tetap ada (reveal gambar, dll) ...

    const sound = document.getElementById('audioDino');
    const btn1 = document.getElementById('btnDino1');
    const btn2 = document.getElementById('btnDino2');
    const statusText = document.getElementById('statusAudio');

    function mngaum(e) {
        // Mencegah link tidak sengaja (jika ada)
        if(e) e.preventDefault();

        // 1. Mainkan Suara
        sound.currentTime = 0;
        const playPromise = sound.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("Suara berhasil diputar");
            }).catch(error => {
                console.error("Gagal putar suara: ", error);
                statusText.innerText = "Klik sekali lagi untuk aktivasi suara browser!";
            });
        }

        // 2. Efek Visual
        const target = e.currentTarget;
        target.classList.add('active');
        setTimeout(() => {
            target.classList.remove('active');
            statusText.innerText = "";
        }, 1000);
    }

    // Pasang event listener jika tombol ada di halaman tersebut
    if (btn1 && btn2) {
        btn1.addEventListener('click', mngaum);
        btn2.addEventListener('click', mngaum);
        
        // Tambahan untuk mobile agar lebih responsif
        btn1.addEventListener('touchstart', () => {}, {passive: true});
        btn2.addEventListener('touchstart', () => {}, {passive: true});
    }
    
    // 1. Logika Gambar Berubah Warna
    const images = document.querySelectorAll('.interactive-img');
    
    images.forEach(img => {
        img.addEventListener('click', () => {
            // Toggle kelas 'reveal' untuk mengubah grayscale jadi warna
            img.classList.toggle('reveal');
        });
    });

    const playBtn = document.getElementById('playBtn','albumcover');
    if (playBtn) {
        const music = new Audio("assets/sekarang.mp3");
        let isPlaying = false;

        playBtn.addEventListener('click', () => {
            if (!isPlaying) {
                music.play();
                playBtn.textContent = "❚❚";
            } else {
                music.pause();
                playBtn.textContent = "▶";
            }
            isPlaying = !isPlaying;
        });
    }
});

    /* --- LOGIKA GAME SUIT --- */
    let skorAku = 0;
    let skorKamu = 0;

    function mainSuit(pilihanAku) {
        const pilihanLawan = acakLawan();
        const elemenHasil = document.getElementById('hasilSuit');
    
        // Update tampilan icon
        document.getElementById('tanganAku').innerText = iconSuit(pilihanAku);
        document.getElementById('tanganLawan').innerText = iconSuit(pilihanLawan);

        // Tentukan Pemenang
        if (pilihanAku === pilihanLawan) {
            elemenHasil.innerText = "CIEE Sama. Sehati kita nih!";
            elemenHasil.style.color = 'var(--text-ink)';
        } else if (
            (pilihanAku === 'batu' && pilihanLawan === 'gunting') ||
            (pilihanAku === 'gunting' && pilihanLawan === 'kertas') ||
            (pilihanAku === 'kertas' && pilihanLawan === 'batu')
        ) {
            skorAku++;
            elemenHasil.innerText = "KAMU MENANGGG..";
            elemenHasil.style.color = 'green';
        } else {
            skorKamu++;
            elemenHasil.innerText = "Aku menanggg wleee..";
            elemenHasil.style.color = 'var(--accent)'; // Merah
        }

        // Update Skor di papan
        document.getElementById('skorAku').innerText = skorAku;
        document.getElementById('skorKamu').innerText = skorKamu;
    }

    function acakLawan() {
        const opsi = ['batu', 'gunting', 'kertas'];
        const acak = Math.floor(Math.random() * 3);
        return opsi[acak];
    }

    function iconSuit(nama) {
        if (nama === 'batu') return '✊';
        if (nama === 'gunting') return '✌️';
        if (nama === 'kertas') return '✋';
        return '❓';
        }
    /* --- LOGIKA TAMBAHAN GAME --- */

// 1. GANTI TAB
function gantiGame(gameId, tabElement) {
    document.querySelectorAll('.game-content').forEach(g => g.style.display = 'none');
    document.getElementById('game-' + gameId).style.display = 'block';
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    tabElement.classList.add('active');
    
    if(gameId === 'cari') resetWordSearch(); // Init grid saat tab dibuka
}

let selectedWord = "";
let shuffledTargets = [];
let currentIndex = 0;

const targets = [
    {
        word: "BANI",
        question: "Coba cari nama pasangan kamu siapa ay",
        message: "Ahahaha BENERRR, klo salah kebangetan wkwk"
    },
    {
        word: "AIDA",
        question: "Siapa yang lagi ulang tahun?",
        message: "CIEEEE Ulang Tahun nih, HBD Sayang!!"
    },
    {
        word: "CINTA",
        question: "Di hubungan membutuhkan yang namanya?",
        message: "AHHH MASAAAAA!!!!"
    },
];

function openWordSearch() {
    document.getElementById("game-cari").style.display = "block";
    startWordSearchGame();
}
// 🔀 shuffle helper
function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// ▶ mulai game (acak SEKALI)
function startWordSearchGame() {
    shuffledTargets = shuffleArray([...targets]);
    currentIndex = 0;
    resetWordSearch();
}

// 🔁 reset grid / lanjut soal
function resetWordSearch() {
    const grid = document.getElementById("wordSearchGrid");
    const msg = document.getElementById("wordMsg");
    const instruction = document.getElementById("wordInstruction");

    grid.innerHTML = "";
    msg.innerText = "";
    selectedWord = "";

    const target = shuffledTargets[currentIndex];
    if (!target) return;

    instruction.innerHTML = `<b>${target.question}</b>`;

    // 5x4 = 20 huruf
    const letters = [
        ...target.word.split(""),
        "X","Y","Z","L","O","V","E","M","N","P","Q","R","S","T","A","I"
    ].slice(0, 20);

    shuffleArray(letters);

    letters.forEach(char => {
        const div = document.createElement("div");
        div.className = "letter-box";
        div.innerText = char;

        div.onclick = function () {
            if (this.classList.contains("found")) return;

            this.classList.add("found");
            selectedWord += this.innerText;

            if (!target.word.startsWith(selectedWord)) {
                msg.innerText = "HAYOOOOOO";
                resetSelection();
                return;
            }

            if (selectedWord === target.word) {
                msg.innerText = target.message;
                currentIndex++;

                if (currentIndex < shuffledTargets.length) {
                    setTimeout(resetWordSearch, 1200);
                } else {
                    instruction.innerHTML = "<b>HEHE DAH 3 DOANG. SELAMATTT!!!</b>";
                }
            }
        };

        grid.appendChild(div);
    });
}

function resetSelection() {
    selectedWord = "";
    document
        .querySelectorAll(".letter-box.found")
        .forEach(el => el.classList.remove("found"));
}


// 3. LOGIKA TEBAK ANGKA
let angkaRahasia = Math.floor(Math.random() * 20) + 1;
function cekTebakan() {
    const input = document.getElementById('inputAngka').value;
    const msg = document.getElementById('msgTebak');
    
    if(input == angkaRahasia) {
        msg.innerText = "CIEEE TAUUUU ISI PIKIRAN AKU!!";
        msg.style.color = "green";
        angkaRahasia = Math.floor(Math.random() * 20) + 1; // Reset angka
    } else if (input < angkaRahasia) {
        msg.innerText = "Kekecilan ay..";
        msg.style.color = "var(--accent)";
    } else {
        msg.innerText = "Kegedean ay..";
        msg.style.color = "var(--accent)";
    }
}

