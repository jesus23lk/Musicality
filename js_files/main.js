import {initiateGame, removeImg} from "./game.js";
import setupAllSideElements from "./side_elements.js";
import g from "./globals.js";

window.onload = function() {

  //Setup the page
  createLocations();                    
  initiateGame();
  setupAllSideElements();

}

function createLocations() {

  //This functions creates all lines and spaces where a note can spawn

  const grdStaff = document.getElementById('staff');                  //grand staff contains all lines and spaces
  
  for(let i = 0; i < 52; i++) {

    const curChild = document.createElement('div');

    //Lines on even indices
    if(i % 2 === 0) {                         

      if(i < 17 || i > 39 || i === 28) {      //Ledger lines above treble clef, below bass clef, and middle C

        curChild.className = 'ledger-line';
        curChild.innerHTML = `<div class = 'empty-l'></div>
                              <div class = 'empty-r'></div>`;
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

    curChild.id = 'loc-' + i;                       
    curChild.idNum = i;                             //A seperate property idNum is created here
    curChild.noteVal = g.notes[i % 7];                //Assign a note value (A-G) to each location

    grdStaff.appendChild(curChild);                    
  }

}

