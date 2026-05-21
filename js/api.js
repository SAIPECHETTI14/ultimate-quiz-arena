// SHUFFLE ARRAY

function shuffleArray(array){

  return array.sort(
    () => Math.random() - 0.5
  );

}

// REMOVE DUPLICATES

function removeDuplicates(array){

  const seen = new Set();

  return array.filter((item) => {

    if(seen.has(item.question)){

      return false;

    }

    seen.add(item.question);

    return true;

  });

}

// FETCH QUESTIONS

async function fetchQuestions(
  category,
  difficulty,
  amount
){

  // LOCAL CATEGORY SYSTEM

  if(category === "coding"){

    const uniqueQuestions =
      removeDuplicates(
        codingQuestions
      );

    return handleLocalQuestions(
      uniqueQuestions,
      amount,
      "Coding"
    );

  }

  if(category === "scienceLocal"){

    const uniqueQuestions =
      removeDuplicates(
        scienceQuestions
      );

    return handleLocalQuestions(
      uniqueQuestions,
      amount,
      "Science"
    );

  }

  if(category === "moviesLocal"){

    const uniqueQuestions =
      removeDuplicates(
        moviesQuestions
      );

    return handleLocalQuestions(
      uniqueQuestions,
      amount,
      "Movies"
    );

  }

  if(category === "anime"){

    const uniqueQuestions =
      removeDuplicates(
        animeQuestions
      );

    return handleLocalQuestions(
      uniqueQuestions,
      amount,
      "Anime"
    );

  }

  if(category === "sportsLocal"){

    const uniqueQuestions =
      removeDuplicates(
        sportsQuestions
      );

    return handleLocalQuestions(
      uniqueQuestions,
      amount,
      "Sports"
    );

  }

  // API CATEGORIES

  try{

    const url =
      `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;

    const response =
      await fetch(url);

    const data =
      await response.json();

    if(
      data.response_code !== 0 ||
      !data.results
    ){

      throw new Error(
        "Failed to fetch questions"
      );

    }

    let questions =
      data.results.map((q) => {

        return {

          question:q.question,

          correct_answer:
            q.correct_answer,

          incorrect_answers:
            q.incorrect_answers,

          category:q.category,

          difficulty:q.difficulty

        };

      });

    // REMOVE DUPLICATES

    questions =
      removeDuplicates(
        questions
      );

    // SHUFFLE

    questions =
      shuffleArray(
        questions
      );

    return questions.slice(0, amount);

  }

  catch(error){

    console.error(error);

    return [];

  }

}

// HANDLE LOCAL QUESTIONS

function handleLocalQuestions(
  questions,
  amount,
  categoryName
){

  // SHUFFLE

  questions =
    shuffleArray(
      questions
    );

  // NOT ENOUGH QUESTIONS

  if(amount > questions.length){

    alert(
      `Only ${questions.length} unique ${categoryName} questions available.`
    );

  }

  // RETURN UNIQUE ONLY

  return questions.slice(0, amount);

}