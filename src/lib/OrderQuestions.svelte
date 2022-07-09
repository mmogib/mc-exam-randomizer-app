<script lang="ts">
  import SortableList from "svelte-sortable-list";
  import { type Question, WizardState } from "../types";
  import { store_exam, wizard_state } from "../store";
  import EditQuestion from "./EditQuestion.svelte";
  let questions: [Question] | null = $store_exam.questions;

  const sortQuestions = (ev) => {
    questions = ev.detail;
  };
  const goNext = async () => {
    store_exam.update((v) => ({
      ...v,
      questions: questions.map((q, i) => ({ ...q, order: i + 1 })) as [
        Question
      ],
    }));
    wizard_state.set(WizardState.GROUP_QUESTIONS);
  };
  const updateQuestion = (e) => {
    const q = e.detail as Question;
    questions = questions.map((v) => {
      if (v.order === q.order) {
        return q;
      }
      return v;
    }) as [Question];
  };
</script>

<div class="flex flex-col ">
  <div class="flex items-center justify-between">
    <div class="w-1/2">
      <h1 class="text-lg font-bold">Order Question</h1>
      <p>
        Take a minute to revise the order of the question and the correct option
        for each question and then click NEXT.
      </p>
      <div class="font-semibold">You can re-order by dragging and dropping</div>
    </div>
    <div>
      <div class="flex ">
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
  </div>
  {#if questions}
    <SortableList list={questions} key="order" on:sort={sortQuestions} let:item>
      <EditQuestion q={item} on:updateQuestion={updateQuestion} />
    </SortableList>
    <!-- {#each questions as q (q.order)}
      <EditQuestion {q} />
    {/each} -->
  {/if}
</div>
