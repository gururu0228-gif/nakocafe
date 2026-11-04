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