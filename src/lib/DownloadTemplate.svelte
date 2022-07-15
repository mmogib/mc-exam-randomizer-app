<script lang="ts">
  import { save, open, message as diagMesg } from "@tauri-apps/api/dialog";
  import { writeTextFile, readTextFile } from "@tauri-apps/api/fs";
  import { WizardState, type ExamSettings, type TemplateExt } from "../types";
  import { tex_template, csv_template, txt_template } from "../constants";
  import {
    wizard_state,
    setting,
    store_exam,
    store_frozen_options,
  } from "../store";

  let number_of_questions = 6;
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
        store_frozen_options.set(exam_setting.options_order || {});

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
      if (save_path) {
        await writeTextFile(save_path, tex_template(number_of_questions));
      } else {
        return;
      }
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
      if (save_path) {
        await writeTextFile(save_path, txt_template(number_of_questions));
      } else {
        return;
      }
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
      if (save_path) {
        await writeTextFile(save_path, csv_template(number_of_questions));
      } else {
        return;
      }
    }
    wizard_state.set(WizardState.NEW);

    return;
  };
</script>

<div class="col-span-1 flex flex-row text-center justify-between">
  <button
    on:click={() => {
      store_frozen_options.set({});
      wizard_state.set(WizardState.NEW);
    }}
    class="btn
        w-1/3 
        ">New Exam</button
  >

  <button on:click={openSavedSetting} class="btn w-1/3">Open Old Exam</button>
</div>
<div class="col-span-2 flex flex-col justify-center ">
  <div class="col-span-2 flex flex-col justify-center ">
    <div class="grid grid-cols-2 mt-16 gap-5 ">
      <div class=" h-32  flex flex-col items-start">
        <button
          on:click={downloadTemplate("TEX")}
          class=" text-center underline underline-light-600"
          >Download Latex Template
        </button>
        <p class="text-center font-bold">
          {number_of_questions} questions
        </p>
      </div>
      <div class=" h-32 flex flex-col items-end">
        <button
          on:click={downloadTemplate("CSV")}
          class=" text-center underline underline-light-600"
        >
          Download CSV Template (Comma-Separated)
        </button>
        <p class="text-center font-bold">
          {number_of_questions} questions
        </p>
      </div>
      <div class=" h-32 flex flex-col items-start">
        <button
          on:click={downloadTemplate("TXT")}
          class=" text-center underline underline-light-600"
        >
          Download TXT Template (Tab-Separated)
        </button>
        <p class="text-center font-bold">
          {number_of_questions} questions
        </p>
      </div>

      <div class="border border-gray-300 h-32 rounded-xl p-5">
        <label
          for="minmax-range"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >How many questions you need in the template?
        </label>
        <input
          id="minmax-range"
          type="range"
          min="6"
          max="100"
          step="1"
          bind:value={number_of_questions}
          class="w-full h-2 bg-purple-200 rounded-lg appearance-none 
         
          cursor-pointer dark:bg-purple-700"
        />
      </div>
    </div>
  </div>
</div>
<div />
