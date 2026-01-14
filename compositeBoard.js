// compositeBoard.js
// =====================================
//n 개의 보더를 하나의 보더처럼 다루는 객체
// =====================================

import { drawBoard } from "./renderBoard.js";

export class CompositeBoard {
  constructor(boards) {
    if (!Array.isArray(boards))  {
      throw new Error("CompositeBoard requires exactly  boards");
    }

    this.boards = boards;
  }

  render(ctx) {
    this.boards.forEach(board => {
      drawBoard(ctx, board);
    });
  }
}
