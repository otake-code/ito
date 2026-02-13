// ゲームの状態管理
const state = {
    playerCount: 3,
    topic: '',
    playerNumbers: [],
    currentPlayerIndex: 0,
    isCardFlipped: false
};

// お題データ
const categorizedTopics = {
  "食べ物系": [
    "飲食店の人気",
    "中華料理の人気",
    "学校給食の人気",
    "食べ物の人気",
    "飲み物の人気",
    "お菓子・スイーツ・アイスの人気",
    "おにぎりの具の人気",
    "パンの種類の人気",
    "和食料理の人気",
    "洋食料理の人気",
    "食べ物のカロリー"
  ],

  "お店・建物系": [
    "コンビニ商品の人気",
    "100円ショップ商品の人気",
    "駅の人気",
    "建物の人気"
  ],

  "人物系": [
    "有名人の人気",
    "俳優の人気",
    "悪役の人気",
    "ミュージシャンの人気",
    "歴史上の人物の人気",
    "声優の人気",
    "映画キャラの人気",
    "アスリートの人気",
    "なりたい有名人",
    "なりたい歴史上の人物",
    "歴史上の人物の強さ",
    "映画キャラの強さ",
    "有名人の年収・資産",
    "結婚したい有名人"
  ],

  "趣味・娯楽系": [
    "アプリの人気",
    "おもちゃの人気",
    "映画の人気",
    "趣味の人気",
    "アニメ・漫画の人気",
    "ゲームの人気",
    "童話の人気",
    "歌の人気",
    "スポーツの人気",
    "テレビ番組の人気",
    "ボードゲームの人気",
    "旅行先の人気",
    "旅行に持っていきたい物",
    "ボードゲームの重さ"
  ],

  "生き物系": [
    "生き物の人気",
    "ペットの人気",
    "なりたい生き物",
    "生き物の大きさ",
    "生き物の強さ"
  ],

  "ぶっ飛び系": [
    "ゾンビと戦う時に持っていきたい物",
    "無人島に持っていきたい物",
    "雪山遭難で持っていたい物",
    "宇宙人へのお土産"
  ],

  "キャラクター系": [
    "アニメキャラの人気",
    "ゲームキャラの人気",
    "キャラクターの人気",
    "なりたいキャラ",
    "アニメキャラの強さ",
    "ゲームキャラの強さ",
    "結婚したいキャラ",
    "親になってほしいキャラ"
  ],

  "感情系": [
    "美しいもの",
    "怖いもの",
    "楽しいこと",
    "嬉しいこと",
    "カバンに入っていたら嬉しい物",
    "言われて嬉しい言葉",
    "カッコいいもの",
    "カッコいいセリフ",
    "カッコいい名前",
    "かわいいもの",
    "テンションが上がること"
  ],

  "学校・学生系": [
    "学校にある物の大きさ",
    "小学生が好きな言葉",
    "中高生が好きな言葉",
    "職業の人気"
  ],

  "大人向け": [
    "時代遅れの言葉",
    "オタクが喜ぶセリフ",
    "グッとくる仕草",
    "されたいプロポーズ",
    "酒のつまみの人気",
    "化粧品の人気",
    "デートスポットの人気",
    "ハネムーンの行き先",
    "恋人にしたい職業",
    "モテる条件"
  ],

  "その他": [
    "子供に人気なもの",
    "プレゼントの人気",
    "住みたい国や場所",
    "乗り物の人気",
    "電化製品の人気",
    "ブランドの人気",
    "資格の人気",
    "一人暮らしに必要な物",
    "強そうな言葉",
    "強そうな効果音",
    "重そうなもの",
    "やわらかそうなもの",
    "人生で大切なもの",
    "ほしい特殊能力",
    "便利なもの"
  ]
};



// DOM要素
const screens = {
    setup: document.getElementById('setup-screen'),
    distribution: document.getElementById('distribution-screen'),
    result: document.getElementById('result-screen')
};

const elements = {
    playerCountInput: document.getElementById('player-count'),
    topicInput: document.getElementById('topic-input'),
    btnStartGame: document.getElementById('btn-start-game'),
    currentPlayerLabel: document.getElementById('current-player-label'),
    numberCard: document.getElementById('number-card'),
    cardNumber: document.querySelector('.card-front .number'),
    instructionText: document.getElementById('instruction-text'),
    btnNextPlayer: document.getElementById('btn-next-player'),
    btnToResult: document.getElementById('btn-to-result'),
    resultList: document.getElementById('result-list'),
    btnRestart: document.getElementById('btn-restart')
};

// 初期化
function init() {
    console.log('App initialized');
    addEventListeners();
    registerServiceWorker();
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('SW registered'))
                .catch(err => console.log('SW registration failed', err));
        });
    }
}

function addEventListeners() {
    elements.btnStartGame.addEventListener('click', startGame);
    elements.numberCard.addEventListener('click', toggleCard);
    elements.btnNextPlayer.addEventListener('click', nextPlayer);
    elements.btnToResult.addEventListener('click', showResults);
    elements.btnRestart.addEventListener('click', restartGame);
}

// ロジック
// function setRandomTopic() {
//     const randomIndex = Math.floor(Math.random() * topics.length);
//     state.topic = topics[randomIndex];
//     elements.topicDisplay.innerHTML = `<p>${state.topic}</p>`;
// }

function startGame() {
    state.playerCount = parseInt(elements.playerCountInput.value);
    if (state.playerCount < 2 || state.playerCount > 10) {
        alert('プレイヤーは2人から10人で設定してください。');
        return;
    }

    // 数字をシャッフル (1-100)
    const allNumbers = Array.from({ length: 100 }, (_, i) => i + 1);
    for (let i = allNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allNumbers[i], allNumbers[j]] = [allNumbers[j], allNumbers[i]];
    }

    state.playerNumbers = allNumbers.slice(0, state.playerCount);
    state.currentPlayerIndex = 0;
    state.isCardFlipped = false;

    updateDistributionScreen();
    switchScreen('distribution');
}

function toggleCard() {
    state.isCardFlipped = !state.isCardFlipped;
    elements.numberCard.classList.toggle('flipped', state.isCardFlipped);

    if (state.isCardFlipped) {
        elements.instructionText.innerText = '確認したらタップして閉じてください';

        // 全員分配布し終わったかどうか
        if (state.currentPlayerIndex === state.playerCount - 1) {
            elements.btnToResult.style.display = 'block';
        } else {
            elements.btnNextPlayer.style.display = 'block';
        }
    } else {
        elements.instructionText.innerText = 'タップして数字を確認してください';
    }
}

function nextPlayer() {
    state.currentPlayerIndex++;
    state.isCardFlipped = false;
    elements.numberCard.classList.remove('flipped');
    elements.btnNextPlayer.style.display = 'none';

    // 少し待ってから次のプレイヤーを表示 (アニメーション用)
    setTimeout(() => {
        updateDistributionScreen();
    }, 300);
}

function updateDistributionScreen() {
    elements.currentPlayerLabel.innerText = `プレイヤー ${state.currentPlayerIndex + 1}`;
    elements.cardNumber.innerText = state.playerNumbers[state.currentPlayerIndex];
    elements.instructionText.innerText = 'タップして数字を確認してください';
}

function showResults() {
    elements.resultList.innerHTML = '';

    // プレイヤー番号順にソートして表示
    const results = state.playerNumbers.map((num, index) => ({
        num,
        playerIdx: index + 1
    }));

    // 数字の小さい順にソート (価値観当てゲームの基本ルール)
    results.sort((a, b) => a.num - b.num);

    results.forEach((res, i) => {
        const item = document.createElement('div');
        item.className = 'result-item';
        item.style.animationDelay = `${i * 0.1}s`;
        item.innerHTML = `
            <span class="player-name">プレイヤー ${res.playerIdx}</span>
            <span class="player-number">${res.num}</span>
        `;
        elements.resultList.appendChild(item);
    });

    switchScreen('result');
}

function restartGame() {
    switchScreen('setup');
}

function switchScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

init();
