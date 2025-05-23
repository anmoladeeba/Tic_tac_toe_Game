const boardEl = document.getElementById('board');
const messageEl = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');
const startBtn = document.getElementById('startBtn');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const gameArea = document.getElementById('gameArea');

let board, currentPlayer, players, gameActive, winnerLine;

const WIN_LINES = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // cols
  [0,4,8], [2,4,6]           // diagonals
];

function startGame() {
  const p1 = player1Input.value.trim() || "Player 1";
  const p2 = player2Input.value.trim() || "Player 2";
  players = [{name: p1, symbol: 'x'}, {name: p2, symbol: 'o'}];
  currentPlayer = 0;
  board = Array(9).fill('');
  gameActive = true;
  winnerLine = null;
  renderBoard();
  messageEl.textContent = `${players[currentPlayer].name}'s turn (${players[currentPlayer].symbol.toUpperCase()})`;
  gameArea.classList.remove('hidden');
  resetBtn.classList.add('hidden');
}

function renderBoard() {
  boardEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell' + (board[i] ? ' ' + board[i] : '');
    if (winnerLine && winnerLine.includes(i)) cell.classList.add('winner');
    cell.dataset.index = i;
    cell.textContent = board[i] ? (board[i] === 'x' ? '✕' : '◯') : '';
    cell.onclick = () => handleCellClick(i);
    boardEl.appendChild(cell);
  }
}

function handleCellClick(idx) {
  if (!gameActive || board[idx]) return;
  board[idx] = players[currentPlayer].symbol;
  renderBoard();
  const result = checkWinner();
  if (result) {
    winnerLine = result.line;
    renderBoard();
    messageEl.innerHTML = `Congratulations, <span style="color:#ff4ecb">${players[currentPlayer].name}</span> wins! 🎉 Well played! 👏`;
    gameActive = false;
    resetBtn.classList.remove('hidden');
  } else if (board.every(cell => cell)) {
    messageEl.textContent = "It's a draw! 🤝";
    gameActive = false;
    resetBtn.classList.remove('hidden');
  } else {
    currentPlayer = 1 - currentPlayer;
    messageEl.textContent = `${players[currentPlayer].name}'s turn (${players[currentPlayer].symbol.toUpperCase()})`;
  }
}

function checkWinner() {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {winner: board[a], line};
    }
  }
  return null;
}

startBtn.onclick = () => startGame();
resetBtn.onclick = () => startGame();
