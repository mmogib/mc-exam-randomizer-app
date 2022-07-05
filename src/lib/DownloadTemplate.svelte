<script lang="ts">
  import { save, open, message as diagMesg } from "@tauri-apps/api/dialog";
  import { writeTextFile, readTextFile } from "@tauri-apps/api/fs";
  import { ExamSettings, TemplateExt, WizardState } from "../types";
  import { tex_template, csv_template, txt_template } from "../constants";
  import { wizard_state, setting, store_exam } from "../store";
  let q = `\\documentclass{article}
%{#preamble}
\\usepackage{amsfonts}
\\usepackage{amsmath}
\\usepackage{amssymb}
%{/preamble}
  \\begin{document}  
%{#q}
What is 1 + 1?
%{/q}
\\begin{enumerate}
    \\item
    %{#o}
    2
    %{/o}
    \\item
    %{#o}
    1
    %{/o}
    \\item
    %{#o}
    3
    %{/o}
    \\item
    %{#o}
    4
    %{/o}
    \\item
    %{#o}
    5
    %{/o}
\\end{enumerate}

\\end{document}
`;
  let qTags = {
    qS: `%{#q}`,
    qE: `%{#q}`,
    oS: `%{#o}`,
    oE: `%{#o}`,
    pS: `%{#preamble}`,
    pE: `%{/preamble}`,
  };
  const openSavedSetting = async () => {
    try {
      const saved_file_path = await open({
        title: "Open Saved Exam",
        filters: [
          {
            name: "Config",
            extensions: ["conf"],
          },
        ],
      });
      if (saved_file_path) {
        const exam_setting_string: string = await readTextFile(
          saved_file_path as string
        );
        const exam_setting: ExamSettings = JSON.parse(
          exam_setting_string
        ) as ExamSettings;
        setting.set(exam_setting.setting);
        store_exam.set(exam_setting.exam);

        wizard_state.set(WizardState.FILL_SETTING);
      }
    } catch (error) {
      await diagMesg(error, { title: "Error Opening", type: "error" });
    }
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
    } else if (extenstion === "TXT") {
      const save_path = await save({
        title: "Save Template",
        filters: [
          {
            name: "TEXT",
            extensions: ["txt"],
          },
        ],
      });
      await writeTextFile(save_path, txt_template);
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
    wizard_state.set(WizardState.NEW);

    return;
  };
</script>

<div class="col-span-1 flex flex-row text-center justify-center">
  <button
    on:click={() => {
      store_exam.set({
        name: "",
        ordering: null,
        questions: null,
        preamble: null,
      });
      wizard_state.set(WizardState.NEW);
    }}
    class="text-center 
        w-1/3 
        hover:bg-amber-600
        rounded-lg
        bg-white
        text-amber-600
        p-2
        my-1
        mx-4
        text-2xl
        hover:text-white">Create New Exam</button
  >

  <button
    on:click={openSavedSetting}
    class="text-center
        w-1/3
       hover:bg-purple-900 hover:text-white
       font-semibold
        rounded-lg
        p-2
        my-1
        mx-4
        text-xl
         text-purple-900">Open Old Exam</button
  >
</div>
<div class="col-span-2 flex flex-col justify-center ">
  <div class="col-span-2 flex flex-col justify-center ">
    <button
      on:click={downloadTemplate("TEX")}
      class=" text-center underline underline-light-600 mx-10 my-5"
      >Download Latex Template
    </button>
    <button
      on:click={downloadTemplate("CSV")}
      class=" text-center underline underline-light-600 mx-10 mb-5"
    >
      Download CSV Template (Comma-Separated)
    </button>
    <button
      on:click={downloadTemplate("TXT")}
      class=" text-center underline underline-light-600 mx-10 mb-5"
    >
      Download TXT Template (Tab-Separated)
    </button>
  </div>
</div>
<div />
