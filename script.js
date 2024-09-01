const deck = [
    { value: 1, name: '1' },
    { value: 2, name: '2' },
    { value: 3, name: '3' },
    { value: 4, name: '4' },
    { value: 5, name: '5' },
    { value: 6, name: '6' },
    { value: 7, name: '7' },
    { value: 8, name: '8' },
    { value: 9, name: '9' },
    { value: 10, name: '10' },
];

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCards(deck) {
    const player1Cards = deck.splice(0, 5);
    const player2Cards = deck.splice(0, 5);
    return { player1Cards, player2Cards };
}

function calculateScore(cards) {
    return cards.reduce((total, card) => total + card.value, 0);
}

function displayCards(playerCards, playerId) {
    const cardsDiv = document.getElementById(`${playerId}-cards`);
    cardsDiv.innerHTML = ''; // Очистить текущее содержимое
    playerCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.textContent = card.name; // Отображаем имя карты
        cardsDiv.appendChild(cardElement);
    });
}

// Начало игры
shuffleDeck(deck);
const { player1Cards, player2Cards } = dealCards(deck);
const player1Score = calculateScore(player1Cards);
const player2Score = calculateScore(player2Cards);

displayCards(player1Cards, 'player1');
displayCards(player2Cards, 'player2');

console.log('Карты Игрока 1:', player1Cards);
console.log('Очки Игрока 1:', player1Score);
console.log('Карты Игрока 2:', player2Cards);
console.log('Очки Игрока 2:', player2Score);