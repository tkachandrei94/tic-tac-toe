import AdManager from '../services/AdManager.js';

export default class GameUI {
    constructor({ onCellClick, onNewGame, onExitGame, onStartGame }) {
        // Elements related to the game board and player info
        this.boardEl = document.getElementById('board');
        this.currentPlayerInfo = document.getElementById('current-player-info');
        this.resultInfo = document.getElementById('result-info');

        // Modals for start and end of the game
        this.startModal = document.getElementById('start-modal');
        this.startModalContent = document.getElementById('start-modal-content');
        this.endModal = document.getElementById('end-modal');
        this.endModalContent = document.getElementById('end-modal-content');

        // Flags to track modal state
        this._startModalActive = false;
        this._endModalActive = false;

        // Callback functions
        this.onCellClick = onCellClick;
        this.onNewGame = onNewGame;
        this.onExitGame = onExitGame;
        this.onStartGame = onStartGame;

        // Initialize AdManager
        this.adManager = new AdManager ('ad-container', 'ad-video');

        // Selected cell coordinates for keyboard navigation
        this.selectedCell = { i: 0, j: 0 };

        this._initializeEventListeners();
    }

    // Initialize event listeners for game interactions and keyboard inputs
    _initializeEventListeners() {
        this.boardEl.addEventListener('click', (e) => this._handleCellClick(e));

        document.addEventListener('keydown', (e) => this._handleKeyPress(e));
        document.addEventListener('keydown', (e) =>
            this._handleModalKeyPress(e)
        );
    }

    // Handle modal-related key presses
    _handleModalKeyPress(event) {
        if (this._startModalActive) {
            this._handleStartModalKeyPress(event);
        } else if (this._endModalActive) {
            this._handleEndModalKeyPress(event);
        }
    }

    // Handle key presses for the start modal
    _handleStartModalKeyPress(event) {
        if (event.key === 'Enter') {
            this.hideStartModal();
            this.onStartGame(); // Trigger game start
        } else if (event.key === 'Backspace') {
            this.hideStartModal();
            this.onExitGame(); // Trigger game exit
        }
    }

    // Handle key presses for the end modal
    _handleEndModalKeyPress(event) {
        if (event.key === 'Enter') {
            this.hideEndModal();
            this.onNewGame(); // Trigger new game start
        } else if (event.key === 'Backspace') {
            this.hideEndModal();
            this.onExitGame(); // Trigger game exit
        }
    }

    // Handle mouse clicks on the game board cells
    _handleCellClick(event) {
        if (!event.target.classList.contains('cell')) return;

        event.preventDefault(); // Prevent default click behavior

        const i = parseInt(event.target.getAttribute('data-i'));
        const j = parseInt(event.target.getAttribute('data-j'));
        this.onCellClick(i, j); // Trigger cell click callback
    }

    // Handle general keyboard inputs
    _handleKeyPress(event) {
        const { i, j } = this.selectedCell;
        const maxIndex = 2; // Max index for a 3x3 grid

        switch (event.key) {
            case 'ArrowUp':
                this._selectCell(Math.max(0, i - 1), j); // Navigate up
                break;
            case 'ArrowDown':
                this._selectCell(Math.min(maxIndex, i + 1), j); // Navigate down
                break;
            case 'ArrowLeft':
                this._selectCell(i, Math.max(0, j - 1)); // Navigate left
                break;
            case 'ArrowRight':
                this._selectCell(i, Math.min(maxIndex, j + 1)); // Navigate right
                break;
            case 'Enter':
                this.onCellClick(i, j); // Make a move in the selected cell
                break;
            case 'Backspace':
                this.onExitGame(); // Exit the game
                break;
            default:
                break;
        }
    }

    // Highlight the selected cell for keyboard navigation
    _selectCell(i, j) {
        this.selectedCell = { i, j };
        this._highlightSelectedCell();
    }

    // Visually highlight the currently selected cell
    _highlightSelectedCell() {
        const cells = this.boardEl.querySelectorAll('.cell');
        cells.forEach((cell) => cell.classList.remove('selected-cell'));

        const selector = `.cell[data-i="${this.selectedCell.i}"][data-j="${this.selectedCell.j}"]`;
        const selectedCell = this.boardEl.querySelector(selector);
        if (selectedCell) {
            selectedCell.classList.add('selected-cell');
        }
    }

    // Render the current state of the game board
    renderBoard(board) {
        const cells = this.boardEl.querySelectorAll('.cell');
        cells.forEach((cell) => {
            const i = parseInt(cell.getAttribute('data-i'));
            const j = parseInt(cell.getAttribute('data-j'));
            cell.textContent = board.getCell(i, j); // Update cell content
            cell.style.cursor =
                board.getCell(i, j) === '' ? 'pointer' : 'default';
        });

        this._highlightSelectedCell(); // Update cell highlight
    }

    // Update the displayed current player
    showCurrentPlayer(playerName) {
        this.resultInfo.textContent = `Current Player: ${playerName}`;
    }

    // Show the result of the game (win or draw)
    showResult(result) {
        const playerName = result.winner === 'X' ? 'Human' : 'Computer';

        if (result.status === 'win') {
            this.resultInfo.textContent = `Winner: ${playerName}`;
            this.resultInfo.classList.add('winner');
            this.highlightWinningCells(result.cells);
        } else if (result.status === 'draw') {
            this.resultInfo.textContent = 'Draw!';
            this.resultInfo.classList.add('draw');
        }
    }

    // Clear the board for a new game
    clearBoard() {
        const cells = this.boardEl.querySelectorAll('.cell');
        cells.forEach((cell) => {
            cell.textContent = '';
            cell.style.cursor = 'pointer';
            cell.classList.remove('winning-cell');
        });
        this.resultInfo.className = 'info';
    }

    // Highlight the winning cells
    highlightWinningCells(cells) {
        cells.forEach((cellCoord) => {
            const selector = `.cell[data-i="${cellCoord.i}"][data-j="${cellCoord.j}"]`;
            this.boardEl.querySelector(selector)?.classList.add('winning-cell');
        });
    }

    // Show the start modal
    showStartModal() {
        this.startModalContent.innerHTML = `
            <p>Do you want to play?</p>
            <p>Press <strong>Enter</strong> to start or <strong>Backspace</strong> to exit</p>
        `;
        this.startModal.classList.remove('hidden');
        this.startModal.classList.add('visible');
        this._startModalActive = true;
    }

    // Hide the start modal
    hideStartModal() {
        this.startModal.classList.remove('visible');
        this.startModal.classList.add('hidden');
        this._startModalActive = false;
    }

    // Show the end modal with a message
    showEndModal(message) {
        this.endModalContent.innerHTML = `
            <p>${message}</p>
            <p>Press <strong>Enter</strong> to play again or <strong>Backspace</strong> to exit</p>
        `;

        setTimeout(() => {
            this.endModal.classList.remove('hidden');
            this.endModal.classList.add('visible');
            this._endModalActive = true;
        }, 500);
    }

    // Hide the end modal
    hideEndModal() {
        this.endModal.classList.remove('visible');
        this.endModal.classList.add('hidden');
        this._endModalActive = false;
    }

    // Show the advertisement using AdManager
    showAd(onAdComplete) {
        this.adManager.showAd(onAdComplete);
    }

    // Remove the highlight from all cells
    _removeSelectedHighlight() {
        const cells = this.boardEl.querySelectorAll('.cell');
        cells.forEach((cell) => cell.classList.remove('selected-cell'));
    }
}
