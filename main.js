// ゲームの状態管理
const state = {
    playerCount: 3,
    topic: '',
    playerNumbers: [],
    currentPlayerIndex: 0,
    isCardFlipped: false
};

// お題データ
const topics = [
    "食べ物の人気度",
    "欲しいドラえもんの道具",
    "動物の強さ",
    "ゾンビ映画での生存率",
    "カッコいい名字",
    "住みたい街の魅力",
    "コンビニの便利さ",
    "行ってみたい旅行先",
    "魔法の威力",
    "無人島に持っていきたいもの"
];

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
