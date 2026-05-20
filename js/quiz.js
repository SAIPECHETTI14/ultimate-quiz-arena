const questionElement = document.getElementById("question");

const answersElement = document.getElementById("answers");

const nextBtn = document.getElementById("nextBtn");

const prevBtn = document.getElementById("prevBtn");

const timerElement = document.getElementById("timer");

const progressBar = document.getElementById("progressBar");

const questionCounter = document.getElementById("questionCounter");

const categoryBadge = document.getElementById("categoryBadge");

const difficultyBadge = document.getElementById("difficultyBadge");

// Quiz Variables

let questions = [];

let currentQuestionIndex = 0;

let score = 0;

let timer;

let timeLeft = 15;

let selectedAnswers = [];

let totalTimeTaken = 0;

// Sound Effects

const correctSound = new Audio(
  "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3"
);

const wrongSound = new Audio(
  "https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3"
);

const warningSound = new Audio(
  "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
);

// Start Quiz

async function startQuiz() {

  questions = await fetchQuizQuestions();

  if (questions.length === 0) {

    alert("Failed to load quiz questions.");

    return;

  }

  showQuestion();

}

startQuiz();

// Show Question

function showQuestion() {

  resetState();

  startTimer();

  const currentQuestion = questions[currentQuestionIndex];

  // Update UI

  questionCounter.textContent =
    `Question ${currentQuestionIndex + 1} / ${questions.length}`;

  progressBar.style.width =
    `${((currentQuestionIndex + 1) / questions.length) * 100}%`;

  categoryBadge.textContent =
    decodeHTML(currentQuestion.category);

  difficultyBadge.textContent =
    currentQuestion.difficulty.toUpperCase();

  questionElement.innerHTML =
    decodeHTML(currentQuestion.question);

  // Answers

  const answers = [
    ...(currentQuestion.incorrect_answers || []),
    currentQuestion.correct_answer
  ];

  // Shuffle answers

  answers.sort(() => Math.random() - 0.5);

  answers.forEach(answer => {

    const button = document.createElement("button");

    button.classList.add("answer-btn");

    button.innerHTML = decodeHTML(answer);

    button.addEventListener("click", () =>
      selectAnswer(button, answer)
    );

    answersElement.appendChild(button);

  });

}

// Reset

function resetState() {

  clearInterval(timer);

  timeLeft = 15;

  timerElement.textContent = timeLeft;

  answersElement.innerHTML = "";

}

// Timer

// TIMER

function startTimer() {

  clearInterval(timer);

  timeLeft = 15;

  timerElement.textContent = timeLeft;

  timer = setInterval(() => {

    timeLeft--;

    totalTimeTaken++;

    timerElement.textContent = timeLeft;

    // WARNING SOUND

    if(timeLeft <= 5 && timeLeft > 0){

      warningSound.currentTime = 0;

      warningSound.play();

    }

    // TIME FINISHED

    if(timeLeft <= 0){

      clearInterval(timer);

      timerElement.textContent = 0;

      autoNextQuestion();

    }

  }, 1000);

}

// Select Answer

function selectAnswer(button, selectedAnswer) {

  clearInterval(timer);

  const correctAnswer =
    questions[currentQuestionIndex].correct_answer;

  const allButtons =
    document.querySelectorAll(".answer-btn");

  // Disable all buttons

  allButtons.forEach(btn => {
    btn.disabled = true;
  });

  // Correct

  if (selectedAnswer === correctAnswer) {

    button.classList.add("correct");

    correctSound.play();

    score++;

  } else {

    button.classList.add("wrong");

    wrongSound.play();

    // Highlight correct answer

    allButtons.forEach(btn => {

      if (btn.textContent === correctAnswer) {

        btn.classList.add("correct");

      }

    });

  }

  // Save answer

  selectedAnswers[currentQuestionIndex] = selectedAnswer;

}

// Auto Next

function autoNextQuestion() {

  if (currentQuestionIndex < questions.length - 1) {

    currentQuestionIndex++;

    showQuestion();

  } else {

    finishQuiz();

  }

}

// Next Button

nextBtn.addEventListener("click", () => {

  if (currentQuestionIndex < questions.length - 1) {

    currentQuestionIndex++;

    showQuestion();

  } else {

    finishQuiz();

  }

});

// Previous Button

prevBtn.addEventListener("click", () => {

  if (currentQuestionIndex > 0) {

    currentQuestionIndex--;

    showQuestion();

  }

});

// Finish Quiz

function finishQuiz() {

  localStorage.setItem("quizScore", score);

  localStorage.setItem("totalQuestions", questions.length);

  localStorage.setItem(
    "correctAnswers",
    score
  );

  localStorage.setItem(
    "wrongAnswers",
    questions.length - score
  );

  localStorage.setItem(
    "timeTaken",
    totalTimeTaken
  );

  // Save leaderboard

  saveLeaderboard();

  // Redirect

  window.location.href = "result.html";

}

// Save Leaderboard

function saveLeaderboard() {

  const playerName =
    localStorage.getItem("playerName") || "Player";

  const leaderboard =
    JSON.parse(localStorage.getItem("leaderboard")) || [];

  leaderboard.push({

    name: playerName,

    score: score,

    total: questions.length,

    date: new Date().toLocaleDateString()

  });

  // Sort highest score

  leaderboard.sort((a, b) => b.score - a.score);

  // Save top 10

  localStorage.setItem(
    "leaderboard",
    JSON.stringify(leaderboard.slice(0, 10))
  );

}

// Keyboard Shortcuts

document.addEventListener("keydown", (e) => {

  if (e.key === "ArrowRight") {

    nextBtn.click();

  }

  if (e.key === "ArrowLeft") {

    prevBtn.click();

  }

});