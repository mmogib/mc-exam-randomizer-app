<script lang="ts">
  import { Question, WizardState } from "../types";
  import { store_exam, wizard_state } from "../store";
  import EditQuestion from "./EditQuestion.svelte";
  let questions: [Question] | null;
  store_exam.subscribe((v) => {
    questions = v.questions ? [...v.questions] : null;
  });

  const goNext = async () => {
    wizard_state.set(WizardState.DOWNLOAD_EXAM);
  };
</script>

<div class="flex flex-col ">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-lg font-bold">Order Options</h1>
      <p>
        Take a minute to revise the order and the correct option for each
        question and then click NEXT.
      </p>
    </div>
    <div>
      <button
        on:click={() => {
          wizard_state.set(WizardState.FILL_SETTING);
        }}
        class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
      >
        <span
          class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
        >
          Go back
        </span>
      </button>
      <button
        on:click={goNext}
        class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
      >
        <span
          class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
        >
          Next
        </span>
      </button>
    </div>
  </div>
  {#if questions}
    {#each questions as q (q.order)}
      <EditQuestion {q} />
    {/each}
  {/if}
</div>
