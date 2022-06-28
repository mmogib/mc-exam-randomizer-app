<script lang="ts">
  import { open, save } from "@tauri-apps/api/dialog";
  import { writeTextFile } from "@tauri-apps/api/fs";
  import { TemplateExt, WizardState } from "../types";

  import { tex_template, csv_template } from "../constants";
  import { questions_file_path, wizard_state } from "../store";

  const uploadQuestionsFromFile = async () => {
    const source_filename: string = (await open({
      filters: [
        {
          name: "Tex/CSV",
          extensions: ["tex", "csv"],
        },
      ],
    })) as string;
    questions_file_path.set(source_filename);
    wizard_state.set(WizardState.FILL_SETTING);
  };

  const downloadTemplate = (extenstion: TemplateExt) => async () => {
    if (extenstion === "TEX") {
      const save_path = await save({
        title: "Save Template",
        filters: [
          {
            name: "Latex",
            extensions: ["tex"],
          },
        ],
      });
      await writeTextFile(save_path, tex_template);
    } else {
      const save_path = await save({
        title: "Save Template",
        filters: [
          {
            name: "CSV",
            extensions: ["csv"],
          },
        ],
      });
      await writeTextFile(save_path, csv_template);
    }
    return;
  };
</script>

<div class="col-span-2 flex justify-center ">
  <button
    on:click={downloadTemplate("TEX")}
    class=" text-center underline underline-light-600 mx-10"
    >Download Latex Template
  </button>
  <button
    on:click={downloadTemplate("CSV")}
    class=" text-center underline underline-light-600 mx-10"
  >
    Download CSV Template
  </button>
</div>

<div
  class="mt-5 
    border border-blue-900
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
