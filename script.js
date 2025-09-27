// script.js versi final dengan Delta E + Kotak Notifikasi
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resultDiv = document.getElementById('result');
const historyTable = document.getElementById('historyTable');
const cameraSelect = document.getElementById('cameraSelect');

let historyData = JSON.parse(localStorage.getItem('scanHistory')) || [];
let stream;

// Referensi warna TTI (ubah jika ingin kalibrasi lebih lanjut)
const references = [
  { name: 'Sangat Layak', rgb: { r: 75, g: 9, b: 12 }, price: 'Rp 20.000' },
  { name: 'Masih Layak', rgb: { r: 101, g: 7, b: 5 }, price: 'Rp 15.000' },
  { name: 'Tidak Layak', rgb: { r: 245, g: 197, b: 66 }, price: 'Rp 10.000' }
];

// Fungsi Delta E (jarak euclidean sederhana di ruang RGB)
function colorDistance(c1, c2) {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

// Mulai kamera
async function startCamera(facingMode) {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingMode }
    });
    video.srcObject = stream;
  } catch (err) {
    console.error('Gagal mengakses kamera:', err);
  }
}

// Event ubah kamera
cameraSelect.addEventListener('change', () => {
  startCamera(cameraSelect.value);
});

// Fungsi scan warna rata-rata (ROI: seluruh frame)
function scanColor() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < imageData.data.length; i += 4) {
    r += imageData.data[i];
    g += imageData.data[i + 1];
    b += imageData.data[i + 2];
  }
  let pixelCount = imageData.data.length / 4;
  r = Math.round(r / pixelCount);
  g = Math.round(g / pixelCount);
  b = Math.round(b / pixelCount);
  return { r, g, b };
}

// Evaluasi kualitas menggunakan Delta E
function evaluateQuality(rgb) {
  let bestMatch = references[0];
  let minDist = colorDistance(rgb, references[0].rgb);

  for (let i = 1; i < references.length; i++) {
    let dist = colorDistance(rgb, references[i].rgb);
    if (dist < minDist) {
      minDist = dist;
      bestMatch = references[i];
    }
  }
  return { quality: bestMatch.name, price: bestMatch.price };
}

// Tampilkan notifikasi kualitas sebagai kotak di dalam halaman
function showNotification(status) {
  // hapus notifikasi sebelumnya jika ada
  const old = resultDiv.querySelector('.notification');
  if (old) old.remove();

  const notif = document.createElement('div');
  notif.classList.add('notification');

  if (status === 'Sangat Layak') {
    notif.textContent = '✅ Produk masih sangat layak konsumsi!';
    notif.style.background = '#2ecc71';
  } else if (status === 'Masih Layak') {
    notif.textContent = '⚠️ Produk masih layak, sebaiknya segera dikonsumsi.';
    notif.style.background = '#f1c40f';
    notif.style.color = '#111';
  } else if (status === 'Tidak Layak') {
    notif.textContent = '❌ Produk tidak layak konsumsi, jangan digunakan!';
    notif.style.background = '#e74c3c';
  }

  notif.style.color = 'white';
  notif.style.padding = '15px';
  notif.style.borderRadius = '10px';
  notif.style.marginTop = '10px';
  notif.style.textAlign = 'center';
  notif.style.fontWeight = 'bold';
  notif.style.transition = 'opacity 0.5s ease';

  resultDiv.appendChild(notif);

  setTimeout(() => {
    notif.style.opacity = '0';
    setTimeout(() => notif.remove(), 500);
  }, 5000);
}

// Tombol scan
const scanBtn = document.getElementById('scanBtn');
scanBtn.addEventListener('click', () => {
  const rgb = scanColor();
  const { quality, price } = evaluateQuality(rgb);
  const time = new Date().toLocaleString();

  resultDiv.innerHTML = `RGB: (${rgb.r}, ${rgb.g}, ${rgb.b}) <br> Kualitas: ${quality} <br> Harga: ${price}`;

  historyData.push({ time, rgb, quality, price });
  localStorage.setItem('scanHistory', JSON.stringify(historyData));
  renderHistory();
  showNotification(quality);
});

// Render riwayat
function renderHistory() {
  historyTable.innerHTML = '';
  historyData.forEach(item => {
    const row = `<tr>
      <td>${item.time}</td>
      <td>(${item.rgb.r}, ${item.rgb.g}, ${item.rgb.b})</td>
      <td>${item.quality}</td>
      <td>${item.price}</td>
    </tr>`;
    historyTable.innerHTML += row;
  });
}

// Export CSV
const exportBtn = document.getElementById('exportBtn');
exportBtn.addEventListener('click', () => {
  let csvContent = "data:text/csv;charset=utf-8,Waktu,RGB,Kualitas,Harga\n";
  historyData.forEach(item => {
    csvContent += `${item.time},"(${item.rgb.r},${item.rgb.g},${item.rgb.b})",${item.quality},${item.price}\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "scan_history.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Jalankan awal
startCamera('environment');
renderHistory();
