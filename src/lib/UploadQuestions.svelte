<script lang="ts">
  import { open, message as diagMesg } from "@tauri-apps/api/dialog";

  import { FrontExam, WizardState } from "../types";

  import {
    questions_file_path,
    wizard_state,
    store_exam,
    setting,
    exam_string,
  } from "../store";
  import { extname } from "@tauri-apps/api/path";
  import { invoke } from "@tauri-apps/api";
  import { parse_exam } from "../functions";

  const uploadQuestionsFromFile = async () => {
    const source_filename = (await open({
      filters: [
        {
          name: "Tex/CSV/TEXT",
          extensions: ["tex", "csv", "txt"],
        },
      ],
    })) as string;
    if (source_filename) {
      try {
        const ext = await extname(source_filename);

        let content: FrontExam;
        if (ext === "tex") {
          content = (await invoke("read_tex", {
            filename: source_filename,
          })) as FrontExam;
        } else if (ext === "txt") {
          content = (await invoke("read_txt", {
            filename: source_filename,
          })) as FrontExam;
        } else {
          content = (await invoke("read_csv", {
            filename: source_filename,
          })) as FrontExam;
        }

        questions_file_path.set(source_filename);
        store_exam.set(content);
        const exam = await parse_exam(content, $setting);
        exam_string.set(exam);

        wizard_state.set(WizardState.FILL_SETTING);
      } catch (error) {
        diagMesg(error, {
          title: "Error",
          type: "error",
        });
      }
    }
  };
</script>

<div
  class="mt-5 
   
    p-5
    col-span-2 flex  flex-col text-center w-auto justify-center "
>
  <p>Write your questions according to the template and upload</p>
  <button
    on:click={uploadQuestionsFromFile}
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
    Upload Questions</button
  >
</div>
