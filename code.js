const notes = ['F', 'E', 'D', 'C', 'B', 'A', 'G'];
const notesAG = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
let curLoc = '';

window.onload = function() {

  giveIds();
  setupBtns();
  curLoc = pickLocation();

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
  
  const locId = getRandom(20);     //get random number 0-20
  const loc = document.getElementById('loc-' + locId);

  const note = document.createElement('img');
  note.src = 'Images/quarter-note.png';
  note.id = 'note';
  loc.appendChild(note);

  if(loc.className === 'line') note.style.bottom = '-15px';
  
  else note.style.bottom = '-4.25px';

  return loc;

}

function evaluateChoice() {

  const choice = this.noteVal;
  const correctAns = curLoc.noteVal;
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
  curLoc.removeChild(curLoc.firstChild);
  curLoc = pickLocation();
}