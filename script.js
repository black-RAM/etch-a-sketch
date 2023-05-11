// viewport dimensions
let [vw, vh] = [window.innerWidth, window.innerHeight];
let [vwu, vhu] = [vw / 100, vh/100]; // viewport width|height unit
// adjust viewport dimension's variables on resize
window.addEventListener('resize', () => {
  [vw, vh] = [window.innerWidth, window.innerHeight];
  [vwu, vhu] = [vw / 100, vh/100];
  location.reload();
})

/* grid creation is in function to more easily control parameters. Parameters:
res = resolution =  number of columns. Named as such because 
higher column number = smaller "pixels" = higher "resolution".
ratio = aspect ratio; 1:1 input as [1, 1] */

function createGrid(res, ratio) {
  const [w, h] = ratio; // divide ratio into width and height variables

  let grid = document.getElementById('grid-container'); 

  // for portrait orientation (like on tablets), 
  let isPortrait = vw < vh;
  if(isPortrait) {
    // manipulate height to achieve desired aspect ratio (rather than going wide and overflowing)
    grid.style.width = `${90 * vwu}px`;
    grid.style.height = `${90*vwu / w * h}px`
  } else {
    // else manipulate width (more convenient as user can see whole board)
    grid.style.height = `${90*vhu}px`;
    grid.style.width = `${90*vhu / h * w}px`;
  }
  
  grid.style.gridTemplateColumns = `repeat(${res}, auto)`;

  for(let i = 0; i < res*6; i++) {
    let gridElement = document.createElement('div');
    gridElement.classList.add('grid-element');
    grid.appendChild(gridElement)
  }
}

createGrid(10, [1, 1]);