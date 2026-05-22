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

// LOAD LEADERBOARD

async function loadLeaderboard(){

  try{

    const snapshot =
      await getDocs(

        collection(
          db,
          "leaderboard"
        )

      );

    leaderboardBody.innerHTML = "";

    if(snapshot.empty){

      leaderboardBody.innerHTML =

      `
      <tr>
        <td colspan="5">
          No scores yet.
        </td>
      </tr>
      `;

    }

    else{

      let scores = [];

      snapshot.forEach((doc) => {

        scores.push(doc.data());

      });

      // SORT

      scores.sort(

        (a,b) =>

        b.percentage -
        a.percentage

      );

      // TOP 10

      scores =
        scores.slice(0,10);

      // DISPLAY

      scores.forEach((data,index) => {

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
            ${data.percentage || 0}%
          </td>

          <td>
            ${data.score || 0}
            /
            ${data.total || 0}
          </td>

          <td>
            ${data.date || "-"}
          </td>

        </tr>
        `;

      });

    }

  }

  catch(error){

    console.log(error);

    leaderboardBody.innerHTML =

    `
    <tr>
      <td colspan="5">
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

loadLeaderboard();

// HOME BUTTON

document.getElementById(
  "homeBtn"
)
.addEventListener("click", () => {

  window.location.href =
    "../index.html";

});