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
    grid.style.width = `${gridWidth}px`;
    
    gridHeight = 90 * vwu / w * h;
    grid.style.minHeight = `${gridHeight}px`;
  } else {
    // else manipulate width (more convenient as user can see the whole board)
    gridHeight = 75 * vhu;
    grid.style.minHeight = `${gridHeight}px`;
    
    gridWidth = 75 * vhu / h * w;
    grid.style.width = `${gridWidth}px`;
  }
  
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
// get grid "resolution" value
let chosenRes = 20; // default
// initial grid creation
createGrid(chosenRes, [4, 3]);
// adjustment for user choice
document.getElementById('res').addEventListener('input', function() {
  chosenRes = this.value;
  createGrid(chosenRes, [4, 3]);
})

// function to handle resize event
function handleResize() {
  // update viewport variables
  [vw, vh] = [window.innerWidth, window.innerHeight];
  [vwu, vhu] = [vw / 100, vh / 100];
  createGrid(chosenRes, [4, 3]); // re-call createGrid. ADJUST PARAMETERS TOO
}
// add resize event listener
window.addEventListener('resize', handleResize);

// drawing effect
{ // block scope to clean up global
  const gridElements = [...document.querySelectorAll('.grid-element')];
  let isPointerDown = false;

  gridElements.forEach(element => {
    element.addEventListener('pointerdown', handlePointerDown);
    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerup', handlePointerUp);
    // for touch-screens
    element.addEventListener('touchstart', handlePointerDown);
    element.addEventListener('touchmove', handlePointerMove);
    element.addEventListener('touchend', handlePointerUp);
  });
  // get chosen pen color from user input
  let chosenColor = 'lightslategray'; // default color

  document.getElementById('color').addEventListener('input', function() {
    chosenColor = this.value; // Update chosenColor when input changes
  });
  
  let useRandom = false; // will be toggled changed by button. False by default.
  
  function getRandomColor() {
    const [r, g, b] = [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    ];
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  function handlePointerDown() {
    isPointerDown = true;
    this.style.backgroundColor = useRandom ? getRandomColor() : chosenColor; 
  }
  
  function handlePointerMove() {
    if (isPointerDown) {
      this.style.backgroundColor = useRandom ? getRandomColor() : chosenColor; 
    }
  }
  
  function handlePointerUp() {
    isPointerDown = false;
  }  
}