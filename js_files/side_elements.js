import g from './globals.js';
import { removeImg, pickLocation } from './game.js';

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

    g.errorState = true;

    removeImg();                    //When in an error state, we want to remove the note image and not accept user input
  }

  else if (minOption.idNum === maxOption.idNum) {                         

    errorMsg.textContent = "Error: lowest note cannot be equal to highest note";      

    g.errorState = true;

    removeImg();                    //When in an error state, we want to remove the note image and not accept user input
  }

  else {              //Entered when user picks legal values for highest and lowest notes

    errorMsg.textContent = '';
    
    if(g.errorState) g.errorState = false;              //exit error state
    
    else removeImg();                                                  //We only want to remove the image if we aren't in an error state

    g.highestNote = maxOption.idNum;               //Finally change the actual highest note value
    g.lowestNote = minOption.idNum;                //Finally change the actual lowest note value

    g.noteDiv = pickLocation();                              //Spawn a new note in a different location that adheres to our new lowest and highest


  }
}
function resetMinMax() {

  /* entered when user clicks reset button to reset highest and lowest notes */

  const errorMsg = document.getElementById('error-msg');                    // <p> that is used to display error message
  errorMsg.textContent = '';

  const msgBanner = document.getElementById('msg-banner')
  msgBanner.style.backgroundColor = 'rgb(128, 128, 128)';               //Hide message banner
  msgBanner.textContent = "Press a key or click a button";

  if(g.errorState) g.errorState = false;                                           //Exit error state

  else removeImg();                                               //If we aren't in an error state, then remove the note image

  const maxSelect = document.getElementById('max-select');       //Drop down selector for max note
  const minSelect = document.getElementById('min-select');       //Drop down selector for min note

  maxSelect.options[11].selected = 'selected';                 //Return highest note selector to its defualt value
  minSelect.options[45].selected = 'selected';                //Return lowest note selector to its default value

  g.highestNote = 11;                                   //Reset lowest and highest note values
  g.lowestNote = 45;

  g.noteDiv = pickLocation();
}

function setupVolume() {

  const volumeSection = document.getElementById('volume-section');
  const volumeIcon = document.querySelector('.volume-icon');
  
  volumeSection.addEventListener('click', () => {
    
    if(g.volumeOn) {
      volumeIcon.textContent = 'toggle_off';
      g.volumeOn = false;
    }
    
    else {
      volumeIcon.textContent = 'toggle_on';
      g.volumeOn = true;
    }
  });
}

function setupLeftSidebar() {

  const menuIcon = document.getElementById("menu-icon");
  const closeSection = document.querySelector(".close-section");
  const sideBar = document.getElementById("sidebar");
  const cover = document.querySelector('.cover');

  cover.addEventListener('click',() => {
    sideBar.classList.remove('visible');
    cover.style.display = 'none';
  });

  menuIcon.onclick = () => {
    sideBar.classList.add("visible");
    cover.style.display = 'block';
  }
  closeSection.onclick = () => {
    sideBar.classList.remove("visible");
    cover.style.display = 'none';
  }
}

function setupNoteRange() {

  const noteRangeSec = document.querySelector('.note-range-container');
  const arrowIcon = document.querySelector('.material-symbols-outlined.arrow-icon');

  document.getElementById('note-range-section').addEventListener('click', (e) => {

    if (e.target.closest('.note-range-container')) {
      
      console.log('hello');
      return;  

    }

    if(noteRangeSec.dataset.visible === 'false') {
      noteRangeSec.classList.add('visible');
      arrowIcon.textContent = 'keyboard_arrow_up';
      noteRangeSec.dataset.visible = 'true';
    }
    
    else {
      noteRangeSec.classList.remove('visible');
      arrowIcon.textContent = 'keyboard_arrow_down';
      noteRangeSec.dataset.visible = 'false';
    }
  })
}

function setupAllSideElements() {

  setupDropDowns();                           //Sets up drop down menus to change highest and lowest notes

  setupVolume();                            //Sets up the volume button to disable an enable volume

  // setupHelpModal();

  setupLeftSidebar();


  setupNoteRange();
}

export default setupAllSideElements;