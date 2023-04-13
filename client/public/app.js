//const socket = io("ws://localhost:3000");
const socket = io('http://server_container:3000');


const board = document.getElementById('game-board');
const textWin = document.getElementById('textWin');
const textPlayerTurn = document.getElementById('textPlayerTurn');
const resetButton = document.getElementById('reset-button');
const winnersList = document.getElementById('winners');

const rows = 6;
const columns = 7;
let gameFinish = false;
let currentPlayerColor = 'red'; // 'red' or 'blue'
let myTurn = false; // Add a variable to control the player's turn
let roomName;

// Receive messages from the server
socket.on('message', (event) => {
    console.log(event);
    const message = JSON.parse(event);
    
    if (message.type === 'gameState') {
      updateBoard(message.gameState);
    } else if (message.type === 'newMove') {
      if (message.origin !== socket.id) { // Check if the move originated from the current player
        dropPiece(message.column, message.playerColor, true);
      }
    }
});

socket.on('joinRoom', (data) => {
    roomName = data.room;
    currentPlayerColor = data.color;
    myTurn = data.color === 'red'; // Set myTurn to true if the player is 'red'
    console.log(`Joined room ${roomName} as ${currentPlayerColor}`);

    if (myTurn)  textPlayerTurn.innerHTML = "My turn!";
    else textPlayerTurn.innerHTML = "Opponent turn!";

    hideButton();
});
socket.emit('joinRoom');

socket.on('yourTurn', () => {
    myTurn = true;
    textPlayerTurn.innerHTML = "My turn!";
});

socket.on('history', (data) => {
  const listItem = document.createElement('li');
  listItem.innerHTML = `Winner: <span class="winner-color">${data}</span>`;
  listItem.querySelector('.winner-color').style.color = data;
  winnersList.appendChild(listItem);
})


socket.on('reset', () => {
    hideButton();
    resetGame();
});





// Create the game board
for (let i = 0; i < rows; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < columns; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = i;
        cell.dataset.column = j;
        row.appendChild(cell);
    }
    board.appendChild(row);
}

// Listen for clicks on the game board
board.addEventListener('click', (event) => {
    const cell = event.target;
    if (!cell.classList.contains('cell') || !myTurn) return; // Prevent action if it's not the player's turn

    const column = parseInt(cell.dataset.column);
    // Drop a piece in the clicked column with the current player's color
    dropPiece(column, currentPlayerColor);
});

resetButton.addEventListener('click', () => {
    hideButton();// hide reset button for the current player
    resetGame(); // Reset the game for the current player
    socket.emit('reset'); // Notify the server to reset the game for all other players
});

// Modify the dropPiece function to send moves to the server
function dropPiece(column, playerColor, isRemoteMove = false) {
    if (!gameFinish){
        for (let i = rows - 1; i >= 0; i--) {
            const cell = board.querySelector(`.cell[data-row="${i}"][data-column="${column}"]`);
            if (!cell.classList.contains('filled')) {
                cell.classList.add('filled', playerColor);

                // Send the move to the server only if it's a local move and the WebSocket is open
                if (!isRemoteMove) {
                    // Modify the move event data to include the room name and the player's socket ID
                    socket.emit('move', JSON.stringify({ type: 'move', column, playerColor, room: roomName, origin: socket.id }));
            
                    // Set myTurn to false
                    myTurn = false;
                }
                break;
            }
        }
        textPlayerTurn.innerHTML = "Opponent turn!";

        const boardArray = getBoardArray();
        if (checkWin(boardArray, playerColor)) {
            textWin.innerHTML = `${playerColor} player wins!`;
            gameFinish = true;
            showButton();
            if (!isRemoteMove) socket.emit('win', playerColor);
        }
    }
}

function updateBoard(gameState) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const cell = board.querySelector(`.cell[data-row="${i}"][data-column="${j}"]`);
            if (gameState[i][j]) {
                cell.classList.add('filled');
                if (gameState[i][j] === 'red') {
                    cell.classList.add('red');
                } else {
                    cell.classList.add('blue');
                }
            } else {
                cell.classList.remove('filled', 'red', 'blue');
            }
        }
    }
}

function checkWin(board, playerColor) {
    const checkDirection = (rowDelta, colDelta) => {
      let count = 0;
  
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          if (board[row][col] === playerColor) {
            let newRow = row;
            let newCol = col;
            count = 1;
  
            while (true) {
              newRow += rowDelta;
              newCol += colDelta;
  
              if (
                newRow < 0 ||
                newRow >= rows ||
                newCol < 0 ||
                newCol >= columns ||
                board[newRow][newCol] !== playerColor
              ) {
                break;
              }
  
              count++;
              if (count >= 4) {
                return true;
              }
            }
          }
        }
      }
  
      return false;
    };
  
    const horizontalWin = checkDirection(0, 1);
    const verticalWin = checkDirection(1, 0);
    const diagonalRightWin = checkDirection(1, 1);
    const diagonalLeftWin = checkDirection(1, -1);
  
    return horizontalWin || verticalWin || diagonalRightWin || diagonalLeftWin;
  }
  
  function getBoardArray() {
    const boardArray = [];
  
    for (let row = 0; row < rows; row++) {
      const rowArray = [];
      for (let col = 0; col < columns; col++) {
        const cell = board.querySelector(`.cell[data-row="${row}"][data-column="${col}"]`);
        if (cell.classList.contains('red')) {
          rowArray.push('red');
        } else if (cell.classList.contains('blue')) {
          rowArray.push('blue');
        } else {
          rowArray.push(null);
        }
      }
      boardArray.push(rowArray);
    }
  
    return boardArray;
  }

  function resetGame() {
    gameFinish = false;
    textWin.innerHTML = "";

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const cell = board.querySelector(`.cell[data-row="${i}"][data-column="${j}"]`);
        cell.classList.remove('filled', 'red', 'blue');
      }
    }
  }

  function hideButton() {
    resetButton.style.display = 'none';
  }
  
  function showButton() {
    resetButton.style.display = 'block';
  }
  
  
  
  
  
  
  