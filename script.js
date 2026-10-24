
// VBAの指示みたいなイメージ
// それぞれの動きに対して個別のプログラムを作っている
// ==============================
// 1. ハンバーガーメニューの開閉(スマホ)
// ==============================
// HTMLの中から id="menuBtn" の要素を探してmenuBtnに代入
// 定数を宣言、menuBtnに、今開いているHTMLのid"menuBtn"を代入する"
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

// menuBtn(ハンバーガー)がクリックされるイベントが起きたら｛｝内を実行する
menuBtn.addEventListener('click', () => {
  // HTMLのnavにクリックされてたらis-openを付け、されていなければis-openを外す。またtrueかfalseをisOpenに返す。
  const isOpen = nav.classList.toggle('is-open');   // navにis-openを付け外し(toggle)する。is-openがついてる=開いてる(true)is-openがついてない=閉じている(false)をisOpenni返す(trueかfalseかはtoggleが自分で判断する)
  menuBtn.classList.toggle('is-open', isOpen);      // ボタンを「×」に(ボタンにisOpenがtrueならis-openを付ける、falseなら外す)
  menuBtn.setAttribute('aria-expanded', isOpen);    // 読み上げ用の状態
  menuBtn.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
});

// メニュー内のリンクを押したら自動で閉じる
 nav.querySelectorAll('a').forEach((link) => {// navの中のリンクを1つずつ処理する。navの<a>を一覧にし順番にlinkという名前で受け取り{}の処理をする
  link.addEventListener('click', () => { //linkがクリックされたら{}内を実行する
    nav.classList.remove('is-open'); // navのis-openを外す
    menuBtn.classList.remove('is-open'); //menuBtnのis-openを外す(✕が三本線に戻る)
    menuBtn.setAttribute('aria-expanded', false); // 読み上げを閉じる状態にする
    menuBtn.setAttribute('aria-label', 'メニューを開く'); //読み上げをメニューを開く状態にする
  });
});

// ============================== 
// 2. よくある質問の開閉(アコーディオン)
// ==============================
// documentはページ全体ということ　//.はクラス名を表す
document.querySelectorAll('.faq__q').forEach((question) => { //ページ全体から質問ボタンを探し
  question.addEventListener('click', () => {
    const answer = question.nextElementSibling; //answerは質問の次の要素(答え)を指す
    const isOpen = question.getAttribute('aria-expanded') === 'true'; //質問ボタンのaria-expandedがtrueかfalseかをisOpenに返す(getAttributeは属性を取得する)

    if (isOpen) {
      // 閉じる
      answer.style.maxHeight = null;
      question.setAttribute('aria-expanded', false);//質問ボタンの aria-expanded を、"false"(閉じている)にする
    } else {
      // 開く(中身の高さぶんだけ広げる)
      answer.style.maxHeight = answer.scrollHeight + 'px';//中身(答え)の高さを測りpxをつけてmaxHeightに代入する
      question.setAttribute('aria-expanded', true);//質問ボタンの aria-expanded を、"true"(開いている)にする
    }
  });
});
