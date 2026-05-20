// PAGE LOADING ANIMATION

window.addEventListener("load", () => {

  document.body.style.opacity = "1";

});
// FORM

const form = document.getElementById("quizConfigForm");

// MOBILE MENU

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");

mobileMenuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// TOAST FUNCTION

function showToast(message) {

  const toast = document.getElementById("toast");

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);

}

// FORM SUBMIT

form.addEventListener("submit", (e) => {

  e.preventDefault();

  const category = document.getElementById("category").value;

  const difficulty = document.getElementById("difficulty").value;

  const amount = document.getElementById("amount").value;

  const playerName = document.getElementById("playerName").value;

  // Save settings to localStorage

  localStorage.setItem("quizCategory", category);

  localStorage.setItem("quizDifficulty", difficulty);

  localStorage.setItem("quizAmount", amount);

  localStorage.setItem("playerName", playerName);

  showToast("Quiz Starting...");

  // Redirect

  setTimeout(() => {

    window.location.href = "pages/quiz.html";

  }, 1500);

});
// ACCESSIBILITY

document.querySelectorAll("button")
.forEach(button => {

  button.setAttribute(
    "aria-label",
    button.textContent
  );

});

// ENTER KEY START QUIZ

document.addEventListener("keydown", (e) => {

  if(e.key === "Enter"){

    const active =
      document.activeElement.tagName;

    if(active !== "TEXTAREA"){

      form.requestSubmit();

    }

  }

});
// SMOOTH PAGE TRANSITIONS

document.querySelectorAll("a")
.forEach(link => {

  link.addEventListener("click", e => {

    const href = link.getAttribute("href");

    if(href && !href.startsWith("#")){

      e.preventDefault();

      document.body.style.opacity = "0";

      setTimeout(() => {

        window.location.href = href;

      }, 300);

    }

  });

});