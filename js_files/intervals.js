/* THIS IS THE MAIN FILE FOR THE INTERVAL TEST */

import * as util from "./util.js";

const intervals = [2, 3, 4, 5, 6, 7, 8, 9];

// The number of times we go through intervals[]
let numReps = 3;
let numTerms = numReps * intervals.length;
let repNum = 0;

let numErrors = 0;
let firstError = true;

// The index we are on in intervals[]
let curInterval = 0;

let note1 = null;
let note2 = null;

let volume = true;

function resetReps (numSelect) {
  console.log(repNum);  

  const defaultOption = numSelect.options[2];
  defaultOption.selected = true;
  numReps = Number(defaultOption.textContent);
  
  note1.remove();
  note2.remove();

  restartGame();
}

function updateRepetitions(e) {

  // Close context menu after user clicks option
  const context = document.querySelector('.settings-context');
  const cover = document.querySelector('.cover');
  context.classList.toggle('hidden');
  cover.style.display = 'none';
  
  const numSelect = e.target;
  const selectedOption = numSelect.options[numSelect.selectedIndex];
  numReps = Number(selectedOption.textContent);

  numTerms = numReps * intervals.length;
  const numDiv = document.querySelector('.hud-center');
  numDiv.textContent = (curInterval + 1) + (repNum * intervals.length) + '/' + numTerms;

  note1.remove();
  note2.remove();

  restartGame();
}

function setupDropDowns() {

  const numSelect = document.querySelector('.num-select');

  for (let i = 0; i < 10; i++) {

    const option = document.createElement('option');
    option.textContent = i + 1;
    numSelect.appendChild(option);
  }

  let foundOption;

  for (let option of numSelect.options) {
    if (option.textContent === String(numReps)) {
      foundOption = option;
      break;
    }
  }

  foundOption.selected = true;

  numSelect.addEventListener('change', updateRepetitions);

  // Button to reset repetitions
  const resetBtn = document.querySelector('.reset-option-btn');
  resetBtn.addEventListener('click', () => resetReps(numSelect));                                 
}

function setupVolume() {

  const volumeSec = document.querySelector('.volume-section');

  volumeSec.addEventListener('click', () => {
    
    const volumeIcon = volumeSec.querySelector('.material-symbols-outlined');
    if (volumeIcon.textContent === 'toggle_on') {
      volumeIcon.textContent = 'toggle_off';
      volume = false;
    }

    else {
      volumeIcon.textContent = 'toggle_on';
      volume = true;
    }
  });
}

function handleGameEnd() {

  const doneModal = document.querySelector('.done-modal');
  doneModal.showModal();

  const points = numTerms - numErrors;
  const scoreSpan = document.querySelector('.done-modal span');
  scoreSpan.textContent = `${points + '/' + numTerms}`;

  util.drawScoreCircle(points, numTerms);
}

function handleClick(e) {

  const btn = e.target;
  const btnNum = Number(btn.textContent[0]);

  if (btnNum === intervals[curInterval]) {
    // Case 1: User clicked correct button

    if (volume) util.playCorrectSound();

    curInterval++;
    firstError++;

    btn.classList.add('btn-correct');
    btn.addEventListener('animationend', () => btn.classList.remove('btn-correct'));

    note1.remove();
    note2.remove();
    
    if (curInterval === intervals.length) {

      numReps--;
      repNum++;
      curInterval = 0;
      util.shuffleArray(intervals);

      if (numReps === 0) {
        handleGameEnd();
        return;
      }
    }

    displayInterval();

  }

  else {
    //Case 2: user clicked wrong button

    if (volume) util.playWrongSound();

    if (firstError) {
      numErrors++;
      const errorDiv = document.querySelector('.hud-right span');
      errorDiv.textContent = numErrors;
      firstError = false;
    }

    btn.classList.add('btn-wrong');
    btn.addEventListener('animationend', () => btn.classList.remove('btn-wrong'));
  }
}

function setupBtns() {

  const btns = document.querySelectorAll('.btn');

  btns.forEach(btn => {

    btn.addEventListener('click', handleClick);
  });
  
  
}

function createClef() {
  
  // Creates our staff which just contains treble clef
  const staff = document.querySelector('.staff');   
  
  for (let i = 0; i < 25; i++) {

    const curChild = document.createElement('div');

    //Lines on even indices
    if(i % 2 === 0) {                         

      // Ledger lines below and above treble clef
      if(i < 7 || i > 17) {      

        curChild.className = 'ledger-line';
      }

      else curChild.className = 'line';
    }

    //Spaces on odd indices
    else {

      /* ledger spaces start at 2nd space above treble clef and 2nd space below it */
      
      if (i < 6 || i > 18) curChild.className = 'ledger-space';         

      else curChild.className = 'space';                                
    }   

    curChild.classList.add('loc-' + i);                       
    curChild.idNum = i;                             //A seperate property idNum is created here

    staff.appendChild(curChild);     
  }
  
}

function handleLedgers(hiNote, loNote) {
  // Displays appropriate ledger lines

  // Get divs where notes are located
  const hiPos = hiNote.closest('div');
  const loPos = loNote.closest('div');

  // Get class (loc-0, loc-1, loc-2...) as a string
  const hiClass = hiPos.classList[1];
  const loClass = loPos.classList[1];
  
  // Get the number out of the class in the format loc-0, loc-1, loc-2...
  const hiNum = Number(hiClass.split('-')[1]);
  const loNum = Number(loClass.split('-')[1]);


  if (hiNum < 7) {

    let curPos = hiPos;

    curPos.classList.add('visible');

    while (curPos.classList.contains('ledger-space') || curPos.classList.contains('ledger-line')) {
      curPos = curPos.nextElementSibling;
      curPos.classList.add('visible');
    }
    
  }

  else if (loNum > 17) {

    let curPos = loPos;

    curPos.classList.add('visible');

    while (curPos.classList.contains('ledger-space') || curPos.classList.contains('ledger-line')) {
      curPos = curPos.previousElementSibling;
      curPos.classList.add('visible');
    }

  }

}

function removeLedgers() {

  const ledgerLines = document.querySelectorAll('.ledger-line');

  ledgerLines.forEach(line => {
    line.classList.remove('visible');
  });

}

function displayInterval() {

  // Hide any visible ledger lines;
  removeLedgers();
  
  const position1 = util.getRandom(0, 24);
  let position2;
  const numDiv = document.querySelector('.hud-center');

  note1 = document.createElement('img');
  note2 = document.createElement('img');


  if (position1 < 8) {
    // Then the other note should be below this one, note1 is the higher note

    // Handle 2nd
    if (intervals[curInterval] === 2) {
      note2.src = 'Images/quarter_note_flipped.png';
      note2.classList.add('flipped-note');
      note1.src = 'Images/quarter_note_for_2nd.png';
    }
    
    else {
      note2.src = 'Images/quarter_note_long_stem.png';
      note1.src = 'Images/quarter_note_for_9th.png';
    }
    
    position2 = position1 + intervals[curInterval] - 1;
    note1.classList.add('note', 'higher-note');
    note2.classList.add('note', 'lower-note');

    const div1 = document.querySelector('.loc-' + position1);
    div1.appendChild(note1);
    
    const div2 = document.querySelector('.loc-' + position2);
    div2.appendChild(note2);

    handleLedgers(note1, note2);
  }
  
  else {
    // note 2 is the higher-note
    
    if (intervals[curInterval] === 2) {
      note1.src = 'Images/quarter_note_flipped.png';
      note1.classList.add('flipped-note');

      note2.src = 'Images/quarter_note_for_2nd.png';
    }
    
    else {
      note1.src = 'Images/quarter_note_long_stem.png';
      note2.src = 'Images/quarter_note_for_9th.png';
    }

    position2 = position1 - intervals[curInterval] + 1;
    note1.classList.add('note', 'lower-note');
    note2.classList.add('note', 'higher-note');

    const div1 = document.querySelector('.loc-' + position1);
    div1.appendChild(note1);
    
    const div2 = document.querySelector('.loc-' + position2);
    div2.appendChild(note2);

    handleLedgers(note2, note1);
  }
  

  // This logic is overly verbose
  numDiv.textContent = (curInterval + 1) + (repNum * intervals.length) + '/' + numTerms;
}

function restartGame() {

  const doneModal = document.querySelector('.done-modal');
  doneModal.close();

  repNum = 0;
  numErrors = 0;
  firstError = true;
  curInterval = 0;
  note1 = null;
  note2 = null;

  const errorDiv = document.querySelector('.hud-right span');
  errorDiv.textContent = numErrors;

  util.shuffleArray(intervals);
  displayInterval();
}

function setupRestartBtn() {

  const restartBtn = document.querySelector('.restart-game-btn');

  restartBtn.addEventListener('click', restartGame);
}

function main() {

  setupDropDowns();
  setupVolume();

  util.setupContextSettings();
  util.setupSidebar();
  
  setupBtns();
  createClef();

  util.shuffleArray(intervals);
  displayInterval();

  setupRestartBtn();
}

main();