import {
  auth,
  db,
  provider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "./firebase.js";

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const googleRegisterBtn = document.getElementById("googleRegisterBtn");
const resetPasswordBtn = document.getElementById("resetPasswordBtn");
const authMessage = document.getElementById("authMessage");

function showMessage(message, isError = false){
  if(authMessage){
    authMessage.textContent = message;
    authMessage.className = isError ? "auth-message error" : "auth-message";
    return;
  }

  alert(message);
}

function setSession(user, fallbackName){
  const name = user.displayName || fallbackName || user.email?.split("@")[0] || "Player";

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("playerName", name);
  localStorage.setItem("userId", user.uid);
  localStorage.setItem("userEmail", user.email || "");
}

async function saveUserProfile(user, username){
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);
  const existing = snapshot.exists() ? snapshot.data() : {};

  await setDoc(userRef, {
    uid: user.uid,
    username: username || existing.username || user.displayName || "Player",
    email: user.email || existing.email || "",
    avatar: user.photoURL || existing.avatar || "",
    provider: user.providerData?.[0]?.providerId || existing.provider || "password",
    emailVerified: user.emailVerified,
    role: existing.role || "user",
    updatedAt: serverTimestamp(),
    createdAt: existing.createdAt || serverTimestamp()
  }, { merge: true });
}

registerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if(password.length < 6){
    showMessage("Password must be at least 6 characters.", true);
    return;
  }

  try{
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: username });
    await sendEmailVerification(userCredential.user);
    await saveUserProfile(userCredential.user, username);
    setSession(userCredential.user, username);
    showMessage("Registration successful. Verification email sent.");
    window.location.href = "../index.html";
  }
  catch(error){
    showMessage(error.message, true);
  }
});

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  try{
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await saveUserProfile(userCredential.user);
    setSession(userCredential.user);
    showMessage("Login successful.");
    window.location.href = "../index.html";
  }
  catch(error){
    showMessage(error.message, true);
  }
});

async function continueWithGoogle(){
  try{
    const result = await signInWithPopup(auth, provider);
    await saveUserProfile(result.user);
    setSession(result.user);
    showMessage("Google login successful.");
    window.location.href = "../index.html";
  }
  catch(error){
    showMessage(error.message, true);
  }
}

googleLoginBtn?.addEventListener("click", continueWithGoogle);
googleRegisterBtn?.addEventListener("click", continueWithGoogle);

resetPasswordBtn?.addEventListener("click", async () => {
  const emailInput = document.getElementById("loginEmail");
  const email = emailInput?.value.trim() || prompt("Enter your email");

  if(!email) return;

  try{
    await sendPasswordResetEmail(auth, email);
    showMessage("Password reset email sent.");
  }
  catch(error){
    showMessage(error.message, true);
  }
});
