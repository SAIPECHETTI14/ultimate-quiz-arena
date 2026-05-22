import {

  db,

  collection,

  getDocs,

  query,

  orderBy,

  limit

}

from "./firebase.js";

const leaderboardBody =
  document.getElementById(
    "leaderboardBody"
  );

async function loadLeaderboard(){

  leaderboardBody.innerHTML =
    `
      <tr>
        <td colspan="5">
          Loading...
        </td>
      </tr>
    `;

  try{

    const q = query(

      collection(
        db,
        "leaderboard"
      ),

      orderBy(
        "percentage",
        "desc"
      ),

      limit(10)

    );

    const querySnapshot =
      await getDocs(q);

    leaderboardBody.innerHTML = "";

    if(querySnapshot.empty){

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

    let rank = 1;

    querySnapshot.forEach((doc) => {

      const data = doc.data();

      let medal = "";

      if(rank === 1){

        medal = "🥇";

      }

      else if(rank === 2){

        medal = "🥈";

      }

      else if(rank === 3){

        medal = "🥉";

      }

      leaderboardBody.innerHTML +=

      `
      <tr>

        <td>
          ${medal} ${rank}
        </td>

        <td>
          ${data.name}
        </td>

        <td>
          ${data.percentage}%
        </td>

        <td>
          ${data.score}/${data.total}
        </td>

        <td>
          ${data.date}
        </td>

      </tr>
      `;

      rank++;

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