import {

  db,

  collection,

  getDocs

}

from "./firebase.js";

const leaderboardBody =
  document.getElementById(
    "leaderboardBody"
  );

const categoryFilter =
  document.getElementById(
    "categoryFilter"
  );

const difficultyFilter =
  document.getElementById(
    "difficultyFilter"
  );

const amountFilter =
  document.getElementById(
    "amountFilter"
  );

let allScores = [];

// LOAD FIREBASE DATA

async function loadLeaderboard(){

  try{

    const snapshot =
      await getDocs(

        collection(
          db,
          "leaderboard"
        )

      );

    allScores = [];

    snapshot.forEach((doc) => {

      allScores.push(
        doc.data()
      );

    });

    renderLeaderboard();

  }

  catch(error){

    console.log(error);

    leaderboardBody.innerHTML =

    `
    <tr>
      <td colspan="6">
        Firebase Error
      </td>
    </tr>
    `;

  }

  // HIDE LOADING

  document.getElementById(
    "loadingScreen"
  ).style.display = "none";

}

// RENDER

function renderLeaderboard(){

  leaderboardBody.innerHTML = "";

  let filtered =
    [...allScores];

  // CATEGORY FILTER

  if(
    categoryFilter.value !== "all"
  ){

    filtered =
      filtered.filter(

        score =>

        score.category ===
        categoryFilter.value

      );

  }

  // DIFFICULTY FILTER

  if(
    difficultyFilter.value !== "all"
  ){

    filtered =
      filtered.filter(

        score =>

        score.difficulty ===
        difficultyFilter.value

      );

  }

  // QUESTION FILTER

  if(
    amountFilter.value !== "all"
  ){

    filtered =
      filtered.filter(

        score =>

        score.amount ===
        Number(amountFilter.value)

      );

  }

  // SORT

  filtered.sort(

    (a,b) =>

    b.percentage -
    a.percentage

  );

  // TOP 10

  filtered =
    filtered.slice(0,10);

  // EMPTY

  if(filtered.length === 0){

    leaderboardBody.innerHTML =

    `
    <tr>
      <td colspan="6">
        No scores found
      </td>
    </tr>
    `;

    return;

  }

  // SHOW DATA

  filtered.forEach((data,index) => {

    let medal = "";

    if(index === 0){

      medal = "🥇";

    }

    else if(index === 1){

      medal = "🥈";

    }

    else if(index === 2){

      medal = "🥉";

    }

    leaderboardBody.innerHTML +=

    `
    <tr>

      <td>
        ${medal}
        ${index + 1}
      </td>

      <td>
        ${data.name || "Player"}
      </td>

      <td>
        ${data.category || "-"}
      </td>

      <td>
        ${data.difficulty || "-"}
      </td>

      <td>
        ${data.percentage || 0}%
      </td>

      <td>
        ${data.date || "-"}
      </td>

    </tr>
    `;

  });

}

// FILTER EVENTS

categoryFilter.addEventListener(
  "change",
  renderLeaderboard
);

difficultyFilter.addEventListener(
  "change",
  renderLeaderboard
);

amountFilter.addEventListener(
  "change",
  renderLeaderboard
);

// HOME BUTTON

document.getElementById(
  "homeBtn"
)
.addEventListener("click", () => {

  window.location.href =
    "../index.html";

});

loadLeaderboard();