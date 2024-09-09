let players = []; // Массив для хранения игроков
let currentPlayerIndex = 0; // Индекс текущего игрока
let gameTime = 0; // Время игры
let gameInterval; // Интервал для отслеживания времени
let deck = []; // Колода карт
let hands = []; // Руки игроков
const winningScore = 4; // Количество сундучков для победы
const suits = ['♠', '♥', '♦', '♣']; // Масти карт
const ranks = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']; // Достоинства карт

// Элементы интерфейса
const createRoomButton = document.getElementById('create-room');
const playAgainstAIButton = document.getElementById('play-against-ai');
const playerNameInput = document.getElementById('player-name');
const playerCountSelect = document.getElementById('player-count');
const gameContainer = document.getElementById('game-container');
const setupContainer = document.getElementById('setup-container');
const gameTimeElement = document.getElementById('game-time');
const playersNamesContainer = document.getElementById('players-names');
const playerListContainer = document.getElementById('player-list'); // Новый элемент для списка игроков
const modal = document.getElementById('modal');
const closeButton = document.querySelector('.close-button');
const playerCardsContainer = document.getElementById('player-cards');
const opponentCardsContainer = document.getElementById('opponent-cards');
const deckContainer = document.getElementById('deck-container');
const chatInput = document.getElementById('chat-input');
const sendChatButton = document.getElementById('send-chat');
const chatBox = document.getElementById('chat-box');

let canDrawFromDeck = false; // Флаг, указывающий, может ли игрок взять карту из колоды

// Функция для генерации колоды карт
function generateDeck() {
    deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push(`${rank} ${suit}`);
        }
    }
    shuffleDeck(); // Перетасовать колоду
}

// Функция для перетасовки колоды
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Меняем местами
    }
}

// Функция для раздачи карт игрокам
function dealCards(playerCount) {
    hands = Array.from({ length: playerCount }, () => []);
    for (let i = 0; i < 5; i++) { // Каждому игроку по 5 карт
        for (let j = 0; j < playerCount; j++) {
            hands[j].push(deck.pop());
        }
    }
}

// Обработчик для создания комнаты
createRoomButton.addEventListener('click', function () {
    const playerName = playerNameInput.value;
    const playerCount = playerCountSelect.value;
    if (playerName) {
        players = Array.from({ length: playerCount }, (_, i) => `Игрок ${i + 1}`);
        players[0] = playerName; // Устанавливаем имя текущего игрока
        playersNamesContainer.innerText = players.join(', '); // Отображаем имена игроков
        updatePlayerList(); // Обновляем список игроков в игре
        alert(`Комната создана для ${playerName} с ${playerCount} игроками!`);
        generateDeck(); // Генерация колоды
        dealCards(playerCount); // Раздача карт
        startGame(); // Запускаем игру
    } else {
        alert('Пожалуйста, введите ваше имя.');
    }
});

// Обработчик для игры против AI
playAgainstAIButton.addEventListener('click', function () {
    const playerName = playerNameInput.value;
    if (playerName) {
        players = ['Игрок', 'AI'];
        playersNamesContainer.innerText = players.join(', '); // Отображаем имена игроков
        updatePlayerList(); // Обновляем список игроков в игре
        alert(`Вы играете против AI!`);
        generateDeck(); // Генерация колоды
        dealCards(2); // Раздача карт
        startGame(); // Запускаем игру
    } else {
        alert('Пожалуйста, введите ваше имя.');
    }
});

// Функция для обновления списка игроков
function updatePlayerList() {
    playerListContainer.innerHTML = players.join(', ');
}

// Функция для старта игры
function startGame() {
    setupContainer.style.display = 'none'; // Скрыть меню
    gameContainer.style.display = 'block'; // Показать игровое поле
    currentPlayerIndex = 0; // Начинаем с первого игрока
    gameTime = 0; // Сброс времени игры
    gameTimeElement.innerText = `Время игры: ${gameTime} секунд`;
    gameInterval = setInterval(() => {
        gameTime++;
        gameTimeElement.innerText = `Время игры: ${gameTime} секунд`;
    }, 1000);
    renderOpponentCards(); // Отображаем карты противников
    renderPlayerCards(); // Отображаем карты игрока
    renderDeck(); // Отображаем колоду на столе
}

// Функция для отображения карт противников
function renderOpponentCards() {
    opponentCardsContainer.innerHTML = '';
    for (let i = 0; i < players.length; i++) {
        if (i !== currentPlayerIndex) {
            const opponentCardElement = document.createElement('div');
            opponentCardElement.className = 'opponent-card';
            opponentCardElement.innerText = `Карты: ${hands[i].length}`; // Отображаем количество карт
            opponentCardsContainer.appendChild(opponentCardElement);
        }
    }
}

// Функция для отображения карт игрока
function renderPlayerCards() {
    playerCardsContainer.innerHTML = '';
    hands[currentPlayerIndex].forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        const [rank, suit] = card.split(' '); // Извлекаем достоинство и масть
        const rankElement = document.createElement('div');
        rankElement.className = 'rank';
        rankElement.innerText = rank;
        const suitElement = document.createElement('div');
        suitElement.className = 'suit';
        suitElement.innerText = suit;

        // Устанавливаем цвет в зависимости от масти
        if (suit === '♥' || suit === '♦') {
            cardElement.classList.add('red');
        } else {
            cardElement.classList.add('black');
        }
        cardElement.appendChild(rankElement);
        cardElement.appendChild(suitElement);
        cardElement.onclick = () => askForCard(card); // Запрос карты при нажатии
        playerCardsContainer.appendChild(cardElement);
    });
}

// Функция для отображения колоды на столе
function renderDeck() {
    deckContainer.innerHTML = `Осталось карт в колоде: ${deck.length}`;
}

// Функция для запроса карты
function askForCard(selectedCard) {
    const question = `Есть ли у вас карта ${selectedCard.split(' ')[0]}?`;
    if (confirm(question)) {
        checkOpponentCards(selectedCard); // Проверка карт противников
    }
}

// Функция для проверки карт противников
function checkOpponentCards(selectedCard) {
    let foundCard = false;
    for (let i = 0; i < players.length; i++) {
        if (i !== currentPlayerIndex && hands[i].some(card => card.split(' ')[0] === selectedCard.split(' ')[0])) {
            foundCard = true;
            const cardsToGive = hands[i].filter(card => card.split(' ')[0] === selectedCard.split(' ')[0]);
            hands[i] = hands[i].filter(card => !cardsToGive.includes(card)); // Убираем карты у противника
            hands[currentPlayerIndex].push(...cardsToGive); // Добавляем карты к текущему игроку
            alert(`${players[i]} отдал вам карты ${selectedCard.split(' ')[0]}.`);
            renderPlayerCards(); // Обновляем отображение карт игрока
            renderOpponentCards(); // Обновляем отображение карт противников
            renderDeck(); // Обновляем отображение колоды
            canDrawFromDeck = false; // Сбросить флаг после успешного запроса
            return; // Выходим из функции
        }
    }
    // Если карта не найдена
    alert(`У противников нет карты ${selectedCard.split(' ')[0]}. Нажмите на колоду, чтобы взять карту.`);
    canDrawFromDeck = true; // Установить флаг, чтобы игрок мог взять карту
}

// Обработчик для нажатия на колоду
deckContainer.addEventListener('click', function () {
    if (canDrawFromDeck && deck.length > 0) {
        const drawnCard = deck.pop(); // Берем карту из колоды
        hands[currentPlayerIndex].push(drawnCard); // Добавляем карту к руке игрока
        alert(`${players[currentPlayerIndex]} взял карту из колоды.`);
        renderPlayerCards(); // Обновляем отображение карт игрока
        renderDeck(); // Обновляем отображение колоды
        canDrawFromDeck = false; // Сбросить флаг
    } else if (!canDrawFromDeck) {
        alert('Вы не можете взять карту сейчас.');
    } else {
        alert('В колоде больше нет карт!');
    }
});

// Функция для AI хода
function aiTurn() {
    const aiCard = hands[1][Math.floor(Math.random() * hands[1].length)]; // AI выбирает случайную карту
    const question = `AI: Есть ли у вас карта ${aiCard.split(' ')[0]}?`;
    setTimeout(() => {
        alert(question);
        checkOpponentCards(aiCard); // AI проверяет карты противника
    }, 1000); // Задержка в 1 секунду перед ходом AI
}

// Функция для проверки наличия 4 одинаковых карт (сундучки)
function checkForSunducks() {
    const playerHand = hands[currentPlayerIndex];
    const cardCounts = {};
    playerHand.forEach(card => {
        const rank = card.split(' ')[0]; // Извлекаем достоинство
        cardCounts[rank] = (cardCounts[rank] || 0) + 1;
        if (cardCounts[rank] === winningScore) {
            alert(`${players[currentPlayerIndex]} собрал 4 ${rank} и получил сундучок!`); // Удаляем эти карты из руки игрока
            hands[currentPlayerIndex] = playerHand.filter(card => !card.startsWith(rank));
        }
    });
    if (hands[currentPlayerIndex].length === 0) {
        endGame(players[currentPlayerIndex]); // Если у игрока закончились карты, игра прекращается
    }
}

// Функция для завершения игры
function endGame(winnerName) {
    clearInterval(gameInterval); // Остановить таймер
    alert(`${winnerName} выиграл игру!`); // Сообщить о победе
    showFinalScores(); // Показать итоговые результаты
}

// Функция для показа итогов игры
function showFinalScores() {
    const scores = players.map((player, index) => {
        const sunducks = hands[index].filter(card => {
            const rank = card.split(' ')[0];
            return hands[index].filter(c => c.split(' ')[0] === rank).length === winningScore;
        }).length;
        return `${player}: ${sunducks} сундучков`;
    }).join('\n');
    alert(`Итоги игры:\n${scores}`);
    resetGame(); // Сброс игры
}

// Функция для сброса игры
function resetGame() {
    setupContainer.style.display = 'block'; // Показать меню
    gameContainer.style.display = 'none'; // Скрыть игровое поле
    players = [];
    hands = [];
    currentPlayerIndex = 0;
    gameTime = 0;
}

// Обработчик для закрытия модального окна с правилами
closeButton.addEventListener('click', function () {
    modal.style.display = 'none'; // Закрыть модальное окно
});

// Закрытие модального окна при клике вне его
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Обработчик для открытия модального окна с правилами
document.getElementById('rules-button').addEventListener('click', function () {
    modal.style.display = 'block'; // Открыть модальное окно с правилами
});

// Обработчик для отправки сообщений в чат
sendChatButton.addEventListener('click', function () {
    const message = chatInput.value;
    if (message) {
        chatBox.innerHTML += `<div><strong>${players[currentPlayerIndex]}:</strong> ${message}</div>`;
        chatInput.value = ''; // Очистить поле ввода
        chatBox.scrollTop = chatBox.scrollHeight; // Прокрутить чат вниз
    }
});