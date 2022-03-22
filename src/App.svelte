<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import { Books } from "~/books";
  import { Practise } from "~/practise";

  // Props
  export let url = "";
</script>

<Router {url}>
  <main>
    <Route path="/"><Books /></Route>
    <Route path="/practise"><Practise /></Route>
  </main>
</Router>
