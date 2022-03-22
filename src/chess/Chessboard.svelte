<script lang="ts">
  import { onMount } from "svelte";
  import { ChessboardUtil } from "./chessboard-util";

  let board: HTMLElement;

  let container: HTMLElement;

  let chessboardWrapper: ChessboardUtil;

  // Lifecycle
  onMount(() => {
    chessboardWrapper = new ChessboardUtil({
      board,
      container,
      orientation: "white",
      color: "white",
    });
  });
</script>

<div
  bind:this={container}
  class="w-[320px] h-[320px] medium:w-[480px] medium:h-[480px]"
>
  <div bind:this={board} class="rounded-md" />
</div>
