import Game from './Game.js';
import GameUI from './GameUI.js';
import Board from './Board.js';
import HumanPlayer from './HumanPlayer.js';
import ComputerPlayer from './ComputerPlayer.js';
import { PLAYER_X_SYMBOL, PLAYER_O_SYMBOL, BOARD_SIZE } from './constants.js';

export default class GameController {
    constructor() {
        this.board = new Board(BOARD_SIZE);
        this.humanPlayer = new HumanPlayer(PLAYER_X_SYMBOL);
        this.computerPlayer = new ComputerPlayer(PLAYER_O_SYMBOL);
        this.game = new Game(this.board, this.humanPlayer, this.computerPlayer);

        this.gameUI = new GameUI({
            onCellClick: (i, j) => this._handleCellClick(i, j),
            onNewGame: () => this._resetGame(),
            onExitGame: () => this._exitGame(),
            onStartGame: () => this._startGame(),
        });

        this._showStartModal();
        this._updateUI();
    }

    _showStartModal() {
        this.gameUI.showStartModal();
    }

    _startGame() {
        this._resetGame();
    }

    _exitGame() {
        window.location.href = 'https://google.com';
    }

    _handleCellClick(i, j) {
        if (this.game.isGameOver() || this.game.isCurrentPlayerComputer())
            return;

        const result = this.game.makeMove(i, j);
        this._updateUI();
        this.gameUI.showResult(result);

        if (result.status === 'win' || result.status === 'draw') {
            this._showEndModal(result);
        } else {
            this._checkAndPlayComputerMove();
        }

        // if (this.game.isGameOver()) return;

        // this._checkAndPlayComputerMove();
    }

    _showEndModal(result) {
        const message =
            result.status === 'win'
                ? `Победил игрок ${result.winner === 'X' ? 'Человек' : 'Компьютер'}`
                : 'Ничья!';
        this.gameUI.showEndModal(message);
    }

    _checkAndPlayComputerMove() {
        if (!this.game.isCurrentPlayerComputer() || this.game.isGameOver())
            return;

        setTimeout(() => {
            if (!this.game.isCurrentPlayerComputer() || this.game.isGameOver())
                return;

            const result = this.game.computerMove();
            this._updateUI();

            this.gameUI.showResult(result);
        }, 500);
    }

    _resetGame() {
        this.game.reset();
        this.gameUI.clearBoard();
        this._updateUI();
        this._checkAndPlayComputerMove();
    }

    _updateUI() {
        this.gameUI.renderBoard(this.board);
        const currentPlayerName =
            this.game.currentPlayerSymbol === 'X' ? 'Человек' : 'Компьютер';
        this.gameUI.showCurrentPlayer(currentPlayerName);
    }
}
