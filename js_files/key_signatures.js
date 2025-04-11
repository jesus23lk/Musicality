import { getRandom, drawScoreCircle } from "./game.js";
import { setupSidebar } from "./side_elements.js";

const keySigs = [
  'a_flat_major',
  'a_major',
  'b_flat_major',
  'b_major',
  'c_flat_major',
  'c_major',
  'c_sharp_major',
  'd_flat_major',
  'd_major',
  'e_flat_major',
  'e_major',
  'f_major',
  'f_sharp_major',
  'g_flat_major',
  'g_major'
];

// Initialize this to zero
let currentImg = 0;
let numErrors = 0;
let firstError = true;


function generateSequence() {

  //Implement the fisher yates algorithm for random sequence
  for (let i = keySigs.length - 1; i > 0; i--) {

    const randIndx = getRandom(0, i);

    // Swap array values using destructuring
    [keySigs[i], keySigs[randIndx]] = [keySigs[randIndx], keySigs[i]];

  }
}

function dipslayImg() {

  const keySigPic = document.querySelector('.key-sig-pic');
  keySigPic.src = '../Images/key_signatures/' + keySigs[currentImg] + '.svg';

  const noteNumDiv = document.querySelector('.hud-center');
  noteNumDiv.textContent = currentImg + 1 + '/' + keySigs.length;
}

function handleGameEnd() {
  console.log('game is done');

  const doneModal = document.querySelector('.done-modal');
  doneModal.showModal();

  const points = keySigs.length - numErrors;
  const scoreSpan = document.querySelector('.done-modal span');
  scoreSpan.textContent = `${points + '/' + keySigs.length}`;

  drawScoreCircle(points, keySigs.length);
}

function handleCorrect(e) {
  // For when user clicks right button

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

  if (btnText[1] === '♯') imgText = btnText[0].toLowerCase() + '_sharp_major';

  else if (btnText[1] === '♭') imgText = btnText[0].toLowerCase() + '_flat_major';

  else imgText = btnText[0].toLowerCase() + '_major';

  if(imgText === keySigs[currentImg]) handleCorrect(e);

  else handleWrong(e);
}

function setupBtns() {
  const btns = document.querySelectorAll('.btn-container button');

  btns.forEach(btn => {
    btn.classList.add('btn')
    btn.addEventListener('click', handleClick);
  });
}

function setupRestartBtn() {

  const restartBtn = document.querySelector('.restart-game-btn');

  restartBtn.addEventListener('click', () =>{

    const doneModal = document.querySelector('.done-modal');
    doneModal.close();
    currentImg = 0;
    numErrors = 0;
    const errorDiv = document.querySelector('.hud-right span');
    errorDiv.textContent = numErrors;
    firstError = true;
    generateSequence()
    dipslayImg();

  });
}

function main() {
  generateSequence();
  dipslayImg();
  setupBtns();
  setupRestartBtn();
  setupSidebar();
}

main();
