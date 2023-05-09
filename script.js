let grid = document.getElementById('container');

// create one row
for(let i = 0; i < 16*6; i++) {
  let gridElement = document.createElement('div');
  gridElement.classList.add('grid-element');
  grid.appendChild(gridElement)
}