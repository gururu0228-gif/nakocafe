
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

// ==============================
// 猫の紹介:cats.json から、丸い写真を、ふわふわ漂わせる
// ==============================
const floaters = document.getElementById('floaters');
const catEmojis = ['🐱', '😸', '😺', '😻', '🐈', '😼'];   // 写真が入るまでの、仮の絵

// min〜max の間の、ランダムな数字を返す道具
function rand(min, max) {
  return min + Math.random() * (max - min);
}

// 猫1匹分の「丸い写真」を作って返す関数
function createFloater(cat) {
  const item = document.createElement('div');
  item.className = 'floater';
 // 揺れ方を、猫ごとに、ばらばらにする(CSS変数に、数字を書き込む)
  const range  = window.innerWidth >= 768 ? 140 : 24;   // 動く範囲(横)。スマホは40、広い画面は100
  floaters.style.setProperty('--range', range + 'px');   // 動く範囲を、CSS変数 --range に書き込む
  const yRange = range * 0.8;                            // 縦の動きは、横の6割にする(縦が長くならない・重なりにくい)
  const slow   = range / 60;
  item.style.setProperty('--dur', rand(20, 32) * slow + 's');
  item.style.setProperty('--delay', -rand(0, 26 * slow) + 's');
  item.style.setProperty('--shift', rand(0, 15) + 'px');   // 前: rand(0, 30)

  for (let k = 1; k <= 3; k++) {                                 // 目的地を、3か所、決める
    item.style.setProperty('--x' + k, rand(-range, range) + 'px');
    item.style.setProperty('--y' + k, rand(-yRange, yRange) + 'px');
  }

  const button = document.createElement('button');
  button.className = 'floater__btn';
  button.type = 'button';
  button.style.setProperty('--tint', cat.tint);
  button.setAttribute('aria-label', cat.name + 'のしょうかいを見る');

  // 写真があれば写真、なければ仮の絵(絵文字)
  if (cat.photo) {
    button.classList.add('has-photo');          // ← この1行を足す(写真がある猫に、印を付ける)
    const img = document.createElement('img');
    img.src = cat.photo;
    img.alt = cat.name + 'の写真';
    button.append(img);
  } else {
    button.append(catEmojis[cat.id % catEmojis.length]);
  }

  const name = document.createElement('span');
  name.className = 'floater__name';
  name.textContent = cat.name;
  button.append(name);

  button.addEventListener('click', () => openModal(cat, button));   // 押したら、カードを開く

  item.append(button);
  return item;
}

// ------------------------------
// 猫の丸を、シャボン玉のように、枠の中で漂わせる
// ------------------------------
function startBubbles() {
  const box = document.getElementById('floaters');
  const items = Array.from(box.querySelectorAll('.floater'));

  let W = box.clientWidth;    // 枠の幅
  let H = box.clientHeight;   // 枠の高さ
  const collide = true;                       // 前: window.innerWidth >= 768。スマホでも、ぶつかる
  const over = 0.35;                          // 丸の大きさの何割まで、枠の上下からはみ出してよいか

  // 丸ごとに、位置(x,y)と、速さ(vx,vy)を、ランダムに決める
  const bubbles = items.map((el) => {
    const r = el.offsetWidth / 2;                // 半径
    const speed = rand(14, 26);                  // 速さ(px/秒)
    const dir = rand(0, Math.PI * 2);            // 向き(ラジアン。0〜360度)
    return {
      el, r,
      x: rand(0, W - r * 2),
      y: rand(0, H - r * 2),
      vx: Math.cos(dir) * speed,
      vy: Math.sin(dir) * speed,
    };
  });

  function draw() {                              // 画面に、今の位置を、反映する
    bubbles.forEach((b) => { b.el.style.translate = `${b.x}px ${b.y}px`; });
  }

  if (reduceMotion) { draw(); return; }          // 「動きを減らす」設定の人は、動かさない

  // 枠の外に出ていたら、戻して、跳ね返す(1匹分の、壁チェック)
  function keepInside(b) {
    const oy = b.r * 2 * over;                   // 上下に、はみ出してよい長さ(px)
    if (b.x < 0)                { b.x = 0;                    b.vx =  Math.abs(b.vx); }
    if (b.x > W - b.r * 2)      { b.x = W - b.r * 2;          b.vx = -Math.abs(b.vx); }
    if (b.y < -oy)              { b.y = -oy;                  b.vy =  Math.abs(b.vy); }
    if (b.y > H - b.r * 2 + oy) { b.y = H - b.r * 2 + oy;     b.vy = -Math.abs(b.vy); }
  }

  let last = performance.now();

  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05);   // 前回からの経過秒。上限を付けて、ジャンプを防ぐ
    last = now;

    // 1. それぞれ、進めて、壁で跳ね返る
    bubbles.forEach((b) => {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      keepInside(b);
    });

    // 2. 丸どうしが、ぶつかったら、離して、跳ね返る(2匹ずつ、総当たりで調べる)
    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        const a = bubbles[i];
        const b = bubbles[j];
        const dx = (a.x + a.r) - (b.x + b.r);     // 中心どうしの差
        const dy = (a.y + a.r) - (b.y + b.r);
        const dist = Math.hypot(dx, dy);          // 中心どうしの距離
        const min = a.r + b.r;                    // これより近いと、重なっている
        if (collide && dist < min && dist > 0) {
          const nx = dx / dist;                   // 2匹を結ぶ、向き(長さ1)
          const ny = dy / dist;
          const push = (min - dist) / 2;          // 重なりの半分ずつ、離す
          a.x += nx * push;  a.y += ny * push;
          b.x -= nx * push;  b.y -= ny * push;
          const rel = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;   // 近づく速さ
          if (rel < 0) {                          // 近づいているときだけ、跳ね返す
            a.vx -= rel * nx;  a.vy -= rel * ny;
            b.vx += rel * nx;  b.vy += rel * ny;
          }
        }
      }
    }

    bubbles.forEach(keepInside);                  // ぶつかって押し出された丸も、戻す

    draw();
    requestAnimationFrame(tick);                  // 次のフレームも、この関数を呼ぶ(くりかえし)
  }

  requestAnimationFrame(tick);

  // 画面の幅が変わったら、枠の大きさを、取り直す
  window.addEventListener('resize', () => { W = box.clientWidth; H = box.clientHeight; });
}


// cats.json を読み込んで、並べる
async function loadCats() {
  try {
    const response = await fetch('cats.json');
    if (!response.ok) {
      throw new Error('cats.json を読み込めませんでした');
    }
    const cats = await response.json();
    cats.forEach((cat) => floaters.append(createFloater(cat)));
    startBubbles();                       // 丸を並べ終わってから、動かし始める
  } catch (error) {
    console.error(error);
    const message = document.createElement('p');
    message.className = 'note';
    message.textContent = 'ねこの情報を読み込めませんでした。';
    floaters.replaceChildren(message);
  }
}

loadCats();

// ==============================
// 猫のカード(モーダル)を、開く・閉じる
// ==============================
const modal = document.getElementById('catModal');
let lastButton = null;                                  // 最後に押した丸(閉じたあとに、ここへ戻す)

function openModal(cat, button) {
  // 写真(なければ、仮の絵文字)を入れる
  const photo = document.getElementById('catModalPhoto');
  photo.style.setProperty('--tint', cat.tint);
  photo.classList.toggle('has-photo', Boolean(cat.photo));   //(写真があれば、印を付ける)
  if (cat.photo) {
    const img = document.createElement('img');
    img.src = cat.photo;
    img.alt = cat.name + 'の写真';
    photo.replaceChildren(img);
  } else {
    photo.textContent = catEmojis[cat.id % catEmojis.length];
  }

  // 名前、年齢と性別、性格のことば、ひとこと
  document.getElementById('catModalName').textContent = cat.name;
  document.getElementById('catModalMeta').textContent = cat.age + ' ・ ' + cat.sex;
  const traits = document.getElementById('catModalTraits');
  traits.replaceChildren();                             // 前の猫のことばを、空にする
  cat.traits.forEach((trait) => {
    const li = document.createElement('li');
    li.textContent = trait;
    traits.append(li);
  });
  document.getElementById('catModalText').textContent = cat.text;

  modal.hidden = false;                                 // 表示する(先に表示してから、位置を測る)

  // 押した丸の位置から、ふくらむように見せる
  const rect = button.getBoundingClientRect();          // 押した丸の、画面上の位置と大きさ
  const card = modal.querySelector('.modal__card');
  const cardRect = card.getBoundingClientRect();
  card.style.setProperty('--ox', (rect.left + rect.width / 2 - cardRect.left) + 'px');
  card.style.setProperty('--oy', (rect.top + rect.height / 2 - cardRect.top) + 'px');

  floaters.classList.add('is-paused');                  // 漂うのを、一時停止
  lastButton = button;
  modal.querySelector('.modal__close').focus();         // キーボード操作用に、×ボタンに、フォーカスを移す
}

function closeModal() {
  modal.hidden = true;                                  // 隠す
  floaters.classList.remove('is-paused');               // 漂うのを、再開
  if (lastButton) lastButton.focus();                   // 押した丸に、フォーカスを戻す
}

// 暗い幕か、×を押したら、閉じる(data-close が付いたものが、閉じる合図)
modal.addEventListener('click', (event) => {
  if (event.target.closest('[data-close]')) closeModal();
});
// Escキーでも、閉じる
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});

// ------------------------------
// マウス(PC)や指(スマホ・iPad)のあとを、猫の足あとが、ついてくる
// ------------------------------
if (!reduceMotion) {                        // reduceMotion は、ふわっと出る動きのところで、もう作ってある
  let lastX = null;
  let lastY = null;
  let side = 1;                             // 1と-1を、交互に入れ替える(左足・右足)
  const STEP = 46;                          // 何px動くたびに、足あとを1つ置くか

  // 足あとを置く、共通の処理(マウスも、指も、ここを使う)
  function leavePaw(x, y) {
    if (lastX === null) { lastX = x; lastY = y; return; }   // 最初の1回は、位置を覚えるだけ

    const dx = x - lastX;
    const dy = y - lastY;
    if (Math.hypot(dx, dy) < STEP) return;  // まだ、遠くへ動いていない → 何もしない

    const angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;   // 進む向き(度)。足先が前を向くよう+90

    const paw = document.createElement('span');
    paw.className = 'paw';
    paw.style.left = x + 'px';
    paw.style.top = y + 'px';
    paw.style.setProperty('--rot', angle + 'deg');
    paw.style.setProperty('--side', side * 9 + 'px');         // 進行方向と直角に、左右へずらす
    side *= -1;
    document.body.append(paw);
    paw.addEventListener('animationend', () => paw.remove()); // 消えたら、要素も削除

    lastX = x;
    lastY = y;
  }

  // マウス・ペン(PC、iPadにつないだマウスなど)
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;  // 指は、下の touchmove で扱う
    leavePaw(e.clientX, e.clientY);
  });

  // 指(スマホ・iPad)
  window.addEventListener('touchstart', (e) => {
    lastX = e.touches[0].clientX;           // 指を置いた位置から、始める(前回の位置との距離で、足あとが、飛ばないように)
    lastY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    leavePaw(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
}

// ==============================
// 本:右から左へ進む、一枚の帯
// ==============================
const book = document.querySelector('.book');

// どこまで進めるか(右の端 = 0、左へ進むほど、マイナスの数字になる)
function bookMax() {
  return book.scrollWidth - book.clientWidth;
}

// --- PC:ホイールの縦の動きを、横の動きに変える(なめらかに追いかける) ---
let wheelTarget = 0;       // 行きたい位置
let wheelFrame = null;     // 動いている間の、アニメーション番号

function glide() {
  const diff = wheelTarget - book.scrollLeft;
  if (Math.abs(diff) < 1.5) {                       // ほぼ着いたら、終わる(拡大率の刻みより、大きく)    book.scrollLeft = wheelTarget;
    wheelFrame = null;
    return;
  }
  book.scrollLeft += diff * 0.12;                   // 残りの12%ずつ、近づく
  wheelFrame = requestAnimationFrame(glide);
}

book.addEventListener('wheel', (e) => {
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;       // 横の動きは、そのまま
  e.preventDefault();                                          // 縦の動きは、こちらで受ける
  const delta = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;  // 行単位の機器も、px に直す
  if (wheelFrame === null) wheelTarget = book.scrollLeft;      // 止まっていたら、いまの位置から
  wheelTarget = Math.max(-bookMax(), Math.min(0, wheelTarget - delta));   // 下へ回すと、左へ進む
  if (wheelFrame === null) wheelFrame = requestAnimationFrame(glide);
}, { passive: false });

// --- 進み具合バー:帯の位置から、0〜1 を計算 ---
function updateBookProgress() {
  const max = bookMax();
  const p = max > 0 ? Math.min(1, Math.max(0, -book.scrollLeft / max)) : 0;
  progress.style.setProperty('--p', p);
}
book.addEventListener('scroll', updateBookProgress, { passive: true });
window.addEventListener('resize', updateBookProgress);

// --- ナビのリンク:押した場所の、右端が、画面の右端に来るように、動かす ---
document.querySelectorAll('.nav a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    const dest = document.querySelector(href);
    if (!dest) return;
    event.preventDefault();                                     // 標準の動きは、止める
    let left = 0;                                               // #top(ロゴ)は、右の端へ
    if (href !== '#top') {
      left = book.scrollLeft + (dest.getBoundingClientRect().right - book.getBoundingClientRect().right);
    }
    book.scrollTo({ left: Math.max(-bookMax(), Math.min(0, left)), behavior: 'smooth' });
  });
});

// ==============================
// ABOUT:カフェメニューを、menu.json から読み込んで、並べる
// ==============================
const menuList = document.getElementById('menuList');
const treatList = document.getElementById('treatList');
const menuChips = document.querySelectorAll('.menu__chip');
let menuData = [];                // menu.json の中身を、入れておく場所
let menuKind = 'savory';          // いま選んでいるのは、しょっぱい系

// 「品名 ... 値段」の1行(<li>)を作って返す道具
function makeMenuRow(label, price) {
  const li = document.createElement('li');
  const name = document.createElement('span');
  name.textContent = label;
  const cost = document.createElement('span');
  cost.className = 'menu__price';
  cost.textContent = price.toLocaleString() + '円';    // 1200 → 1,200 のように、カンマをつける
  li.append(name, cost);
  return li;
}

// いま選んでいる種類(menuKind)だけを、並べ直す
function renderMenu() {
  menuList.replaceChildren();                           // 前の一覧を、空にする
  menuData.forEach((group) => {
    group.items
      .filter((item) => item.kind === menuKind)         // 選んでいる種類の品だけに、絞る
      .forEach((item) => {
        // グループに品が1つだけなら、品名だけ。複数あるなら「グループ名 品名」
        const label = group.items.length === 1 ? item.name : group.name + ' ' + item.name;
        menuList.append(makeMenuRow(label, item.price));
      });
  });
}

// 切り替えボタン:押したら、種類を変えて、並べ直す
menuChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    menuKind = chip.dataset.kind;                       // HTMLの data-kind を読む
    menuChips.forEach((c) => c.classList.toggle('is-on', c === chip));   // 押したボタンだけ、色をつける
    renderMenu();
  });
});

// 2つのJSONを読み込む
async function loadMenu() {
  try {
    const [menuRes, treatRes] = await Promise.all([fetch('menu.json'), fetch('treats.json')]);   // 2つを、同時に取りに行く
    if (!menuRes.ok || !treatRes.ok) throw new Error('menu.json か treats.json を読み込めませんでした');
    menuData = await menuRes.json();
    const treats = await treatRes.json();

    renderMenu();
    treats.forEach((treat) => treatList.append(makeMenuRow(treat.name, treat.price)));
  } catch (error) {
    console.error(error);
    menuList.textContent = 'メニューを読み込めませんでした。';
  }
}

loadMenu();


// ==============================
// オープニング:ローディング → ロケットくんが左下へ → 「ねんね」が出る → 消える
// ==============================
const introScreen = document.getElementById('introScreen');

if (introScreen) {
  const MIN_LOADING = 2000;                 // ローディングを、最低、これだけ(ミリ秒)見せる
  const OPENING_TIME = 2000;                // 「ねんね」の画面を、見せている時間
  const started = performance.now();
  
    // ボタンで、夜のページから、戻ってきたか(mode.js が、メモを残している)
  let skipIntro = false;
  try {
    skipIntro = sessionStorage.getItem('skipIntro') === '1';
    sessionStorage.removeItem('skipIntro');               // 1回使ったら、メモは、消す
  } catch (e) {}

  if (reduceMotion || skipIntro) {
    introScreen.remove();                   // 「動きを減らす」設定の人には、出さない
  } else {
    document.body.classList.add('is-intro');            // 下の画面を、スクロールさせない

    // --- ロケットくんの歩き:コマを、順番に入れ替える(パラパラ漫画) ---
    const WALK_FRAMES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];   // 使うコマの番号(10コマ)
    const FRAME_MS = 140;                                  // 1コマを、見せる時間
    const rocketImg = document.getElementById('rocketImg');
    let frameIndex = 0;

    // 先に、全部の絵を、読み込んでおく(ちらつかないように)
    WALK_FRAMES.forEach((n) => {
      new Image().src = `images/rocket-${n}.png`;
    });

    const walkTimer = setInterval(() => {
      frameIndex = (frameIndex + 1) % WALK_FRAMES.length;   // 0→1→2…→最後→0 と、くり返す
      rocketImg.src = `images/rocket-${WALK_FRAMES[frameIndex]}.png`;
    }, FRAME_MS);

    // --- ローディング → オープニングへ ---
    let opened = false;                                 // 二重に、始まらないための、目印
    function startOpening() {
      if (opened) return;
      opened = true;
      introScreen.classList.remove('is-loading');
      introScreen.classList.add('is-opening');          // ロケットくんが左下へ。「ねんね」が、ズームアウトで出る
      setTimeout(() => {
        introScreen.classList.add('is-done');           // 画面全体を、すっと消す
        document.body.classList.remove('is-intro');     // スクロールを、元に戻す
        clearInterval(walkTimer);                       // コマ送りを、止める
      }, OPENING_TIME);
    }

    function whenReady() {
      const rest = Math.max(0, MIN_LOADING - (performance.now() - started));   // 最低の時間まで、あと何ミリ秒か
      setTimeout(startOpening, rest);
    }

    // ページの全部が、読み込めたら、始める
    if (document.readyState === 'complete') whenReady();
    else window.addEventListener('load', whenReady);

    setTimeout(startOpening, 6000);                     // 保険:6秒たったら、読み込みが終わっていなくても、始める

    // 消えたら、要素ごと、取り除く
    introScreen.addEventListener('transitionend', (e) => {
      if (e.target === introScreen && e.propertyName === 'opacity') introScreen.remove();
    });
  }
}


// ==============================
// ABOUT:システムのカードの、切り替え(料金 / 時間 / ルール)
// ==============================
const sysChips = document.querySelectorAll('.sys__chip');
const sysPanes = document.querySelectorAll('.sys__pane');

sysChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    sysChips.forEach((c) => c.classList.toggle('is-on', c === chip));        // 押したボタンだけ、色をつける
    sysPanes.forEach((pane) => {
      pane.hidden = pane.dataset.pane !== chip.dataset.pane;                 // 名札が合う塊だけ、見せる
    });
  });
});


// ==============================
// ABOUT:店内あんない。tour.json から、写真と動画を並べて、押したら、大きく見せる
// ==============================
const tourGrid = document.getElementById('tourGrid');
const lightbox = document.getElementById('lightbox');
const lightboxMedia = document.getElementById('lightboxMedia');
const lightboxCaption = document.getElementById('lightboxCaption');
let tourItems = [];          // tour.json の中身を、入れておく場所
let tourIndex = 0;           // いま、大きく見ているのは、何番目か
let lastTourButton = null;   // 最後に押した、小さな一覧(閉じたあとに、ここへ戻す)

// 小さな一覧の、1つ分(押せるボタン)を作って返す
function makeTourThumb(item, index) {
  const li = document.createElement('li');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'tour__item';
  btn.style.setProperty('--tint', item.tint || '#ffd9cf');
  btn.setAttribute('aria-label', item.caption + (item.type === 'video' ? '(動画)' : '') + 'を、大きく見る');

  // 写真なら写真、動画なら表紙。なければ、仮の絵(絵文字)
  const thumb = item.type === 'video' ? item.poster : item.src;
  if (thumb) {
    const img = document.createElement('img');
    img.src = thumb;
    img.alt = '';
    btn.append(img);
  } else {
    btn.append(item.emoji || '🐾');
  }

  if (item.type === 'video') {                         // 動画には、▶マークを付ける
    const play = document.createElement('span');
    play.className = 'tour__play';
    play.textContent = '▶';
    btn.append(play);
  }

  const cap = document.createElement('span');
  cap.className = 'tour__cap';
  cap.textContent = item.caption;
  btn.append(cap);

  btn.addEventListener('click', () => openLightbox(index, btn));
  li.append(btn);
  return li;
}

// 大きな画面に、index 番目を、出す
function showLightboxItem(index) {
  tourIndex = (index + tourItems.length) % tourItems.length;   // 最後の次は、最初に戻る(逆も)
  const item = tourItems[tourIndex];
  lightboxMedia.replaceChildren();                             // 前の中身を、空にする(動画も止まる)

  if (item.type === 'video' && item.src) {
    const video = document.createElement('video');
    video.src = item.src;
    if (item.poster) video.poster = item.poster;
    video.controls = true;                                     // 再生ボタンを出す
    video.playsInline = true;                                  // iPhoneで、全画面に、ならずに再生
    video.preload = 'metadata';                                // 必要な情報だけ先に、読む
    lightboxMedia.append(video);
  } else if (item.type === 'photo' && item.src) {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.caption;
    lightboxMedia.append(img);
  } else {                                                     // 写真・動画が、まだないとき:仮の絵
    const ph = document.createElement('div');
    ph.className = 'lightbox__ph';
    ph.style.setProperty('--tint', item.tint || '#ffd9cf');
    ph.textContent = item.emoji || '🐾';
    lightboxMedia.append(ph);
  }
  lightboxCaption.textContent = item.caption;
}

function openLightbox(index, button) {
  lastTourButton = button;
  showLightboxItem(index);
  lightbox.hidden = false;
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxMedia.replaceChildren();                             // 動画を止めて、空にする
  if (lastTourButton) lastTourButton.focus();
}

// 暗い幕か、×を押したら、閉じる
lightbox.addEventListener('click', (event) => {
  if (event.target.closest('[data-close-lb]')) closeLightbox();
});
document.getElementById('lightboxPrev').addEventListener('click', () => showLightboxItem(tourIndex - 1));
document.getElementById('lightboxNext').addEventListener('click', () => showLightboxItem(tourIndex + 1));

// キーボード:Escで閉じる、← → で前後
document.addEventListener('keydown', (event) => {
  if (lightbox.hidden) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showLightboxItem(tourIndex - 1);
  if (event.key === 'ArrowRight') showLightboxItem(tourIndex + 1);
});

// スマホ:左右に、スワイプして、前後
let swipeX = null;
lightbox.addEventListener('touchstart', (event) => { swipeX = event.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', (event) => {
  if (swipeX === null) return;
  const dx = event.changedTouches[0].clientX - swipeX;         // 指が、どれだけ、横に動いたか
  swipeX = null;
  if (Math.abs(dx) > 50) showLightboxItem(tourIndex + (dx < 0 ? 1 : -1));   // 左へ → 次、右へ → 前
}, { passive: true });

// tour.json を読み込んで、並べる
async function loadTour() {
  try {
    const response = await fetch('tour.json');
    if (!response.ok) throw new Error('tour.json を読み込めませんでした');
    tourItems = await response.json();
    tourItems.forEach((item, i) => tourGrid.append(makeTourThumb(item, i)));
  } catch (error) {
    console.error(error);
    tourGrid.textContent = '読み込めませんでした。';
  }
}

loadTour();

// ==============================
// ABOUT:スタッフ紹介。staff.json から並べて、押したら、自己紹介のカードを開く
// ==============================
const staffList = document.getElementById('staffList');
const staffModal = document.getElementById('staffModal');
let lastStaffButton = null;                                   // 最後に押したボタン(閉じたあとに、ここへ戻す)

// 1人分(<li>の中の、押せるボタン)を作って返す
function makeStaffRow(person) {
  const li = document.createElement('li');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'staff__item';
  btn.setAttribute('aria-label', person.name + 'の自己紹介を見る');

  const avatar = document.createElement('div');
  avatar.className = 'staff__avatar';
  avatar.style.setProperty('--tint', person.tint || '#ffd9cf');
  if (person.photo) {                                         // 写真があれば写真。見つからなければ、絵文字
    const img = document.createElement('img');
    img.src = person.photo;
    img.alt = '';
    img.addEventListener('error', () => { avatar.textContent = person.emoji || '🐾'; });
    avatar.append(img);
  } else {
    avatar.textContent = person.emoji || '🐾';
  }

  const body = document.createElement('div');
  const name = document.createElement('p');
  name.className = 'staff__name';
  name.textContent = person.name;
  const text = document.createElement('p');
  text.className = 'staff__text';
  text.textContent = person.text;
  body.append(name, text);

  btn.append(avatar, body);
  btn.addEventListener('click', () => openStaffModal(person, btn));   // 押したら、自己紹介を開く
  li.append(btn);
  return li;
}

// 自己紹介のカードを、開く
function openStaffModal(person, button) {
  const photo = document.getElementById('staffModalPhoto');
  photo.style.setProperty('--tint', person.tint || '#ffd9cf');
  if (person.photo) {
    const img = document.createElement('img');
    img.src = person.photo;
    img.alt = person.name;
    img.addEventListener('error', () => { photo.textContent = person.emoji || '🐾'; });
    photo.replaceChildren(img);
  } else {
    photo.textContent = person.emoji || '🐾';
  }
  document.getElementById('staffModalName').textContent = person.name;
  document.getElementById('staffModalText').textContent = person.intro || person.text;

  staffModal.hidden = false;                                  // 表示する(先に表示してから、位置を測る)

  // 押したボタンの位置から、ふくらむように見せる
  const rect = button.getBoundingClientRect();
  const card = staffModal.querySelector('.modal__card');
  const cardRect = card.getBoundingClientRect();
  card.style.setProperty('--ox', (rect.left + rect.width / 2 - cardRect.left) + 'px');
  card.style.setProperty('--oy', (rect.top + rect.height / 2 - cardRect.top) + 'px');

  lastStaffButton = button;
  staffModal.querySelector('.modal__close').focus();
}

function closeStaffModal() {
  staffModal.hidden = true;
  if (lastStaffButton) lastStaffButton.focus();
}

// 暗い幕か、×を押したら、閉じる
staffModal.addEventListener('click', (event) => {
  if (event.target.closest('[data-close-staff]')) closeStaffModal();
});
// Escキーでも、閉じる
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !staffModal.hidden) closeStaffModal();
});

async function loadStaff() {
  try {
    const response = await fetch('staff.json');
    if (!response.ok) throw new Error('staff.json を読み込めませんでした');
    const staff = await response.json();
    staff.forEach((person) => staffList.append(makeStaffRow(person)));
  } catch (error) {
    console.error(error);
    staffList.textContent = '読み込めませんでした。';
  }
}

loadStaff();

// ==============================
// 文字の出方:1文字ずつに分けて、画面に入ったら、しなやかに出す
// ==============================

// 要素の中の文字を、1文字ずつの <span class="char"> に分ける
function splitChars(el) {
  const label = el.textContent.replace(/\s+/g, ' ').trim();   // 読み上げ用に、元の文章を覚えておく
  const wrap = document.createElement('span');
  wrap.setAttribute('aria-hidden', 'true');                   // 分けた文字は、読み上げない(二重に読まれるのを防ぐ)
  let i = 0;                                                  // 何文字目か(遅れの計算に使う)

  Array.from(el.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {                   // 文字の部分
      const text = node.textContent.replace(/\s+/g, ' ').trim();
      for (const ch of text) {                                // 1文字ずつ
        const span = document.createElement('span');
        span.className = 'char';
        span.style.setProperty('--i', i++);
        span.textContent = ch;
        wrap.append(span);
      }
    } else {
      wrap.append(node.cloneNode(true));                      // <br> などは、そのまま
    }
  });

  const sr = document.createElement('span');                  // 読み上げ専用の、元の文章
  sr.className = 'sr-only';
  sr.textContent = label;
  el.replaceChildren(sr, wrap);
}

// 対象:見出し、導入文、カードの文字
const textTargets = document.querySelectorAll(
  '.hero__vtext, .intro__text, .card__title, .card__big, .card__text, .oval-title span, .story__headline, .story__text p'
);
textTargets.forEach((el) => {
  el.classList.add('text-in');
  splitChars(el);
});

if ('IntersectionObserver' in window && !reduceMotion) {
  const textObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        textObserver.unobserve(entry.target);                 // 1回出したら、見張りをやめる
      }
    });
  }, { threshold: 0.3, rootMargin: '0px -8% 0px -8%' });      // 画面の端から、少し内側に入ったら、始める
  textTargets.forEach((el) => textObserver.observe(el));
} else {
  textTargets.forEach((el) => el.classList.add('is-visible'));
}

// ==============================
// 開いたとき、必ず、いちばん右(ヒーロー)から始める
// ==============================
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';   // ブラウザの「前の位置を覚える機能」を、切る

function goToStart() {
  book.scrollLeft = 0;     // 右の端 = ヒーロー
  wheelTarget = 0;         // ホイールの目標位置も、合わせる
}

goToStart();                                          // 最初に1回
window.addEventListener('load', goToStart);           // 全部の読み込みが終わったとき
window.addEventListener('pageshow', goToStart);       // 戻るボタンなどで、戻ってきたとき

// オープニングの画面の状態(class)が変わるたびに、位置を戻す(消えるとき・始まるとき)
if (introScreen) {
  new MutationObserver(goToStart).observe(introScreen, { attributes: true, attributeFilter: ['class'] });
}

// ==============================
// ロゴ:押したら、いちばん右(ヒーロー)へ、なめらかに戻る
// ==============================
document.addEventListener('click', (event) => {
  if (!event.target.closest('.logo')) return;     // ロゴ以外のクリックは、無視
  event.preventDefault();                         // 標準の動きは、止める
  wheelTarget = 0;                                // 行き先は、右の端(ヒーロー)
  if (wheelFrame === null) wheelFrame = requestAnimationFrame(glide);   // ホイールと、同じ動きで進む
});

// ==============================
// 左上のラベル:いまいる章の名前が、ふわっと出て、その章の間、とどまる
// ==============================
// ページの id → [英語, 日本語]。ヒーローとフッターは、ラベルなし
const PAGE_LABELS = {
  'intro':          ['STORY',    'ねんねのはじまり'],
  'news':           ['NEWS',     'お知らせ'],
  'cats':           ['CATS',     '猫の紹介'],
  'about-concept':  ['CONCEPT',  'コンセプト'],
  'about-can':      ['ACTIVITY', 'できること'],
  'about-menu':     ['MENU',     'カフェメニュー'],
  'about-tour':     ['TOUR',     '店内あんない'],
  'about-staff':    ['STAFF',    'スタッフ紹介'],
  'about-system':   ['SYSTEM',   'システム'],
  'faq':            ['FAQ',      'よくある質問'],
  'access':         ['ACCESS',   'アクセス'],
};

// ラベルの箱を作って、ページに足す
const pageLabel = document.createElement('div');
pageLabel.className = 'page-label';
pageLabel.setAttribute('aria-hidden', 'true');              // 飾りなので、読み上げない
const labelEn = document.createElement('span');
labelEn.className = 'page-label__en';
const labelJa = document.createElement('span');
labelJa.className = 'page-label__ja';
pageLabel.append(labelEn, labelJa);
document.body.append(pageLabel);

let labelId = null;       // いま出している章の id
let labelTimer = null;

function updatePageLabel() {
  // 画面のまん中(横)に、かかっているページを探す
  const x = window.innerWidth * 0.5;
  let id = null;
  for (const page of book.children) {
    const rect = page.getBoundingClientRect();
    if (rect.left <= x && x < rect.right) {
      if (PAGE_LABELS[page.id]) id = page.id;               // 一覧にある章だけ
      break;
    }
  }
  if (id === labelId) return;                               // 同じ章なら、何もしない
  labelId = id;

  pageLabel.classList.remove('is-show');                    // いったん、ふわっと消す
  clearTimeout(labelTimer);
  labelTimer = setTimeout(() => {                           // 消えたころに、文字を入れ替えて、出す
    if (id) {
      labelEn.textContent = PAGE_LABELS[id][0];
      labelJa.textContent = PAGE_LABELS[id][1];
      pageLabel.classList.add('is-show');
    }
  }, 350);
}

book.addEventListener('scroll', updatePageLabel, { passive: true });
window.addEventListener('resize', updatePageLabel);
updatePageLabel();
