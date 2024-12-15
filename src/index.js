import './ui/styles.css';
import GameController from './controller/GameController.js';

if (!window.__GAME_INITIALIZED__) {
    window.__GAME_INITIALIZED__ = true;

    new GameController();
}
