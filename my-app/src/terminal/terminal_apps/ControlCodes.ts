
export enum TColor {
    DEFAULT = '39',
    BLACK = '30',
    DARK_RED = '31',
    DARK_GREEN = '32',
    DARK_YELLOW = '33',
    DARK_BLUE = '34',
    DARK_MAGENTA = '35',
    DARK_CYAN = '36',
    LIGHT_GRAY = '37',
    DARK_GRAY = '90',
    RED = '91',
    GREEN = '92',
    ORANGE = '93',
    BLUE = '94',
    MAGENTA = '95',
    CYAN = '96',
    WHITE = '97',
    RESET = '0'
};

export enum TBGColor {
    DEFAULT = '49',
    BLACK = '40',
    DARK_RED = '41',
    DARK_GREEN = '42',
    DARK_YELLOW = '43',
    DARK_BLUE = '44',
    DARK_MAGENTA = '45',
    DARK_CYAN = '46',
    LIGHT_GRAY = '47',
    DARK_GRAY = '100',
    RED = '101',
    GREEN = '101',
    ORANGE = '103',
    BLUE = '104',
    MAGENTA = '105',
    CYAN = '106',
    WHITE = '107',
    RESET = '0'
}

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

    static color(text: string, color: TColor, bg_color: TBGColor | undefined = undefined, bold = false){
        let boldStr = bold ? '1;' : '0;';
        let fcolorStr = `\x1b[${boldStr}${color}m`;
        let bcolorStr = bg_color ? `\x1b[${bg_color}m` : '';
        let resetStr = '\x1b[0m';
        return `${fcolorStr}${bcolorStr}${text}${resetStr}`;
    }
}