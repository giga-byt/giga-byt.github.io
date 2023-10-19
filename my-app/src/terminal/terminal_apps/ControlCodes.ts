
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
        if(moves < 1) {
            return '';
        }
        return `\x1b[${moves}C`;
    }

    static moveDown(moves: number) {
        if(moves < 1) {
            return '';
        }
        return `\x1b[${moves}B`;
    }

}