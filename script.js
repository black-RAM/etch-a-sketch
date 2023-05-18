const body = document.getElementsByTagName('body')[0];

// viewport dimensions
let [vw, vh] = [window.innerWidth, window.innerHeight];
let [vwu, vhu] = [vw / 100, vh / 100]; // viewport width|height unit

// grid width and height values
let gridWidth = 0;
let gridHeight = 0;

// grid creation function
function createGrid(res, ratio) {
  const [w, h] = ratio; // divide ratio into width and height variables

  let grid = document.getElementById('grid-container'); // retrieve grid container

  // Clear existing grid content (which may be there if this function is called by handleResize())
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }

  // for portrait orientation (like on tablets),
  let isPortrait = vw < vh;
  if (isPortrait) {
    // manipulate height to achieve desired aspect ratio (rather than going wide and overflowing)
    gridWidth = 90 * vwu;
    gridHeight = gridWidth / w * h;
  } else {
    // else manipulate width (more convenient as user can see the whole board)
    gridHeight = 75 * vhu;    
    gridWidth = gridHeight / h * w;
  }
  grid.style.width = `${gridWidth}px`;
  grid.style.minHeight = `${gridHeight}px`;
  
  const columnWidth = gridWidth / res;
  grid.style.gridTemplateColumns = `repeat(${res}, ${columnWidth}px)`;
  
  // loop to actually create the grid
  let spaceLeft = gridHeight;

  while(spaceLeft > 0) {
    // create rows
    for (let i = 0; i < res; i++) {
      let gridElement = document.createElement('div');
      gridElement.classList.add('grid-element');
      gridElement.style.height = `${columnWidth}px`; // make the elements perfect squares
      grid.appendChild(gridElement);
    }
    spaceLeft-=columnWidth;
  }
  // also set width of control panel, under the grid to same value to line up
  const controls = document.getElementById('controls')
  controls.style.width = `${gridWidth}px`;
}

// defaults
let chosenRes = 20;
let aspectRatio = [4, 3];

// initial grid creation
createGrid(chosenRes, aspectRatio);

// Adjustment for user's resolution choice
let sliderTimeout; // Variable to store the timeout ID for input slider
document.getElementById('res').addEventListener('input', function () {
  clearTimeout(sliderTimeout); // Clear any existing timeout
  
  // Timeout to change only once, and not with every increment of the slider.
  // Changing at every increment caused the height to be shaky
  sliderTimeout = setTimeout(() => {
    chosenRes = this.value;
    createGrid(chosenRes, aspectRatio);
  }, 100);
});

// for user aspect ratio choice
let options = [...document.querySelectorAll('.ratio')];
options.forEach(option => {
  option.addEventListener('click', function () {
    let chosenRatio = this.innerText;
    chosenRatio = chosenRatio.split('');
    chosenRatio = chosenRatio.filter(char => /\d/.test(char));
    aspectRatio = chosenRatio;
    createGrid(chosenRes, chosenRatio)
  })
})

// function to handle resize event
function handleResize() {
  // update viewport variables
  [vw, vh] = [window.innerWidth, window.innerHeight];
  [vwu, vhu] = [vw / 100, vh / 100];
  createGrid(chosenRes, aspectRatio); // re-call createGrid. ADJUST PARAMETERS TOO
}

// add resize event listener
window.addEventListener('resize', handleResize);

// clear grid for erase
document.getElementById('erase-all').addEventListener('click', () => {
  createGrid(chosenRes, aspectRatio);
})

// drawing effect
const gridContainer = document.getElementById('grid-container');
let isPointerDown = false;

gridContainer.addEventListener('pointerdown', handlePointerDown);
gridContainer.addEventListener('pointermove', handlePointerMove);
gridContainer.addEventListener('pointerup', handlePointerUp);
// for touch-screens
gridContainer.addEventListener('touchstart', handlePointerDown);
gridContainer.addEventListener('touchmove', handlePointerMove);
gridContainer.addEventListener('touchend', handlePointerUp);

// for if the user wants randomised colors
let useRandom = false; 
const randomButton = document.getElementById('use-random-button');
randomButton.addEventListener('click', function() {
  useRandom = !useRandom; // Toggle the value of useRandom
  this.style.backgroundColor = useRandom ? 'hsl(208, 90%, 90%)' : 'aliceblue';
});

function getRandomColor() {
  const [r, g, b] = Array.from({ length: 3 }, () => Math.floor(Math.random() * 256));
  return `rgb(${r}, ${g}, ${b})`;
}

// If not get chosen pen color from user input
let chosenColor = 'lightslategray'; // default color
document.getElementById('color').addEventListener('input', function() {
  chosenColor = this.value; // Update chosenColor when input changes
  // deactivate use random
  useRandom = false;
  randomButton.style.backgroundColor = 'aliceblue';
});

// Eraser boolean
let isErasing = false;

function handlePointerDown(event) {
  if (event.target.classList.contains('grid-element')) {
    isPointerDown = true;
    event.target.style.backgroundColor = 
      isErasing ? 'white' : 
      useRandom ? getRandomColor() 
      : chosenColor; 
  }
}

function handlePointerMove(event) {
  if (isPointerDown && event.target.classList.contains('grid-element')) {
    event.target.style.backgroundColor = 
      isErasing ? 'white' : 
      useRandom ? getRandomColor() 
      : chosenColor; 
  }
}

function handlePointerUp() {
  isPointerDown = false;
};

// Eraser
document.getElementById('eraser-button').addEventListener('click', function() {
  isErasing = !isErasing; // Toggle eraser mode
  this.style.backgroundColor = isErasing ? 'hsl(208, 90%, 90%)' : 'aliceblue';
});

// Function to download the drawing
function downloadDrawing() {
  const canvas = document.createElement('canvas');
  canvas.width = gridWidth;
  canvas.height = gridHeight;
  const context = canvas.getContext('2d');

  const elements = [...document.getElementsByClassName('grid-element')];
  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    let color = element.style.backgroundColor;
    color = color? color : 'white'; // if color is truthy, keep it, else make it white
    context.fillStyle = color;
    context.fillRect(rect.left, rect.top, rect.width, rect.height);
  });

  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'drawing.png';
  link.dispatchEvent(new MouseEvent('click'));
}

// Add a click event listener to the download button
document.getElementById('download-button').addEventListener('click', downloadDrawing);