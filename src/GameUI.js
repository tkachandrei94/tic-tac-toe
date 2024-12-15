export default class GameUI {
    constructor({ onCellClick, onNewGame, onExitGame, onStartGame }) {
        this.boardEl = document.getElementById('board');
        this.currentPlayerInfo = document.getElementById('current-player-info');
        this.resultInfo = document.getElementById('result-info');

        this.newGameButton = document.getElementById('new-game-button');

        this.startModal = document.getElementById('start-modal');
        this.startModalContent = document.getElementById('start-modal-content');
        this.endModal = document.getElementById('end-modal');
        this.endModalContent = document.getElementById('end-modal-content');
        this._startModalActive = false;
        this._endModalActive = false;

        this.onCellClick = onCellClick;
        this.onNewGame = onNewGame;
        this.onExitGame = onExitGame;
        this.onStartGame = onStartGame;

        this.selectedCell = { i: 0, j: 0 };

        this._initializeEventListeners();
    }

    _initializeEventListeners() {
        this.boardEl.addEventListener('click', (e) => this._handleCellClick(e));
        this.newGameButton.addEventListener('click', () => this.onNewGame());

        document.addEventListener('keydown', (e) => this._handleKeyPress(e));
        document.addEventListener('keydown', (e) =>
            this._handleModalKeyPress(e)
        );
    }

    _handleModalKeyPress(event) {
        if (this._startModalActive) {
            this._handleStartModalKeyPress(event);
        } else if (this._endModalActive) {
            this._handleEndModalKeyPress(event);
        }
    }

    _handleStartModalKeyPress(event) {
        if (event.key === 'Enter') {
            this.hideStartModal();
            this.onStartGame();
        } else if (event.key === 'Backspace') {
            this.hideStartModal();
            this.onExitGame();
        }
    }

    _handleEndModalKeyPress(event) {
        if (event.key === 'Enter') {
            this.hideEndModal();
            this.onNewGame();
        } else if (event.key === 'Backspace') {
            this.hideEndModal();
            this.onExitGame();
        }
    }

    _handleCellClick(event) {
        if (!event.target.classList.contains('cell')) return;

        event.preventDefault(); // Остановка стандартного действия

        const i = parseInt(event.target.getAttribute('data-i'));
        const j = parseInt(event.target.getAttribute('data-j'));
        this.onCellClick(i, j);
    }

    _handleKeyPress(event) {
        const { i, j } = this.selectedCell;
        const maxIndex = 2;

        switch (event.key) {
            case 'ArrowUp':
                this._selectCell(Math.max(0, i - 1), j);
                break;
            case 'ArrowDown':
                this._selectCell(Math.min(maxIndex, i + 1), j);
                break;
            case 'ArrowLeft':
                this._selectCell(i, Math.max(0, j - 1));
                break;
            case 'ArrowRight':
                this._selectCell(i, Math.min(maxIndex, j + 1));
                break;
            case 'Enter':
                this.onCellClick(i, j); // Делаем ход в выбранную ячейку
                break;
            case 'Backspace':
                this.onExitGame();
                break;
            default:
                break;
        }
    }

    _selectCell(i, j) {
        this.selectedCell = { i, j };
        this._highlightSelectedCell();
    }

    _highlightSelectedCell() {
        const cells = this.boardEl.querySelectorAll('.cell');
        cells.forEach((cell) => cell.classList.remove('selected-cell'));

        const selector = `.cell[data-i="${this.selectedCell.i}"][data-j="${this.selectedCell.j}"]`;
        const selectedCell = this.boardEl.querySelector(selector);
        if (selectedCell) {
            selectedCell.classList.add('selected-cell');
        }
    }

    renderBoard(board) {
        const cells = this.boardEl.querySelectorAll('.cell');
        cells.forEach((cell) => {
            const i = parseInt(cell.getAttribute('data-i'));
            const j = parseInt(cell.getAttribute('data-j'));
            cell.textContent = board.getCell(i, j);
            cell.style.cursor =
                board.getCell(i, j) === '' ? 'pointer' : 'default';
        });

        this._highlightSelectedCell(); // Обновляем выделение
    }

    // updateCurrentPlayer(playerSymbol) {
    //     const playerName = playerSymbol === 'X' ? 'Человек' : 'Компьютер';
    //     this.resultInfo.textContent = `Ходит игрок: ${playerName}`;
    // }

    showCurrentPlayer(playerName) {
        this.resultInfo.textContent = `Ходит игрок: ${playerName}`;
    }

    showResult(result) {
        const playerName = result.winner === 'X' ? 'Человек' : 'Компьютер';

        if (result.status === 'win') {
            this.resultInfo.textContent = `Победил игрок - ${playerName}`;
            this.resultInfo.classList.add('winner');

            this.highlightWinningCells(result.cells);
        } else if (result.status === 'draw') {
            this.resultInfo.textContent = 'Ничья!';
            this.resultInfo.classList.add('draw');
        }
    }

    clearBoard() {
        const cells = this.boardEl.querySelectorAll('.cell');
        cells.forEach((cell) => {
            cell.textContent = '';
            cell.style.cursor = 'pointer';
            cell.classList.remove('winning-cell');
        });
        this.resultInfo.className = 'info';
    }

    highlightWinningCells(cells) {
        cells.forEach((cellCoord) => {
            const selector = `.cell[data-i="${cellCoord.i}"][data-j="${cellCoord.j}"]`;
            this.boardEl.querySelector(selector)?.classList.add('winning-cell');
        });
    }

    showStartModal() {
        this.startModalContent.innerHTML = `
            <p>Вы хотите играть?</p>
            <p>Нажмите <strong>Enter</strong> для начала игры или <strong>Backspace</strong> для выхода</p>
        `;
        this.startModal.classList.remove('hidden');
        this.startModal.classList.add('visible');
        this._startModalActive = true;
    }

    hideStartModal() {
        this.startModal.classList.remove('visible');
        this.startModal.classList.add('hidden');
        this._startModalActive = false;
    }

    showEndModal(message) {
        console.log('showEndModal');
        this.endModalContent.innerHTML = `
            <p>${message}</p>
            <p>Нажмите <strong>Enter</strong> чтобы сыграть ещё раз или <strong>Backspace</strong> для выхода</p>
        `;

        setTimeout(() => {
            this.endModal.classList.remove('hidden');
            this.endModal.classList.add('visible');
            this._endModalActive = true;
        }, [500]);
    }

    hideEndModal() {
        this.endModal.classList.remove('visible');
        this.endModal.classList.add('hidden');
        this._endModalActive = false;
    }
}
