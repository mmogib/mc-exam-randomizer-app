<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { store_exam } from "../store";

  import type { Choices, FrontExam, Question } from "../types";

  export let q: Question;
  let qs: [Question];
  let isFixed: boolean = false;
  const dispatch = createEventDispatcher();

  $: isFixed = q.choices[2] ? true : false;

  const markOptionAsCorrect = (order: number) => () => {
    const options = [q.choices[0], order, q.choices[2]];
    q = { ...q, choices: options as Choices };
    dispatch("updateQuestion", q);
  };

  const fixOrder = () => {
    const orderOpts = isFixed ? null : [0, 1, 2, 3, 4];
    isFixed = !isFixed;
    const options = [q.choices[0], q.choices[1], orderOpts];
    q = { ...q, choices: options as Choices };
    dispatch("updateQuestion", q);
  };
</script>

<div
  class="mt-5 
    border border-blue-900
    p-5
    hover:bg-gray-100
    dark:hover:bg-gray-800
    col-span-2 flex  flex-col w-auto  
    {isFixed ? 'bg-purple-200' : ''}
    "
>
  <div class="flex justify-between items-center">
    <h1 class="font-semibold">Question {q.order}</h1>

    <div>
      <label
        for="fixedOrder-switch_{q.order}"
        class="inline-flex relative items-center cursor-pointer"
      >
        <input
          type="checkbox"
          value=""
          id="fixedOrder-switch_{q.order}"
          class="sr-only peer"
          on:click={fixOrder}
        />
        <div
          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 
          peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 
          rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full 
          peer-checked:after:border-white after:content-[''] 
          after:absolute after:top-[2px] after:left-[2px] 
          after:bg-white 
          after:border-gray-300 
          after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
          dark:border-gray-600 peer-checked:bg-purple-600"
        />
        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-800"
          >{isFixed ? `Unfix options order` : "Fix options order"}</span
        >
      </label>
    </div>
  </div>
  <pre class="my-4">
    {q.text}
  </pre>
  <div>
    {#each q.choices[0] as o, i (i)}
      <div class="flex items-center justify-between ">
        <div>
          <pre>
            {o.text}
          </pre>
        </div>
        <label for="correct_{q.order}" class="flex items-center cursor-pointer">
          <div>
            {#if q.choices[1] === i}
              <span class="text-purple-800 mx-4"> correct </span>
            {/if}
          </div>
          <input
            type="radio"
            name="correct_{q.order}"
            id="correct_{q.order}"
            checked={q.choices[1] === i}
            on:change={markOptionAsCorrect(i)}
          />
        </label>
      </div>
    {/each}
  </div>
</div>
