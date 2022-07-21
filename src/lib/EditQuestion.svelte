<script lang="ts">
  import { store_exam } from "../store";

  import { createEventDispatcher } from "svelte";

  import type { Choices, Question } from "../types";
  import OrderOptions from "./OrderOptions.svelte";
  const dispatch = createEventDispatcher();

  export let q: Question;
  export let keepInOnePage: boolean = true;

  let hideit: string = "";
  let isFixed: boolean = false;

  $: hideit = `hide_${q.order}`;
  $: isFixed = q.choices && q.choices[2] ? true : false;
  const includeInOnePageList = () => {
    dispatch("keepInOnePage", q);
  };

  const markOptionAsCorrect = (e) => {
    const order = e.detail;
    const options = [q.choices[0], order, q.choices[2]];
    q = { ...q, choices: options as Choices };
    dispatch("updateQuestion", q);
  };

  const fixOrder = () => {
    const orderOpts = isFixed ? null : q.choices[0].map((_, i) => i);
    isFixed = !isFixed;
    const options = [q.choices[0], q.choices[1], orderOpts];
    q = { ...q, choices: options as Choices };
    dispatch("updateQuestion", q);
  };

  const updateOptions = (e) => {
    const { options, correct } = e.detail;

    const new_options = [options, correct, q.choices[2]];
    q = { ...q, choices: new_options as Choices };
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
  
    "
>
  <div class="flex justify-between items-center">
    <div class="flex flex-col">
      <h1 class="font-semibold">Question {q.order}</h1>
      <div>
        <label
          for="keepOnOnePage-switch_{q.order}"
          class="inline-flex relative items-center cursor-pointer"
        >
          <input
            type="checkbox"
            checked={keepInOnePage}
            value=""
            id="keepOnOnePage-switch_{q.order}"
            class="sr-only peer"
            on:click={includeInOnePageList}
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
          dark:border-gray-600 peer-checked:bg-purple-600
          dark:hover:bg-white-700
          "
          />
          <span class="ml-3 text-sm font-medium text-gray-900 dark:text-white"
            >{keepInOnePage
              ? `This will be in one page, click to remove`
              : "Click to keep in one page"}</span
          >
        </label>
      </div>
    </div>
    <div>
      <label
        for="fixedOrder-switch_{q.order}"
        class="inline-flex relative items-center cursor-pointer"
      >
        <input
          type="checkbox"
          checked={isFixed}
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
        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-white"
          >{isFixed ? `Unfix options order` : "Fix options order"}</span
        >
      </label>
    </div>
  </div>
  <pre contenteditable="true" bind:textContent={q.text} class="my-4" />
  <button
    class="bg-blue-500 w-1/5  rounded-lg p-2 text-white "
    on:click={() => {
      hideit === "" ? (hideit = `hide_${q.order}`) : (hideit = "");
    }}>{hideit === "" ? "Hide" : "Show"} Options</button
  >
  <div class={hideit === `hide_${q.order}` ? "hidden" : ""}>
    <OrderOptions
      choices={q.choices}
      q_order={q.order}
      on:markOptionAsCorrect={markOptionAsCorrect}
      on:updateOptions={updateOptions}
    />
  </div>
</div>
