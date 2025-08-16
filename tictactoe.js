document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('resetBtn');
    const playerModeBtn = document.getElementById('playerMode');
    const computerModeBtn = document.getElementById('computerMode');
    
    // Game variables
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let vsComputer = false;
    
    // Winning conditions
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    // Initialize the board
    function initializeBoard() {
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }
    
    // Handle cell click
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // If cell already filled or game not active, ignore
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        // Update game state and UI
        updateGame(clickedCell, clickedCellIndex);
        
        // If playing against computer and game is still active
        if (vsComputer && gameActive && currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    }
    
    // Update game state
    function updateGame(cell, index) {
        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
        
        // Check for win or draw
        checkResult();
    }
    
    // Check for win or draw
    function checkResult() {
        let roundWon = false;
        
        // Check all winning conditions
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
                continue;
            }
            
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                highlightWinningCells([a, b, c]);
                break;
            }
        }
        
        // If won
        if (roundWon) {
            status.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            return;
        }
        
        // If draw
        if (!gameState.includes('')) {
            status.textContent = "Game ended in a draw!";
            gameActive = false;
            return;
        }
        
        // Continue game
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    }
    
    // Highlight winning cells
    function highlightWinningCells(cells) {
        cells.forEach(index => {
            document.querySelector(`.cell[data-index="${index}"]`).classList.add('winning-cell');
        });
    }
    
    // Computer move
    function computerMove() {
        if (!gameActive) return;
        
        // Simple AI - first try to win, then block, then random
        let move = findWinningMove('O') || findWinningMove('X') || randomMove();
        
        if (move !== null) {
            const cell = document.querySelector(`.cell[data-index="${move}"]`);
            updateGame(cell, move);
        }
    }
    
    // Find winning or blocking move
    function findWinningMove(player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const cells = [gameState[a], gameState[b], gameState[c]];
            
            // Count player marks and empty cells
            const playerCount = cells.filter(cell => cell === player).length;
            const emptyCount = cells.filter(cell => cell === '').length;
            
            if (playerCount === 2 && emptyCount === 1) {
                return [a, b, c][cells.indexOf('')];
            }
        }
        return null;
    }
    
    // Random move
    function randomMove() {
        const emptyCells = gameState.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);
        
        if (emptyCells.length > 0) {
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
        return null;
    }
    
    // Reset game
    function resetGame() {
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        status.textContent = `Player ${currentPlayer}'s turn`;
        initializeBoard();
    }
    
    // Set game mode
    function setGameMode(againstComputer) {
        vsComputer = againstComputer;
        playerModeBtn.classList.toggle('active', !againstComputer);
        computerModeBtn.classList.toggle('active', againstComputer);
        resetGame();
    }
    
    // Event listeners
    resetBtn.addEventListener('click', resetGame);
    playerModeBtn.addEventListener('click', () => setGameMode(false));
    computerModeBtn.addEventListener('click', () => setGameMode(true));
    
    // Initialize game
    initializeBoard();
});
