<script lang="ts">
  import { save, message as diagMesg } from "@tauri-apps/api/dialog";
  import { onMount } from "svelte";
  import { writeTextFile } from "@tauri-apps/api/fs";

  import { exam_string, store_exam, wizard_state, setting } from "../store";
  import { FrontExam, Question, WizardState } from "../types";
  import { parse_exam } from "../functions";
  import ShowQuestions from "./ShowQuestions.svelte";
  import EditQuestion from "./EditQuestion.svelte";

  enum ToggleQuestion {
    None,
    All,
    One,
  }
  let exam: string;
  let content: FrontExam;
  let display_questions: ToggleQuestion = ToggleQuestion.None;
  let active_q: Question;

  onMount(() => {
    exam_string.subscribe((v) => {
      exam = v;
    });
    store_exam.subscribe((v) => {
      content = v;
    });
  });

  const saveExamSetting = async () => {
    try {
      const saved_setting_file = await save({
        title: "Save your setting",
        filters: [
          {
            name: "Config",
            extensions: ["conf"],
          },
        ],
      });
      await get_parsed_exam();
      await writeTextFile(
        saved_setting_file,
        JSON.stringify({ setting: $setting, exam: content })
      );
    } catch (error) {
      await diagMesg(error, { title: "MC Shuffler Error", type: "error" });
    } finally {
      await diagMesg("Great! Your setting has been saved.", {
        title: "Success",
        type: "info",
      });
    }
  };
  const downloadExam = async () => {
    const save_path = await save({
      title: "Save Template",
      filters: [
        {
          name: "Latex",
          extensions: ["tex"],
        },
      ],
    });

    try {
      await get_parsed_exam();

      await writeTextFile(save_path, exam);
    } catch (error) {
      await diagMesg(error, { title: "MC Shuffler Error", type: "error" });
    } finally {
      await diagMesg("Great! Your exam has been saved.", {
        title: "Success",
        type: "info",
      });
    }
  };

  const get_parsed_exam = async () => {
    exam = await parse_exam(content, $setting);
  };
  const editQuestions = async () => {
    display_questions = ToggleQuestion.All;
  };
</script>

<div class="mb-6 col-span-2 w-auto text-center">
  <h1 class="text-lg first-letter:text-xl">Your exam is ready.</h1>
  {#if false}
    <button
      on:click={editQuestions}
      type="button"
      class="text-green 
  
  hover:bg-green-800 hover:text-white
  focus:ring-4 
  focus:ring-green-300 
  
  text-lg 
  rounded-lg 
  
  px-5 py-2.5 mr-2 mb-2 
  underline underline-light-600
  dark:bg-green-600 dark:hover:bg-green-700 
  focus:outline-none dark:focus:ring-green-800"
    >
      Edit Questions</button
    >
  {/if}

  <button
    on:click={downloadExam}
    type="button"
    class="text-green 
  
  hover:bg-green-800 hover:text-white
  focus:ring-4 
  focus:ring-green-300 
  
  text-lg 
  rounded-lg 
  
  px-5 py-2.5 mr-2 mb-2 
  underline underline-light-600
  dark:bg-green-600 dark:hover:bg-green-700 
  focus:outline-none dark:focus:ring-green-800"
  >
    Download</button
  >

  <button
    on:click={saveExamSetting}
    type="button"
    class="text-green 
  
  hover:bg-green-800 hover:text-white
  focus:ring-4 
  focus:ring-green-300 
  
  text-lg 
  rounded-lg 
  
  px-5 py-2.5 mr-2 mb-2 
  underline underline-light-600
  dark:bg-green-600 dark:hover:bg-green-700 
  focus:outline-none dark:focus:ring-green-800"
  >
    Save Setting</button
  >
  <button
    on:click={() => {
      wizard_state.set(WizardState.DOWNLOAD_TEMPLATE);
    }}
    type="button"
    class="text-green 
  
  hover:bg-green-800 hover:text-white
  focus:ring-4 
  focus:ring-green-300 
  
  text-lg 
  rounded-lg 
  
  px-5 py-2.5 mr-2 mb-2 
  underline underline-light-600
  dark:bg-green-600 dark:hover:bg-green-700 
  focus:outline-none dark:focus:ring-green-800"
  >
    Start Over</button
  >
  {#if display_questions === ToggleQuestion.All}
    <ShowQuestions
      on:set-active-q={(e) => {
        display_questions = ToggleQuestion.One;
        active_q = e.detail.q;
      }}
    />
  {/if}
  {#if display_questions === ToggleQuestion.One && active_q}
    <EditQuestion q={active_q} />
  {/if}
</div>
