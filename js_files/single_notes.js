import * as util from "./util.js";

//! THIS FILE CONTAINS FUNCTIONALITY FOR SINGLE NOTES

// Only for textcontent of buttons
const notesAG = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

//Location where note landed
let noteDiv = '';

//error variables for hud
let firstError = true;
let numErrors = 0 ; 

let noteImg = '';           
let extraLines = [];

let highestNote = 11;          //Default highest note F6          
let lowestNote = 45;           //Lowest note G1

let volumeOn = true;           //Is volume enabled

//This array is now being used
const allPianoNotes = [
  "C8",
  "B7", "A7", "G7", "F7", "E7", "D7", "C7",
  "B6", "A6", "G6", "F6", "E6", "D6", "C6",
  "B5", "A5", "G5", "F5", "E5", "D5", "C5",
  "B4", "A4", "G4", "F4", "E4", "D4", "C4",
  "B3", "A3", "G3", "F3", "E3", "D3", "C3",
  "B2", "A2", "G2", "F2", "E2", "D2", "C2",
  "B1", "A1", "G1", "F1", "E1", "D1", "C1",
  "B0", "A0"
];

let errorState = false;     /* Set true when page is in an error state
When this happens, interaction is disabled */

//The current sequence of notes that we are following
let currentSequence = [];
let sequenceNum = 1;
let sequenceLength = null;

function setupVolume() {


  const volumeIcon = document.querySelector('.volume-icon');
  const volumeSection = volumeIcon.closest('.context-section');
  
  volumeSection.addEventListener('click', () => {
    
    if(volumeOn) {
      volumeIcon.textContent = 'toggle_off';
      volumeOn = false;
    }
    
    else {
      volumeIcon.textContent = 'toggle_on';
      volumeOn = true;
    }
  });
}

function setupDropDowns() {

  let charRange = 'CBAGFED'         //Defines the range of characters we want

  const pianoKeys = [];                  //This will hold our piano note values that go from C1, D1, E1.. all the way to C8

  let i = 0;
  let k = 8;

  while(i < 52) {

    for(let j = 0; j < 7; j++) {

      pianoKeys[i] = charRange[j];       //populate pianoKeys array
      pianoKeys[i] += k;                //String concatenation to add numbers going from 7 to 1
  
      i++;
      if(i === 52) break;
      if (j === 0) k--;
    }

  }

  const maxSelect = document.querySelector('.max-select');       //Drop down selector for max note
  const minSelect = document.querySelector('.min-select');       //Drop down selector for min note
  
  for(let i = 0; i < 52; i++) {

    /* This loop populates our two selectors for
      highest and lowest notes */
  
    const maxOption = document.createElement('option');                   //We create an option element for each selector
    const minOption = document.createElement('option');
  
    maxOption.textContent = pianoKeys[i];                                    //They each get the same text value
    minOption.textContent = pianoKeys[i];                                    //That will be one of these: 'C8, 'B7', 'A7', etc.

    if (i === 18) {
      /* Here we add a marker to help us find the 
        top line of treble clef in our select menu */

      maxOption.textContent += ' (Treble Top Line)';                        
      minOption.textContent += ' (Treble Top Line)';  
    }

    if (i === 28) {      
      /* Here we add a marker to help us find the 
        middle C in our select menu */

      maxOption.textContent += ' (Middle C)';                        
      minOption.textContent += ' (Middle C)';                                        
    }

    
    if (i === 38) {      
      /* Here we add a marker to help us find the 
        bottom line of bass clef*/

      maxOption.textContent += ' (Bass Bottom Line)';                        
      minOption.textContent += ' (Bass Bottom Line)';                                        
    }


    maxOption.idNum = i;                                               //Here I define a new attribute 'idNum' that can be 0-42
    minOption.idNum = i;                                               //We will need it later to compare lowest and highest values
  
    maxSelect.appendChild(maxOption);                                   //Add each option to its corresponding selector
    minSelect.appendChild(minOption);
    
    //! You shouldn't hardcode these values here, rather you should set the to what they are in g
    if(i === 11) maxOption.selected = true;                      /* Defiens the default value of the highest note
                                                                          which is F6 */

    if(i === 45) minOption.selected = true;                       /* Defines the default value of the lowest note
                                                                          Which is G1*/
  }

  maxSelect.addEventListener('change', updateMinMax);
  minSelect.addEventListener('change', updateMinMax);

  /* Below we configure our reset button. clicked to reset
    highest and lowest notes */

  const resetBtn = document.querySelector('.reset-option-btn');
  resetBtn.addEventListener('click', resetMinMax);                                 
}

function updateMinMax() {

  /* Entered when user clicks update button to update lowest and highest note values */

  const maxSelect = document.querySelector('.max-select');      
  const minSelect = document.querySelector('.min-select');      

  /* Retrieve the <option> elements with current lowest and highest notes */
  const maxOption = maxSelect.options[maxSelect.selectedIndex];          
  const minOption = minSelect.options[minSelect.selectedIndex];

  /* Check that lowest note is not greater than or equal to highest note */
  const errorMsg = document.querySelector('.error-msg');                    

  if(minOption.idNum < maxOption.idNum)  {                                 

    errorMsg.textContent = "Error: lowest note cannot be higher than highest note";

    //Go into error state to reject user input
    errorState = true;
    removeImg();                    
  }

  else if (minOption.idNum === maxOption.idNum) {                         

    errorMsg.textContent = "Error: lowest note cannot be equal to highest note";      

    errorState = true;
    removeImg();                    
  }

  //When user picks legal values
  else {           

    errorMsg.textContent = '';
    
    //exit error state
    if(errorState) errorState = false;              
    
    else removeImg();                                                  

    //Finally change highest and lowest notes
    highestNote = maxOption.idNum;               
    lowestNote = minOption.idNum;                

    //Reset everything
    updateHudNoteRange();
    sequenceNum = 1;
    generateSequence();
    noteDiv = getNextLocation();                             
  }
}

function resetMinMax() {

  /* entered when user clicks reset button to reset highest and lowest notes */

  if(errorState) {
    document.querySelector('.error-msg').textContent = '';
    errorState = false;                                           //Exit error state
  }

  else removeImg();                                               //If we aren't in an error state, then remove the note image

  const maxSelect = document.querySelector('.max-select');       
  const minSelect = document.querySelector('.min-select');    

  // Return lowest and highest note selectors to their default values
  maxSelect.options[11].selected = true;                 
  minSelect.options[45].selected = true;                

  //Reset global highest and lowest
  highestNote = 11;              
  lowestNote = 45;

  //Start the game again
  updateHudNoteRange();
  sequenceNum = 1;
  generateSequence();
  noteDiv = getNextLocation();                              
}

function updateHudNoteRange() {
  //Used to update note range in the hud

  const hudNtRng = document.querySelector('.hud-left');

  //Get indices for highest and lowest notes
  const high = highestNote;
  const low = lowestNote;

  //Use indices on allPianoNotes array
  hudNtRng.textContent = `${allPianoNotes[low] + '-' + allPianoNotes[high]}`;
}

const resetErrorCount = () => {

  numErrors = 0;
  firstError = true;
  document.querySelector('.hud-right span').textContent = 0;
}

function setupBtns() {
  
  const btnDiv = document.querySelector('.input-container');        //div that holds 7 A-G buttons

  for(let i = 0; i < notesAG.length; i++) {              

    const newBtn = document.createElement('button');

    newBtn.className = 'btn';

    newBtn.textContent = notesAG[i];
    newBtn.noteVal = notesAG[i];

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
      extraLines[i] = tempLoc;                         //We also wanna save each line we made visible, that way we can hide them later
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
      extraLines[i] = tempLoc;
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
  for (let i = highestNote; i <= lowestNote; i++) {
    sequence[j] = i;
    j++;
  }

  //Implement the fisher yates algorithm for random sequence
  util.shuffleArray(sequence);

  sequenceLength = sequence.length;
  currentSequence = sequence;
}

function endGame() {

  const doneModal = document.querySelector('.done-modal');
  doneModal.showModal();

  const points = sequenceLength - numErrors;
  const scoreSpan = document.querySelector('.done-modal span');
  scoreSpan.textContent = `${points + '/' + sequenceLength}`;

  // Disable user input
  errorState = true;

  util.drawScoreCircle(points, sequenceLength);
}

function setupRestartBtn() {

  const restartBtn = document.querySelector('.restart-game-btn');

  restartBtn.addEventListener('click', () =>{

    //Reset everything
    const doneModal = document.querySelector('.done-modal');
    doneModal.close();

    errorState = false;
    sequenceNum = 1;
    generateSequence();
    noteDiv = getNextLocation();
  });
}

function getNextLocation() {

  if (sequenceNum > sequenceLength) {
    endGame();
    return;
  }

  const noteNumDiv = document.querySelector('.hud-center');
  noteNumDiv.textContent = `${sequenceNum}/${sequenceLength}`;

  let locId = currentSequence.pop();

  //Retrieve div that corresponds to our locId
  const locDiv = document.querySelector('.loc-' + locId);
  
  if (locDiv.classList.contains('ledger-line') || locDiv.classList.contains('ledger-space')) showExtraLines(locDiv);      
  
  //Everything below here pertains to our quarter note image
  
  const note = document.createElement('img');                                   
  noteImg = note;                                          
  note.src = 'Images/quarter_note.png';
  note.classList.add('note');
  locDiv.appendChild(note);
  
  if (locId < 5) note.classList.add('upside-down')

  return locDiv;
}

function removeImg() {

  noteImg.remove();
  // noteDiv.removeChild(noteImg);                     //Remove the note image

  if (noteDiv.classList.contains('ledger-line')) noteDiv.style.backgroundColor = 'transparent';      //If the current location is a ledger-line, then we need to hide it

  if(extraLines) {

    /* If there are extra ledger lines visible,
      then we want to hide each of those lines*/

    for(let i = 0; i < extraLines.length; i++) {

      extraLines[i].style.backgroundColor = 'transparent';

    }
  }
}

function incErrorCount() {
  numErrors++;
  document.querySelector('.hud-right span').textContent = numErrors;
  firstError = false;
}

function evaluateChoice(choice) {
  //Tell user if clicked answer is right or wrong

  const btns = document.querySelectorAll('.btn');
  let btn;
  
  // Find button they clicked
  for (btn of btns) {
    if (btn.noteVal === choice) break;
  }

  const correctAns = noteDiv.noteVal;                        

  //Case 1: correct answer 
  if (choice === correctAns) {

    firstError = true;

    if(volumeOn) util.playCorrectSound();
    
    //correct animation
    btn.classList.add('btn-correct');
    btn.addEventListener('animationend', () => btn.classList.remove('btn-correct'));
    
    //Move note to new location
    removeImg();                            
    sequenceNum++;
    noteDiv = getNextLocation();             
  }
  
  //Case 2 wrong answer
  else {
    
    if (firstError) incErrorCount();
    
    if(volumeOn) util.playWrongSound();

    btn.classList.add('btn-wrong');
    btn.addEventListener('animationend', () => btn.classList.remove('btn-wrong'));
  }

}

function parseInput(e) {

  if (errorState) return;

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

function main() {

  util.createGrandStaff();
  
  setupBtns();
  setupVolume();

  generateSequence();

  noteDiv = getNextLocation();

  //Functionality for key presses
  document.addEventListener('keydown', parseInput);

  setupRestartBtn();

  setupDropDowns();

  updateHudNoteRange();

  util.setupContextSettings();
  util.setupSidebar();
}

main();

export { removeImg, getNextLocation, generateSequence};