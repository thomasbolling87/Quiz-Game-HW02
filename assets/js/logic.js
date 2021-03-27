var currentQuestionIndex = 0;
var time = 100;
var timerId;

// variables that reference DOM elements
var timerEl = document.getElementById("time");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var questionsEl = document.getElementById("questions");
var answersEl = document.getElementById("answers");
var feedbackEl = document.getElementById("feedback");

// sound effects
var sfxRight = new Audio("assets/sfx/correct.wav");
var sfxWrong = new Audio("assets/sfx/incorrect.wav");

// start game function
function startGame() {
  // hide the start screen
  var baseScreenEl = document.getElementById("base");
  baseScreenEl.setAttribute("class", "hide");

  // un-hide the questions secion page
  questionsEl.removeAttribute("class");

  // start game timer
  timerId = setInterval(clockTick, 1000);

  // show the starting time of timer
  timerEl.textContent = time;

  // this grabs questions function
  getQuestion();
}

function getQuestion() {
  // grabs the questions from the question array
  // function that randomizes the questions
  function questionRandomizer() {
    currentQuestion = Math.floor(Math.random() * questions[currentQuestionIndex].length);
    return questions[currentQuestionIndex];
  }

  var question = questionRandomizer();
 
  // updates the question
  var titleEl = document.getElementById("question-title");
  
  titleEl.textContent = question.title;
      
  // clears out old question answers
  answersEl.innerHTML = "";

  // loops through answers
  question.answers.forEach(function(answer, i) { 
      
    // creates a button for each answer
    var answerNode = document.createElement("button");
    answerNode.setAttribute("class", "answer");
    answerNode.setAttribute("value", answer);
    
    answerNode.textContent = i + 1 + ". " + answer;

    // listener for click notice    
    answerNode.onclick = questionClick;

    // appending the created child to the answers element to display on page
    answersEl.appendChild(answerNode);
  });
}


function questionClick() {
  // checks if player selects the incorrect answer
  if (this.value !== questions[currentQuestionIndex].correctAnswer) {
    // if person answers wrong they are penalized by losing 10 sec
    time -= 10;

    if (time < 0) {
      time = 0;
    }

    // displays the current time on each page as you go through answering questions
    timerEl.textContent = time;

    // play "ehhhh" sound effect when the wrong answer is selected
    sfxWrong.play();

    feedbackEl.textContent = "Wrong Answer!"
  } else{
    // plays "ring" sound effect when the correct answer is selected
    sfxRight.play();

    feedbackEl.textContent = "Correcto Mundo!"
  }

  // flash right/wrong feedback on page for 1 second
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  // move to next question in array
  currentQuestionIndex++;

  // if statement to check if there are any more questions left
  if (currentQuestionIndex !== questions.length) {
    getQuestion();
  } else {
    gameEnd();
  }
}

function gameEnd() {
  // stop timer
  clearInterval(timerId);

  // show game over screen
  var gameOverSreenEl = document.getElementById("game-over");
  gameOverSreenEl.removeAttribute("class");

  // show final score
  var totalScoreEl = document.getElementById("total-score");
  totalScoreEl.textContent = time;

  // hide questions
  questionsEl.setAttribute("class", "hide");
}

function clockTick() {
  // update time as it ticks down
  time--;
  timerEl.textContent = time;

  // if statement to check if time is up
  if (time <= 0) {
    gameEnd();
  }
}

function saveHighScore() {
  // get value of input box
  var initials = initialsEl.value.trim();

  // check to the initials value to see if it is empty
  if (initials !== "") {
    // takes saves scores from localstorage, and set in the empty space/array
    var highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];

    // shows score to user in a clean format
    var newScore = {score: time, initials: initials};

    // pushes score to the local storage
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    // redirect to the high scores page
    window.location.href = "highscores.html";
  }
}

function checkForEnterKey(event) {
  // listener that checks if the Enter key is pressd
  if (event.key === "Enter") {
    saveHighScore();
  }
}

// button that is clicked to submit user initials
submitBtn.onclick = saveHighScore;

// button that is clicked to start game
startBtn.onclick = startGame;

// checks for enter key
initialsEl.onkeyup = checkForEnterKey;