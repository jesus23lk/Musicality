import * as util from "./util.js";
import { setupSidebar, setupContextSettings } from "./side_elements.js";
 
/* DIFFICULTIES 

  0-4 will be easy
  0-6 will medium
  0-length will be hard

*/

const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C♯', 'D♭', 'D♯', 'E♭', 'F♯', 'G♭', 'G♯', 'A♭', 'A♯', 'B♭'];

let volume = true;

/* difficulty based on relative size of keys[]
   5 is easy
   7 is medium
   keys.length is hard
*/

let difficulty= 5;

// Index in keys array we are on;
let curKeyNum = 0;
let numErrors = 0;
let firstError = true;


function setupVolume() {

  const volumeSec = document.querySelector('.volume-section');
  volumeSec.addEventListener('click', () => {
    
    const volumeIcon = volumeSec.querySelector('.material-symbols-outlined');
    if (volumeIcon.textContent === 'toggle_on') {
      volumeIcon.textContent = 'toggle_off';
      volume = false;
    }

    else {
      volumeIcon.textContent = 'toggle_on';
      volume = true;
    }
  });
}

function changeDifficulty(newDif) {

  const hudLeft = document.querySelector('.hud-left');

  // Set difficulty to easy
  if (newDif.classList.contains('easy-div')) {
    difficulty = 5;
    hudLeft.textContent = 'easy';
  }

  // Set difficulty to medium
  else if (newDif.classList.contains('medium-div')) {
    difficulty = 7;
    hudLeft.textContent = 'medium';
  }

  // Set difficulty to hard
  else {
    difficulty = keys.length;
    hudLeft.textContent = 'hard';
  }

  restartGame();
}

function setupDifficultySelect() {

  let options = document.querySelectorAll('.radio-form > div');

  options.forEach(item => item.addEventListener('click', (e) => {

    // Select the outer div of the option
    const inputDiv = e.target.closest('div');

    // Get radio input
    const radioCircle = inputDiv.querySelector('input');

    options.forEach(item => item.classList.remove('selected'));


    radioCircle.checked = true;
    inputDiv.classList.add('selected');

    changeDifficulty(e.target);

  }));

}

function playCorrectNote(key) {

  const noteVal = key.dataset.note;

  // Remove the flat version of the note
  const onlySharp = noteVal.split('/')[0];


  const fileName = onlySharp + '.mp3';

  const noteAudio = new Audio('./audio/' + fileName);
  noteAudio.play();
}

function handleCorrect(key) {

  if (volume) playCorrectNote(key);

  const noteDiv = document.querySelector('.cur-note');

  noteDiv.classList.remove('note-correct');
  noteDiv.classList.remove('note-wrong');

  // Force reflow, in order to restart animation if already playing
  noteDiv.offsetWidth;                 
  noteDiv.classList.add('note-correct');
  noteDiv.addEventListener('animationend', () => noteDiv.classList.remove('note-correct'));

  curKeyNum++;
  firstError = true;

  if (curKeyNum === difficulty) {
    const doneModal = document.querySelector('.done-modal');
    doneModal.showModal();

    const points = difficulty - numErrors;
    const scoreSpan = document.querySelector('.done-modal span');
    scoreSpan.textContent = `${points + '/' + difficulty}`;
  
    util.drawScoreCircle(points, difficulty);
    
  }

  displayKey();
}

function handleIncorrect() {

  if (volume) util.playWrongSound();
  
  const noteDiv = document.querySelector('.cur-note');

  noteDiv.classList.remove('note-wrong');
  // Force reflow, in order to restart animation if already playing
  noteDiv.offsetWidth;                 
  noteDiv.classList.add('note-wrong');
  noteDiv.addEventListener('animationend', () => noteDiv.classList.remove('note-wrong'));

  if (firstError) {

    numErrors++;
    const errorDiv = document.querySelector('.hud-right span');
    errorDiv.textContent = numErrors;
    firstError = false;
  }

}

function handleClick(e) {

  const noteVal = e.target.dataset.note;

  // For notes that are sharp/flat
  const [val1, val2] = noteVal.split('/');

  const correctNote = document.querySelector('.cur-note').textContent;

  // Check if user clicked correct note
  if ([val1, val2].includes(correctNote)) handleCorrect(e.target)

  else handleIncorrect();


}

function setupKeys() {
  // Put event listeners on our piano keys

  const pianoKeys = document.querySelectorAll('.key');

  pianoKeys.forEach(key => {

    key.addEventListener('click', handleClick);
  });
}

function displayKey() {
  const noteDiv = document.querySelector('.cur-note');
  noteDiv.textContent = keys[curKeyNum];

  const noteNumDiv = document.querySelector('.hud-center');
  noteNumDiv.textContent = curKeyNum + 1 + '/' + difficulty;

}

function restartGame() {

  const doneModal = document.querySelector('.done-modal');
  doneModal.close();

  curKeyNum = 0;
  numErrors = 0;
  firstError = true;

  const errorDiv = document.querySelector('.hud-right span');
  errorDiv.textContent = numErrors;

  util.shuffleArray(keys, difficulty);
  displayKey();
}

function setupRestartBtn() {

  const restartBtn = document.querySelector('.restart-game-btn');

  restartBtn.addEventListener('click', restartGame);
}

function main() {

  setupDifficultySelect();
  setupVolume();
  setupKeys();
  util.shuffleArray(keys, difficulty);
  console.log(keys);
  displayKey();
  setupRestartBtn();

  // Functions from side_elements.js
  setupContextSettings();
  setupSidebar();
}

main();