export default class Player {
  _symbol; 

  constructor(symbol) {
    this._symbol = symbol;
  }

  get symbol() {
    return this._symbol;
  }
}
