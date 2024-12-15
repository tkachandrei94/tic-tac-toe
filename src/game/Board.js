export default class Board {
    constructor(size) {
        this._size = size;
        this.reset();
    }

    reset() {
        this._grid = Array.from({ length: this._size }, () =>
            Array(this._size).fill('')
        );
    }

    getCell(i, j) {
        return this._grid[i][j];
    }

    getCells() {
        return this._grid;
    }

    setCell(i, j, symbol) {
        if (this._grid[i][j] === '') {
            this._grid[i][j] = symbol;
            return true;
        }
        return false;
    }

    isFull() {
        for (let i = 0; i < this._size; i++) {
            for (let j = 0; j < this._size; j++) {
                if (this._grid[i][j] === '') return false;
            }
        }
        return true;
    }

    checkWinner() {
        for (let i = 0; i < this._size; i++) {
            if (
                this._grid[i][0] !== '' &&
                this._grid[i].every((cell) => cell === this._grid[i][0])
            ) {
                return this._grid[i][0];
            }
        }

        for (let j = 0; j < this._size; j++) {
            const col = [this._grid[0][j], this._grid[1][j], this._grid[2][j]];
            if (col[0] !== '' && col.every((cell) => cell === col[0])) {
                return col[0];
            }
        }

        const diag1 = [this._grid[0][0], this._grid[1][1], this._grid[2][2]];
        if (diag1[0] !== '' && diag1.every((cell) => cell === diag1[0])) {
            return diag1[0];
        }

        const diag2 = [this._grid[0][2], this._grid[1][1], this._grid[2][0]];
        if (diag2[0] !== '' && diag2.every((cell) => cell === diag2[0])) {
            return diag2[0];
        }

        return null;
    }

    getWinningLine() {
        for (let i = 0; i < this._size; i++) {
            if (
                this._grid[i][0] !== '' &&
                this._grid[i].every((cell) => cell === this._grid[i][0])
            ) {
                return {
                    winner: this._grid[i][0],
                    cells: [
                        { i, j: 0 },
                        { i, j: 1 },
                        { i, j: 2 },
                    ],
                };
            }
        }

        for (let j = 0; j < this._size; j++) {
            const col = [this._grid[0][j], this._grid[1][j], this._grid[2][j]];
            if (col[0] !== '' && col.every((cell) => cell === col[0])) {
                return {
                    winner: col[0],
                    cells: [
                        { i: 0, j },
                        { i: 1, j },
                        { i: 2, j },
                    ],
                };
            }
        }

        const diag1 = [this._grid[0][0], this._grid[1][1], this._grid[2][2]];
        if (diag1[0] !== '' && diag1.every((cell) => cell === diag1[0])) {
            return {
                winner: diag1[0],
                cells: [
                    { i: 0, j: 0 },
                    { i: 1, j: 1 },
                    { i: 2, j: 2 },
                ],
            };
        }

        const diag2 = [this._grid[0][2], this._grid[1][1], this._grid[2][0]];
        if (diag2[0] !== '' && diag2.every((cell) => cell === diag2[0])) {
            return {
                winner: diag2[0],
                cells: [
                    { i: 0, j: 2 },
                    { i: 1, j: 1 },
                    { i: 2, j: 0 },
                ],
            };
        }

        return null;
    }
}
