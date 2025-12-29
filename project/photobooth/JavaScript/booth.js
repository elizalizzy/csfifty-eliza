
// constants
const WIDTH = 1176, HEIGHT = 1470, HALF = HEIGHT / 2;

// dom elements
const elements = {
  video: document.getElementById('liveVideo'),
  canvas: document.getElementById('finalCanvas'),
  ctx: document.getElementById('finalCanvas') ? document.getElementById('finalCanvas').getContext('2d') : null,
  takePhotoBtn: document.getElementById('takePhoto'),
  downloadBtn: document.getElementById('downloadBtn'),
  countdownEl: document.querySelector('.countdown-timer'),
  frameSelect: document.getElementById('frameSelect'),
  frameOverlay: document.querySelector('.frame-overlay')
};

// when the user picks a frame, update the overlay preview immediately
if (elements.frameSelect) {
  elements.frameSelect.addEventListener('change', () => {
    const val = elements.frameSelect.value;
    if (elements.frameOverlay) {
      elements.frameOverlay.src = val || '';
      elements.frameOverlay.style.display = val ? 'block' : 'none';
    }
  });
}


let photoStage = 0; // 0=top,1=bottom,2=done

// move video to half
const moveVideoToHalf = i => {
  const { video } = elements;
  video.style.display = 'block';
  video.style.top = i === 0 ? '0' : '50%';
  video.style.left = '0';
  video.style.width = '100%';
  video.style.height = '50%';
};

// countdown
const startCountdown = callback => {
  let count = 3;
  const { countdownEl } = elements;
  countdownEl.textContent = count;
  countdownEl.style.display = 'flex';
  const intervalId = setInterval(() => {
    count--;
    if (count > 0) countdownEl.textContent = count;
    else {
      clearInterval(intervalId);
      countdownEl.style.display = 'none';
      callback();
    }
  }, 1000);
};

// capture photo
const capturePhoto = () => {
  const { video, ctx, takePhotoBtn } = elements;
  const yOffset = photoStage === 0 ? 0 : HALF;
  const vW = video.videoWidth, vH = video.videoHeight;
  const targetAspect = WIDTH / HALF, vAspect = vW / vH;
  let sx, sy, sw, sh;

  if (vAspect > targetAspect) { sh = vH; sw = vH * targetAspect; sx = (vW - sw) / 2; sy = 0; }
  else { sw = vW; sh = vW / targetAspect; sx = 0; sy = (vH - sh) / 2; }

  ctx.save();
  ctx.translate(WIDTH, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, sx, sy, sw, sh, 0, yOffset, WIDTH, HALF);
  ctx.restore();

  photoStage++;
  if (photoStage === 1) { moveVideoToHalf(1); takePhotoBtn.disabled = false; }
  else if (photoStage === 2) finalizePhotoStrip();
};

// finalize photo strip
const finalizePhotoStrip = () => {
  const { video, ctx, canvas } = elements;
  video.style.display = 'none';
  const frame = new Image();
  const frameSrc = elements.frameOverlay && elements.frameOverlay.src ? elements.frameOverlay.src : '/images/frame.png';
  if (!frameSrc) {
    // no frame selected — just save and continue
    localStorage.setItem('photoStrip', elements.canvas.toDataURL('image/png'));
    setTimeout(() => window.location.href = 'editor.html', 50);
    return;
  }
  frame.src = frameSrc;
  frame.onload = () => {
    if (ctx && canvas) {
      ctx.drawImage(frame, 0, 0, WIDTH, HEIGHT);
      localStorage.setItem('photoStrip', elements.canvas.toDataURL('image/png'));
      setTimeout(() => window.location.href = 'editor.html', 50);
    } else {
      console.error('Canvas or context missing when finalizing strip');
      window.location.href = 'final.html';
    }
  };
  frame.complete && frame.onload();
};

// download photo
const downloadPhoto = () => {
  elements.canvas.toBlob(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'photo-strip.png';
    a.click();
  }, 'image/png');
};

// camera
const setupCamera = () => {
  navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 2560 }, height: { ideal: 1440 }, facingMode: 'user' }, audio: false })
    .then(stream => { elements.video.srcObject = stream; elements.video.play(); moveVideoToHalf(0); })
    .catch(err => alert('Camera access failed: ' + err));
};

// setup
const setupEventListeners = () => {
  const { takePhotoBtn, downloadBtn } = elements;

  takePhotoBtn.addEventListener('click', () => {
    if (photoStage > 1) return;
    takePhotoBtn.disabled = true;
    startCountdown(capturePhoto);
  });

  downloadBtn.addEventListener('click', downloadPhoto);
  window.addEventListener('resize', () => {
    if (photoStage === 0) moveVideoToHalf(0);
    else if (photoStage === 1) moveVideoToHalf(1);
  });
};

// initialize photo booth
const initPhotoBooth = () => { setupCamera(); setupEventListeners(); };
initPhotoBooth();

// logo redirect
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.logo');
  if (logo) logo.addEventListener('click', () => window.location.href = 'index.html');
});
