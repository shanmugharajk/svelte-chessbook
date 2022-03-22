import { Chess, Move, Square } from "chess.js";
import type { ChessInstance as ChessJSInstance } from "chess.js";
import { Chessground } from "chessground";
import type { Api as ChessgroundInstance } from "chessground/api";
import type { Color, Key } from "chessground/types";
import type { Config } from "chessground/config";

type Options = {
  container: HTMLElement;
  board: HTMLElement;
  orientation: Color;
  color: Color;
};

export class ChessboardUtil {
  private chess: ChessJSInstance;
  private cg: ChessgroundInstance;
  private timerId: number;

  constructor(private options: Options) {
    this.chess = new Chess();
    this.cg = Chessground(this.options.board, {
      orientation: this.options.orientation,
      highlight: {
        check: true,
        lastMove: true,
      },
      movable: {
        color: this.options.color,
        free: false,
        dests: this.dests(),
        events: {
          after: this.playOtherSide(),
        },
      },
    });

    this.timerId = window.setTimeout(this.handleResize.bind(this));
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  // == Public fields, methods ==
  public get turnColor(): Color {
    return this.chess.turn() === "w" ? "white" : "black";
  }

  private get config(): Config {
    return {
      turnColor: this.turnColor,
      highlight: { lastMove: true },
      fen: this.chess.fen(),
      movable: {
        color: this.turnColor,
        dests: this.dests(),
      },
    };
  }

  public destroyBoard = () => {
    window.removeEventListener("resize", this.handleResize.bind(this));
    window.clearTimeout(this.timerId);
  };

  // == Private fields, methods ==
  private playOtherSide() {
    return (from: Square, to: Square) => {
      this.chess.move({ from, to });
      this.cg.set(this.config);
    };
  }

  private dests(): Map<Key, Key[]> {
    const dests = new Map();

    this.chess.SQUARES.forEach((s) => {
      const ms = this.chess.moves({ square: s, verbose: true });
      if (ms.length)
        dests.set(
          s,
          ms.map((m) => m.to)
        );
    });

    return dests;
  }

  private handleResize() {
    if (!this.options.board || !this.options.container) {
      return;
    }

    let { height, width } = this.options.container?.getBoundingClientRect();
    let dim = height > width ? width : height;
    dim -= dim % 8;

    this.options.board.style.width = `${dim}px`;
    this.options.board.style.height = `${dim}px`;
  }
}
