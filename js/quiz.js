const questionElement =
  document.getElementById("question");

const answersElement =
  document.getElementById("answers");

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

// VARIABLES

let questions = [];

let currentQuestionIndex = 0;

let score = 0;

let timer;

let timeLeft = 15;

let totalTimeTaken = 0;

let answered = false;

// QUIZ SETTINGS

const playerName =
  localStorage.getItem("playerName") || "Player";

const category =
  localStorage.getItem("quizCategory") || "General";

const difficulty =
  localStorage.getItem("quizDifficulty") || "easy";

// SOUNDS

const correctSound =
  new Audio("../sounds/correct.mp3");

const wrongSound =
  new Audio("../sounds/wrong.mp3");

const warningSound =
  new Audio("../sounds/warning.mp3");

// START QUIZ

async function startQuiz(){

  const amount =
    parseInt(
      localStorage.getItem("quizAmount")
    );

  questions =
    await fetchQuestions(
      category,
      difficulty,
      amount
    );

  if(
    !questions ||
    questions.length === 0
  ){

    questionElement.textContent =
      "Failed to load questions.";

    return;

  }

  showQuestion();

}

startQuiz();

// SHOW QUESTION

function showQuestion(){

  answered = false;

  resetState();

  const currentQuestion =
    questions[currentQuestionIndex];

  questionCounter.textContent =
    `Question ${
      currentQuestionIndex + 1
    } / ${questions.length}`;

  categoryBadge.textContent =
    decodeHTML(
      currentQuestion.category
    );

  difficultyBadge.textContent =
    currentQuestion.difficulty
      .toUpperCase();

  questionElement.innerHTML =
    decodeHTML(
      currentQuestion.question
    );

  progressBar.style.width =
    `${
      (
        (currentQuestionIndex + 1)
        / questions.length
      ) * 100
    }%`;

  const answers = [

    ...currentQuestion.incorrect_answers,

    currentQuestion.correct_answer

  ];

  answers.sort(
    () => Math.random() - 0.5
  );

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
      () => selectAnswer(
        button,
        answer
      )
    );

    answersElement.appendChild(
      button
    );

  });

  startTimer();

}

// RESET

function resetState(){

  clearInterval(timer);

  warningSound.pause();

  warningSound.currentTime = 0;

  timeLeft = 15;

  timerElement.textContent =
    timeLeft;

  answersElement.innerHTML = "";

}

// TIMER

function startTimer(){

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

        if(warningSound.paused){

          warningSound.currentTime = 0;

          warningSound.play();

        }

      }

      // TIME UP

      if(timeLeft <= 0){

        clearInterval(timer);

        warningSound.pause();

        warningSound.currentTime = 0;

        lockAnswers();

        setTimeout(() => {

          nextQuestion();

        },1000);

      }

    },1000);

}

// SELECT ANSWER

function selectAnswer(
  button,
  selectedAnswer
){

  if(answered) return;

  answered = true;

  clearInterval(timer);

  warningSound.pause();

  warningSound.currentTime = 0;

  const correctAnswer =
    questions[currentQuestionIndex]
      .correct_answer;

  const buttons =
    document.querySelectorAll(
      ".answer-btn"
    );

  // FREEZE ANSWERS

  buttons.forEach((btn) => {

    btn.disabled = true;

  });

  // CORRECT

  if(
    selectedAnswer === correctAnswer
  ){

    score++;

    button.classList.add(
      "correct"
    );

    correctSound.currentTime = 0;

    correctSound.play();

  }

  // WRONG

  else{

    button.classList.add(
      "wrong"
    );

    wrongSound.currentTime = 0;

    wrongSound.play();

    buttons.forEach((btn) => {

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

  // AUTO NEXT

  setTimeout(() => {

    nextQuestion();

  },1200);

}

// LOCK ANSWERS

function lockAnswers(){

  const buttons =
    document.querySelectorAll(
      ".answer-btn"
    );

  buttons.forEach((btn) => {

    btn.disabled = true;

  });

}

// NEXT QUESTION

function nextQuestion(){

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

// FINISH QUIZ

function finishQuiz(){

  clearInterval(timer);

  warningSound.pause();

  warningSound.currentTime = 0;

  // SAVE RESULTS

  localStorage.setItem(
    "quizScore",
    score
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
    "totalQuestions",
    questions.length
  );

  localStorage.setItem(
    "timeTaken",
    totalTimeTaken
  );

  localStorage.setItem(
    "playerName",
    playerName
  );

  localStorage.setItem(
    "category",
    category
  );

  localStorage.setItem(
    "difficulty",
    difficulty
  );

  // GO TO RESULT PAGE

  window.location.href =
    "result.html";

}

// HTML DECODE

function decodeHTML(html){

  const txt =
    document.createElement(
      "textarea"
    );

  txt.innerHTML = html;

  return txt.value;

}