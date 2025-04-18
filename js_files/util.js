// Functions that are used by multiple pages

function playCorrectSound() {
  const correctSound = new Audio("./audio/correct_answer.mp3");
  correctSound.play();
}

function playWrongSound() {
  const wrongSound = new Audio("./audio/wrong_answer.mp3");
  wrongSound.play();
}

export {playCorrectSound, playWrongSound}