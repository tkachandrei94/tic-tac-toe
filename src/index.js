import './styles.css';
import GameController from './GameController.js';

if (!window.__GAME_INITIALIZED__) {
    window.__GAME_INITIALIZED__ = true;

    // Инициализация игры
    new GameController();
}
