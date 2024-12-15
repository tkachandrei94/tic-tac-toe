import './styles.css';
import Board from './Board.js';
import Game from './Game.js';
import HumanPlayer from './HumanPlayer.js';
import ComputerPlayer from './ComputerPlayer.js';
import { PLAYER_X_SYMBOL, PLAYER_O_SYMBOL, BOARD_SIZE } from './constants.js';

const boardEl = document.getElementById('board');
const currentPlayerInfo = document.getElementById('current-player-info');
const resultInfo = document.getElementById('result-info');
const newGameButton = document.getElementById('new-game-button');

let timeoutInProgress = false; // Флаг для контроля таймаута

const board = new Board(BOARD_SIZE);
const humanPlayer = new HumanPlayer(PLAYER_X_SYMBOL);
const computerPlayer = new ComputerPlayer(PLAYER_O_SYMBOL);
const game = new Game(board, humanPlayer, computerPlayer);

// Функция обновления UI
function updateUI() {
    currentPlayerInfo.textContent = `Ходит игрок: ${
        game.currentPlayerSymbol === PLAYER_X_SYMBOL
            ? 'Человек (X)'
            : 'Компьютер (O)'
    }`;
    resultInfo.textContent = '';
    resultInfo.className = '';
    clearBoardUI();
}

// Очистка игрового поля в UI
function clearBoardUI() {
    const cells = boardEl.querySelectorAll('.cell');
    cells.forEach((cell) => {
        cell.textContent = '';
        cell.style.cursor = 'pointer';
        cell.classList.remove('winning-cell');
    });
}

// Рендер игрового поля
function renderBoard() {
    const cells = boardEl.querySelectorAll('.cell');
    cells.forEach((cell) => {
        const i = parseInt(cell.getAttribute('data-i'));
        const j = parseInt(cell.getAttribute('data-j'));
        cell.textContent = board.getCell(i, j);
        cell.style.cursor = board.getCell(i, j) === '' ? 'pointer' : 'default';
    });
    currentPlayerInfo.textContent = `Ходит игрок: ${
        game.currentPlayerSymbol === PLAYER_X_SYMBOL
            ? 'Человек (X)'
            : 'Компьютер (O)'
    }`;
}

// Обработка результата хода
function handleResult(result) {
    if (!result) return;
    if (result.status === 'win') {
        resultInfo.textContent = `Победил игрок ${
            result.winner === PLAYER_X_SYMBOL ? 'Человек (X)' : 'Компьютер (O)'
        }!`;
        resultInfo.className = 'winner';
        highlightWinningCells(result.cells);
    } else if (result.status === 'draw') {
        resultInfo.textContent = 'Ничья!';
        resultInfo.className = 'draw';
    }
}

// Подсветка выигравшей линии
function highlightWinningCells(cells) {
    cells.forEach((cellCoord) => {
        const selector = `.cell[data-i="${cellCoord.i}"][data-j="${cellCoord.j}"]`;
        const cellEl = boardEl.querySelector(selector);
        if (cellEl) {
            cellEl.classList.add('winning-cell');
        }
    });
}

function checkAndPlayComputerMove() {
    console.log('checkAndPlayComputerMove');
    if (timeoutInProgress) return;

    timeoutInProgress = true;

    setTimeout(() => {
        if (game.isGameOver() || !game.isCurrentPlayerComputer()) {
            timeoutInProgress = false; // Сброс флага

            return;
        }

        const compResult = game.computerMove();
        renderBoard();
        handleResult(compResult);

        timeoutInProgress = false; // Сброс флага после завершения таймаута
    }, 500);
}

function handleCellClick(cell) {
    if (game.isGameOver()) return;
    if (game.isCurrentPlayerComputer()) return;

    const i = parseInt(cell.getAttribute('data-i'));
    const j = parseInt(cell.getAttribute('data-j'));

    if (board.getCell(i, j) !== '') {
        console.log('Эта клетка уже занята!');
        return;
    }

    const result = game.makeMove(i, j);
    cell.textContent = board.getCell(i, j);
    cell.style.cursor = 'default';
    handleResult(result);
    checkAndPlayComputerMove();
}

function initializeBoardEventListeners() {
    const cells = boardEl.querySelectorAll('.cell');
    cells.forEach((cell) => {
        cell.replaceWith(cell.cloneNode(true));

        const newCell = boardEl.querySelector(
            `.cell[data-i="${cell.getAttribute(
                'data-i'
            )}"][data-j="${cell.getAttribute('data-j')}"]`
        );

        newCell.addEventListener('click', () => handleCellClick(newCell));
    });
}

newGameButton.addEventListener('click', (e) => {
    e.stopImmediatePropagation();

    console.log('\nnewGameButton');
    game.reset();
    updateUI();
    checkAndPlayComputerMove();
});

if (!window.__GAME_INITIALIZED__) {
    window.__GAME_INITIALIZED__ = true;
    console.log('SCRIPT LOADED AT:', new Date().toISOString());

    updateUI();
    initializeBoardEventListeners();
    checkAndPlayComputerMove();
}
