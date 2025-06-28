const gameArea = document.querySelector('.game-area');
const clickCountSpan = document.getElementById('count');
const hiddenMessageWrapper = document.querySelector('.hidden-message-wrapper');
const popSound = document.getElementById('pop-sound');
const winSound = document.getElementById('win-sound');

let clicks = 0;
const clicksToWin = 10; // Define quantos corações ela precisa clicar

// --- Funções do Jogo ---

// Cria um coração clicável
function createClickableHeart() {
  // Se já ganhámos, não criamos mais corações clicáveis
  if (clicks >= clicksToWin) return;

  const heart = document.createElement('div');
  heart.classList.add('clickable-heart');
  heart.style.left = `${Math.random() * 80 + 10}%`; // Posição aleatória na largura
  heart.style.top = `${Math.random() * 80 + 10}%`; // Posição aleatória na altura
  heart.style.animationDelay = `${Math.random() * 0.3}s`; // Pequeno delay para variedade

  // Adiciona o evento de clique diretamente ao coração no momento da sua criação
  heart.addEventListener('click', handleHeartClick);
  gameArea.appendChild(heart);

  // Remove o coração após um tempo se não for clicado
  setTimeout(() => {
    if (heart.parentNode === gameArea) { // Verifica se ainda está na gameArea
      heart.remove();
      // Opcional: recriar um coração se um desaparecer sem ser clicado, para manter o jogo ativo
      if (clicks < clicksToWin) {
         setTimeout(createClickableHeart, 500); // Cria um novo coração para substituir
      }
    }
  }, 2500); // Coração desaparece mais rápido (2.5 segundos) para manter o jogo dinâmico
}

// Lida com o clique no coração
function handleHeartClick(event) {
  // Para evitar múltiplos cliques rápidos no mesmo coração ou após a vitória
  if (clicks >= clicksToWin || event.target.dataset.clicked) return;

  event.target.dataset.clicked = 'true'; // Marca o coração como clicado

  clicks++;
  clickCountSpan.textContent = clicks;
  
  popSound.currentTime = 0; // Reinicia o som para que possa ser tocado rapidamente
  popSound.play();

  // Animação de "explosão" do coração
  const clickedHeart = event.target;
  clickedHeart.style.transform = 'scale(1.5) rotate(45deg)'; // Escala e mantém a rotação
  clickedHeart.style.opacity = '0';
  clickedHeart.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';

  // Cria um pequeno rasto de brilhos ou corações menores
  for (let i = 0; i < 5; i++) {
    const sparkle = document.createElement('span');
    sparkle.classList.add('sparkle');
    sparkle.textContent = '✨'; // Ou '💖'
    // Posição do sparkle relativa ao clique e à gameArea
    const gameAreaRect = gameArea.getBoundingClientRect();
    sparkle.style.left = `${event.clientX - gameAreaRect.left}px`;
    sparkle.style.top = `${event.clientY - gameAreaRect.top}px`;
    gameArea.appendChild(sparkle);

    sparkle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px) scale(0)`, opacity: 0 }
    ], {
      duration: 800 + Math.random() * 500,
      easing: 'ease-out',
      fill: 'forwards'
    }).onfinish = () => sparkle.remove();
  }

  // Remove o coração clicado após a animação
  setTimeout(() => {
    clickedHeart.remove();
  }, 200);

  // Gera um novo coração, mas apenas se o jogo não tiver terminado
  if (clicks < clicksToWin) {
    setTimeout(createClickableHeart, 500); // Gera um novo coração logo após o clique
  }

  // Verifica se o jogo terminou
  if (clicks === clicksToWin) {
    endGame();
  }
}

// Termina o jogo
function endGame() {
  gameArea.innerHTML = ''; // Limpa a área do jogo
  hiddenMessageWrapper.style.display = 'block'; // Mostra a mensagem
  winSound.currentTime = 0;
  winSound.play();

  // Remove o contador de cliques e a instrução
  document.querySelector('.click-count').style.display = 'none';
  document.querySelector('.message').style.display = 'none';

  // Animação de celebração com muitos corações de fundo
  clearInterval(heartInterval); // Para os corações de fundo antigos
  const heartsBackgroundContainer = document.querySelector('.hearts-background');
  heartsBackgroundContainer.innerHTML = ''; // Limpa os antigos
  
  let celebrationHeartsCount = 0;
  const maxCelebrationHearts = 50;

  const celebrationHeartInterval = setInterval(() => {
    if (celebrationHeartsCount < maxCelebrationHearts) {
      createBackgroundHeart(heartsBackgroundContainer, true); // True para corações de celebração
      celebrationHeartsCount++;
    } else {
      clearInterval(celebrationHeartInterval);
    }
  }, 100);

  // Opcional: adicionar um botão de "repetir" ou "partilhar"
}

// --- Animação de Corações de Fundo ---
const heartsBackgroundContainer = document.querySelector('.hearts-background');

function createBackgroundHeart(container, isCelebration = false) {
  const heart = document.createElement('div');
  heart.classList.add('heart-bg');
  if (isCelebration) {
    heart.classList.add('heart-celebration');
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${1 + Math.random() * 2}s`; // Mais rápido na celebração
    heart.style.fontSize = `${1.5 + Math.random()}em`; // Tamanhos variados
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
// Gera o primeiro coração clicável ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  createClickableHeart();
});

// Efeito de inclinação ao mover o rato (do código anterior)
document.querySelector(".container").addEventListener("mousemove", (e) => {
  const container = e.currentTarget;
  const rect = container.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const rotateX = (e.clientY - centerY) / 25; // Ajustei a intensidade
  const rotateY = (centerX - e.clientX) / 25;

  container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

document.querySelector(".container").addEventListener("mouseleave", (e) => {
  e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
});
