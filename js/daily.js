const dailyTitle = document.getElementById("dailyTitle");
const dailyMeta = document.getElementById("dailyMeta");
const startDailyBtn = document.getElementById("startDailyBtn");

const challenges = [
  { category: "coding", label: "Coding Sprint", difficulty: "easy", amount: 10 },
  { category: "scienceLocal", label: "Science Lab", difficulty: "medium", amount: 10 },
  { category: "moviesLocal", label: "Movie Night", difficulty: "easy", amount: 10 },
  { category: "sportsLocal", label: "Sports Arena", difficulty: "medium", amount: 10 },
  { category: "anime", label: "Anime Quest", difficulty: "hard", amount: 10 }
];

const dayNumber = Math.floor(Date.now() / 86400000);
const challenge = challenges[dayNumber % challenges.length];

if(dailyTitle) dailyTitle.textContent = challenge.label;
if(dailyMeta){
  dailyMeta.textContent = `${challenge.amount} questions - ${challenge.difficulty.toUpperCase()} - refreshes daily`;
}

startDailyBtn?.addEventListener("click", () => {
  localStorage.setItem("quizCategory", challenge.category);
  localStorage.setItem("quizDifficulty", challenge.difficulty);
  localStorage.setItem("quizAmount", String(challenge.amount));
  localStorage.setItem("dailyChallenge", new Date().toISOString().slice(0, 10));
  window.location.href = "quiz.html";
});
