<script lang="ts">
  import { save, open, message as diagMesg } from "@tauri-apps/api/dialog";
  import { writeTextFile, readTextFile } from "@tauri-apps/api/fs";
  import { ExamSettings, Setting, TemplateExt, WizardState } from "../types";

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

<div class="col-span-2 flex flex-col justify-center ">
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
          w-1/4 
          bg-green-900
          rounded-lg
          p-2
          my-1
          mx-4
          text-lg
           text-white">Start</button
    >

    <button
      on:click={openSavedSetting}
      class="text-center 
          w-1/4 
          bg-green-900
          rounded-lg
          p-2
          my-1
          mx-4
          text-lg
           text-white">Open Old Exam</button
    >
  </div>
  <div class="mb-10">
    This app is designed to produce multiple choice exam with randomized
    questions and randomized choices. Each question needs to have a body and
    choices (answers). For example
    <blockquote class="ml-4  p-4 bg-gray-100">
      What is 1 + 1?

      <ul>
        <li>2</li>
        <li>1</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
      </ul>
    </blockquote>
    The body of the question is<span class="bg-gray-100 ml-1">
      What is 1 + 1?</span
    >
    and the options are
    <span class="bg-gray-100">2,1,3,4,5</span>. In order to use this, you need
    upload your questions in a specific format. The formats supported so far are
    <ul class="p-5 list-disc">
      <li>
        <span class="font-extrabold">LaTeX</span>
        <p>
          You need to format your question according to the follwoing convention
          (see the file below). For example you may write the above example as
        </p>
        <pre class="mt-4 p-4 bg-gray-100 rounded-md">{q}</pre>
        Note the question body has to between the tags<span class="font-bold"
          >{qTags.qS}</span
        >
        before the body and <span class="font-bold">{qTags.qE}</span> after the
        body. Also each answer is between the tags
        <span class="font-bold">{qTags.oS}</span>
        and <span class="font-bold">{qTags.oE}</span>.
        <p class="font-bold text-red-800 mt-2">
          Each tag is on a separate line. Further the correct answer is always
          the first one.
        </p>
        <p class="font-bold mt-2 text-red-800">
          You can add your own packaged between the tags <span class="font-bold"
            >{qTags.pS}</span
          >
          and <span class="font-bold">{qTags.pE}</span>
        </p>
      </li>
      <li>
        <span class="font-extrabold">CSV/TEXT</span>
        <p>
          This option is simpler. You can use Excel sheet without header. The
          first column contains the question body. Each subsequent column
          contains an answer. The first is always the correct answer. Then save
          your file as `tab-delimited` text file or a `comma-separated` csv
          file. The resulting file should be similar to the file template below.
        </p>
      </li>
    </ul>
  </div>
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
      Download CSV Template (Comma-Separated)
    </button>
    <button
      on:click={downloadTemplate("TXT")}
      class=" text-center underline underline-light-600 mx-10"
    >
      Download TXT Template (Tab-Separated)
    </button>
  </div>
</div>
