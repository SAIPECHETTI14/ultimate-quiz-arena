import {

  db,

  collection,

  addDoc

}

from "./firebase.js";

// QUIZ DATA

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

const playerName =
  localStorage.getItem("playerName") || "Player";

const category =
  localStorage.getItem("category") || "General";

const difficulty =
  localStorage.getItem("difficulty") || "easy";

// ELEMENTS

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

// FIXED PERCENTAGE

const percentage =
  Math.round(
    (correctAnswers / totalQuestions) * 100
  );

// ANIMATE SCORE

let current = 0;

const animation =
  setInterval(() => {

    if(current >= percentage){

      clearInterval(animation);

      scoreText.textContent =
        `${percentage}%`;

    }

    else{

      current++;

      scoreText.textContent =
        `${current}%`;

    }

  },20);

// SET STATS

correctText.textContent =
  correctAnswers;

wrongText.textContent =
  wrongAnswers;

timeText.textContent =
  `${timeTaken}s`;

// MOTIVATION

if(percentage >= 80){

  message.textContent =
    "Outstanding Performance!";

  startConfetti();

}

else if(percentage >= 50){

  message.textContent =
    "Good Job! Keep Improving!";

}

else{

  message.textContent =
    "Practice More And Try Again!";

}

// SAVE SCORE ONLINE

async function saveScore(){

  try{

    await addDoc(

      collection(
        db,
        "leaderboard"
      ),

      {

        name: playerName,

        category: category,

        difficulty: difficulty,

        score: correctAnswers,

        total: totalQuestions,

        percentage: percentage,

        correctAnswers: correctAnswers,

        wrongAnswers: wrongAnswers,

        timeTaken: timeTaken,

        date:
          new Date()
          .toLocaleString()

      }

    );

    console.log(
      "Score saved online!"
    );

  }

  catch(error){

    console.log(
      "Firebase Error:",
      error
    );

  }

}

saveScore();

// BUTTONS

document.getElementById(
  "restartBtn"
)
.addEventListener("click", () => {

  window.location.href =
    "../index.html";

});

document.getElementById(
  "leaderboardBtn"
)
.addEventListener("click", () => {

  window.location.href =
    "leaderboard.html";

});

// SHARE

document.getElementById(
  "shareBtn"
)
.addEventListener(
  "click",
  async () => {

    const shareData = {

      title:
        "Ultimate Quiz Arena",

      text:
        `I scored ${percentage}% in Ultimate Quiz Arena!`,

      url:
        window.location.href

    };

    if(navigator.share){

      await navigator.share(
        shareData
      );

    }

    else{

      alert(
        "Sharing not supported."
      );

    }

  }
);

// CONFETTI

function startConfetti(){

  const canvas =
    document.getElementById(
      "confettiCanvas"
    );

  if(!canvas) return;

  const ctx =
    canvas.getContext("2d");

  canvas.width =
    window.innerWidth;

  canvas.height =
    window.innerHeight;

  const pieces = [];

  for(let i = 0; i < 150; i++){

    pieces.push({

      x:
        Math.random()
        *
        canvas.width,

      y:
        Math.random()
        *
        canvas.height,

      size:
        Math.random()
        * 10 + 5,

      speed:
        Math.random()
        * 3 + 1

    });

  }

  function update(){

    ctx.clearRect(

      0,
      0,

      canvas.width,
      canvas.height

    );

    pieces.forEach(piece => {

      ctx.fillStyle =
        `hsl(${Math.random()*360},100%,50%)`;

      ctx.fillRect(

        piece.x,
        piece.y,

        piece.size,
        piece.size

      );

      piece.y += piece.speed;

      if(piece.y > canvas.height){

        piece.y = -10;

      }

    });

    requestAnimationFrame(
      update
    );

  }

  update();

}