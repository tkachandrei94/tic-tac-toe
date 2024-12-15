import { PLAYER_O_SYMBOL, PLAYER_X_SYMBOL } from "../game/constants.js";

export function getRandomPlayerSymbol() {
  return Math.random() < 0.5 ? PLAYER_X_SYMBOL : PLAYER_O_SYMBOL;
}
