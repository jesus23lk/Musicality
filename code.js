const notes = ['F', 'E', 'D', 'C', 'B', 'A', 'G'];
const notesAG = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const game = {
  noteLoc: '',
  locId: ''
}


window.onload = function() {

  giveIds();
  setupBtns();
  game.noteLoc = pickLocation();

}

function getRandom(num) {

  return Math.floor(Math.random() * num);
}

function giveIds() {

  const clef = document.getElementById('staff');
  const locs = clef.children;

  for(let i = 0; i < locs.length; i++) {

    curChild = locs[i];
    curChild.id = 'loc-' + i;
    curChild.noteVal = notes[i % 7];
  }
}

function setupBtns() {

  const btns = document.getElementById('buttons').children;

  for(let i = 0; i < btns.length; i++) {

    btns[i].noteVal = notesAG[i];
    btns[i].addEventListener('click', evaluateChoice);
  }
}

function pickLocation() {
  
  let locId;

  do {
    locId = getRandom(20);
    console.log(locId);
  }
  while (locId === game.locId);

  console.log(locId);
  game.locId = locId;
  const loc = document.getElementById('loc-' + locId);

  if(locId === 10) loc.style.backgroundColor = 'black';

  const note = document.createElement('img');
  note.src = 'Images/quarter-note1.png';
  note.id = 'note';
  loc.appendChild(note);

  if(loc.className === 'line') note.style.bottom = '-31px';
  
  else note.style.bottom = '-22px';

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

  if(game.locId === 10) {
    game.noteLoc.removeChild(game.noteLoc.children[2]);
    game.noteLoc.style.backgroundColor = 'white';
  }

  else {
    game.noteLoc.removeChild(game.noteLoc.firstChild);
  }
  
  game.noteLoc = pickLocation();

}