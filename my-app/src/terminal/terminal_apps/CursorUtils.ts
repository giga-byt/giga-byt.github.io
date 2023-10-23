export namespace Cursor {
    export function Left(pos: number) {
        return Math.max(0, pos - 1);
    }
    export function Right(pos: number, max: number) {
        return Math.min(pos + 1, max);
    }
}