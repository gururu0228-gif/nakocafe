
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
      // 開いていたら閉じる
      answer.style.maxHeight = null;
      question.setAttribute('aria-expanded', false);//質問ボタンの aria-expanded を、"false"(閉じている)にする
    } else {
      // 開く(中身の高さぶんだけ広げる)
      answer.style.maxHeight = answer.scrollHeight + 'px';//中身(答え)の高さを測りpxをつけてmaxHeightに代入する
      question.setAttribute('aria-expanded', true);//質問ボタンの aria-expanded を、"true"(開いている)にする
    }
  });
});

// ==============================
// 3. お知らせを news.json から読み込んで表示
// ==============================
const newsList = document.getElementById('newsList');

// 画面にメッセージ(読み込み失敗したとき)を1行出す処理
// functionは処理をひとまとまりにして名前を付けたもの｛｝内の処理を呼び出すときは名前を使う
function showNewsMessage(text) {
  newsList.innerHTML = ''; // newsListの中身を空にする
  const li = document.createElement('li'); // 新しいliタグを作って代入する
  li.className = 'news-list__message';
  li.textContent = text;
  newsList.append(li);
}

// asyncｱｼﾝｸ は「途中で待つ時間のかかる処理、(await)を含む関数です」の印
// awaitｱｳｪｲﾄ は「ここで待って、終わったら次の処理に進む」の印
// async→この処理は非同期処理を行います→awaitが使える
// Newsを読み込む処理
async function loadNews() {
  // try..catch は、コード実行中にエラー（例外）が発生してもプログラムが中断するのを防ぎ、安全に処理を続けるためのエラー処理構文
  try {
    // ① news.json を取りに行く(届くまで await で待つ)
    const response = await fetch('news.json');
    if (!response.ok) { //もし response.ok が false なら、エラーを投げる
      throw new Error('news.json を読み込めませんでした'); //catchへ飛ぶ
    }

    // ② 届いた JSON の文字を、配列とオブジェクトに変換する(パース)
    const newsItems = await response.json(); //responseからJsonとして中身を読み取る,それをnewsItemsとする

    // ③ 「読み込み中」を消して、新しい順に並べ替える(ｺﾝｽﾄとｿｰﾃｨﾄﾞ)
    newsList.innerHTML = '';
    // newsItemsはお知らせの配列を読み込んだもの
    // ...はコピーを作る指示newslistをコピー（sortで元の配列を並べ替えてしまうため、コピーを作成しコピーを触ってもらう）
    // localeCompare は、2つの文字列を比べて、「どちらが先か」を判断する。localeCompare() が返す「マイナス・0・プラス」を sort() が使って、2つのデータの位置関係を決めている
    //今回はaのdate10/10，bのdate10/24だから、b.date.localeCompare(a.date)でb→aの順番で並べると最新の日付が先と読み取られる
    // .sortで並べ替える基準として比較できる二つを用意する、それがaとb。今回はb.date.localeCompare(a.date)で日付を比較して新しい順に並べ替える
    // a、bには、Jsonに入ってるデータ１件分すべてをそれぞれ代入している。右側でその中のdateという要素を抜粋して比較するという指示をしている
    // a、bには、別のデータの同じ要素をそれぞれに代入している（「比較する順番が関係ない」のではなく、a と b の“左右”はめちゃくちゃ重要だがJSONの上から順番に a、b と入るかどうかは重要ではない）
    // 比較する順番（Jsonデータを比較関数に代入していく順番）は関係ない
    // 「データを追加する人が守るルール」と「それを読み取るプログラム」がセット、このコードが成立するために、データを更新するときはどのようなルールで更新するか決める事が大事
    // sortに並び順の指示を与えるための指示となるb.date.localeCompare(a.date))後の変数：先の変数にすると、データを新しい順に並べて（降順）との指示になる
    // sort((b, a)としていたら、a.date.localeCompare(b.date))となる。この指示からSortが読み取るというより、ここがSortに指示をしているという感覚
    const sorted = [...newsItems].sort((a, b) => b.date.localeCompare(a.date));

    // ④ 1件ずつ、HTMLの要素を作って、並べる
    sorted.forEach((item) => {                 // sortedの中身を1件ずつitemに代入して{}内の処理をする
      const li = document.createElement('li'); //HTMLの <li> を1個作る

      const date = document.createElement('span'); //日付用のSpanを新しくつくる（CSSがこれに対してデザインしたりできる）
      date.className = 'news-list__date';
      date.textContent = item.date.replaceAll('-', '.');

      const title = document.createElement('span');
      title.textContent = item.title;          //title 要素の中にJSONから取り出した、ニュースのタイトルを代入

      li.append(date, title);                  //日付とタイトルを<li>の中にいれる
      newsList.append(li);                     // newsListの中に<li>を追加する
    });
  } catch (error) {
    console.error(error);   // 原因は F12 のコンソールに出る
    showNewsMessage('お知らせを読み込めませんでした。');
  }
}

loadNews();

// スクロールで、要素をふわっと出す
const targets = document.querySelectorAll('.reveal');   // reveal が付いた要素を、全部集める
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
  // 見張り番:要素が画面に入ったら、この関数が呼ばれる
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {                        // 画面に入った?
        entry.target.classList.add('is-visible');        // 印を付ける → CSSが反応して動く
        observer.unobserve(entry.target);                // 1回出したら、見張りをやめる
      }
    });
  }, { threshold: 0.12 });                               // 12%見えたら「入った」とみなす

  targets.forEach((target) => observer.observe(target)); // 全員に見張り番を付ける
} else {
  // 古いブラウザや「動きを減らす」設定のときは、最初から全部表示する
  targets.forEach((target) => target.classList.add('is-visible'));
}

// ページの進み具合(0〜1)を返す関数。「計算だけ」する
function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;     // スクロールできる長さ
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;        // 0〜1に収める
}

const progress = document.getElementById('progress');

function updateProgress() {
  progress.style.setProperty('--p', scrollProgress());   // CSS変数 --p に、数字を書き込む
}

window.addEventListener('scroll', updateProgress, { passive: true });   // スクロールするたびに実行
updateProgress();                                                        // 最初に1回、実行しておく

// ヒーローの写真スライド(3.4秒ごとに、次の1枚へ)
const slides = document.querySelectorAll('#heroPhotos .slide');   // 写真の枠の中の、スライドを全部集める
let slideIndex = 0;                                               // いま見えているのは、何枚目か(0が1枚目)

// 2枚以上あって、「動きを減らす」設定ではないときだけ動かす
if (slides.length > 1 && !reduceMotion) {
  setInterval(() => {                                             // 3400ミリ秒(3.4秒)ごとに、この中を繰り返す
    slides[slideIndex].classList.remove('is-active');             // いまの1枚から、印を外す(薄くなって消える)
    slideIndex = (slideIndex + 1) % slides.length;                // 次の番号にする。最後まで行ったら、0に戻る
    slides[slideIndex].classList.add('is-active');                // 次の1枚に、印を付ける(濃くなって出てくる)
  }, 3400);
}