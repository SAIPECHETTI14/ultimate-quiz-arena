const questionElement =
  document.getElementById("question");

const answersElement =
  document.getElementById("answers");

const nextBtn =
  document.getElementById("nextBtn");

const prevBtn =
  document.getElementById("prevBtn");

const timerElement =
  document.getElementById("timer");

const progressBar =
  document.getElementById("progressBar");

const questionCounter =
  document.getElementById("questionCounter");

const categoryBadge =
  document.getElementById("categoryBadge");

const difficultyBadge =
  document.getElementById("difficultyBadge");

// QUIZ VARIABLES

let questions = [];

let currentQuestionIndex = 0;

let score = 0;

let timer;

let timeLeft = 15;

let selectedAnswers = [];

let totalTimeTaken = 0;

// SOUNDS

const correctSound =
  new Audio("../sounds/correct.mp3");

const wrongSound =
  new Audio("../sounds/wrong.mp3");

const warningSound =
  new Audio("../sounds/warning.mp3");

// START QUIZ

async function startQuiz() {

  const category =
    localStorage.getItem("quizCategory");

  const difficulty =
    localStorage.getItem("quizDifficulty");

  const amount =
    parseInt(
      localStorage.getItem("quizAmount")
    );

  // FETCH QUESTIONS

  questions =
    await fetchQuestions(
      category,
      difficulty,
      amount
    );

  // CHECK

  if(
    !questions ||
    questions.length === 0
  ){

    questionElement.textContent =
      "Failed to load questions.";

    return;
  }

  currentQuestionIndex = 0;

  showQuestion();

}

// START QUIZ

startQuiz();

// SHOW QUESTION

function showQuestion(){

  // STOP OLD WARNING SOUND

  warningSound.pause();

  warningSound.currentTime = 0;

  resetState();

  const currentQuestion =
    questions[currentQuestionIndex];

  // SAFETY

  if(!currentQuestion){

    questionElement.textContent =
      "Question not found.";

    return;
  }

  // QUESTION COUNTER

  questionCounter.textContent =
    `Question ${
      currentQuestionIndex + 1
    } / ${questions.length}`;

  // CATEGORY

  categoryBadge.textContent =
    decodeHTML(
      currentQuestion.category
    );

  // DIFFICULTY

  difficultyBadge.textContent =
    currentQuestion.difficulty
      .toUpperCase();

  // QUESTION

  questionElement.innerHTML =
    decodeHTML(
      currentQuestion.question
    );

  // PROGRESS BAR

  progressBar.style.width =
    `${
      (
        (currentQuestionIndex + 1)
        / questions.length
      ) * 100
    }%`;

  // ANSWERS

  const answers = [

    ...(currentQuestion.incorrect_answers || []),

    currentQuestion.correct_answer

  ];

  // SHUFFLE

  answers.sort(
    () => Math.random() - 0.5
  );

  // CREATE BUTTONS

  answers.forEach((answer) => {

    const button =
      document.createElement("button");

    button.classList.add(
      "answer-btn"
    );

    button.innerHTML =
      decodeHTML(answer);

    button.addEventListener(
      "click",
      () => {

        selectAnswer(
          button,
          answer
        );

      }
    );

    answersElement.appendChild(
      button
    );

  });

  // START TIMER

  startTimer();

}

// RESET

function resetState(){

  clearInterval(timer);

  // STOP WARNING SOUND

  warningSound.pause();

  warningSound.currentTime = 0;

  timeLeft = 15;

  timerElement.textContent =
    timeLeft;

  answersElement.innerHTML = "";

}

// TIMER

function startTimer(){

  clearInterval(timer);

  // RESET WARNING SOUND

  warningSound.pause();

  warningSound.currentTime = 0;

  timeLeft = 15;

  timerElement.textContent =
    timeLeft;

  timer =
    setInterval(() => {

      timeLeft--;

      totalTimeTaken++;

      timerElement.textContent =
        timeLeft;

      // WARNING SOUND

      if(
        timeLeft <= 8 &&
        timeLeft > 0
      ){

        // PLAY ONLY ONCE

        if(warningSound.paused){

          warningSound.currentTime = 0;

          warningSound.play();

        }

      }

      // TIMER END

      if(timeLeft <= 0){

        clearInterval(timer);

        timerElement.textContent = 0;

        // STOP SOUND

        warningSound.pause();

        warningSound.currentTime = 0;

        autoNextQuestion();

      }

    }, 1000);

}

// SELECT ANSWER

function selectAnswer(
  button,
  selectedAnswer
){

  clearInterval(timer);

  // STOP WARNING SOUND

  warningSound.pause();

  warningSound.currentTime = 0;

  const correctAnswer =
    questions[currentQuestionIndex]
      .correct_answer;

  const allButtons =
    document.querySelectorAll(
      ".answer-btn"
    );

  // DISABLE ALL

  allButtons.forEach((btn) => {

    btn.disabled = true;

  });

  // CORRECT

  if(
    selectedAnswer === correctAnswer
  ){

    button.classList.add(
      "correct"
    );

    correctSound.currentTime = 0;

    correctSound.play();

    score++;

  }

  // WRONG

  else{

    button.classList.add(
      "wrong"
    );

    wrongSound.currentTime = 0;

    wrongSound.play();

    // SHOW CORRECT ANSWER

    allButtons.forEach((btn) => {

      if(
        btn.textContent ===
        decodeHTML(correctAnswer)
      ){

        btn.classList.add(
          "correct"
        );

      }

    });

  }

  // SAVE ANSWER

  selectedAnswers[
    currentQuestionIndex
  ] = selectedAnswer;

}

// AUTO NEXT

function autoNextQuestion(){

  if(
    currentQuestionIndex <
    questions.length - 1
  ){

    currentQuestionIndex++;

    showQuestion();

  }

  else{

    finishQuiz();

  }

}

// NEXT BUTTON

nextBtn.addEventListener(
  "click",
  () => {

    warningSound.pause();

    warningSound.currentTime = 0;

    if(
      currentQuestionIndex <
      questions.length - 1
    ){

      currentQuestionIndex++;

      showQuestion();

    }

    else{

      finishQuiz();

    }

  }
);

// PREVIOUS BUTTON

prevBtn.addEventListener(
  "click",
  () => {

    warningSound.pause();

    warningSound.currentTime = 0;

    if(currentQuestionIndex > 0){

      currentQuestionIndex--;

      showQuestion();

    }

  }
);

// FINISH QUIZ

function finishQuiz(){

  clearInterval(timer);

  // STOP WARNING SOUND

  warningSound.pause();

  warningSound.currentTime = 0;

  localStorage.setItem(
    "quizScore",
    score
  );

  localStorage.setItem(
    "totalQuestions",
    questions.length
  );

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

  // SAVE LEADERBOARD

  saveLeaderboard();

  // RESULT PAGE

  window.location.href =
    "result.html";

}

// SAVE LEADERBOARD

function saveLeaderboard(){

  const playerName =
    localStorage.getItem(
      "playerName"
    ) || "Player";

  const leaderboard =
    JSON.parse(
      localStorage.getItem(
        "leaderboard"
      )
    ) || [];

  leaderboard.push({

    name:playerName,

    score:score,

    total:questions.length,

    date:new Date()
      .toLocaleDateString()

  });

  // SORT

  leaderboard.sort(
    (a,b) => b.score - a.score
  );

  // SAVE TOP 10

  localStorage.setItem(
    "leaderboard",

    JSON.stringify(
      leaderboard.slice(0,10)
    )
  );

}

// KEYBOARD SHORTCUTS

document.addEventListener(
  "keydown",
  (e) => {

    if(e.key === "ArrowRight"){

      nextBtn.click();

    }

    if(e.key === "ArrowLeft"){

      prevBtn.click();

    }

  }
);

// DECODE HTML

function decodeHTML(html){

  const txt =
    document.createElement(
      "textarea"
    );

  txt.innerHTML = html;

  return txt.value;

}