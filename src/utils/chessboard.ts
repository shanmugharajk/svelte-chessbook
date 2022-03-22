import { Chessground } from "chessground";
import { Chess, Move } from "chess.js";
import type { ChessInstance, Square } from "chess.js";
import type { Api } from "chessground/api";
import type { Key } from "chessground/types";
import type { Config } from "chessground/config";

export type Color = "white" | "black";

type Args = {
  el: HTMLElement;
  orientation: Color;
  color: Color;
  onMove: (moves: string[] | Move[], moveNo: number) => void;
};

export class Chessboard {
  private chess: ChessInstance;
  private cg: Api;
  private moveNo = 0;
  private fens: string[] = [];

  constructor(private args: Args) {
    this.init();
  }

  // == Public fileds, methods ==
  public get turnColor(): Color {
    return this.chess.turn() === "w" ? "white" : "black";
  }

  public get PGN(): string {
    return this.chess.pgn({
      newline_char: "\n",
    });
  }

  public toggleOrientation() {
    this.cg.toggleOrientation();
  }

  public undo() {
    if (this.moveNo === 0) {
      return;
    }

    const move = this.chess.undo();
    if (!move) {
      return;
    }

    this.fens.pop();
    this.cg.set({
      ...this.config,
      fen: this.fens[--this.moveNo],
      lastMove: [move.from, move.to],
    });
    this.args.onMove(this.history, this.moveNo);
  }

  public setPiece(sanToSet: Square) {
    const move = this.moves.find(({ san }) => san === sanToSet);
    if (!move) {
      return;
    }

    this.chess.move(move.san);
    this.cg.move(move.from, move.to);
    this.cg.set(this.config);
  }

  public reset() {
    this.chess.reset();
    this.fens = [this.fens[0]];
    this.moveNo = 0;
    this.cg.set({
      ...this.config,
      highlight: { lastMove: false },
      fen: this.fens[0],
    });
  }

  public static color(piece: string) {
    return (piece === "black" ? "black" : "white") as Color;
  }

  // == Private fileds, methods ==
  private get config(): Config {
    return {
      turnColor: this.turnColor,
      highlight: { lastMove: true },
      fen: this.chess.fen(),
      movable: {
        color: this.turnColor,
        dests: this.toDests(),
      },
    };
  }

  private get moves(): Move[] {
    return this.chess.moves({ verbose: true });
  }

  public get history(): string[] | Move[] {
    return this.chess.history({ verbose: false });
  }

  private init() {
    this.chess = new Chess();
    this.fens.push(this.chess.fen());

    this.cg = Chessground(this.args.el, {
      orientation: this.args.orientation,
      highlight: {
        check: true,
      },
      movable: {
        color: this.args.color ?? "white",
        free: false,
        dests: this.toDests(),
      },
    });

    this.cg.set({
      highlight: { lastMove: true },
      events: { move: this.handleMove.bind(this) },
      movable: {
        events: {
          after: this.playOtherSide(),
        },
      },
    });
  }

  private handleMove(from: any, to: any) {
    const hasPromotion = this.hasPromotion(from);

    if (hasPromotion) {
      this.chess.move({ from, to, promotion: "q" });
      this.cg.set({
        ...this.config,
        fen: this.chess.fen(),
      });
    } else {
      this.chess.move({ from, to });
    }

    if (this.chess.in_check()) {
      this.cg.set({ ...this.config, check: true });
    }

    this.moveNo++;
    this.fens.push(this.chess.fen());
    this.args.onMove(this.history, this.moveNo);
  }

  private hasPromotion(origin: Key): boolean {
    return this.moves.some(
      ({ flags, from }) => flags.includes("p") && from === origin
    );
  }

  private playOtherSide() {
    return (from: Square, to: Square) => {
      this.chess.move({ from, to });
      this.cg.set(this.config);
    };
  }

  private toDests(): Map<Key, Key[]> {
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
}
