<script lang="ts">
  import { invoke } from "@tauri-apps/api";
  import { save, message as diagMesg } from "@tauri-apps/api/dialog";
  import { extname } from "@tauri-apps/api/path";
  import { onMount } from "svelte";
  import { writeTextFile } from "@tauri-apps/api/fs";

  import {
    exam_string,
    questions_file_path,
    wizard_state,
    setting,
    store_processing,
  } from "../store";
  import {
    FrontExam,
    Processing,
    Question,
    TemplateExt,
    WizardState,
  } from "../types";
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
  let processing_type: Processing;
  let display_questions: ToggleQuestion = ToggleQuestion.None;
  let active_q: Question;

  store_processing.subscribe((v) => {
    processing_type = v;
  });

  onMount(() => {
    exam_string.subscribe((v) => {
      exam = v;
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
        JSON.stringify({ ...$setting, exam: content })
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
      exam_string.set(exam);
      await writeTextFile(save_path, exam);
    } catch (error) {
      await diagMesg(error, { title: "MC Shuffler Error", type: "error" });
    } finally {
      await diagMesg("Great! Your exam has been saved.", {
        title: "Success",
        type: "info",
      });
      wizard_state.set(WizardState.NEW);
    }
  };

  const get_parsed_exam = async () => {
    if (processing_type === Processing.OLD) {
      content = $setting.exam;
    } else {
      const ext = await extname($questions_file_path);

      if (ext === "tex") {
        content = (await invoke("read_tex", {
          filename: $questions_file_path,
        })) as FrontExam;
      } else if (ext === "txt") {
        content = (await invoke("read_txt", {
          filename: $questions_file_path,
        })) as FrontExam;
      } else {
        content = (await invoke("read_csv", {
          filename: $questions_file_path,
        })) as FrontExam;
      }
    }
    exam = await parse_exam(content, $questions_file_path, $setting);
  };
  const editQuestions = async () => {
    display_questions = ToggleQuestion.All;
  };
</script>

<div class="mb-6 col-span-2 w-auto border text-center">
  <p>Your exam is ready.</p>
  <button
    on:click={editQuestions}
    type="button"
    class="text-blue 
  
  hover:bg-blue-800 hover:text-white
  focus:ring-4 
  focus:ring-blue-300 
  
  text-lg 
  rounded-lg 
  
  px-5 py-2.5 mr-2 mb-2 
  underline underline-light-600
  dark:bg-blue-600 dark:hover:bg-blue-700 
  focus:outline-none dark:focus:ring-blue-800"
  >
    Edit Questions</button
  >
  <button
    on:click={downloadExam}
    type="button"
    class="text-blue 
  
  hover:bg-blue-800 hover:text-white
  focus:ring-4 
  focus:ring-blue-300 
  
  text-lg 
  rounded-lg 
  
  px-5 py-2.5 mr-2 mb-2 
  underline underline-light-600
  dark:bg-blue-600 dark:hover:bg-blue-700 
  focus:outline-none dark:focus:ring-blue-800"
  >
    Download</button
  >

  <button
    on:click={saveExamSetting}
    type="button"
    class="text-blue 
  
  hover:bg-blue-800 hover:text-white
  focus:ring-4 
  focus:ring-blue-300 
  
  text-lg 
  rounded-lg 
  
  px-5 py-2.5 mr-2 mb-2 
  underline underline-light-600
  dark:bg-blue-600 dark:hover:bg-blue-700 
  focus:outline-none dark:focus:ring-blue-800"
  >
    Save Setting</button
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
