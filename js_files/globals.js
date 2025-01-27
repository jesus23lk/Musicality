const g = {
  noteDiv: '',              //Actual div that holds the image note (either line or space)
  
  prevLocId: -1,              //Integer value in the inclusive range 0-42
  
  noteImg: '',              //Current note image, there is only one at any given time
  extraLines: [],
  
  highestNote: 11,          //Default highest note F6          
  lowestNote: 45,           //Lowest note G1
  
  volumeOn: true,            //Is volume enabled
  
  /* Used to populate lines and spaces noteval property */
  notes: ['C', 'B', 'A', 'G', 'F', 'E', 'D'],

  sounds: {
    correct: new Audio("./audio/correct-answer.wav"),
    wrong: new Audio("./audio/wrong-answer.wav"),
    click: new Audio("./audio/click-1.mp3")
  },

  errorState: false     /* Set true when page is in an error state
  When this happens, interaction is disabled */
}

// This array is not currently being used in the game, but it may come in handy later
const pianoNotes = [
  "A0", "B0",
  "C1", "D1", "E1", "F1", "G1", "A1", "B1",
  "C2", "D2", "E2", "F2", "G2", "A2", "B2",
  "C3", "D3", "E3", "F3", "G3", "A3", "B3",
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5",
  "C6", "D6", "E6", "F6", "G6", "A6", "B6",
  "C7", "D7", "E7", "F7", "G7", "A7", "B7",
  "C8"
];


export default g;
    
   