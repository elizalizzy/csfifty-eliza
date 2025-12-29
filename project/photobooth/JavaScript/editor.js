// dom elements
const canvas = document.getElementById('finalCanvas'),
      ctx = canvas.getContext('2d'),
      downloadBtn = document.getElementById('downloadBtn'),
      homeLink = document.querySelector('.home-link'),
      resetBtn = document.getElementById('reset');

// canvas size (use the element's pixel dimensions so editor is smaller)
const WIDTH = canvas.width, HEIGHT = canvas.height;


// load photo
const finalImage = new Image(), dataURL = localStorage.getItem('photoStrip');
if (dataURL) {
  finalImage.src = dataURL;
  finalImage.onload = drawCanvas;
  localStorage.removeItem('photoStrip');
} else {
  // show a simple placeholder until a photo is available
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = '#6b5e62';
  ctx.font = '20px serif';
  ctx.textAlign = 'center';
  ctx.fillText('No photo available', WIDTH / 2, HEIGHT / 2);
}

// draw canvas (simplified: just show the captured photo)
function drawCanvas() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.drawImage(finalImage, 0, 0, WIDTH, HEIGHT);
}




// pointer position
function getPointerPos(e) {
  const rect = canvas.getBoundingClientRect(), scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
  const clientX = e.touches?.[0]?.clientX ?? e.clientX,
        clientY = e.touches?.[0]?.clientY ?? e.clientY;
  return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
}

// drag and drop



// reset (if present) — clears the canvas by reloading the last captured image
if (resetBtn) resetBtn.addEventListener('click', () => { if (finalImage.src) drawCanvas(); });

// download
if (downloadBtn) downloadBtn.addEventListener('click', () => {
  // download at canvas resolution
  canvas.toBlob(blob => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'decorated-photo.png'; a.click(); }, 'image/png');
});

// home link (if present)
if (homeLink) homeLink.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'index.html'; });

// logo
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.logo');
  if (logo) logo.addEventListener('click', () => window.location.href = 'index.html');
});
