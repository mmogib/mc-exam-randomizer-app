<script lang="ts">
  import { onMount } from "svelte";
  import { setting } from "../store";

  import type { Question } from "src/types";

  export let q: Question;

  onMount(() => {});

  const saveQuestion = () => {};
</script>

<div
  class="mt-5 
    border border-blue-900
    p-5
    col-span-2 flex  flex-col text-center w-auto justify-center "
>
  <h1>Editing question {q.order}</h1>
  <p>{q.text}</p>
  {#each q.choices[0] as o}
    <div>{o.text}</div>
  {/each}
</div>
