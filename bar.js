// 夜のページ専用のスクリプト(いまは、ハンバーガーメニューの開閉だけ)
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

menuBtn.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuBtn.classList.toggle('is-open', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen);
  menuBtn.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
});

// メニュー内のリンクを押したら、自動で閉じる
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuBtn.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', false);
    menuBtn.setAttribute('aria-label', 'メニューを開く');
  });
});

// ==============================
// 懐中電灯(点描):光の近くは粒が少なく、遠いほど粒が多い
// ==============================
{
  const SCALE = 3;     // 粒の大きさ(3 = 3×3ピクセルが1粒。大きいほど粗い)
  const DARK = 0.85;   // 暗さ(0〜1。1に近いほど真っ暗)
  const CORE = 0.35;   // 光の中心の、粒ゼロの範囲(0〜1)

  const canvas = document.createElement('canvas');
  canvas.className = 'dark-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let w, h, noise, img;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight * 0.35;
  let nowX = targetX;
  let nowY = targetY;
  let drawnX = -9999;  // 最後に描いた位置(動いた時だけ描き直す)
  let drawnY = -9999;

  // 画面の大きさに合わせて、canvas と、ノイズ(粒の、くじ引きの表)を作る
  function resize() {
    w = Math.ceil(window.innerWidth / SCALE);
    h = Math.ceil(window.innerHeight / SCALE);
    canvas.width = w;
    canvas.height = h;
    img = ctx.createImageData(w, h);
    noise = new Float32Array(w * h);
    for (let i = 0; i < noise.length; i++) noise[i] = Math.random();  // 0〜1 の乱数
    drawnX = -9999;
  }

  // 光の中心(x, y)から、全部の点を、塗るか塗らないか、決める
  function draw(x, y) {
    const cx = x / SCALE;
    const cy = y / SCALE;
    const R = Math.min(window.innerWidth, window.innerHeight) * 0.4 / SCALE;  // 光の半径
    const R2 = R * R;
    const a = Math.round(DARK * 255);
    const data = img.data;

    for (let py = 0; py < h; py++) {
      for (let px = 0; px < w; px++) {
        const i = py * w + px;
        const dx = px - cx;
        const dy = py - cy;
        const d2 = dx * dx + dy * dy;
        let dark;
        if (d2 >= R2) {
          dark = true;                               // 光の外:全部、暗い
        } else {
          const d = Math.sqrt(d2) / R;               // 0(中心)〜1(ふち)
          let p = d <= CORE ? 1 : 1 - (d - CORE) / (1 - CORE);  // 明るくなる確率
          p = p * p * (3 - 2 * p);                   // なめらかな形に
          dark = noise[i] > p;                       // くじ引き:外れたら、黒い粒
        }
        data[i * 4 + 3] = dark ? a : 0;              // 4番目が、透明度(Aの値)
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  window.addEventListener('pointermove', (e) => { targetX = e.clientX; targetY = e.clientY; });
  window.addEventListener('touchstart', (e) => { targetX = e.touches[0].clientX; targetY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchmove', (e) => { targetX = e.touches[0].clientX; targetY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('resize', resize);

  function tick() {
    nowX += (targetX - nowX) * 0.18;
    nowY += (targetY - nowY) * 0.18;
    // 1ピクセル以上、動いた時だけ、描き直す(止まっている時は、休む)
    if (Math.abs(nowX - drawnX) > 1 || Math.abs(nowY - drawnY) > 1) {
      draw(nowX, nowY);
      drawnX = nowX;
      drawnY = nowY;
    }
    requestAnimationFrame(tick);
  }

  resize();
  tick();
}