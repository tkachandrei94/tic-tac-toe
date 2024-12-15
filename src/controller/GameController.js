import Game from '../game/Game.js';
import GameUI from '../ui/GameUI.js';
import Board from '../game/Board.js';
import HumanPlayer from '../game/HumanPlayer.js';
import ComputerPlayer from '../game/ComputerPlayer.js';
import { PLAYER_X_SYMBOL, PLAYER_O_SYMBOL, BOARD_SIZE } from '../game/constants.js';

export default class GameController {
    constructor() {
        // Initialize the game board and players
        this.board = new Board(BOARD_SIZE);
        this.humanPlayer = new HumanPlayer(PLAYER_X_SYMBOL);
        this.computerPlayer = new ComputerPlayer(PLAYER_O_SYMBOL);
        this.game = new Game(this.board, this.humanPlayer, this.computerPlayer);

        // Initialize the UI with callbacks
        this.gameUI = new GameUI({
            onCellClick: (i, j) => this._handleCellClick(i, j),
            onNewGame: () => this._startNewRoundWithAd(),
            onExitGame: () => this._exitGame(),
            onStartGame: () => this._startGame(),
        });

        this._showStartModal(); // Show the start modal at initialization
        this._updateUI();
    }

    // Display the start modal
    _showStartModal() {
        this.gameUI.showStartModal();
    }

    // Start the game after displaying an advertisement
    _startGame() {
        this.gameUI.showAd(() => {
            this._resetGame();
        });
    }

    // Start a new round with an advertisement
    _startNewRoundWithAd() {
        this.gameUI.showAd(() => {
            this._resetGame();
        });
    }

    // Exit the game and redirect the user
    _exitGame() {
        this._resetGame();

        window.location.href = 'https://google.com';
    }

    // Handle a cell click by the user
    _handleCellClick(i, j) {
        if (this.game.isGameOver() || this.game.isCurrentPlayerComputer()) return;

        const result = this.game.makeMove(i, j);
        this._updateUI();
        this.gameUI.showResult(result);

        console.log('_handleCellClick result', result);

        if (result.status === 'win' || result.status === 'draw') {
            this._showEndModal(result); // Show the end modal if the game is over
        } else {
            this._checkAndPlayComputerMove(); // Let the computer make its move
        }
    }

    // Display the end modal with the game result
    _showEndModal(result) {
        const message =
            result.status === 'win'
                ? `Player ${
                      result.winner === 'X' ? 'Human' : 'Computer'
                  } won!`
                : 'It\'s a draw!';
        this.gameUI.showEndModal(message);
    }

    // Let the computer make its move if it's its turn
    _checkAndPlayComputerMove() {
        if (!this.game.isCurrentPlayerComputer() || this.game.isGameOver()) return;

        setTimeout(() => {
            if (!this.game.isCurrentPlayerComputer() || this.game.isGameOver()) return;

            const result = this.game.computerMove();
            this._updateUI();
            this.gameUI.showResult(result);

            if (result.status === 'win' || result.status === 'draw') {
                this._showEndModal(result); // Show the end modal if the game is over
            } else {
                this._checkAndPlayComputerMove(); // Continue the computer's turn if needed
            }
        }, 500);
    }

    // Reset the game state for a new round
    _resetGame() {
        this.game.reset();
        this.gameUI.clearBoard();
        this._updateUI();
        this._checkAndPlayComputerMove(); // Start the computer's turn if it's first
    }

    // Update the UI to reflect the current game state
    _updateUI() {
        this.gameUI.renderBoard(this.board);
        const currentPlayerName =
            this.game.currentPlayerSymbol === 'X' ? 'Human' : 'Computer';
        this.gameUI.showCurrentPlayer(currentPlayerName); // Display the current player
    }
}
