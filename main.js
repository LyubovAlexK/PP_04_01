// Глобальные переменные
let currentCards = [];
let cardElements = [];
let openCard = [];
let lockBoard = false;
let pairsFound = 0;
let totalPairs = 0;

// Массив с изображениями
const IMAGES = [
    'black-flower.jpg',
    'blue-flower.jpg',
    'colorfull-flower.jpg',
    'pink-flower.jpg',
    'purple-flower.jpg',
    'red-flower.jpg',
    'white-flower.jpg',
    'yellow-flower.jpg'
];

// Этап 1. Создание функции, генерирующую массив парных изображений
function createNumbersArray(count) {
    const pairs = [];
    for (let i = 0; i < count; i++) {
        pairs.push(IMAGES[i], IMAGES[i]);
    }
    return pairs;
}

// Этап 2. Создание функции перемешивания массива
function shuffle(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Этап 3. Создание игрового пространства
function startGame(count) {
    // Задаем начальные значения
    totalPairs = count;
    pairsFound = 0;
    openCard = [];
    lockBoard = false;

    // Обновляем счетчик
    const gameStats = document.getElementById('gameStats');
    if (gameStats) {
        gameStats.textContent = `Найдено пар: 0 / ${totalPairs}`;
    }

    // Очищаем сообщение о победе
    const gameOverMessage = document.getElementById('gameOverMessage');
    if (gameOverMessage) {
        gameOverMessage.innerHTML = '';
    }

    // Создаем массив пар и перемешиваем
    const pairsArray = createNumbersArray(count);
    currentCards = shuffle(pairsArray);

    // Создаем DOM-элементы
    const gameBoard = document.getElementById('gameBoard');
    if (!gameBoard) return;
    
    gameBoard.innerHTML = '';
    cardElements = [];

    // Добавляем стили для сетки
    gameBoard.style.display = 'grid';
    gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
    gameBoard.style.gap = '12px';
    gameBoard.style.maxWidth = '600px';
    gameBoard.style.margin = '0 auto';

    currentCards.forEach((imageName, index) => {
        // Создаем карточку
        const card = document.createElement('div');
        card.style.cssText = `
            aspect-ratio: 1 / 1;
            cursor: pointer;
            background-color: #919191;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            position: relative;
        `;
        
        // Изображение (лицевая сторона)
        const img = document.createElement('img');
        img.src = `./img/${imageName}`;
        img.alt = 'flower';
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: none;
        `;
        
        // Обратная сторона (знак вопроса)
        const back = document.createElement('div');
        back.textContent = '?';
        back.style.cssText = `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            font-weight: bold;
            color: white;
            background-color: #919191;
            position: absolute;
            top: 0;
            left: 0;
        `;
        
        card.appendChild(img);
        card.appendChild(back);
        gameBoard.appendChild(card);
        
        cardElements.push({
            element: card,
            img: img,
            back: back,
            imageName: imageName,
            isFlipped: false,
            isMatched: false
        });

        card.addEventListener('click', () => handleCardClick(index));
    });
}

// Проверка совпадения
function checkMatch() {
    if (openCard.length !== 2) return;
    
    const [index1, index2] = openCard;
    const card1 = cardElements[index1];
    const card2 = cardElements[index2];
    
    if (!card1 || !card2) return;

    // Пара ли две карты?
    if (card1.imageName === card2.imageName) {
        // Найдена пара
        card1.element.style.opacity = '0.5';
        card2.element.style.opacity = '0.5';
        card1.element.style.cursor = 'default';
        card2.element.style.cursor = 'default';
        card1.isMatched = true;
        card2.isMatched = true;

        pairsFound++;
        const gameStats = document.getElementById('gameStats');
        if (gameStats) {
            gameStats.textContent = `Найдено пар: ${pairsFound} / ${totalPairs}`;
        }

        openCard = [];
        lockBoard = false; // ВАЖНО: разблокируем доску после нахождения пары

        // Проверка на победу
        if (pairsFound === totalPairs) {
            endGame();
        }
    } else {
        // Нет совпадения
        setTimeout(() => {
            if (card1 && !card1.isMatched) {
                card1.img.style.display = 'none';
                card1.back.style.display = 'flex';
                card1.element.style.backgroundColor = '#919191';
                card1.element.style.opacity = '1';
                card1.isFlipped = false;
            }
            
            if (card2 && !card2.isMatched) {
                card2.img.style.display = 'none';
                card2.back.style.display = 'flex';
                card2.element.style.backgroundColor = '#919191';
                card2.element.style.opacity = '1';
                card2.isFlipped = false;
            }
            
            openCard = [];
            lockBoard = false;
        }, 800);
    }
}

// Обработчик клика
function handleCardClick(index) {
    const card = cardElements[index];
    
    if (!card) return;
    if (lockBoard || card.isFlipped || card.isMatched) {
        return;
    }

    // Открываем карточку
    card.img.style.display = 'block';
    card.back.style.display = 'none';
    card.element.style.backgroundColor = '#ffffff';
    card.isFlipped = true;
    openCard.push(index);

    // Если открыто 2 карточки
    if (openCard.length === 2) {
        lockBoard = true;
        checkMatch();
    }
}

// Конец игры
function endGame() {
    const gameOverMessage = document.getElementById('gameOverMessage');
    if (!gameOverMessage) return;
    
    gameOverMessage.innerHTML = `
        <div class="alert alert-success mt-4">
            <h4 class="alert-heading">Поздравляем!</h4>
            <p>Вы нашли все ${totalPairs} пар цветов!</p>
            <button id="restartBtn" class="btn btn-success">Сыграть ещё раз</button>
        </div>
    `;
    
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            startGame(totalPairs);
        });
    }
}

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    startGame(8);
});