import Player from './Player.js';
import { BOARD_SIZE } from './constants.js';

export default class ComputerPlayer extends Player {
  constructor(symbol) {
    super(symbol);
  }

  makeMove(board) {
    const availableMoves = this._getAvailableMoves(board);
    
    if (availableMoves.length === 0) return null;
    return this._getRandomMove(availableMoves);
  }

  _getAvailableMoves(board) {
    const moves = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board.getCell(i, j) === '') {
          moves.push({ i, j });
        }
      }
    }
    return moves;
  }

  _getRandomMove(moves) {
    const randomIndex = Math.floor(Math.random() * moves.length);
    return moves[randomIndex];
  }
}
