/* grid creation is in function to more easily control parameters. Parameters:
res = resolution = number of columns. Named as such because
higher column number = smaller "pixels" = higher "resolution".
ratio = aspect ratio; 1:1 input as [1, 1] */

function createGrid(res, ratio) {
  const [w, h] = ratio;
  let grid = document.getElementById('grid-container');
  grid.style.gridTemplateColumns = `repeat(${res}, auto)`;

  for (let i = 0; i < res * 6; i++) {
    let gridElement = document.createElement('div');
    gridElement.classList.add('grid-element');
    grid.appendChild(gridElement);
  }
}

createGrid(10, [1, 1]);