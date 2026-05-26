import { auth, signOut } from "./js/firebase.js";

// PAGE LOADING ANIMATION

window.addEventListener("load", () => {

  document.body.style.opacity = "1";

});

// FORM

const form =
document.getElementById(
  "quizConfigForm"
);

// MOBILE MENU

const mobileMenuBtn =
document.getElementById(
  "mobileMenuBtn"
);

const navLinks =
document.getElementById(
  "navLinks"
);

const logoutHomeBtn =
document.getElementById(
  "logoutHomeBtn"
);

// MOBILE NAV TOGGLE

mobileMenuBtn.addEventListener(
  "click",
  () => {

    navLinks.classList.toggle(
      "active"
    );

  }
);

if(logoutHomeBtn){

  logoutHomeBtn.addEventListener(
    "click",
    async () => {

      await signOut(auth);

      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");

      window.location.href =
      "pages/login.html";

    }
  );

}

// TOAST FUNCTION

function showToast(message){

  const toast =
  document.getElementById(
    "toast"
  );

  toast.textContent =
  message;

  toast.classList.add(
    "show"
  );

  setTimeout(()=>{

    toast.classList.remove(
      "show"
    );

  },3000);

}

// FORM SUBMIT

form.addEventListener(
  "submit",
  (e)=>{

    e.preventDefault();

    const category =
    document.getElementById(
      "category"
    ).value;

    const difficulty =
    document.getElementById(
      "difficulty"
    ).value;

    const amount =
    document.getElementById(
      "amount"
    ).value;

    localStorage.setItem(
      "quizCategory",
      category
    );

    localStorage.setItem(
      "quizDifficulty",
      difficulty
    );

    localStorage.setItem(
      "quizAmount",
      amount
    );

    const loggedInName = localStorage.getItem("playerName") || "Player";
    localStorage.setItem("playerName", loggedInName);

    showToast(
      "Quiz Starting..."
    );

    // REDIRECT

    setTimeout(()=>{

      window.location.href =
      "pages/quiz.html";

    },1500);

  }
);

// USER WELCOME TEXT
const welcomeText = document.getElementById("welcomeText");
if(welcomeText){
  const loggedInName = localStorage.getItem("playerName") || "Player";
  welcomeText.textContent = `Welcome back, ${loggedInName}! Ready for a new quiz?`;
}

// ACCESSIBILITY

document.querySelectorAll(
  "button"
)
.forEach(button=>{

  button.setAttribute(

    "aria-label",

    button.textContent

  );

});

// ENTER KEY START QUIZ

document.addEventListener(
  "keydown",
  (e)=>{

    if(e.key === "Enter"){

      const active =
      document.activeElement
      .tagName;

      if(
        active !==
        "TEXTAREA"
      ){

        form.requestSubmit();

      }

    }

  }
);

// SMOOTH PAGE TRANSITIONS

document.querySelectorAll("a")
.forEach(link=>{

  link.addEventListener(
    "click",
    e=>{

      const href =
      link.getAttribute(
        "href"
      );

      if(
        href &&
        !href.startsWith("#")
      ){

        e.preventDefault();

        document.body.style.opacity =
        "0";

        setTimeout(()=>{

          window.location.href =
          href;

        },300);

      }

    }
  );

});
