import Player from './Player.js';
import { BOARD_SIZE } from './constants.js';

export default class ComputerPlayer extends Player {
  constructor(symbol) {
    super(symbol);
  }

  // Делает случайный ход из доступных
  makeMove(board) {
    const availableMoves = this._getAvailableMoves(board);
    console.log('availableMoves', availableMoves);
    
    if (availableMoves.length === 0) return null; // Если ходов нет, возвращаем null

    // Случайный выбор хода
    return this._getRandomMove(availableMoves);
  }

  // Приватный метод для получения доступных ходов
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

  // Приватный метод для выбора случайного хода
  _getRandomMove(moves) {
    const randomIndex = Math.floor(Math.random() * moves.length);
    return moves[randomIndex];
  }
}
