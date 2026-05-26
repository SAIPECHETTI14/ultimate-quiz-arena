import {
  auth,
  db,
  collection,
  getDocs,
  signOut,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  onAuthStateChanged
} from "./firebase.js";

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const emailStatus = document.getElementById("emailStatus");
const editUsername = document.getElementById("editUsername");
const saveUsernameBtn = document.getElementById("saveUsernameBtn");
const totalQuiz = document.getElementById("totalQuiz");
const bestScore = document.getElementById("bestScore");
const totalXP = document.getElementById("totalXP");
const xpProgress = document.getElementById("xpProgress");
const xpText = document.getElementById("xpText");
const badges = document.getElementById("badges");
const historyList = document.getElementById("historyList");
const profileAvatar = document.getElementById("profileAvatar");
const profileAvatarInput = document.getElementById("avatarInput");
const homeBtn = document.getElementById("homeBtn");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;
let username = localStorage.getItem("playerName") || "Player";

const defaultAvatar = "https://i.ibb.co/4pDNDk1/avatar.png";

function setText(element, value){
  if(element) element.textContent = value;
}

function renderProfile(user, profile = {}){
  username = profile.username || user.displayName || localStorage.getItem("playerName") || "Player";
  const avatar = profile.avatar || user.photoURL || localStorage.getItem(`profileAvatar:${user.uid}`) || defaultAvatar;

  localStorage.setItem("playerName", username);
  localStorage.setItem("userId", user.uid);
  localStorage.setItem("userEmail", user.email || "");

  setText(profileName, username);
  setText(profileEmail, user.email || "No email");
  setText(emailStatus, user.emailVerified ? "Email verified" : "Email not verified yet");

  if(editUsername) editUsername.value = username;
  if(profileAvatar) profileAvatar.src = avatar;
}

async function loadUserProfile(user){
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if(snapshot.exists()){
    return snapshot.data();
  }

  const profile = {
    uid: user.uid,
    username: user.displayName || username,
    email: user.email || "",
    avatar: user.photoURL || "",
    role: "user",
    emailVerified: user.emailVerified,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(userRef, profile, { merge: true });
  return profile;
}

function getAchievements(userScores, highest, xp){
  const earned = [];

  if(userScores.length >= 1) earned.push(["First Quiz", "Complete your first quiz"]);
  if(highest >= 80) earned.push(["Quiz Master", "Score 80% or higher"]);
  if(highest === 100) earned.push(["Perfect Run", "Score 100%"]);
  if(userScores.length >= 10) earned.push(["10 Quizzes", "Attend 10 quizzes"]);
  if(xp >= 1000) earned.push(["XP Hunter", "Reach 1000 XP"]);

  return earned;
}

function renderHistory(userScores){
  if(!historyList) return;

  historyList.innerHTML = "";

  if(userScores.length === 0){
    historyList.innerHTML = `
      <div class="history-item empty">
        <p>No quiz history yet. Play a quiz to save your first score.</p>
      </div>
    `;
    return;
  }

  userScores
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
    .forEach((quiz) => {
      const item = document.createElement("div");
      item.className = "history-item";
      item.innerHTML = `
        <h3>${quiz.category || "Quiz"}</h3>
        <p>Score: ${quiz.percentage || 0}% (${quiz.score || 0}/${quiz.total || 0})</p>
        <p>Difficulty: ${quiz.difficulty || "-"}</p>
        <p>Time: ${quiz.timeTaken || 0}s</p>
        <p>${quiz.date || "-"}</p>
      `;
      historyList.appendChild(item);
    });
}

async function loadHistory(){
  if(!currentUser) return;

  try{
    const snapshot = await getDocs(collection(db, "leaderboard"));
    const userScores = [];

    snapshot.forEach((scoreDoc) => {
      const data = scoreDoc.data();
      if(data.userId === currentUser.uid || data.email === currentUser.email){
        userScores.push(data);
      }
    });

    const highest = userScores.reduce((best, quiz) => Math.max(best, Number(quiz.percentage) || 0), 0);
    const xp = userScores.reduce((sum, quiz) => sum + ((Number(quiz.percentage) || 0) * 2) + 50, 0);
    const level = Math.floor(xp / 500) + 1;
    const progress = xp % 500;

    setText(totalQuiz, userScores.length);
    setText(bestScore, `${highest}%`);
    setText(totalXP, xp);
    setText(xpText, `Level ${level} - ${progress}/500 XP`);
    if(xpProgress) xpProgress.style.width = `${Math.min((progress / 500) * 100, 100)}%`;

    if(badges){
      const achievements = getAchievements(userScores, highest, xp);
      badges.innerHTML = achievements.length
        ? achievements.map(([title, detail]) => `<div class="badge" title="${detail}">${title}</div>`).join("")
        : `<div class="badge locked">No badges yet</div>`;
    }

    renderHistory(userScores);
  }
  catch(error){
    console.error(error);
    if(historyList){
      historyList.innerHTML = `<div class="history-item empty"><p>Could not load quiz history.</p></div>`;
    }
  }
}

profileAvatarInput?.addEventListener("change", function(){
  const file = this.files[0];
  if(!file || !currentUser) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    const avatar = event.target.result;
    if(profileAvatar) profileAvatar.src = avatar;
    localStorage.setItem(`profileAvatar:${currentUser.uid}`, avatar);
    await setDoc(doc(db, "users", currentUser.uid), {
      avatar,
      updatedAt: serverTimestamp()
    }, { merge: true });
  };
  reader.readAsDataURL(file);
});

saveUsernameBtn?.addEventListener("click", async () => {
  if(!currentUser || !editUsername) return;

  const newName = editUsername.value.trim();
  if(!newName){
    alert("Enter username");
    return;
  }

  try{
    await updateProfile(currentUser, { displayName: newName });
    await setDoc(doc(db, "users", currentUser.uid), {
      username: newName,
      updatedAt: serverTimestamp()
    }, { merge: true });

    username = newName;
    localStorage.setItem("playerName", newName);
    setText(profileName, newName);
    alert("Username updated.");
    await loadHistory();
  }
  catch(error){
    alert(error.message);
  }
});

homeBtn?.addEventListener("click", () => {
  window.location.href = "../index.html";
});

logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userId");
  localStorage.removeItem("userEmail");
  window.location.href = "login.html";
});

onAuthStateChanged(auth, async (user) => {
  if(!user){
    window.location.href = "login.html";
    return;
  }

  currentUser = user;
  const profile = await loadUserProfile(user);
  renderProfile(user, profile);
  await loadHistory();
});
