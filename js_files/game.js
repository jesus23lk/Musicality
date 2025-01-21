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

  if(locDiv.className === 'line' || locDiv.className === 'ledger-line') note.style.bottom = '-22px';
  
  else note.style.bottom = '-17px';

  //Finally return the div that contains our note

  return locDiv;

}


function removeImg() {

  g.noteDiv.removeChild(g.noteImg);                     //Remove the note image

  if(g.noteDiv.className === 'ledger-line') g.noteDiv.style.backgroundColor = 'white';      //If the current location is a ledger-line, then we need to hide it

  if(g.extraLines) {

    /* If there are extra ledger lines visible,
      then we want to hide each of those lines*/

    for(let i = 0; i < g.extraLines.length; i++) {

      g.extraLines[i].style.backgroundColor = 'white';

    }
  }
}

function evaluateChoice(e) {

  //Called when user clicks an A-G button or when they press a key

  if(g.errorState) return;        //If in an error state, we want to disable user input by exiting this function

  let choice;                                             //Choice can either be the value of a button or the value of a keyboard key

  if(e.target.className) choice = e.target.noteVal;              //Checks if user clicked a button by checking if the event target has a class

  else {
    /*Conditional entered when user pressed a key
      because keys don't have css classes*/

    choice = e.key.toUpperCase();       
    
    /*We only want to accept the keys: A, B, C, D, E, F, G as input and nothing else
      Choice[1] means the name of the key pressed has more than one character in it so it can't be a letter.
      The other two options just hone in on the range we set being A-G */

    if(choice[1] || choice.charCodeAt(0) < 65 || choice.charCodeAt(0) > 71) return;
  }

  //Save current note's value
  const correctAns = g.noteDiv.noteVal;                        
  const banner = document.getElementById('msg-banner');          

  //Show banner
  banner.style.display = 'flex';                               

  if(choice === correctAns) {                                    //Entered if user guessed correctly
    if(g.volumeOn) g.sounds.correct.play();                               //Only play sound if volume is on 
    banner.style.backgroundColor = 'rgb(42, 135, 42)';
    banner.textContent = 'Correct!';

    removeImg();                                                //If player got the right answer, we need to remove the note img from where it's currently at
    g.noteDiv = pickLocation();                              //And spawn a new note in a different location
  }

  else  {                                                       //Entered if user guessed incorrectly
    if(g.volumeOn) g.sounds.wrong.play();                              
    banner.style.backgroundColor = 'rgb(198, 51, 51)';
    banner.textContent = 'Try Again!';
  }

}

function initiateGame() {

  setupBtns();                          
  //Starts game by putting note in random location
  g.noteDiv = pickLocation();        
  //Functionality for key presses
  document.addEventListener('keydown', evaluateChoice);

}


export default initiateGame;