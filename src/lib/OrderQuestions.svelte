<script lang="ts">
  import { message as diagMesg } from "@tauri-apps/api/dialog";
  import SortableList from "svelte-sortable-list";
  import { type Question, WizardState, type ValidationError } from "../types";
  import { store_exam, wizard_state } from "../store";
  import EditQuestion from "./EditQuestion.svelte";
  import NavigationButton from "../components/NavigationButton.svelte";
  let questions: [Question] | null = $store_exam.questions;
  let ketp_in_one_page: number[] = $store_exam.kept_in_one_page
    ? $store_exam.kept_in_one_page
    : [];

  const sortQuestions = (ev) => {
    questions = ev.detail;
    ketp_in_one_page = [];
  };
  const validateQuestions = (): ValidationError => {
    const invalid_qs = questions
      .filter((q) => {
        if (
          q.choices === null ||
          q.choices[1] === undefined ||
          q.choices[1] === null
        ) {
          return true;
        }
      })
      .map((q) => q.order);
    if (invalid_qs.length > 0) {
      return {
        message: `Please check the questions ${invalid_qs.join(", ")}`,
        valid: "invalid",
      };
    }
    return {
      valid: "valid",
      message: "",
    };
  };
  const goNext = async () => {
    const validation = validateQuestions();
    if (validation.valid === "valid") {
      store_exam.update((v) => ({
        ...v,
        questions: questions.map((q, i) => ({ ...q, order: i + 1 })) as [
          Question
        ],
        kept_in_one_page: ketp_in_one_page,
      }));
      wizard_state.set(WizardState.GROUP_QUESTIONS);
    } else {
      diagMesg(validation.message, {
        title: "Validation Error",
        type: "error",
      });
    }
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

  const keepInOnePage = (e) => {
    const q = e.detail as Question;

    if (ketp_in_one_page && ketp_in_one_page.includes(q.order)) {
      ketp_in_one_page = ketp_in_one_page.filter((v) => v !== q.order);
    } else {
      ketp_in_one_page = [...ketp_in_one_page, q.order];
    }
  };
</script>

<div class="flex flex-col ">
  <div class="flex items-center justify-between">
    <div class="w-1/2">
      <h1 class="text-lg font-bold">Order Questions</h1>
      <p>
        Take a minute to revise the order of the questions and the correct
        option for each question and then click NEXT.
      </p>
      <div class="font-semibold">You can re-order by dragging and dropping</div>
    </div>
    <div>
      <div class="flex ">
        <NavigationButton
          text="Go Back"
          action={() => wizard_state.set(WizardState.FILL_SETTING)}
        />

        <NavigationButton text="Next" action={goNext} />
      </div>
    </div>
  </div>
  {#if questions}
    <SortableList list={questions} key="order" on:sort={sortQuestions} let:item>
      <EditQuestion
        q={item}
        on:updateQuestion={updateQuestion}
        on:keepInOnePage={keepInOnePage}
        keepInOnePage={ketp_in_one_page.includes(item.order)}
      />
    </SortableList>
  {/if}
</div>
