let rows, cols, intervalId;
let isRunning = false;

function initGame() {
  rows = parseInt(document.getElementById('rows').value);
  cols = parseInt(document.getElementById('cols').value);
  isRunning = false;
  clearInterval(intervalId);
  createBoard();
  renderBoard();
}

function createBoard() {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';
  gameBoard.style.gridTemplateColumns = `repeat(${cols}, 20px)`;

  for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.id = `cell_${Math.floor(i / cols)}_${i % cols}`;
    cell.addEventListener('click', toggleCell);
    gameBoard.appendChild(cell);
  }
}

function renderBoard() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.getElementById(`cell_${i}_${j}`);
      cell.style.backgroundColor = Math.random() > 0.5 ? '#000' : '#ddd';
    }
  }
}

function toggleCell() {
  if (!isRunning) {
    this.style.backgroundColor = this.style.backgroundColor === 'rgb(0, 0, 0)' ? '#ddd' : '#000';
  }
}

function startGame() {
  isRunning = true;
  intervalId = setInterval(generateNextGeneration, 100);
}

function stopGame() {
  isRunning = false;
  clearInterval(intervalId);
}

function generateNextGeneration() {
  const nextGeneration = [];
  for (let i = 0; i < rows; i++) {
    nextGeneration[i] = [];
    for (let j = 0; j < cols; j++) {
      const aliveNeighbors = countAliveNeighbors(i, j);
      nextGeneration[i][j] = determineCellFate(i, j, aliveNeighbors);
    }
  }
  updateBoard(nextGeneration);
}

function countAliveNeighbors(x, y) {
  const neighbors = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  let count = 0;
  for (const [dx, dy] of neighbors) {
    const newX = (x + dx + rows) % rows;
    const newY = (y + dy + cols) % cols;
    const neighborCell = document.getElementById(`cell_${newX}_${newY}`);
    if (neighborCell.style.backgroundColor === 'rgb(0, 0, 0)') {
      count++;
    }
  }

  return count;
}

function determineCellFate(x, y, aliveNeighbors) {
  const currentCell = document.getElementById(`cell_${x}_${y}`);
  const isAlive = currentCell.style.backgroundColor === 'rgb(0, 0, 0)';

  if (isAlive && (aliveNeighbors < 2 || aliveNeighbors > 3)) {
    return '#ddd';
  } else if (!isAlive && aliveNeighbors === 3) {
    return '#000';
  } else {
    return currentCell.style.backgroundColor;
  }
}

function updateBoard(nextGeneration) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.getElementById(`cell_${i}_${j}`);
      cell.style.backgroundColor = nextGeneration[i][j];
    }
  }
}