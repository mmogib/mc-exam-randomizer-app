<script lang="ts">
  import { message as diagMesg } from "@tauri-apps/api/dialog";
  import { setting, store_exam, wizard_state } from "../store";
  import { type Question, WizardState, type ValidationError } from "../types";
  let questions: [Question] = $store_exam.questions;
  let groups: string = $setting.groups;
  const goNext = () => {
    const validation = validateGroups();
    if (validation.valid === "valid") {
      setting.update((v) => ({ ...v, groups }));
      store_exam.update((v) => ({ ...v, questions }));
      wizard_state.set(WizardState.DOWNLOAD_EXAM);
    } else {
      diagMesg(validation.message, {
        title: "Validation Error",
        type: "error",
      });
    }
  };
  const validateGroups = (): ValidationError => {
    const num_of_questions = questions.length;
    const groups_arr = groups.split(",");
    if (groups_arr.length < 1) {
      return { message: "Please check the groups field", valid: "invalid" };
    }
    let group_numbers = groups_arr
      .map((v) => parseInt(v))
      .filter((v) => Number.isInteger(v));
    if (groups_arr.length === 1 && group_numbers[0] === 1) {
      group_numbers = [num_of_questions];
    }

    const number_of_questions_in_groups = group_numbers.reduce(
      (acc, v) => acc + v,
      0
    );
    if (num_of_questions !== number_of_questions_in_groups) {
      return {
        message: `Number of questions ${num_of_questions} whereas your groups includes ${number_of_questions_in_groups} questions`,
        valid: "invalid",
      };
    }

    const groups_running_total = group_numbers.map((v, i) => {
      if (i === 0) {
        return v;
      }
      return v + group_numbers.slice(0, i).reduce((acc, v) => acc + v, 0);
    });

    const qs = questions.slice(0).map((v, i) => {
      const group = groups_running_total
        .map((v2, i2) => {
          if (i < v2) {
            return i2 + 1;
          } else {
            return 0;
          }
        })
        .filter((v2) => v2 !== 0)[0];
      return { ...v, group };
    });
    questions = [...qs] as [Question];
    return { valid: "valid", message: "✔" };
  };
</script>

<div class="flex flex-col">
  <div class="flex justify-center items-start">
    <div class="w-3/4">
      <h1 class="text-lg font-bold mb-2">Questions Grouping</h1>
      <p>
        Here you can put your questions in groups. Each group will be randomized
        within that group. Assume for example you have 8 question and you have 5
        questions in group 1, and 3 questions in group 2, the questions will be
        randomized in the following manner: The first group will be randomized
        and will appear in the first five positions in the exam. The second
        group will be randomized and will appear in the next three positions in
        the exam.
      </p>
    </div>
    <div class="w-1/4">
      <div class="flex justify-end">
        <button
          on:click={() => {
            wizard_state.set(WizardState.ORDER_OPTIONS);
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
  <div class="mb-6">
    <div class="flex justify-between">
      <label for="groups" class="block mb-2 text-lg font-medium "
        >Grouping</label
      >
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-500">
        <span class="font-medium"
          >number of questions {questions.length || ""}
        </span>
      </p>
    </div>
    <input
      type="text"
      id="groups"
      bind:value={groups}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-500">
      <span class="font-medium">comma sparated numbers, like: 5,5,6</span>
    </p>
  </div>
</div>
