export const charCodeOffset = 97;

export const fromPieceDecl = (pos: string) => {
    const [piece, square] = pos.split('@');
    const x = square.toLowerCase().charCodeAt(0) - charCodeOffset;
    const y = Number(square[1]) - 1;
    return {x, y, piece, square};
}
