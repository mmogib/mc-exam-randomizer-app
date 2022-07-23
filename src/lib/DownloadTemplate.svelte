<script lang="ts">
  import { save, open, message as diagMesg } from "@tauri-apps/api/dialog";
  import { writeTextFile, readTextFile } from "@tauri-apps/api/fs";
  import { WizardState, type ExamSettings, type TemplateExt } from "../types";
  import {
    tex_template,
    csv_template,
    txt_template,
    tex_template_with_image,
    tex_template_with_plots,
  } from "../template";
  import {
    wizard_state,
    setting,
    store_exam,
    store_frozen_options,
  } from "../store";

  let res_dir = "";
  let number_of_questions = 4;
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
  interface DownTemplateOptions {
    images: number;
    plots: number;
  }
  const downloadTemplate =
    (
      extenstion: TemplateExt,
      options: DownTemplateOptions = { images: 0, plots: 0 }
    ) =>
    async () => {
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
          if (options.images === 0 && options.plots === 0) {
            await writeTextFile(save_path, tex_template(number_of_questions));
          } else {
            if (options.images > 0) {
              await writeTextFile(
                save_path,
                tex_template_with_image(number_of_questions)
              );
            }
            if (options.plots > 0) {
              await writeTextFile(
                save_path,
                tex_template_with_plots(number_of_questions)
              );
            }
          }
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
<div class="col-span-2 flex flex-col">
  <div class="grid grid-cols-2 mt-16 gap-5 ">
    <div
      class="w-3/4 col-span-2 mx-auto border border-gray-300 h-32 rounded-xl p-5"
    >
      <div class="flex justify-between">
        <label
          for="minmax-range"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >How many questions you need in the template? ({number_of_questions})?
        </label>
        <button
          disabled={number_of_questions === 100}
          on:click={() => {
            number_of_questions =
              number_of_questions < 100
                ? number_of_questions + 1
                : number_of_questions;
          }}
          type="button"
          class="text-purple-700 border border-purple-700 hover:bg-purple-700 hover:text-white 
          focus:ring-4 focus:outline-none focus:ring-purple-300 
          font-medium 
          rounded-full 
          text-sm p-2.5 
          text-center 
          inline-flex 
          items-center dark:border-purple-500 
          dark:text-purple-500 dark:hover:text-white 
          dark:focus:ring-purple-800"
        >
          <svg
            class="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 15l7-7 7 7"
            /></svg
          >
          <span class="sr-only">Increase the number of questions</span>
        </button>
      </div>
      <input
        id="minmax-range"
        type="range"
        min="4"
        max="100"
        step="1"
        bind:value={number_of_questions}
        class="w-full h-2 bg-purple-200 rounded-lg appearance-none 
         
          cursor-pointer dark:bg-purple-700"
      />
      <div class="flex justify-end">
        <button
          disabled={number_of_questions === 4}
          on:click={() => {
            number_of_questions =
              number_of_questions < 4
                ? number_of_questions
                : number_of_questions - 1;
          }}
          type="button"
          class="text-purple-700 border border-purple-700 hover:bg-purple-700 hover:text-white 
          focus:ring-4 focus:outline-none focus:ring-purple-300 
          font-medium 
          rounded-full 
          text-sm p-2.5 
          text-center 
          inline-flex 
          items-center dark:border-purple-500 
          dark:text-purple-500 dark:hover:text-white 
          dark:focus:ring-purple-800"
        >
          <svg
            class="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            /></svg
          >
          <span class="sr-only">Increase the number of questions</span>
        </button>
      </div>
    </div>
    <div class="w-3/4 col-span-2 flex flex-wrap justify-between mx-auto">
      <div
        class="w-1/3 h-32  flex flex-col justify-between p-2 m-4 border border-gray-200 rounded-xl "
      >
        <button
          on:click={downloadTemplate("TEX")}
          class="text-xl text-center underline underline-light-600"
          >Download Latex Template
        </button>
        <p class="text-center font-bold">
          ({number_of_questions} questions)
        </p>
      </div>
      <div
        class="w-1/3 h-32  flex flex-col justify-between p-2 m-4 border border-gray-200 rounded-xl"
      >
        <button
          on:click={downloadTemplate("TEX", { images: 1, plots: 0 })}
          class="text-xl text-center underline underline-light-600"
          >Download Latex Template with Images
        </button>
        <p class="text-center font-bold">
          ({number_of_questions} questions)
        </p>
      </div>

      <div
        class="w-1/3 h-32  flex flex-col justify-between p-2 m-4 border border-gray-200 rounded-xl"
      >
        <button
          on:click={downloadTemplate("TEX", { images: 0, plots: 1 })}
          class=" text-xl text-center underline underline-light-600"
          >Download Latex Template with Plots
        </button>
        <p class="text-center font-bold">
          ({number_of_questions} questions)
        </p>
      </div>
      <div
        class="w-1/3 h-32 flex flex-col justify-between p-2 m-4 border border-gray-200 rounded-xl"
      >
        <button
          on:click={downloadTemplate("CSV")}
          class=" text-xl text-center underline underline-light-600"
        >
          Download CSV Template <p>(Comma-Separated)</p>
        </button>
        <p class="text-center font-bold">
          ({number_of_questions} questions)
        </p>
      </div>
      <div
        class="w-1/3 h-32  flex flex-col justify-between p-2 m-4 border border-gray-200 rounded-xl"
      >
        <button
          on:click={downloadTemplate("TXT")}
          class=" text-xl text-center underline underline-light-600"
        >
          Download TXT Template <p>(Tab-Separated)</p>
        </button>
        <p class="text-center font-bold">
          ({number_of_questions} questions)
        </p>
      </div>
    </div>
  </div>
</div>

<div />
