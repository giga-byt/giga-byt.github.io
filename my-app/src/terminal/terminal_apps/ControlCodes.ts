
export default class ControlCodes {
    static clearLine(): string {
        return '\x1b[2K';
    }

    static clearScreen(): string {
        return '\x1b[2J';
    }

    static newLine(): string {
        return '\n\r';
    }

    static moveToTopLeft(): string {
        return '\x1b[H';
    }

    static moveToLineStart(): string {
        return '\r';
    }

    static moveRight(moves: number): string {
        return moves < 1 ? '' : `\x1b[${moves}C`;
    }

    static moveLeft(moves: number): string {
        return moves < 1 ? '' : `\x1b[${moves}D`;
    }

    static moveDown(moves: number) {
        return moves < 1 ? '' : `\x1b[${moves}B`;
    }

    static moveUp(moves: number) {
        return moves < 1 ? '' : `\x1b[${moves}A`;
    }
}