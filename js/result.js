const score =
  Number(localStorage.getItem("quizScore")) || 0;

const totalQuestions =
  Number(localStorage.getItem("totalQuestions")) || 10;

const correctAnswers =
  Number(localStorage.getItem("correctAnswers")) || 0;

const wrongAnswers =
  Number(localStorage.getItem("wrongAnswers")) || 0;

const timeTaken =
  Number(localStorage.getItem("timeTaken")) || 0;

// Elements

const scoreText =
  document.getElementById("scoreText");

const correctText =
  document.getElementById("correctAnswers");

const wrongText =
  document.getElementById("wrongAnswers");

const timeText =
  document.getElementById("timeTaken");

const message =
  document.getElementById("message");

// Accuracy

const percentage =
  Math.round((score / totalQuestions) * 100);

// Animate Score

let current = 0;

const animation = setInterval(() => {

  if (current >= percentage) {

    clearInterval(animation);

  } else {

    current++;

    scoreText.textContent = `${current}%`;

  }

}, 20);

// Set Stats

correctText.textContent = correctAnswers;

wrongText.textContent = wrongAnswers;

timeText.textContent = `${timeTaken}s`;

// Motivational Message

if (percentage >= 80) {

  message.textContent =
    "Outstanding Performance!";

  startConfetti();

} else if (percentage >= 50) {

  message.textContent =
    "Good Job! Keep Improving!";

} else {

  message.textContent =
    "Practice More And Try Again!";
}

// Buttons

document.getElementById("restartBtn")
.addEventListener("click", () => {

  window.location.href = "../index.html";

});

document.getElementById("leaderboardBtn")
.addEventListener("click", () => {

  window.location.href = "leaderboard.html";

});

// Share Result

document.getElementById("shareBtn")
.addEventListener("click", async () => {

  const shareData = {

    title: "Ultimate Quiz Arena",

    text:
      `I scored ${percentage}% in Ultimate Quiz Arena!`,

    url: window.location.href

  };

  if (navigator.share) {

    await navigator.share(shareData);

  } else {

    alert("Sharing not supported on this browser.");

  }

});

// Simple Confetti

function startConfetti() {

  const canvas =
    document.getElementById("confettiCanvas");

  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;

  canvas.height = window.innerHeight;

  const pieces = [];

  for (let i = 0; i < 150; i++) {

    pieces.push({

      x: Math.random() * canvas.width,

      y: Math.random() * canvas.height,

      size: Math.random() * 10 + 5,

      speed: Math.random() * 3 + 1

    });

  }

  function update() {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    pieces.forEach(piece => {

      ctx.fillStyle =
        `hsl(${Math.random() * 360},100%,50%)`;

      ctx.fillRect(
        piece.x,
        piece.y,
        piece.size,
        piece.size
      );

      piece.y += piece.speed;

      if (piece.y > canvas.height) {

        piece.y = -10;

      }

    });

    requestAnimationFrame(update);

  }

  update();

}