const notes =   ['C', 'B', 'A', 'G', 'F', 'E', 'D'];
const notesAG = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const game = {
  noteLoc: '',
  locId: '',
  curNote: '',
  locsToHide: [],
}


window.onload = function() {

  createLocations();
  setupBtns();
  game.noteLoc = pickLocation();

}

function getRandom(num) {

  return Math.floor(Math.random() * num);
}

function showLedgerLines(loc) {

  if(loc.className === 'ledger-line') loc.style.backgroundColor = 'black';

  const staff = document.getElementById('staff').children;
  let curLoc = loc.nextSibling;

  let i = 0;
  
  while (curLoc.idNum < 10) {

    if (curLoc.className === 'ledger-line') {
      curLoc.style.backgroundColor = 'black';
      game.locsToHide[i] = curLoc;
      i++;
    }  

    curLoc = curLoc.nextSibling;

  }

  curLoc = curLoc.previousSibling;
  i = 0;

  while (curLoc.idNum > 32) {

    if (curLoc.className === 'ledger-line') {
      curLoc.style.backgroundColor = 'black';
      game.locsToHide[i] = curLoc;
      i++;
    }  

    curLoc = curLoc.previousSibling;

  }

}

function createLocations() {

  const clef = document.getElementById('staff');
  
  for(let i = 0; i < 43; i++) {

    const curChild = document.createElement('div');

    if(i % 2 !== 0) {

      if(i < 11 || i > 32 || i === 21) {      //create ledger line locations

        curChild.className = 'ledger-line';
        curChild.innerHTML = `<div class = 'empty-l'></div>
                              <div class = 'empty-r'></div>`;
      }
 
      else curChild.className = 'line';
    }

    else {
      
      if (i > 33 || i < 9) curChild.className = 'ledger-space';

      else curChild.className = 'space';
    }

    curChild.id = 'loc-' + i;
    curChild.idNum = i;
    curChild.noteVal = notes[i % 7];

    clef.appendChild(curChild);
  }

}

function setupBtns() {    

  const btns = document.getElementById('buttons');

  for(let i = 0; i < notesAG.length; i++) {

    const newBtn = document.createElement('button');
    newBtn.className = 'btn';
    newBtn.textContent = notesAG[i];
    newBtn.noteVal = notesAG[i];
    newBtn.addEventListener('click', evaluateChoice);

    btns.appendChild(newBtn);


  }
}

function pickLocation() {
  
  let locId;

  do {
    locId = getRandom(42);
  }
  while (locId === game.locId);

  game.locId = locId;
  const loc = document.getElementById('loc-' + locId);

  // if(loc.className === 'ledger-line') loc.style.backgroundColor = 'black';      //make ledger line visible

  if (loc.className === 'ledger-line' || loc.className === 'ledger-space') showLedgerLines(loc);

  const note = document.createElement('img');                                   //make note image visible
  game.curNote = note;
  note.src = 'Images/quarter-note1.png';
  note.id = 'note';
  loc.appendChild(note);

  if(loc.className === 'line' || loc.className === 'ledger-line') note.style.bottom = '-16.5px';
  
  else note.style.bottom = '-11.5px';

  return loc;

}

function evaluateChoice() {

  const choice = this.noteVal;
  const correctAns = game.noteLoc.noteVal;
  const winMessage = document.getElementById('message');
  let winSound;

  winMessage.style.display = 'grid';

  if(choice === correctAns) {
    winSound = new Audio("audio/correct-answer.wav");
    winSound.play();
    winMessage.style.backgroundColor = 'rgb(42, 135, 42)';
    winMessage.textContent = 'Correct!';
    resetClef();
  }

  else  {
    winSound = new Audio('audio/wrong-answer.wav');
    winSound.play();
    winMessage.style.backgroundColor = 'rgb(198, 51, 51)';
    winMessage.textContent = 'Try Again!';
  }

}

function resetClef() {

  game.noteLoc.removeChild(game.curNote);

  if(game.noteLoc.className === 'ledger-line') game.noteLoc.style.backgroundColor = 'white';

  if(game.locsToHide) {

    for(let i = 0; i < game.locsToHide.length; i++) {

      game.locsToHide[i].style.backgroundColor = 'white';

    }

  }
  
  game.noteLoc = pickLocation();

}