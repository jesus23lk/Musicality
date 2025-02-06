import g from "./globals.js";

//! THIS FILE CONTAINS FUNCTIONALITY FOR THE ACTUAL GAME

// Only for textcontent of buttons
const notesAG = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

// random value in the range min-max (inclusive)
const getRandom = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const resetErrorCount = () => {

  g.numErrors = 0;
  g.firstError = true;
  document.querySelector('.mistakes-count span').textContent = 0;
}

function setupBtns() {
  
  const btnDiv = document.getElementById('btn-container');        //div that holds 7 A-G buttons

  for(let i = 0; i < notesAG.length; i++) {              

    const newBtn = document.createElement('button');

    newBtn.className = 'btn';
    newBtn.textContent = notesAG[i];
    newBtn.noteVal = notesAG[i];                              //Each button gets a property named 'noteVal' that gets a value 'A'-'G'
    newBtn.addEventListener('click', parseInput);

    btnDiv.appendChild(newBtn);                                
  }
}

function showExtraLines(locDiv) {

  // For when note is above treble clef or below bass clef which require extra lines

  if(locDiv.className === 'ledger-line') locDiv.style.backgroundColor = 'black';      //If on a ledger-line, make it visible

  const staff = document.getElementById('staff').children;

  /*This part below does some linked list style logic where we use a temp variable to traverse a list
    In this case we are traversing our line and space divs */

  let tempLoc = locDiv;            //start at our note location
  let i = 0;                    //i is just used to save every location we made visible to an array 
  
  while (tempLoc.idNum < 17) {                    //Entered if we are above treble clef

    if (tempLoc.className === 'ledger-line') {
      
      /* In here we make every ledger line underneath our
        note location visible, stopping
        at the first ledger line above treble clef */

      tempLoc.style.backgroundColor = 'black';
      g.extraLines[i] = tempLoc;                         //We also wanna save each line we made visible, that way we can hide them later
      i++;
    }  

    tempLoc = tempLoc.nextSibling;
  }

  while (tempLoc.idNum > 39) {                        //Entered if we are below bass clef

    /* In here we make every ledger line above our
      note location visible, stopping
      at the first ledger line below bass clef*/

    if (tempLoc.className === 'ledger-line') {
      tempLoc.style.backgroundColor = 'black';          //We also wanna save each line we made visible, that way we can hide them later
      g.extraLines[i] = tempLoc;
      i++;
    }  

    tempLoc = tempLoc.previousSibling;
  }

}

function generateSequence() {

  // Wanna do this everytime we restart the game
  resetErrorCount();

  const sequence = [];

  // Make an array with numbers in our note range
  let j = 0;
  for (let i = g.highestNote; i <= g.lowestNote; i++) {
    sequence[j] = i;
    j++;
  }

  //Implement the fisher yates algorithm for random sequence
  for (let i = sequence.length - 1; i > 0; i--) {

    const randIndx = getRandom(0, i);

    // Swap array values using destructuring
    [sequence[i], sequence[randIndx]] = [sequence[randIndx], sequence[i]];

  }

  g.sequenceLength = sequence.length;
  g.currentSequence = sequence;
}

function getColor(percent) {
  //! Learn how this code works, later, don't just leave it here

  const hue = (120 * percent); // Map 0-100% to 0-120° (red to green)

  // if hue is more green, then we want less lightness, because super bright greens are ugly
  const lightness = hue < 60 ? '50%' : '35%';

  return `hsl(${hue}, 100%, ${lightness})`;
}

function drawScoreCircle(points) {

  const canvas = document.querySelector('.score-circle');
  const ctx = canvas.getContext('2d');

  //Draw circle background in light gray
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  let radius = 60;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
  ctx.lineTo(centerX, centerY);
  ctx.closePath();
  ctx.fillStyle = 'rgb(215, 215, 215)';
  ctx.fill();
  
  // Percentage of the circle to be filled here 0-1
  let percent = points / g.sequenceLength;
  let percent100 = Math.floor(percent * 100);
  const startAngle = -Math.PI/2;
  const endAngle = startAngle + Math.PI * 2 * percent;

  // Draw colored progress circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
  ctx.lineTo(centerX, centerY);
  ctx.closePath();
  ctx.fillStyle = `${getColor(percent)}`;
  ctx.fill();

  // Draw white center circle
  radius /= 1.3;
  ctx.beginPath();
  ctx.arc(centerX,centerY, radius, 0, Math.PI * 2, false);
  ctx.lineTo(centerX, centerY);
  ctx.closePath();
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.fill();

  //Add text to center of circle
  ctx.fillStyle = 'black';
  ctx.font = '800 20px Arial';
  ctx.textAlign = 'center'; 
  ctx.textBaseline = 'middle'; 
  ctx.fillText(`${percent100}%`, centerX, centerY);
}

function endGame() {

  const doneModal = document.querySelector('.done-modal');
  doneModal.showModal();

  const points = g.sequenceLength - g.numErrors;
  const scoreSpan = document.querySelector('.done-modal span');
  scoreSpan.textContent = `${points + '/' + g.sequenceLength}`;

  // Disable user input
  g.errorState = true;

  drawScoreCircle(points);
}

function setupRestartBtn() {

  const restartBtn = document.querySelector('.restart-game-btn');

  restartBtn.addEventListener('click', () =>{

    //Reset everything
    const doneModal = document.querySelector('.done-modal');
    doneModal.close();

    g.errorState = false;
    g.sequenceNum = 1;
    generateSequence();
    g.noteDiv = getNextLocation();
  });
}

function getNextLocation() {

  if (g.sequenceNum > g.sequenceLength) {
    endGame();
    return;
  }

  const noteNumDiv = document.querySelector('.note-number-container');
  noteNumDiv.textContent = `${g.sequenceNum}/${g.sequenceLength}`;

  let locId = g.currentSequence.pop();

  //Retrieve div that corresponds to our locId
  const locDiv = document.getElementById('loc-' + locId);
  
  if (locDiv.className === 'ledger-line' || locDiv.className === 'ledger-space') showExtraLines(locDiv);      
  
  //Everything below here pertains to our quarter note image
  
  const note = document.createElement('img');                                   
  g.noteImg = note;                                          
  note.src = 'Images/quarter_note.png';
  note.id = 'note';
  locDiv.appendChild(note);
  
  if (locId < 5) note.classList.add('upside-down')

  return locDiv;
}

function removeImg() {

  g.noteDiv.removeChild(g.noteImg);                     //Remove the note image
  g.noteImg.classList.remove('upside-down');

  if(g.noteDiv.className === 'ledger-line') g.noteDiv.style.backgroundColor = 'transparent';      //If the current location is a ledger-line, then we need to hide it

  if(g.extraLines) {

    /* If there are extra ledger lines visible,
      then we want to hide each of those lines*/

    for(let i = 0; i < g.extraLines.length; i++) {

      g.extraLines[i].style.backgroundColor = 'transparent';

    }
  }
}

function incErrorCount() {
  g.numErrors++;
  document.querySelector('.mistakes-count span').textContent = g.numErrors;
  g.firstError = false;
}

function evaluateChoice(choice) {
  //Tell user if clicked answer is right or wrong

  const btns = document.querySelectorAll('.btn');
  let btn;
  
  for (btn of btns) {
    if (btn.noteVal === choice) break;
  }

  const correctAns = g.noteDiv.noteVal;                        

  //Case 1: correct answer 
  if (choice === correctAns) {

    g.firstError = true;

    if(g.volumeOn) g.sounds.correct.play();
    
    //correct animation
    btn.classList.add('btn-correct');
    btn.addEventListener('animationend', () => btn.classList.remove('btn-correct'));

    //Move note to new location
    removeImg();                            
    g.sequenceNum++;
    g.noteDiv = getNextLocation();             
  }
  
  //Case 2 wrong answer
  else {

    if (g.firstError) incErrorCount();

    if(g.volumeOn) g.sounds.wrong.play();                              
    btn.classList.add('btn-wrong');
    btn.addEventListener('animationend', () => btn.classList.remove('btn-wrong'));
  }

}

function parseInput(e) {

  if (g.errorState) return;

  let choice;

  // Case 1: Button was clicked (mouse/touch)
  if (e.type === 'click' && e.target.classList.contains('btn')) choice = e.target.noteVal;

  // Case 2: Key was pressed (global listener)
  else if (e.type === 'keydown') {
    const key = e.key.toUpperCase();

    // Check if key is A-G (single character, ASCII 65-71)
    if (key.length !== 1 || key < 'A' || key > 'G') return;

    // If the focused element is a button, prevent its default keyboard behavior
    if (document.activeElement?.classList?.contains('.btn')) {
      e.preventDefault();
    }

    choice = key;
  }

  // Ignore other events
  else return;

  evaluateChoice(choice);
}

function initiateGame() {
  
  setupBtns();

  generateSequence();

  g.noteDiv = getNextLocation();

  //Functionality for key presses
  document.addEventListener('keydown', parseInput);

  setupRestartBtn();
}

export {initiateGame, removeImg, getNextLocation, generateSequence};