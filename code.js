/* The notes array below is used to populate our lines and spaces
   Specifically to populate their noteVal property*/

const notes =   ['C', 'B', 'A', 'G', 'F', 'E', 'D'];

/* The notesAG array below is used to populate the text content
  of our buttons*/

const notesAG = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

let errorState = false;     /* Set true when page is in an error state
                                When this happens, interaction is disabled */

const data = {
  noteDiv: '',              //Actual div that holds the image note (either line or space)

  prevLocId: '',              //Integer value in the inclusive range 0-42

  noteImg: '',              //Current note image, there is only one at any given time
  extraLines: [],

  highestNote: 11,          //Default highest note F6          
  lowestNote: 45,           //Lowest note G1

  volumeOn: true            //Is volume enabled
}

const sounds = {
  correct: new Audio("./audio/correct-answer.wav"),
  wrong: new Audio("./audio/wrong-answer.wav"),
  click: new Audio("./audio/click-1.mp3")
}

window.onload = function() {

  createLocations();                    //Creates all ledger-line and space locations inside staff

  setupBtns();                          //Creates A-G buttons for user to interact

  data.noteDiv = pickLocation();        /*Puts a quarter note img in a random location (space or line).
                                          Returns that location as a div and stores it in a global variable*/

  document.addEventListener('keydown', evaluateChoice);  //When a key is pressed, call evaluateChoice()

  setupDropDowns();                           //Sets up drop down menus to change highest and lowest notes

  setupVolume();                            //Sets up the volume button to disable an enable volume

  setupHelpModal();

  setupSidebar();

}

function createLocations() {

  //This functions creates all lines and spaces where a note can spawn

  const grdStaff = document.getElementById('staff');                  //grand staff contains all lines and spaces
  
  for(let i = 0; i < 52; i++) {

    const curChild = document.createElement('div');

    if(i % 2 === 0) {                         //! Lines are now found on even indices

      if(i < 17 || i > 39 || i === 28) {      //Ledger lines above treble clef, below bass clef, and middle C

        curChild.className = 'ledger-line';
        // curChild.insertAdjacentHTML = ('beforeend',`<div class = 'empty-l'></div><div class = 'empty-r'></div>`);
        curChild.innerHTML = `<div class = 'empty-l'></div>
                              <div class = 'empty-r'></div>`;
      }

      else curChild.className = 'line';
    }

    else {      //! Spaces now found on odd indices

      /*ledger spaces start at 2nd space above treble clef and higher.
        Also 2nd space below bass clef and lower*/
      
      if (i < 16 || i > 40) curChild.className = 'ledger-space';         

      else curChild.className = 'space';                                //Any other space is just a space  
    }   

    curChild.id = 'loc-' + i;                       
    curChild.idNum = i;                             //A seperate property idNum is created here
    curChild.noteVal = notes[i % 7];                //Assign a note value (A-G) to each location

    grdStaff.appendChild(curChild);                    
  }

}

function setupBtns() {
  
  //creates the buttons the user will interact with

  const btnDiv = document.getElementById('btn-container');        //div that holds 7 A-G buttons

  for(let i = 0; i < notesAG.length; i++) {               //notesAG is an array that holds charcters 'A' - 'G'

    const newBtn = document.createElement('button');

    newBtn.className = 'btn';
    newBtn.textContent = notesAG[i];
    newBtn.noteVal = notesAG[i];                              //Each button gets a property named 'noteVal' that gets a value 'A'-'G'
    newBtn.addEventListener('click', evaluateChoice);

    btnDiv.appendChild(newBtn);                                 
  }
}

const getRandom = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));         //returns random value in the range min-max (inclusive)

function showExtraLines(locDiv) {

  /*Entered when our note spawns on a location above treble clef or below bass clef
    A location that requires extra ledger-lines to be shown*/

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
      data.extraLines[i] = tempLoc;                         //We also wanna save each line we made visible, that way we can hide them later
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
      data.extraLines[i] = tempLoc;
      i++;
    }  

    tempLoc = tempLoc.previousSibling;
  }

}

function pickLocation() {
  
  let locId;                        //Location id of note (integer 0-42)

  do {                              //do while loop is here to make sure our note is not in the same place twice 

    locId = getRandom(data.highestNote, data.lowestNote);       //Get random number in the range 0-42 (inclusive) 

  }
  while (locId === data.prevLocId);     /* Keep looping if the random location we got is the same as our previous location*/

  data.prevLocId = locId;               //Current location saved as previous location

  const locDiv = document.getElementById('loc-' + locId);          //Retrieve location div that corresponds to our locId

  if (locDiv.className === 'ledger-line' || locDiv.className === 'ledger-space') showExtraLines(locDiv);      //ledger-lines and ledger-spaces need extra lines to be shown

  //Everything below here pertains to our quarter note image

  const note = document.createElement('img');                                   
  data.noteImg = note;                                          //We need to save our image to a global because a different function will be in charge of removing it
  note.src = 'Images/quarter-note1.png';
  note.id = 'note';
  locDiv.appendChild(note);

  if(locDiv.className === 'line' || locDiv.className === 'ledger-line') note.style.bottom = '-22px';
  
  else note.style.bottom = '-17px';

  //Finally return the div that contains our note

  return locDiv;

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

  const maxSelect = document.getElementById('max-select');       //Drop down selector for max note
  const minSelect = document.getElementById('min-select');       //Drop down selector for min note
  
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
    
    if(i === 11) maxOption.selected = 'selected' ;                      /* Defiens the default value of the highest note
                                                                          which is F6 */

    if(i === 45) minOption.selected = 'selected';                       /* Defines the default value of the lowest note
                                                                          Which is G1*/
  }

  /* Below we configure our update button that the user clicks
    to confirm their choice of highest and lowest notes */

  const updateBtn = document.getElementById('update-btn');      
  updateBtn.onclick = updateMinMax;                                 

  /* Below we configure our reset button. clicked to reset
    highest and lowest notes */

  const resetBtn = document.getElementById('reset-btn');
  resetBtn.onclick = resetMinMax;                                 
}

function updateMinMax() {

  /* Entered when user clicks update button to update lowest and highest note values */

  const msgBanner = document.getElementById('msg-banner')
  msgBanner.style.backgroundColor = 'rgb(128, 128, 128)';               //Hide message banner
  msgBanner.textContent = "Press a key or click a button";
  

  const maxSelect = document.getElementById('max-select');       //Drop down selector for max note
  const minSelect = document.getElementById('min-select');       //Drop down selector for min note

  /* Two lines of code below retrieve the <option> elements for the
    user-selected lowest and highest notes */

  const maxOption = maxSelect.options[maxSelect.selectedIndex];          
  const minOption = minSelect.options[minSelect.selectedIndex];

  /* Lowest note cannot be greater than highest note.
    It also cannot be equal to highest note.
    The conditionals below are there to check for that.
    If this does happen then we enter an error state */

  const errorMsg = document.getElementById('error-msg');                    // <p> that is used to display error message

  if(minOption.idNum < maxOption.idNum)  {                                  

    errorMsg.textContent = "Error: lowest note cannot be higher than highest note";

    errorState = true;

    removeImg();                    //When in an error state, we want to remove the note image and not accept user input
  }

  else if (minOption.idNum === maxOption.idNum) {                         

    errorMsg.textContent = "Error: lowest note cannot be equal to highest note";      

    errorState = true;

    removeImg();                    //When in an error state, we want to remove the note image and not accept user input
  }

  else {              //Entered when user picks legal values for highest and lowest notes

    errorMsg.textContent = '';
    
    if(errorState) errorState = false;              //exit error state
    
    else removeImg();                                                  //We only want to remove the image if we aren't in an error state

    data.highestNote = maxOption.idNum;               //Finally change the actual highest note value
    data.lowestNote = minOption.idNum;                //Finally change the actual lowest note value

    data.noteDiv = pickLocation();                              //Spawn a new note in a different location that adheres to our new lowest and highest


  }


}

function resetMinMax() {

  /* entered when user clicks reset button to reset highest and lowest notes */

  const errorMsg = document.getElementById('error-msg');                    // <p> that is used to display error message
  errorMsg.textContent = '';

  const msgBanner = document.getElementById('msg-banner')
  msgBanner.style.backgroundColor = 'rgb(128, 128, 128)';               //Hide message banner
  msgBanner.textContent = "Press a key or click a button";

  if(errorState) errorState = false;                                           //Exit error state

  else removeImg();                                               //If we aren't in an error state, then remove the note image

  const maxSelect = document.getElementById('max-select');       //Drop down selector for max note
  const minSelect = document.getElementById('min-select');       //Drop down selector for min note

  maxSelect.options[11].selected = 'selected';                 //Return highest note selector to its defualt value
  minSelect.options[45].selected = 'selected';                //Return lowest note selector to its default value

  data.highestNote = 11;                                   //Reset lowest and highest note values
  data.lowestNote = 45;

  data.noteDiv = pickLocation();
}

function evaluateChoice(e) {

  //Called when user clicks an A-G button or when they press a key

  if(errorState) return;        //If in an error state, we want to disable user input by exiting this function

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
  const correctAns = data.noteDiv.noteVal;                        
  const banner = document.getElementById('msg-banner');          

  //Show banner
  banner.style.display = 'flex';                               

  if(choice === correctAns) {                                    //Entered if user guessed correctly
    if(data.volumeOn) sounds.correct.play();                               //Only play sound if volume is on 
    banner.style.backgroundColor = 'rgb(42, 135, 42)';
    banner.textContent = 'Correct!';

    removeImg();                                                //If player got the right answer, we need to remove the note img from where it's currently at
    data.noteDiv = pickLocation();                              //And spawn a new note in a different location
  }

  else  {                                                       //Entered if user guessed incorrectly
    if(data.volumeOn) sounds.wrong.play();                              
    banner.style.backgroundColor = 'rgb(198, 51, 51)';
    banner.textContent = 'Try Again!';
  }

}

function removeImg() {

  data.noteDiv.removeChild(data.noteImg);                     //Remove the note image

  if(data.noteDiv.className === 'ledger-line') data.noteDiv.style.backgroundColor = 'white';      //If the current location is a ledger-line, then we need to hide it

  if(data.extraLines) {

    /* If there are extra ledger lines visible,
      then we want to hide each of those lines*/

    for(let i = 0; i < data.extraLines.length; i++) {

      data.extraLines[i].style.backgroundColor = 'white';

    }

  }
}

function setupVolume() {

  const volumePic = document.getElementById('volume-pic');
  
  
  volumePic.onclick = () => {
    
    if(data.volumeOn) {
      sounds.click.play();
      data.volumeOn = false;
      volumePic.src = 'Images/no-volume-logo.png';
    }
    
    else {
      sounds.click.play();
      data.volumeOn = true;
      volumePic.src = 'Images/volume-logo.png';
    }
  }
}

function setupHelpModal() {

  const helpModal = document.getElementById("help-modal");
  const closeHelp = document.getElementById("close-help");
  const helpBtn = document.getElementById("help-btn");

  helpBtn.onclick = () => {helpModal.showModal() }
  closeHelp.onclick = () => { helpModal.close() }
}

function setupSidebar() {

  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  const sideBar = document.getElementById("sidebar");

  menuIcon.onclick = () => sideBar.classList.add("visible");
  closeIcon.onclick = () => sideBar.classList.remove("visible");
}