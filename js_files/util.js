//! FUNCTIONS THAT ARE USED BY MULTIPLE PAGES

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

export {playCorrectSound, playWrongSound, shuffleArray, drawScoreCircle}