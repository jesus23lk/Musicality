import { getRandom, drawScoreCircle } from "./game.js";
import { setupSidebar, setupContextSettings } from "./side_elements.js";
import { playCorrectSound, playWrongSound} from "./util.js";

const allKeys = {
  "f_minor": "a_flat_major",
  "f_sharp_minor": "a_major",
  "g_minor": "b_flat_major",
  "g_sharp_minor": "b_major",
  "a_flat_minor": "c_flat_major",
  "a_minor": "c_major",
  "a_sharp_minor": "c_sharp_major",
  "b_flat_minor": "d_flat_major",
  "b_minor": "d_major",
  "c_minor": "e_flat_major",
  "c_sharp_minor": "e_major",
  "d_minor": "f_major",
  "d_sharp_minor": "f_sharp_major",
  "e_flat_minor": "g_flat_major",
  "e_minor": "g_major"
};

let volume = true;

let currentKeys = [];

// Can be set to either major or minor
let currentMode = 'major';``


// Initialize this to zero
let currentImg = 0;
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

function changeMode(e) {

  const inputDiv = e.target.closest('div');
  const inputEle = inputDiv.querySelector('input');
  inputEle.checked = true;
  inputDiv.classList.add('selected');

  if (inputDiv.classList.contains('major-div')) {
    
    document.querySelector('.minor-div').classList.remove('selected');
    currentMode = 'major';
  }

  else {
    document.querySelector('.major-div').classList.remove('selected');
    currentMode = 'minor';
  }

  restartGame();
}

function setupKeyForm() {

  const majorDiv = document.querySelector('.major-div');
  const minorDiv = document.querySelector('.minor-div');

  majorDiv.addEventListener('click', changeMode);
  minorDiv.addEventListener('click', changeMode);
}

function setupBtns() {
  
  const btns = document.querySelectorAll('.btn-container button');

  let i = 0;

  btns.forEach(btn => {

    // Here we add text to our buttons and set up listeners

    let btnString;

    // Only capitalize in major key mode
    if (currentMode === 'major') btnString = currentKeys[i][0].toUpperCase();
    else btnString = currentKeys[i][0];

    const parts = currentKeys[i].split('_');

    if(parts[1] === 'flat') btnString += '♭'
    else if (parts[1] === 'sharp') btnString += '♯';

    btn.textContent = btnString;

    btn.classList.add('btn')
    btn.addEventListener('click', handleClick);
    i++;
  });

}

function generateSequence() {

  //Implement the fisher yates algorithm for random sequence
  for (let i = currentKeys.length - 1; i > 0; i--) {

    const randIndx = getRandom(0, i);

    // Swap array values using destructuring
    [currentKeys[i], currentKeys[randIndx]] = [currentKeys[randIndx], currentKeys[i]];

  }
}

function dipslayImg() {

  const hudKey = document.querySelector('.hud-left');
  const keySigPic = document.querySelector('.key-sig-pic');
  const noteNumDiv = document.querySelector('.hud-center');

  if (currentMode === 'major') {
    hudKey.textContent = 'Major Keys';
    
    keySigPic.src = '../Images/key_signatures/' + currentKeys[currentImg] + '.svg';
    
  }
  
  else if (currentMode === 'minor') {

    const curMinorKey = currentKeys[currentImg];
    const curMajorKey = allKeys[curMinorKey];

    hudKey.textContent = 'Minor Keys';

    // Our img names are all major keys, so we can only use major keys in img path
    keySigPic.src = '../Images/key_signatures/' + curMajorKey + '.svg';
    
  }
  
  noteNumDiv.textContent = currentImg + 1 + '/' + currentKeys.length;
}

function handleGameEnd() {

  const doneModal = document.querySelector('.done-modal');
  doneModal.showModal();

  const points = currentKeys.length - numErrors;
  const scoreSpan = document.querySelector('.done-modal span');
  scoreSpan.textContent = `${points + '/' + currentKeys.length}`;

  drawScoreCircle(points, currentKeys.length);
}

function handleCorrect(e) {
  // For when user clicks right button

  if (volume) playCorrectSound();

  const btn = e.target;
  firstError = true;

  
  //play correct animation
  btn.classList.add('btn-correct');
  btn.addEventListener('animationend', () => btn.classList.remove('btn-correct'));
  
  //If we are on final pic, then end the game
  if (currentImg === 14) {
    handleGameEnd();
    return;
  }

  // Go to next pic in sequence
  currentImg++;
  dipslayImg();

}

function handleWrong(e) {

  // Play animation when user clicks wrong button

  if(volume) playWrongSound();

  if (firstError) {

    numErrors++;
    const errorDiv = document.querySelector('.hud-right span');
    errorDiv.textContent = numErrors;
    firstError = false;
  }

  const btn = e.target;
  btn.classList.add('btn-wrong');
  btn.addEventListener('animationend', () => btn.classList.remove('btn-wrong'));
}

function handleClick(e) {

  const btnText = e.target.textContent;
  let imgText;

  if (btnText[1] === '♯') imgText = btnText[0].toLowerCase() + '_sharp';

  else if (btnText[1] === '♭') imgText = btnText[0].toLowerCase() + '_flat';

  else imgText = btnText[0].toLowerCase();

  if (currentMode === 'major') imgText += '_major';

  else if (currentMode === 'minor') imgText += '_minor';

  if(imgText === currentKeys[currentImg]) handleCorrect(e);

  else handleWrong(e);
}

function restartGame() {
  
  if (currentMode === 'major') currentKeys = Object.values(allKeys);
  else if (currentMode === 'minor') currentKeys = Object.keys(allKeys);
  setupBtns();

  const doneModal = document.querySelector('.done-modal');
  doneModal.close();

  currentImg = 0;
  numErrors = 0;
  
  const errorDiv = document.querySelector('.hud-right span');
  errorDiv.textContent = numErrors;
  firstError = true;
  generateSequence()
  dipslayImg();

}

function setupRestartBtn() {

  const restartBtn = document.querySelector('.restart-game-btn');

  restartBtn.addEventListener('click', restartGame);
}

function main() {

  // Get object keys as an array
  if (currentMode === 'major') currentKeys = Object.values(allKeys);
  else if (currentMode === 'minor') currentKeys = Object.keys(allKeys);

  setupVolume();
  setupContextSettings();
  setupKeyForm();
  setupBtns();
  generateSequence();
  dipslayImg();
  setupRestartBtn();
  setupSidebar();
}

main();
