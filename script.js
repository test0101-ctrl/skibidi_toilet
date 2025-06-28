const memoryGameGrid = document.querySelector('.memory-game-grid');
const matchesCountSpan = document.getElementById('matches');
const totalMatchesSpan = document.getElementById('total-matches');
const hiddenMessageWrapper = document.querySelector('.hidden-message-wrapper');

const flipSound = document.getElementById('flip-sound');
const matchSound = document.getElementById('match-sound');
const winSound = document.getElementById('win-sound');

const cardIcons = ['🌸', '✨', '💖', '💌', '🌟', '😊', '🥰', '🌈']; // Mais ícones se quiseres mais pares

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0;
let lockBoard = false; // Para evitar cliques enquanto as cartas estão a virar

// --- Funções do Jogo ---

// Inicia o jogo de memória
function initializeGame() {
  cards = [];
  flippedCards = [];
  matchedPairs = 0;
  lockBoard = false;

  // Duplica os ícones para criar pares e embaralha
  let gameIcons = [...cardIcons.slice(0, 6), ...cardIcons.slice(0, 6)]; // Usamos 6 tipos de ícones para 12 cartas (6 pares)
  gameIcons = shuffleArray(gameIcons);
  totalPairs = gameIcons.length / 2; // Calcula o número total de pares

  totalMatchesSpan.textContent = totalPairs;
  matchesCountSpan.textContent = matchedPairs;

  memoryGameGrid.innerHTML = ''; // Limpa a grelha de jogo

  gameIcons.forEach((icon, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('memory-card');
    cardElement.dataset.icon = icon;
    cardElement.dataset.id = index; // Para identificação única

    const cardInner = `
      <div class="card-face card-front"></div>
      <div class="card-face card-back">${icon}</div>
    `;
    cardElement.innerHTML = cardInner;
    cardElement.addEventListener('click', flipCard);
    memoryGameGrid.appendChild(cardElement);
    cards.push(cardElement);
  });
}

// Embaralha um array (algoritmo Fisher-Yates)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Vira uma carta
function flipCard() {
  if (lockBoard) return; // Se o tabuleiro está bloqueado, não faz nada
  if (this === flippedCards[0]) return; // Evita clicar na mesma carta duas vezes

  this.classList.add('flipped');
  flipSound.currentTime = 0;
  flipSound.play();

  flippedCards.push(this);

  if (flippedCards.length === 2) {
    lockBoard = true; // Bloqueia o tabuleiro
    checkForMatch();
  }
}

// Verifica se as duas cartas viradas são um par
function checkForMatch() {
  const [firstCard, secondCard] = flippedCards;
  const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

  if (isMatch) {
    matchedPairs++;
    matchesCountSpan.textContent = matchedPairs;
    matchSound.currentTime = 0;
    matchSound.play();

    disableCards(); // Remove os event listeners
    if (matchedPairs === totalPairs) {
      endGame();
    }
  } else {
    unflipCards(); // Vira as cartas de volta
  }
}

// Desativa as cartas que formaram um par
function disableCards() {
  flippedCards.forEach(card => {
    card.removeEventListener('click', flipCard);
    card.classList.add('matched'); // Adiciona classe para estilo de "combinado"
  });
  resetBoard();
}

// Vira as cartas de volta se não forem um par
function unflipCards() {
  setTimeout(() => {
    flippedCards.forEach(card => {
      card.classList.remove('flipped');
    });
    resetBoard();
  }, 1000); // Espera 1 segundo antes de virar de volta
}

// Reseta o estado do tabuleiro
function resetBoard() {
  [flippedCards, lockBoard] = [[], false];
}

// Termina o jogo
function endGame() {
  // Limpa a grelha de jogo e esconde as instruções
  memoryGameGrid.innerHTML = '';
  document.querySelector('.message').style.display = 'none';
  document.querySelector('.matches-count').style.display = 'none';

  hiddenMessageWrapper.style.display = 'block'; // Mostra a mensagem
  winSound.currentTime = 0;
  winSound.play();

  // Animação de celebração com muitos corações de fundo (do jogo anterior)
  clearInterval(heartInterval); // Para os corações de fundo antigos
  const heartsBackgroundContainer = document.querySelector('.hearts-background');
  heartsBackgroundContainer.innerHTML = ''; // Limpa os antigos
  
  let celebrationHeartsCount = 0;
  const maxCelebrationHearts = 50;

  const celebrationHeartInterval = setInterval(() => {
    if (celebrationHeartsCount < maxCelebrationHearts) {
      createBackgroundHeart(heartsBackgroundContainer, true);
      celebrationHeartsCount++;
    } else {
      clearInterval(celebrationHeartInterval);
    }
  }, 100);
}

// --- Animação de Corações de Fundo (mantida do jogo anterior) ---
const heartsBackgroundContainer = document.querySelector('.hearts-background');

function createBackgroundHeart(container, isCelebration = false) {
  const heart = document.createElement('div');
  heart.classList.add('heart-bg');
  if (isCelebration) {
    heart.classList.add('heart-celebration');
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${1 + Math.random() * 2}s`;
    heart.style.fontSize = `${1.5 + Math.random()}em`;
    heart.style.opacity = `${0.6 + Math.random() * 0.4}`;
  } else {
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${3 + Math.random() * 2}s`;
  }
  container.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, isCelebration ? 3000 : 5000);
}

// Inicia a geração de corações de fundo regulares
let heartInterval = setInterval(() => createBackgroundHeart(heartsBackgroundContainer), 300);

// --- Início do Jogo ---
document.addEventListener('DOMContentLoaded', initializeGame); // Inicia o jogo de memória ao carregar

// Efeito de inclinação ao mover o rato (mantido)
document.querySelector(".container").addEventListener("mousemove", (e) => {
  const container = e.currentTarget;
  const rect = container.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const rotateX = (e.clientY - centerY) / 25;
  const rotateY = (centerX - e.clientX) / 25;

  container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

document.querySelector(".container").addEventListener("mouseleave", (e) => {
  e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
});
