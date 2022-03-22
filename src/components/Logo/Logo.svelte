<script lang="ts">
  import { link } from "svelte-routing";
  import { Puzzle } from "~/components/icons";
</script>

<div class="border-b py-4 px-5 border-light-blue flex items-center text-link">
  <div class="w-6 h-6 mr-2"><Puzzle /></div>
  <a href="/" use:link>Svelte Chessbook</a>
</div>
