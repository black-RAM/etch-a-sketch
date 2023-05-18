const body = document.getElementsByTagName('body')[0];
// viewport dimensions
let [vw, vh] = [window.innerWidth, window.innerHeight];
let [vwu, vhu] = [vw / 100, vh / 100]; // viewport width|height unit

// grid creation function
function createGrid(res, ratio) {
  const [w, h] = ratio; // divide ratio into width and height variables

  let grid = document.getElementById('grid-container'); // retrieve grid container

  // Clear existing grid content (which may be there if this function is called by handleResize())
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }

  // initialized in function scope to avoid reference errors and verbosity
  let gridWidth = 0;
  let gridHeight = 0;
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
}

let chosenRes = 20; // default

// initial grid creation
createGrid(chosenRes, [5, 3]);

// Adjustment for user choice with a delay
let sliderTimeout; // Variable to store the timeout ID for input slider
document.getElementById('res').addEventListener('input', function () {
  clearTimeout(sliderTimeout); // Clear any existing timeout
  
  // Timeout to change only once, and not with every increment of the slider.
  // Changing at every increment caused the height to be shaky
  sliderTimeout = setTimeout(() => {
    chosenRes = this.value;
    createGrid(chosenRes, [4, 3]);
  }, 100);
});

// function to handle resize event
function handleResize() {
  // update viewport variables
  [vw, vh] = [window.innerWidth, window.innerHeight];
  [vwu, vhu] = [vw / 100, vh / 100];
  createGrid(chosenRes, [5, 3]); // re-call createGrid. ADJUST PARAMETERS TOO
}

// add resize event listener
window.addEventListener('resize', handleResize);

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

// get chosen pen color from user input
let chosenColor = 'lightslategray'; // default color

document.getElementById('color').addEventListener('input', function() {
  chosenColor = this.value; // Update chosenColor when input changes
});

let useRandom = false; // will be toggled changed by button. False by default.

function getRandomColor() {
  const [r, g, b] = Array.from({ length: 3 }, () => Math.floor(Math.random() * 256));
  return `rgb(${r}, ${g}, ${b})`;
}

function handlePointerDown(event) {
  if (event.target.classList.contains('grid-element')) {
    isPointerDown = true;
    event.target.style.backgroundColor = useRandom ? getRandomColor() : chosenColor; 
  }
}

function handlePointerMove(event) {
  if (isPointerDown && event.target.classList.contains('grid-element')) {
    event.target.style.backgroundColor = useRandom ? getRandomColor() : chosenColor; 
  }
}

function handlePointerUp() {
  isPointerDown = false;
};