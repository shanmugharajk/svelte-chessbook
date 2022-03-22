import type { Move, Square } from "chess.js";

import { Chessboard, sleep } from "~/utils";
import type { Color } from "~/utils";

import { scrollIntoView } from "./utils";

export type onMoveArgs = {
  movesSoFar: string[] | Move[];
  moveNo: number;
  showWrongMoveAlert: boolean;
  canPlayOtherSide: boolean;
};

export type OnMove = (args: onMoveArgs) => void;

export class ChessboardWrapper {
  private chessboard: Chessboard;

  private isPrevWrongMove: boolean;

  private showWrongMoveAlert: boolean;

  private moves: string[] = [];

  private moveNo: number = 0;

  private autoPlayEnabled: boolean;

  private autoPlayInProgress: boolean;

  private canPlayOtherSide: boolean = true;

  constructor(el: HTMLElement, color: Color, private onMove: OnMove) {
    this.chessboard = new Chessboard({
      el,
      color,
      orientation: color,
      onMove: this.handleMove.bind(this),
    });
  }

  public get turnColor(): Color {
    return this.chessboard.turnColor;
  }

  public set chapterMoves(moves: string[]) {
    this.moves = moves;
    this.moveNo = 0;

    // Reset the cg board.
    this.chessboard.reset();
    // Reset the autoplay if any in progress on chapter change
    this.autoPlayInProgress = false;
    this.autoPlayEnabled = false;
    this.canPlayOtherSide = true;
  }

  public prev() {
    this.canPlayOtherSide = false;

    if (this.autoPlayInProgress) {
      return;
    }

    this.chessboard.undo();
  }

  public next() {
    this.canPlayOtherSide = false;

    if (this.autoPlayInProgress) {
      return;
    }

    const nextMove = this.moves[this.moveNo++];
    if (!nextMove) {
      this.moveNo--;
      return;
    }

    this.chessboard.setPiece(nextMove as Square);
  }

  public first() {
    if (this.autoPlayInProgress) {
      return;
    }

    scrollIntoView(0);
    this.chessboard.reset();
    this.moveNo = 0;
    this.canPlayOtherSide = true;
  }

  public async last() {
    this.playTill(this.moves.length);
  }

  public async autoPlay() {
    this.autoPlayEnabled = true;
    this.autoPlayInProgress = true;
    await this.play();
    this.autoPlayInProgress = false;
  }

  public stopAutoPlay() {
    this.autoPlayEnabled = false;
  }

  public async playTill(lastMove: number) {
    if (this.autoPlayInProgress || this.moveNo >= lastMove) {
      return;
    }

    this.autoPlayEnabled = true;
    await this.play(this.moves[this.moveNo], lastMove, 50);
    this.autoPlayEnabled = false;
  }

  /**
   * Sets the pieces with the given delay as per moves (study moves) passed.
   * @param move move from where to start the play.
   * @lastMove no of moves untill autoplay.
   * @param ms delay between moves.
   */
  private async play(
    move: string = this.moves[0],
    lastMove: number = this.moves.length,
    delay?: number
  ) {
    const ms = this.delay(delay);

    if (!this.autoPlayEnabled || this.moveNo > lastMove) {
      this.moveNo--;
      return;
    }

    this.chessboard.setPiece(move as Square);
    await sleep(ms);

    const nextMove = this.moves[this.moveNo++];
    if (nextMove) {
      return await this.play(nextMove, lastMove, ms);
    }
  }

  /**
   * Determines whether we can programatically play the other piece. For example if the study
   * is for white piece then black's move will be auto played.
   * @returns flag say's auto play other side is allowed or not.
   */
  private canAutoPlayOtherSide() {
    return (
      this.canPlayOtherSide && !this.autoPlayInProgress && !this.isPrevWrongMove
    );
  }

  /**
   * Handler gets invoked on every move happens by chessground. This gets invoked
   * even for programatically set pieces.
   * @param movesSoFar history of moves so far
   * @param moveNo current move number
   */
  private handleMove(movesSoFar: string[] | Move[], moveNo: number) {
    this.moveNo = moveNo;

    // This event gets triggered when do programmatic undo. We do that when the current move
    // is wrong move. In that case after undo, the current move we get is valid. So the alert
    // will disappear in a fraction of second user can't see. So to avoid that situation we use
    // the flag's 'isPrevWrongMove', 'showWrongMoveAlert'
    if (!this.isPrevWrongMove) {
      this.showWrongMoveAlert = false;
    }

    // Valid moves as per repertoires.
    if (movesSoFar[moveNo - 1] === this.moves[moveNo - 1]) {
      this.isPrevWrongMove = false;
      this.onMove({
        movesSoFar,
        moveNo,
        showWrongMoveAlert: this.showWrongMoveAlert,
        canPlayOtherSide: this.canAutoPlayOtherSide(),
      });
      this.canPlayOtherSide = true;
      return;
    }

    // Reach here on invalid move.
    setTimeout(() => this.chessboard.undo(), 10);

    this.showWrongMoveAlert = true;
    this.isPrevWrongMove = true;

    this.onMove({
      movesSoFar,
      moveNo,
      showWrongMoveAlert: this.showWrongMoveAlert,
      canPlayOtherSide: this.canAutoPlayOtherSide(),
    });
    this.canPlayOtherSide = true;
  }

  /**
   * Gets the delay beween move in autoplay.
   * @param ms Time delay
   * @returns the time delay between the moves in autoplay
   */
  private delay(ms?: number) {
    return ms ?? (window as any).__DELAY__ ?? 500;
  }
}
