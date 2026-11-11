// ==============================
// 昼(index.html)と、夜(bar.html)を、行き来する(昼夜、共通)
// ==============================
const modeBtn = document.getElementById('modeBtn');
const pageFade = document.getElementById('pageFade');
const modeReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (modeBtn && pageFade) {
  const goingTo = modeBtn.dataset.target;                 // 行き先(HTMLの data-target)
  const toNight = goingTo === 'bar.html';                 // 夜へ行くのか

    // 暗い幕で覆って、ページを移る
  const cover = () => {
    pageFade.style.background = toNight ? '#0b0a10' : '#faf8f4';
    pageFade.classList.add('is-on');
    setTimeout(() => { location.href = goingTo; }, 700);
  };

  modeBtn.addEventListener('click', () => {
    try { if (!toNight) sessionStorage.setItem('skipIntro', '1'); } catch (e) {}
    if (modeReduceMotion) { location.href = goingTo; return; }
    if (modeBtn.dataset.busy) return;                  // 二度押し防止
    modeBtn.dataset.busy = '1';

    if (!toNight) { cover(); return; }                 // 昼へ戻るときは、いままで通り

    // 夜へ行くとき:ドアが開いて、ロケット君を1秒見せる
    modeBtn.classList.add('is-opening');
    const r = document.createElement('div');
    r.className = 'rocket-open';
    r.innerHTML =
      '<img class="rocket-open__circle" src="images/rocket-BAROPENcircle.png" alt="">' +
      '<img class="rocket-open__rocket" src="images/rocket-BAROPEN.png" alt="">';
    document.body.appendChild(r);
    requestAnimationFrame(() => requestAnimationFrame(() => r.classList.add('is-on')));
    setTimeout(cover, 1000);                           // 1秒見せてから、暗くして移る
  });

  // ページが、表示されたら、幕を、ふわっと外す(夜のページは、最初から、幕が、かかっている)
  const reveal = () => {
    pageFade.classList.remove('is-on');
    modeBtn.dataset.busy = '';
    modeBtn.classList.remove('is-opening');
    document.querySelectorAll('.rocket-open').forEach(el => el.remove());
  };
  requestAnimationFrame(() => requestAnimationFrame(reveal));
  window.addEventListener('pageshow', reveal);  requestAnimationFrame(() => requestAnimationFrame(reveal));
  window.addEventListener('pageshow', reveal);            // ブラウザの「戻る」で、戻ってきたときも、外す
}