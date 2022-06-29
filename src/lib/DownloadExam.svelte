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
  } from "../store";
  import { FrontExam, TemplateExt, WizardState } from "../types";
  import { parse_exam } from "../functions";

  let exam: string;

  onMount(() => {
    exam_string.subscribe((v) => {
      exam = v;
    });
  });
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
    const ext = await extname($questions_file_path);

    let content: FrontExam;

    try {
      if (ext === "tex") {
        content = (await invoke("read_tex", {
          filename: $questions_file_path,
        })) as FrontExam;
      } else {
        content = (await invoke("read_csv", {
          filename: $questions_file_path,
        })) as FrontExam;
      }
      exam = await parse_exam(
        content,
        $questions_file_path,
        $setting,
        ext.toLocaleUpperCase() as TemplateExt
      );
      exam_string.set(exam);
      await writeTextFile(save_path, exam);
    } catch (error) {
      await diagMesg(error, { title: "MC Shuffler Error", type: "error" });
    } finally {
      wizard_state.set(WizardState.NEW);
    }
  };
</script>

<div class="mb-6 col-span-2 w-auto border text-center">
  <p>Your exam is ready.</p>
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
</div>
