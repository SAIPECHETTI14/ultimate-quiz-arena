import {

  auth,
  db,
  collection,
  addDoc,
  serverTimestamp,
  onAuthStateChanged

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

const amount =
Number(localStorage.getItem("totalQuestions")) || Number(localStorage.getItem("quizAmount")) || 10;

const resultId =
localStorage.getItem("activeResultId") ||
`${Date.now()}-${Math.random().toString(36).slice(2)}`;

localStorage.setItem("activeResultId", resultId);

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

// ACCURACY

const percentage =
Math.round(
(score / totalQuestions) * 100
);

// SHOW STATS

if(correctText) correctText.textContent = correctAnswers;
if(wrongText) wrongText.textContent = wrongAnswers;
if(timeText) timeText.textContent = `${timeTaken}s`;

// SCORE ANIMATION

let current = 0;
let animation = null;

if(scoreText) {
  animation = setInterval(()=>{

    if(current >= percentage){

      clearInterval(animation);

    }

    else{

      current++;

      scoreText.textContent =
      `${current}%`;

    }

  },20);
}

// MESSAGE

if(message){

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

}

// SAVE SCORE

onAuthStateChanged(auth,

async(user)=>{

  if(!user) return;

  if(sessionStorage.getItem(`scoreSaved:${resultId}`)) return;

  try{

    await addDoc(

      collection(
        db,
        "leaderboard"
      ),

      {

        name:
        playerName,

        email:
        user.email,

        category:
        category,

        difficulty:
        difficulty,

        amount:
        Number(amount),

        userId:
        user.uid,

        userDisplayName:
        user.displayName || playerName,

        resultId:
        resultId,

        score:
        score,

        total:
        totalQuestions,

        percentage:
        percentage,

        correctAnswers:
        correctAnswers,

        wrongAnswers:
        wrongAnswers,

        timeTaken:
        timeTaken,

        date:
        new Date()
        .toLocaleString(),

        createdAt:
        serverTimestamp()

      }

    );

    sessionStorage.setItem(`scoreSaved:${resultId}`, "true");

    console.log(
      "Score Uploaded"
    );

  }

  catch(error){

    console.log(
      error
    );

  }

}

);

// PLAY AGAIN

const restartBtn = document.getElementById("restartBtn");
if(restartBtn) {
  restartBtn.addEventListener("click", ()=>{

    localStorage.removeItem("activeResultId");

    window.location.href =
    "../index.html";

  });
}

// LEADERBOARD

const leaderboardBtn = document.getElementById("leaderboardBtn");
if(leaderboardBtn) {
  leaderboardBtn.addEventListener("click", ()=>{

    window.location.href =
    "../pages/leaderboard.html";

  });
}

// SHARE

const shareBtn = document.getElementById("shareBtn");
if(shareBtn) {
  shareBtn.addEventListener("click", async()=>{

    const shareData = {

      title:
      "Ultimate Quiz Arena",

      text:
      `I scored ${percentage}% in Ultimate Quiz Arena!`,

      url:
      window.location.href

    };

    if(navigator.share){

      try {
        await navigator.share(shareData);
      } catch(error) {
        console.log("Share cancelled:", error);
      }

    }

    else{

      alert(
        "Sharing not supported on this browser"
      );

    }

  });
}

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

  for(let i=0;i<150;i++){

    pieces.push({

      x:
      Math.random()
      * canvas.width,

      y:
      Math.random()
      * canvas.height,

      size:
      Math.random()
      * 10 + 5,

      speed:
      Math.random()
      * 3 + 1

    });

  }

  let animationId;
  const update = () => {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    pieces.forEach(piece=>{

      ctx.fillStyle =
      `hsl(${Math.random()*360},100%,50%)`;

      ctx.fillRect(

        piece.x,
        piece.y,
        piece.size,
        piece.size

      );

      piece.y +=
      piece.speed;

      if(
        piece.y >
        canvas.height
      ){

        piece.y = -10;

      }

    });

    animationId = requestAnimationFrame(
      update
    );

  };

  update();

  // Stop confetti after 5 seconds to prevent memory leak
  setTimeout(() => cancelAnimationFrame(animationId), 5000);

}
