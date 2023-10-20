export type Board = (0 | 1)[][];

export interface ImageData {
  imageUrl: string;
  width: number;
  height: number;
}

export function playGameOfLife(board: Board, iterations: number): ImageData {
  for (let i = 0; i < iterations; i++) {
    const outputBoard = generateOutputBoard(board);
    board = outputBoard;
  }

  return getBoardImage(board);
}

export function generateBoard(): Board {
  const width = getIntBetween(0, 101);
  const height = getIntBetween(0, 101);

  const newBoard = Array(height)
    .fill(Array(width))
    .map((array: number[]) =>
      array.fill(0).map((_: number) => getIntBetween(0, 2))
    ) as Board;

  return newBoard;
}

function getIntBetween(start: number, end: number) {
  return Math.floor(Math.random() * end - start) + start;
}

function countNeighbors(board: Board, x: number, y: number): number {
  const top = getCellAtPosition(board, x, y - 1);
  const topRight = getCellAtPosition(board, x + 1, y - 1);
  const right = getCellAtPosition(board, x + 1, y);
  const bottomRight = getCellAtPosition(board, x + 1, y + 1);
  const bottom = getCellAtPosition(board, x, y + 1);
  const bottomLeft = getCellAtPosition(board, x - 1, y + 1);
  const left = getCellAtPosition(board, x - 1, y);
  const topLeft = getCellAtPosition(board, x - 1, y - 1);

  return (
    top + topRight + right + bottomRight + bottom + bottomLeft + left + topLeft
  );
}

function getCellAtPosition(board: Board, x: number, y: number): 0 | 1 {
  if (x < 0 || y < 0) {
    return 0;
  }

  if (x >= getBoardWidth(board) || y >= getBoardHeight(board)) {
    return 0;
  }

  return board[y][x];
}

function generateOutputBoard(board: Board): Board {
  return board.map((row, y) =>
    row.map((value, x) => {
      const neighbors = countNeighbors(board, x, y);

      if (neighbors < 2) {
        return 0;
      }

      if (neighbors <= 3 && value === 1) {
        return 1;
      }

      if (neighbors > 3 && value === 1) {
        return 0;
      }

      if (neighbors === 3 && value === 0) {
        return 1;
      }

      return 0;
    })
  );
}

function getBoardWidth(board: Board): number {
  return board[0].length;
}

function getBoardHeight(board: Board): number {
  return board.length;
}

function getBoardImage(board: Board): ImageData {
  const cellSize = 10;
  const boardWidth = getBoardWidth(board);
  const boardHeight = getBoardHeight(board);

  const canvas = document.createElement("canvas");
  canvas.width = boardWidth * cellSize;
  canvas.height = boardHeight * cellSize;

  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#fff";

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000";

  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      if (getCellAtPosition(board, x, y)) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  return {
    imageUrl: canvas.toDataURL("image/png"),
    width: canvas.width,
    height: canvas.height,
  };
}
