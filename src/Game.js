import { getRandomPlayerSymbol } from './utils.js';

export default class Game {
    constructor(board, humanPlayer, computerPlayer) {
        this._board = board;
        this._humanPlayer = humanPlayer;
        this._computerPlayer = computerPlayer;

        this.reset();
    }

    get currentPlayerSymbol() {
        return this._currentPlayer.symbol;
    }

    reset() {
        this._board.reset();
        const firstSymbol = getRandomPlayerSymbol();

        this._currentPlayer =
            firstSymbol === this._humanPlayer.symbol
                ? this._humanPlayer
                : this._computerPlayer;

        this._gameOver = false;
    }

    makeMove(i, j) {
        if (this._gameOver) return null;

        if (this._board.setCell(i, j, this._currentPlayer.symbol)) {
            const result = this._checkResult();

            if (!this._gameOver) this.switchPlayer();

            return result;
        }

        return { status: 'invalid' };
    }

    computerMove() {
        if (this._gameOver || this._currentPlayer !== this._computerPlayer)
            return null;

        const move = this._computerPlayer.makeMove(this._board);
        if (!move) {
            return { status: 'draw' };
        }

        this._board.setCell(move.i, move.j, this._computerPlayer.symbol);

        const result = this._checkResult();
        console.log('computerMove result', result)
        if (!this._gameOver) this.switchPlayer();

        return result;
    }

    _checkResult() {
        const winInfo = this._board.getWinningLine();

        console.log('winInfo', winInfo)
        if (winInfo) {
            this._gameOver = true;
            return {
                status: 'win',
                winner: winInfo.winner,
                cells: winInfo.cells,
            };
        }

        if (this._board.isFull()) {
            this._gameOver = true;
            this._draws++;
            return { status: 'draw' };
        }

        return { status: 'continue' };
    }

    switchPlayer() {
        this._currentPlayer =
            this._currentPlayer._symbol === this._humanPlayer._symbol
                ? this._computerPlayer
                : this._humanPlayer;
    }

    isGameOver() {
        return this._gameOver;
    }

    isCurrentPlayerComputer() {
        return this._currentPlayer._symbol === this._computerPlayer._symbol;
    }
}
