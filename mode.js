// ==============================
// 昼(index.html)と、夜(bar.html)を、行き来する(昼夜、共通)
// ==============================
const modeBtn = document.getElementById('modeBtn');
const pageFade = document.getElementById('pageFade');
const modeReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (modeBtn && pageFade) {
  const goingTo = modeBtn.dataset.target;                 // 行き先(HTMLの data-target)
  const toNight = goingTo === 'bar.html';                 // 夜へ行くのか

  modeBtn.addEventListener('click', () => {
    try { if (!toNight) sessionStorage.setItem('skipIntro', '1'); } catch (e) {}   // ← この1行を足す(昼へ戻るときだけ、メモを残す)
    if (modeReduceMotion) { location.href = goingTo; return; }   // 「動きを減らす」設定なら、すぐ移る
    pageFade.style.background = toNight ? '#0b0a10' : '#faf8f4';  // 夜へは、黒。昼へは、紙の色で、覆う
    pageFade.classList.add('is-on');                      // 画面を、ふわっと、覆う
    setTimeout(() => { location.href = goingTo; }, 700);  // 覆い終わったら、ページを移る
  });

  // ページが、表示されたら、幕を、ふわっと外す(夜のページは、最初から、幕が、かかっている)
  const reveal = () => pageFade.classList.remove('is-on');
  requestAnimationFrame(() => requestAnimationFrame(reveal));
  window.addEventListener('pageshow', reveal);            // ブラウザの「戻る」で、戻ってきたときも、外す
}