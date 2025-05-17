//! FUNCTIONS THAT ARE USED BY MULTIPLE PAGES

/* Used to populate lines and spaces noteval property */
const notes = ['C', 'B', 'A', 'G', 'F', 'E', 'D'];

function playCorrectSound() {
  const correctSound = new Audio("./audio/correct_answer.mp3");
  correctSound.play();
}

function playWrongSound() {
  const wrongSound = new Audio("./audio/wrong_answer.mp3");
  wrongSound.play();
}

// random value in the range min-max (inclusive)
const getRandom = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));


function shuffleArray(array, arraySize = array.length) {
  // Takes in an array uses the fisher yates algo, to shuffle it's elements

  // We pass in an arraySize rather than using array.length, because sometimes we shuffle only a range of elements in the array
  for (let i = arraySize - 1; i > 0; i--) {

    const randIndx = getRandom(0, i);

    // Swap values using destructuring
    [array[i], array[randIndx]] = [array[randIndx], array[i]];
  }
}

function getColor(percent) {
  //! Learn how this code works, later, don't just leave it here

  const hue = (120 * percent); // Map 0-100% to 0-120° (red to green)

  // if hue is more green, then we want less lightness, because super bright greens are ugly
  const lightness = hue < 60 ? '50%' : '35%';

  return `hsl(${hue}, 100%, ${lightness})`;
}

function drawScoreCircle(points, length) {

  const canvas = document.querySelector('.score-circle');
  const ctx = canvas.getContext('2d');

  //Draw circle background in light gray
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  let radius = 60;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
  ctx.lineTo(centerX, centerY);
  ctx.closePath();
  ctx.fillStyle = 'rgb(215, 215, 215)';
  ctx.fill();
  
  // Percentage of the circle to be filled here 0-1
  let percent = points / length;
  let percent100 = Math.floor(percent * 100);
  const startAngle = -Math.PI/2;
  const endAngle = startAngle + Math.PI * 2 * percent;

  // Draw colored progress circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
  ctx.lineTo(centerX, centerY);
  ctx.closePath();
  ctx.fillStyle = `${getColor(percent)}`;
  ctx.fill();

  // Draw white center circle
  radius /= 1.3;
  ctx.beginPath();
  ctx.arc(centerX,centerY, radius, 0, Math.PI * 2, false);
  ctx.lineTo(centerX, centerY);
  ctx.closePath();
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.fill();

  //Add text to center of circle
  ctx.fillStyle = 'black';
  ctx.font = '800 20px Arial';
  ctx.textAlign = 'center'; 
  ctx.textBaseline = 'middle'; 
  ctx.fillText(`${percent100}%`, centerX, centerY);
}

function createGrandStaff() {

  // Creates all lines and spaces in grand staff as divs

  const grdStaff = document.querySelector('.staff');                  //grand staff contains all lines and spaces
  
  for(let i = 0; i < 52; i++) {

    const curChild = document.createElement('div');

    //Lines on even indices
    if(i % 2 === 0) {                         

      if(i < 17 || i > 39 || i === 28) {      //Ledger lines above treble clef, below bass clef, and middle C

        curChild.className = 'ledger-line';
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

    curChild.classList.add('loc-' + i);                       
    curChild.idNum = i;                             //A seperate property idNum is created here
    curChild.noteVal = notes[i % 7];                //Assign a note value (A-G) to each location

    grdStaff.appendChild(curChild);                    
  }

}

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

function setupVolume(volumeOn) {

  // The global volume variable you are using must be set equal to what this function returns

  const volumeIcon = document.querySelector('.volume-icon');
  const volumeSection = volumeIcon.closest('.context-section');
  
  volumeSection.addEventListener('click', () => {
    
    if(volumeOn) {
      volumeIcon.textContent = 'toggle_off';
      return false;
    }
    
    else {
      volumeIcon.textContent = 'toggle_on';
      return true;
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

export {playCorrectSound, playWrongSound, shuffleArray, drawScoreCircle, createGrandStaff, setupContextSettings, setupVolume, setupSidebar}