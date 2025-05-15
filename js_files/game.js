import g from "./globals.js";
import * as util from "./util.js";

//! THIS FILE CONTAINS FUNCTIONALITY FOR SINGLE NOTES

// Only for textcontent of buttons
const notesAG = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const intervals = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];

function createLocations() {

  //This functions creates all lines and spaces where a note can spawn

  const grdStaff = document.querySelector('.staff');                  //grand staff contains all lines and spaces
  
  for(let i = 0; i < 52; i++) {

    const curChild = document.createElement('div');

    //Lines on even indices
    if(i % 2 === 0) {                         

      if(i < 17 || i > 39 || i === 28) {      //Ledger lines above treble clef, below bass clef, and middle C

        curChild.className = 'ledger-line';
      }

      else curChild.className = 'line';
    }

    //Spaces on odd indices
    else {

      /*ledger spaces start at 2nd space above treble clef and higher.
        Also 2nd space below bass clef and lower*/
      
      if (i < 16 || i > 40) curChild.className = 'ledger-space';         

      else curChild.className = 'space';                                
    }   

    curChild.classList.add('loc-' + i);                       
    curChild.idNum = i;                             //A seperate property idNum is created here
    curChild.noteVal = g.notes[i % 7];                //Assign a note value (A-G) to each location

    grdStaff.appendChild(curChild);                    
  }

}

const resetErrorCount = () => {

  g.numErrors = 0;
  g.firstError = true;
  document.querySelector('.hud-right span').textContent = 0;
}

function setupBtns(gameType) {
  
  const btnDiv = document.querySelector('.input-container');        //div that holds 7 A-G buttons

  for(let i = 0; i < notesAG.length; i++) {              

    const newBtn = document.createElement('button');

    newBtn.className = 'btn';

    //Check if we are in interval mode
    newBtn.textContent = gameType === 'intervals' ? intervals[i] : notesAG[i];
    newBtn.noteVal = gameType === 'intervals' ? null : notesAG[i];                             

    newBtn.addEventListener('click', parseInput);

    btnDiv.appendChild(newBtn);                                
  }
}

function showExtraLines(locDiv) {

  // If on a ledger line, make it visible
  if(locDiv.classList.contains('ledger-line')) locDiv.style.backgroundColor = 'black';      

  // Traverse through lines and spaces
  let tempLoc = locDiv;            
  let i = 0;                    
  
  //For above treble clef
  while (tempLoc.idNum < 17) {                    

    if (tempLoc.classList.contains('ledger-line')) {
      
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

    if (tempLoc.classList.contains('ledger-line')) {
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
  util.shuffleArray(sequence);

  g.sequenceLength = sequence.length;
  g.currentSequence = sequence;
}

function endGame() {

  const doneModal = document.querySelector('.done-modal');
  doneModal.showModal();

  const points = g.sequenceLength - g.numErrors;
  const scoreSpan = document.querySelector('.done-modal span');
  scoreSpan.textContent = `${points + '/' + g.sequenceLength}`;

  // Disable user input
  g.errorState = true;

  util.drawScoreCircle(points, g.sequenceLength);
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

  const noteNumDiv = document.querySelector('.hud-center');
  noteNumDiv.textContent = `${g.sequenceNum}/${g.sequenceLength}`;

  let locId = g.currentSequence.pop();

  //Retrieve div that corresponds to our locId
  const locDiv = document.querySelector('.loc-' + locId);
  
  if (locDiv.classList.contains('ledger-line') || locDiv.classList.contains('ledger-space')) showExtraLines(locDiv);      
  
  //Everything below here pertains to our quarter note image
  
  const note = document.createElement('img');                                   
  g.noteImg = note;                                          
  note.src = 'Images/quarter_note.png';
  note.classList.add('note');
  locDiv.appendChild(note);
  
  if (locId < 5) note.classList.add('upside-down')

  return locDiv;
}

function removeImg() {

  g.noteImg.remove();
  // g.noteDiv.removeChild(g.noteImg);                     //Remove the note image

  if (g.noteDiv.classList.contains('ledger-line')) g.noteDiv.style.backgroundColor = 'transparent';      //If the current location is a ledger-line, then we need to hide it

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
  document.querySelector('.hud-right span').textContent = g.numErrors;
  g.firstError = false;
}

function evaluateChoice(choice) {
  //Tell user if clicked answer is right or wrong

  const btns = document.querySelectorAll('.btn');
  let btn;
  
  // Find button they clicked
  for (btn of btns) {
    if (btn.noteVal === choice) break;
  }

  const correctAns = g.noteDiv.noteVal;                        

  //Case 1: correct answer 
  if (choice === correctAns) {

    g.firstError = true;

    if(g.volumeOn) util.playCorrectSound();
    
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
    
    if(g.volumeOn) util.playWrongSound();

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

function initiateGame(gameType) {

  createLocations();
  
  setupBtns(gameType);

  generateSequence();

  g.noteDiv = getNextLocation();

  //Functionality for key presses
  document.addEventListener('keydown', parseInput);

  setupRestartBtn();
}

export { initiateGame, removeImg, getNextLocation, generateSequence};