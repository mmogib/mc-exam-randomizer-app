<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import SortableList from "svelte-sortable-list";
  import type { Choice, Choices, CorrectChoice } from "../types";
  const dispatch = createEventDispatcher();
  export let choices: Choices;
  export let q_order: number;
  let options: [Choice] = choices[0];
  let correct: CorrectChoice = choices[1];
  let options_order: [number] = choices[2];

  interface OptionWithId {
    id: number;
    option: Choice;
  }
  let options_with_index: OptionWithId[] = [];

  $: options_with_index = options.map((option, index) => {
    return { option: option as Choice, id: index };
  });
  const markOptionAsCorrect = (index: number) => () => {
    correct = index;
    dispatch("markOptionAsCorrect", index);
  };
  const sortOptions = (e) => {
    const new_options = e.detail.map((option) => option.option);
    const new_correct = e.detail
      .map((option, i) => (option.id === correct ? i : 0))
      .filter((v) => v !== 0)[0];

    dispatch("updateOptions", { options: new_options, correct: new_correct });
    options_with_index = e.detail;
  };
</script>

<SortableList list={options_with_index} key="id" on:sort={sortOptions} let:item>
  <div class="flex items-center justify-between ">
    <div>
      {item.option.text}
    </div>
    <label for="correct_{q_order}" class="flex items-center cursor-pointer">
      <div>
        {#if correct === item.id}
          <span class="text-purple-800 mx-4"> correct </span>
        {/if}
      </div>
      <input
        type="radio"
        name="correct_{q_order}"
        id="correct_{q_order}"
        checked={correct === item.id}
        on:change={markOptionAsCorrect(item.id)}
      />
    </label>
  </div></SortableList
>
<!-- 
{#each options as o, i (i)}
  <div class="flex items-center justify-between ">
    <div>
      <pre>
            {o.text}
          </pre>
    </div>
    <label for="correct_{q_order}" class="flex items-center cursor-pointer">
      <div>
        {#if correct === i}
          <span class="text-purple-800 mx-4"> correct </span>
        {/if}
      </div>
      <input
        type="radio"
        name="correct_{q_order}"
        id="correct_{q_order}"
        checked={correct === i}
        on:change={markOptionAsCorrect(i)}
      />
    </label>
  </div>
{/each} -->
