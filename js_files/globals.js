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

export default g;
    
   