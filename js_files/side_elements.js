import g from './globals.js';
import { removeImg, getNextLocation, generateSequence } from './game.js';

function setupContextSettings() {

  const context = document.querySelector('.settings-context');
  const settingsIcon = document.querySelector('.header-right span');
  const closeIcon = document.querySelector('.close-context');
  const cover = document.querySelector('.cover');

  settingsIcon.addEventListener('click', () => {

    context.classList.toggle('hidden');

    if (!context.classList.contains('hidden')) cover.style.display = 'block';
  });

  document.body.addEventListener('click', (e) => {

    // Don't close context if we click within context or on settings icon
    if (context.contains(e.target) || e.target === settingsIcon) return;

    if (!context.classList.contains('hidden')) {
      context.classList.add('hidden');
    }
  })

  closeIcon.addEventListener('click', () => {
    context.classList.add('hidden')
    cover.style.display = 'none';
  });

  
};

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
    if(i === 11) maxOption.selected = 'selected' ;                      /* Defiens the default value of the highest note
                                                                          which is F6 */

    if(i === 45) minOption.selected = 'selected';                       /* Defines the default value of the lowest note
                                                                          Which is G1*/
  }

  maxSelect.addEventListener('change', updateMinMax);
  minSelect.addEventListener('change', updateMinMax);

  /* Below we configure our reset button. clicked to reset
    highest and lowest notes */

  const resetBtn = document.querySelector('.reset-note-range-btn');
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
    g.errorState = true;
    removeImg();                    
  }

  else if (minOption.idNum === maxOption.idNum) {                         

    errorMsg.textContent = "Error: lowest note cannot be equal to highest note";      

    g.errorState = true;
    removeImg();                    
  }

  //When user picks legal values
  else {           

    errorMsg.textContent = '';
    
    //exit error state
    if(g.errorState) g.errorState = false;              
    
    else removeImg();                                                  

    //Finally change highest and lowest notes
    g.highestNote = maxOption.idNum;               
    g.lowestNote = minOption.idNum;                

    //Reset everything
    updateHudNoteRange();
    g.sequenceNum = 1;
    generateSequence();
    g.noteDiv = getNextLocation();                             
  }
}

function resetMinMax() {

  /* entered when user clicks reset button to reset highest and lowest notes */

  if(g.errorState) {
    document.querySelector('.error-msg').textContent = '';
    g.errorState = false;                                           //Exit error state
  }

  else removeImg();                                               //If we aren't in an error state, then remove the note image

  const maxSelect = document.querySelector('.max-select');       
  const minSelect = document.querySelector('.min-select');    

  // Return lowest and highest note selectors to their default values
  maxSelect.options[11].selected = 'selected';                 
  minSelect.options[45].selected = 'selected';                

  //Reset global highest and lowest
  g.highestNote = 11;              
  g.lowestNote = 45;

  //Start the game again
  updateHudNoteRange();
  g.sequenceNum = 1;
  generateSequence();
  g.noteDiv = getNextLocation();                              
}

function setupVolume() {

  const volumeIcon = document.querySelector('.volume-icon');
  const volumeSection = volumeIcon.closest('.context-section');
  
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

function setupSidebar() {

  const menuIcon = document.querySelector(".menu-icon");
  const closeSection = document.querySelector(".close-section");
  const sideBar = document.querySelector(".sidebar");
  const cover = document.querySelector('.cover');

  cover.addEventListener('click',() => {
    sideBar.classList.remove('visible');
    cover.style.display = 'none';
  });

  menuIcon.addEventListener('click', () => {
    sideBar.classList.add("visible");
    cover.style.display = 'block';
  });

  closeSection.addEventListener('click', () => {
    sideBar.classList.remove("visible");
    cover.style.display = 'none';
  });
}

function updateHudNoteRange() {
  //Used to update note range in the hud

  const hudNtRng = document.querySelector('.hud-left');

  //Get indices for highest and lowest notes
  const high = g.highestNote;
  const low = g.lowestNote;

  //Use indices on allPianoNotes array
  hudNtRng.textContent = `${g.allPianoNotes[low] + '-' + g.allPianoNotes[high]}`;
}

function setupAllSideElements() {

  setupContextSettings();

  setupDropDowns();                           //Sets up drop down menus to change highest and lowest notes

  setupVolume();                            //Sets up the volume button to disable an enable volume

  setupSidebar();

  updateHudNoteRange();
  
}

export {setupSidebar, setupAllSideElements, setupContextSettings};