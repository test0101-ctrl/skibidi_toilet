document.querySelector(".reveal-btn").addEventListener("click", () => {
  document.querySelector(".hidden-message").style.display = "block";
  createBurst(); // Trigger emoji burst on click
});

// Heart animation
const heartsContainer = document.querySelector('.hearts');

function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = (3 + Math.random() * 2) + "s";
  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 5000);
}

setInterval(createHeart, 300);

// New: Emoji burst on click
const emojiContainer = document.querySelector('.emoji-container');
const emojis = ['😊', '🥰', '💖', '✨', '🌸', '💫'];

function createBurst() {
  for (let i = 0; i < 20; i++) {
    const emoji = document.createElement('span');
    emoji.classList.add('burst-emoji');
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    // Random position around the button
    const btnRect = document.querySelector(".reveal-btn").getBoundingClientRect();
    emoji.style.left = `${btnRect.left + btnRect.width / 2 + (Math.random() - 0.5) * 100}px`;
    emoji.style.top = `${btnRect.top + btnRect.height / 2 + (Math.random() - 0.5) * 100}px`;
    
    emojiContainer.appendChild(emoji);

    // Animate and remove
    emoji.animate([
      { transform: 'translateY(0) scale(1)', opacity: 1 },
      { transform: `translate(${(Math.random() - 0.5) * 400}px, ${(Math.random() - 0.5) * 400}px) scale(0)`, opacity: 0 }
    ], {
      duration: 1500 + Math.random() * 1000,
      easing: 'ease-out',
      fill: 'forwards'
    }).onfinish = () => emoji.remove();
  }
}

// New: Add a subtle tilt effect on mouse hover
document.querySelector(".container").addEventListener("mousemove", (e) => {
  const container = e.currentTarget;
  const rect = container.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const rotateX = (e.clientY - centerY) / 20; // Adjust the divisor for tilt intensity
  const rotateY = (centerX - e.clientX) / 20;

  container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

document.querySelector(".container").addEventListener("mouseleave", (e) => {
  e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
});
