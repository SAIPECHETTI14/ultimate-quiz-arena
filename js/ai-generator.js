const topicInput = document.getElementById("topicInput");
const difficultyInput = document.getElementById("difficultyInput");
const amountInput = document.getElementById("amountInput");
const generateBtn = document.getElementById("generateBtn");
const startAiQuizBtn = document.getElementById("startAiQuizBtn");
const previewList = document.getElementById("previewList");

const templates = [
  {
    question: "Which statement best describes {topic}?",
    correct: "{topic} is the main concept being tested in this quiz.",
    wrong: ["It is unrelated to the quiz topic.", "It is always a programming language.", "It is only used in movies."]
  },
  {
    question: "What is a good first step when learning {topic}?",
    correct: "Understand the basic terms and examples.",
    wrong: ["Skip the fundamentals.", "Memorize random facts only.", "Avoid practicing."]
  },
  {
    question: "Why should you review mistakes in {topic}?",
    correct: "Mistakes show what needs more practice.",
    wrong: ["Mistakes should be ignored.", "They make scores disappear.", "They remove all progress."]
  },
  {
    question: "Which habit helps improve at {topic}?",
    correct: "Practice consistently and track results.",
    wrong: ["Change topics every minute.", "Never check answers.", "Only guess quickly."]
  },
  {
    question: "What does a high score in {topic} usually show?",
    correct: "Strong understanding of the selected topic.",
    wrong: ["No questions were answered.", "The timer was disabled.", "The topic was not selected."]
  }
];

function buildQuestion(topic, difficulty, index){
  const template = templates[index % templates.length];
  return {
    question: `${template.question.replaceAll("{topic}", topic)} (${index + 1})`,
    correct_answer: template.correct.replaceAll("{topic}", topic),
    incorrect_answers: template.wrong,
    category: `AI: ${topic}`,
    difficulty
  };
}

function renderPreview(questions){
  if(!previewList) return;

  previewList.innerHTML = "";

  questions.forEach((question, index) => {
    const item = document.createElement("div");
    item.className = "feature-item";
    item.innerHTML = `
      <h3>${index + 1}. ${question.question}</h3>
      <p>Answer: ${question.correct_answer}</p>
    `;
    previewList.appendChild(item);
  });
}

generateBtn?.addEventListener("click", () => {
  const topic = topicInput?.value.trim() || "General Knowledge";
  const difficulty = difficultyInput?.value || "easy";
  const amount = Math.max(5, Math.min(Number(amountInput?.value) || 5, 20));
  const questions = Array.from({ length: amount }, (_, index) => buildQuestion(topic, difficulty, index));

  localStorage.setItem("aiGeneratedQuestions", JSON.stringify(questions));
  localStorage.setItem("quizCategory", "aiLocal");
  localStorage.setItem("quizDifficulty", difficulty);
  localStorage.setItem("quizAmount", String(amount));

  renderPreview(questions);
  if(startAiQuizBtn) startAiQuizBtn.disabled = false;
});

startAiQuizBtn?.addEventListener("click", () => {
  window.location.href = "quiz.html";
});
