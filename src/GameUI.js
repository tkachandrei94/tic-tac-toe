export default class GameUI {
    constructor({ onCellClick, onNewGame, onExitGame }) {
        this.boardEl = document.getElementById('board');
        this.currentPlayerInfo = document.getElementById('current-player-info');
        this.resultInfo = document.getElementById('result-info');
        this.newGameButton = document.getElementById('new-game-button');

        this.onCellClick = onCellClick;

        this.onNewGame = onNewGame;
        this.onExitGame = onExitGame;

        this.selectedCell = { i: 0, j: 0 };

        this._initializeEventListeners();

        console.log('GameUI constructor');
    }

    _initializeEventListeners() {
        this.boardEl.addEventListener('click', (e) => this._handleCellClick(e));
        this.newGameButton.addEventListener('click', () => this.onNewGame());

        document.addEventListener('keydown', (e) => this._handleKeyPress(e));
    }

    _handleCellClick(event) {
        if (!event.target.classList.contains('cell')) return;
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
                this.onNewGame(); // Сбрасываем игру
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

    updateCurrentPlayer(playerSymbol) {
        const playerName = playerSymbol === 'X' ? 'Человек' : 'Компьютер';
        this.resultInfo.textContent = `Ходит игрок: ${playerName}`;
    }

    showResult(result) {
        console.log('result', result);
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
}
