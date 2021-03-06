const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

// local questions.json
// fetch("questions.json")
//   .then(res => {
//     return res.json();
//   })
//   .then(loadedQuestions => {
//     console.log(loadedQuestions);
//     questions = loadedQuestions;
//     startGame();
//   })
//   .catch(err => {
//     alert("Questions aren't loaded, please try again.")
//   });

//API questions
fetch(
  "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple"
)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });
    startGame();
  })
  .catch((err) => {
    alert("Questions aren't loaded, please try again.");
  });

// hardcoded questions

// let questions = [
//   {
//     question: "Do jakeho elementu vkladame Javascript?",
//     choice1: "<script>",
//     choice2: "<javascript>",
//     choice3: "<js>",
//     choice4: "<scripting>",
//     answer: 1,
//   },
//   {
//     question: "Jak moc si tady z toho delame prdel?",
//     choice1: "Vubec",
//     choice2: "Malicko",
//     choice3: "Hodne",
//     choice4: "Jako Tvoje mama",
//     answer: 2,
//   },
//   {
//     question: "Java je?",
//     choice1: "Sracka",
//     choice2: "Lidsky odpad",
//     choice3: "Kubuv osud",
//     choice4: "Daviduv trest za jeho minuly zivot",
//     answer: 3,
//   },
//   {
//     question: "otazka 4",
//     choice1: "odpoved1",
//     choice2: "odpoved2",
//     choice3: "odpoved3",
//     choice4: "odpoved4",
//     answer: 4,
//   },
//   {
//     question: "otazka 5",
//     choice1: "odpoved1",
//     choice2: "odpoved2",
//     choice3: "odpoved3",
//     choice4: "odpoved4",
//     answer: 1,
//   },
//   {
//     question: "otazka 6",
//     choice1: "odpoved1",
//     choice2: "odpoved2",
//     choice3: "odpoved3",
//     choice4: "odpoved4",
//     answer: 1,
//   },
// ];

// CONTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  // console.log(availableQuestions);
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    //go to the end page
    return window.location.assign("/quiz-app/end.html");
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  // Update the progress bar
  // console.log((questionCounter / MAX_QUESTIONS) * 100 )
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    // //the same result

    // const classToApply = 'incorrect';
    //   if (selectedAnswer == currentQuestion.answer) {
    //       classToApply = 'correct';
    //   }

    // const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
