import {
  auth,
  db,
  collection,
  getDocs,
  doc,
  getDoc,
  onAuthStateChanged
} from "./firebase.js";

const adminGate = document.getElementById("adminGate");
const adminContent = document.getElementById("adminContent");
const totalUsers = document.getElementById("totalUsers");
const totalScores = document.getElementById("totalScores");
const averageScore = document.getElementById("averageScore");
const adminRows = document.getElementById("adminRows");

function setText(element, value){
  if(element) element.textContent = value;
}

function isFallbackAdmin(user){
  const adminEmails = JSON.parse(localStorage.getItem("adminEmails") || "[]");
  return adminEmails.includes(user.email);
}

async function loadAdmin(user){
  const profileSnap = await getDoc(doc(db, "users", user.uid));
  const role = profileSnap.exists() ? profileSnap.data().role : "user";

  if(role !== "admin" && !isFallbackAdmin(user)){
    setText(adminGate, "Admin access required. Set this user's Firestore role to admin.");
    return;
  }

  if(adminGate) adminGate.style.display = "none";
  if(adminContent) adminContent.style.display = "block";

  const [usersSnap, scoresSnap] = await Promise.all([
    getDocs(collection(db, "users")),
    getDocs(collection(db, "leaderboard"))
  ]);

  const scores = [];
  scoresSnap.forEach((scoreDoc) => scores.push(scoreDoc.data()));

  const average = scores.length
    ? Math.round(scores.reduce((sum, item) => sum + (Number(item.percentage) || 0), 0) / scores.length)
    : 0;

  setText(totalUsers, usersSnap.size);
  setText(totalScores, scores.length);
  setText(averageScore, `${average}%`);

  if(adminRows){
    adminRows.innerHTML = scores
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      .slice(0, 25)
      .map((score) => `
        <tr>
          <td>${score.name || score.userDisplayName || "Player"}</td>
          <td>${score.email || "-"}</td>
          <td>${score.category || "-"}</td>
          <td>${score.percentage || 0}%</td>
          <td>${score.date || "-"}</td>
        </tr>
      `)
      .join("");
  }
}

onAuthStateChanged(auth, (user) => {
  if(!user){
    window.location.href = "login.html";
    return;
  }

  loadAdmin(user).catch((error) => {
    console.error(error);
    setText(adminGate, "Could not load admin dashboard.");
  });
});
