<script lang="ts">
  import { store_exam, store_frozen_options } from "../store";

  import { createEventDispatcher } from "svelte";
  import SortableList from "svelte-sortable-list";
  import type { Choice, Choices, CorrectChoice, FrozenOptions } from "../types";
  const dispatch = createEventDispatcher();
  export let choices: Choices;
  export let q_order: number;
  let options: [Choice] | [] = choices ? choices[0] : [];
  let correct: CorrectChoice | null = choices ? choices[1] : null;
  let frozen_options: number[];

  interface OptionWithId {
    id: number;
    option: Choice;
  }
  let options_with_index: OptionWithId[] = [];

  $: frozen_options = $store_frozen_options[q_order];
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

  const donotRandomize = (option_index) => () => {
    let foptions = [];
    if (frozen_options) {
      if (frozen_options.includes(option_index)) {
        foptions = frozen_options.filter((v) => v !== option_index);
      } else {
        foptions = [...frozen_options, option_index];
      }
    } else {
      foptions = [option_index];
    }
    store_frozen_options.update((v) => ({ ...v, [q_order]: foptions }));
  };
</script>

<SortableList
  list={options_with_index}
  key="id"
  on:sort={sortOptions}
  let:item
  let:index
>
  <div class="flex items-center justify-between ">
    <div class="flex flex-col">
      {item.option.text}
      <label
        for="keep-order-{q_order}-{index}"
        class="inline-flex relative items-center mb-5 cursor-pointer"
      >
        <input
          checked={frozen_options && frozen_options.includes(index)}
          on:change={donotRandomize(index)}
          type="checkbox"
          value=""
          id="keep-order-{q_order}-{index}"
          class="sr-only peer"
        />
        <div
          class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
        />
        <span class="ml-3 text-xs font-thin text-gray-900 dark:text-gray-300"
          >{frozen_options && frozen_options.includes(index)
            ? "Randomize"
            : "Unrandomize"}</span
        >
      </label>
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
