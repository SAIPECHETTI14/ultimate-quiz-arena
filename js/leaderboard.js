// LOADING SCREEN

window.addEventListener("load", () => {

  setTimeout(() => {

    document.getElementById(
      "loadingScreen"
    ).style.display = "none";

  }, 1200);

});

// PARTICLES

const particlesContainer =
  document.getElementById("particles");

for(let i = 0; i < 50; i++){

  const particle =
    document.createElement("div");

  particle.classList.add("particle");

  particle.style.width =
    `${Math.random() * 8 + 2}px`;

  particle.style.height =
    particle.style.width;

  particle.style.left =
    `${Math.random() * 100}%`;

  particle.style.animationDuration =
    `${Math.random() * 10 + 5}s`;

  particle.style.opacity =
    Math.random();

  particlesContainer.appendChild(
    particle
  );

}

// GET DATA

let leaderboard =
  JSON.parse(
    localStorage.getItem(
      "leaderboard"
    )
  ) || [];

// REMOVE BAD DATA

leaderboard =
  leaderboard.filter(player => {

    return (
      player &&
      player.name &&
      typeof player.score === "number"
    );

  });

// SORT HIGHEST SCORE

leaderboard.sort(
  (a,b) => {

    // SCORE SORT

    if(b.score !== a.score){

      return b.score - a.score;

    }

    // IF SAME SCORE
    // LESS TIME WINS

    return (
      (a.timeTaken || 9999)
      -
      (b.timeTaken || 9999)
    );

  }
);

// KEEP TOP 10 ONLY

leaderboard =
  leaderboard.slice(0,10);

// SAVE CLEAN DATA

localStorage.setItem(
  "leaderboard",

  JSON.stringify(leaderboard)
);

// TABLE

const leaderboardBody =
  document.getElementById(
    "leaderboardBody"
  );

// RENDER

function renderLeaderboard(){

  leaderboardBody.innerHTML = "";

  if(leaderboard.length === 0){

    leaderboardBody.innerHTML = `
      <tr>
        <td colspan="5">
          No scores yet.
        </td>
      </tr>
    `;

    return;

  }

  leaderboard.forEach(
    (player,index) => {

      const row =
        document.createElement("tr");

      // PERCENTAGE

      const percentage =
        Math.round(
          (
            player.score /
            player.total
          ) * 100
        );

      // MEDALS

      let rankDisplay =
        `#${index + 1}`;

      if(index === 0){

        rankDisplay = "🥇";

      }

      else if(index === 1){

        rankDisplay = "🥈";

      }

      else if(index === 2){

        rankDisplay = "🥉";

      }

      row.innerHTML = `

        <td>${rankDisplay}</td>

        <td>
          ${player.name}
        </td>

        <td>
          ${player.score}
          /
          ${player.total}
          <br>
          <small>
            ${percentage}%
          </small>
        </td>

        <td>
          ${player.total}
        </td>

        <td>
          ${player.date || "N/A"}
        </td>

      `;

      // ANIMATION

      row.style.opacity = 0;

      row.style.transform =
        "translateY(20px)";

      setTimeout(() => {

        row.style.transition =
          "0.5s";

        row.style.opacity = 1;

        row.style.transform =
          "translateY(0)";

      }, index * 100);

      leaderboardBody.appendChild(
        row
      );

    }
  );

}

renderLeaderboard();

// ACHIEVEMENTS

const achievementList =
  document.getElementById(
    "achievementList"
  );

const achievements = [

  "🏆 Quiz Master",

  "🔥 5 Win Streak",

  "⚡ Speed Runner",

  "🎯 Accuracy Expert",

  "👑 Arena Champion"

];

achievements.forEach(item => {

  const badge =
    document.createElement("div");

  badge.classList.add(
    "achievement"
  );

  badge.textContent = item;

  achievementList.appendChild(
    badge
  );

});

// TOAST

function showToast(message){

  const toast =
    document.getElementById(
      "toast"
    );

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {

    toast.classList.remove(
      "show"
    );

  },3000);

}

// BUTTONS

document.getElementById(
  "homeBtn"
)
.addEventListener(
  "click",
  () => {

    window.location.href =
      "../index.html";

  }
);

document.getElementById(
  "clearBtn"
)
.addEventListener(
  "click",
  () => {

    const confirmClear =
      confirm(
        "Clear leaderboard?"
      );

    if(confirmClear){

      localStorage.removeItem(
        "leaderboard"
      );

      showToast(
        "Leaderboard Cleared!"
      );

      setTimeout(() => {

        location.reload();

      },1000);

    }

  }
);

// DAILY CHALLENGE

const challenges = [

  "Complete a hard quiz with 90% accuracy",

  "Finish a quiz under 60 seconds",

  "Score 100% in science category",

  "Play 3 quizzes today",

  "Beat the top leaderboard score"

];

const randomChallenge =

  challenges[
    Math.floor(
      Math.random()
      *
      challenges.length
    )
  ];

document.getElementById(
  "dailyChallengeText"
).textContent =
  randomChallenge;

// ACCESSIBILITY

document.querySelectorAll(
  "button"
)
.forEach(button => {

  button.setAttribute(
    "aria-label",
    button.textContent
  );

});

// KEYBOARD SHORTCUTS

document.addEventListener(
  "keydown",
  (e) => {

    if(e.key === "h"){

      window.location.href =
        "../index.html";

    }

  }
);