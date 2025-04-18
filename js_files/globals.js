const g = {
  //Location where note landed
  noteDiv: '',              
  
  //error variables for hud
  firstError: true,
  numErrors: 0,  

  noteImg: '',            
  extraLines: [],
  
  highestNote: 11,          //Default highest note F6          
  lowestNote: 45,           //Lowest note G1
  
  volumeOn: true,            //Is volume enabled
  
  /* Used to populate lines and spaces noteval property */
  notes: ['C', 'B', 'A', 'G', 'F', 'E', 'D'],

  //This array is now being used
  allPianoNotes: [
    "C8",
    "B7", "A7", "G7", "F7", "E7", "D7", "C7",
    "B6", "A6", "G6", "F6", "E6", "D6", "C6",
    "B5", "A5", "G5", "F5", "E5", "D5", "C5",
    "B4", "A4", "G4", "F4", "E4", "D4", "C4",
    "B3", "A3", "G3", "F3", "E3", "D3", "C3",
    "B2", "A2", "G2", "F2", "E2", "D2", "C2",
    "B1", "A1", "G1", "F1", "E1", "D1", "C1",
    "B0", "A0"
  ],

  errorState: false,     /* Set true when page is in an error state
  When this happens, interaction is disabled */

  //The current sequence of notes that we are following
  currentSequence: [],
  sequenceNum: 1,
  sequenceLength: null,
}

//! Below is the depracated pickLocation() function that isn't used anymore 

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

export default g;
    
   