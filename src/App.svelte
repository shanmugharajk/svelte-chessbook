<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import { Books } from "~/books";
  import { Header } from "~/components";

  // Props
  export let url = "";
</script>

<Router {url}>
  <Header />
  <main>
    <Route path="/"><Books /></Route>
  </main>
</Router>
