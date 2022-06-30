<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { setting } from "../store";

  import type { Question } from "../types";

  let qs: [Question];
  const dispatch = createEventDispatcher();
  setting.subscribe((v) => {
    qs = v.exam.questions;
  });
</script>

<div class="flex flex-col text-center text-4xl">
  <h1>All questions</h1>
</div>

<div class="grid grid-cols-2 gap-4 mt-4">
  {#each qs as qq}
    <div class="p-4 w-100 h-100 border border-gray-500">
      <h2 class="text-lg mb-2">Question {qq.order}</h2>
      <button
        on:click={() => {
          dispatch("set-active-q", { q: qq });
        }}
        class="text-blue-600">Edit</button
      >
    </div>
  {/each}
</div>
