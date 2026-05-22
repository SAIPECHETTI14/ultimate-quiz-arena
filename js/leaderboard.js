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

    // NO SCORES

    if(snapshot.empty){

      leaderboardBody.innerHTML =

      `
      <tr>
        <td colspan="5">
          No scores yet.
        </td>
      </tr>
      `;

      return;

    }

    let scores = [];

    snapshot.forEach((doc) => {

      scores.push(doc.data());

    });

    // SORT HIGHEST SCORE

    scores.sort(

      (a,b) =>

      b.percentage -
      a.percentage

    );

    // TOP 10

    scores =
      scores.slice(0,10);

    // SHOW SCORES

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

}

loadLeaderboard();