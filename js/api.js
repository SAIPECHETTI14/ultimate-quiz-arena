// LOCAL CATEGORY MAP

const localCategories = {

  coding: codingQuestions,

  scienceLocal: scienceQuestions,

  anime: animeQuestions,

  moviesLocal: moviesQuestions,

  sportsLocal: sportsQuestions

};

// FETCH QUIZ QUESTIONS

async function fetchQuizQuestions() {

  try {

    const category =
      localStorage.getItem("quizCategory") || 9;

    const difficulty =
      localStorage.getItem("quizDifficulty") || "easy";

    const amount =
      Number(localStorage.getItem("quizAmount")) || 10;

    // LOCAL QUESTIONS

    if(localCategories[category]){

      let localData =
        [...localCategories[category]];

      // FILTER DIFFICULTY

      localData = localData.filter(q =>
        q.difficulty === difficulty
      );

      // SHUFFLE

      localData.sort(() => Math.random() - 0.5);

      return localData.slice(0, amount);

    }

    // ONLINE API

    const apiURL =
      `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;

    const response = await fetch(apiURL);

    const data = await response.json();

    if(!data.results){

      throw new Error("API Failed");

    }

    return data.results;

  } catch(error){

    console.error(error);

    return [];

  }

}

// HTML DECODE

function decodeHTML(html){

  const txt =
    document.createElement("textarea");

  txt.innerHTML = html;

  return txt.value;

}