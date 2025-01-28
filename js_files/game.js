import g from "./globals.js";

//! THIS FILE CONTAINS FUNCTIONALITY FOR THE ACTUAL GAME

// Only for textcontent of buttons
const notesAG = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

// random value in the range min-max (inclusive)
const getRandom = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));         

function setupBtns() {
  
  const btnDiv = document.getElementById('btn-container');        //div that holds 7 A-G buttons

  for(let i = 0; i < notesAG.length; i++) {              

    const newBtn = document.createElement('button');

    newBtn.className = 'btn';
    newBtn.textContent = notesAG[i];
    newBtn.noteVal = notesAG[i];                              //Each button gets a property named 'noteVal' that gets a value 'A'-'G'
    newBtn.addEventListener('click', evaluateChoice);

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

function pickLocation() {
  
  //Location id of note (integer 0-42)
  let locId;                        

  //do while loop is here to make sure our note is not in the same place twice 
  do {                              
     //Get random number in the range 0-42 (inclusive) 
    locId = getRandom(g.highestNote, g.lowestNote);      
  }
  while (locId === g.prevLocId);     /* Keep looping if the random location we got is the same as our previous location*/

  //Current location saved as previous location
  g.prevLocId = locId;
  
  //Retrieve div that corresponds to our locId
  const locDiv = document.getElementById('loc-' + locId);
  
  if (locDiv.className === 'ledger-line' || locDiv.className === 'ledger-space') showExtraLines(locDiv);      
  
  //Everything below here pertains to our quarter note image
  
  const note = document.createElement('img');                                   
  g.noteImg = note;                                          
  note.src = 'Images/quarter-note1.png';
  note.id = 'note';
  locDiv.appendChild(note);
  
  if (locId < 5) note.classList.add('upside-down')

  if(locDiv.className === 'ledger-line') note.classList.add('on-ledger');
  
  else if (locDiv.className === 'line') note.classList.add('on-line');
  
  else note.classList.add('on-space');
  
  //Finally return the div that contains our note

  return locDiv;

}

function removeImg() {

  g.noteDiv.removeChild(g.noteImg);                     //Remove the note image
  g.noteImg.classList.remove('on-ledger');
  g.noteImg.classList.remove('on-line');
  g.noteImg.classList.remove('on-space');
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

function giveFeedback(choice) {
  //Tell user if clicked answer is right or wrong

  const btns = document.querySelectorAll('.btn');
  let btn;
  
  for (btn of btns) {
    if (btn.noteVal === choice) break;
  }

  const correctAns = g.noteDiv.noteVal;                        

  if (choice === correctAns) {
    if(g.volumeOn) g.sounds.correct.play();
    
    //correct animation
    btn.classList.add('btn-correct');
    btn.addEventListener('animationend', () => btn.classList.remove('btn-correct'));

    //Move note to new location
    removeImg();                            
    g.noteDiv = pickLocation();             

  }
  
  else {
    if(g.volumeOn) g.sounds.wrong.play();                              
    btn.classList.add('btn-wrong');
    btn.addEventListener('animationend', () => btn.classList.remove('btn-wrong'));
  }

}

function evaluateChoice(e) {

  //Called when user clicks an A-G button or when they press a key

  //Disable input when in error state
  if(g.errorState) return;        

  //user input, button or keyboard key
  let choice; 

  //Check if a button was clicked 
  if(e.target.className) choice = e.target.noteVal;              

  else {

    choice = e.key.toUpperCase();       
    
    //Check if key pressed  is A-G
    if(choice[1] || choice.charCodeAt(0) < 65 || choice.charCodeAt(0) > 71) return;
  }

  giveFeedback(choice);
}

function initiateGame() {

  setupBtns();       

  //Starts game by putting note in random location
  g.noteDiv = pickLocation();        

  //Functionality for key presses
  document.addEventListener('keydown', evaluateChoice);
}


export {initiateGame, removeImg, pickLocation};