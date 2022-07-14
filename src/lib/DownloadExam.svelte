<script lang="ts">
  import { save, message as diagMesg } from "@tauri-apps/api/dialog";

  import { writeTextFile } from "@tauri-apps/api/fs";

  import {
    store_exam,
    wizard_state,
    setting,
    exam_string,
    store_frozen_options,
  } from "../store";
  import { type FrontExam, WizardState } from "../types";
  import { parse_master_only } from "../functions";
  import NavigationButton from "../components/NavigationButton.svelte";

  let content: FrontExam = $store_exam;
  let exam: string = $exam_string;

  const saveExamSetting = async () => {
    const saved_setting_file = await save({
      title: "Save your setting",
      filters: [
        {
          name: "Config",
          extensions: ["conf"],
        },
      ],
    });
    if (saved_setting_file) {
      try {
        await writeTextFile(
          saved_setting_file,
          JSON.stringify({
            setting: $setting,
            exam: content,
            options_order: $store_frozen_options,
          })
        );
      } catch (error) {
        await diagMesg(error, { title: "MC Shuffler Error", type: "error" });
      } finally {
        await diagMesg("Great! Your setting has been saved.", {
          title: "Success",
          type: "info",
        });
      }
    }
  };

  const downloadAsTemplate = async () => {
    const save_path = await save({
      title: "Save As Template",
      filters: [
        {
          name: "Latex",
          extensions: ["tex"],
        },
      ],
    });
    if (save_path) {
      try {
        const master = await parse_master_only(content, $setting);
        await writeTextFile(save_path, master);
      } catch (error) {
        await diagMesg(error, { title: "MC Shuffler Error", type: "error" });
      } finally {
        await diagMesg("Great! Your exam tempalte has been saved.", {
          title: "Success",
          type: "info",
        });
      }
    }
  };
  const downloadExam = async () => {
    const save_path = await save({
      title: "Save Exam",
      filters: [
        {
          name: "Latex",
          extensions: ["tex"],
        },
      ],
    });

    try {
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
</script>

<div class="flex flex-col h-72   mx-auto mb-6 col-span-2 text-center">
  <div class="my-4 text-xl">
    <div
      class="flex items-center p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
      role="alert"
    >
      <svg
        class="inline flex-shrink-0 mr-2 w-8 h-8 text-lg"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clip-rule="evenodd"
        /></svg
      >
      <div class="text-lg">
        <span class="font-medium">Congadurations!</span> Your exam is ready.
      </div>
    </div>
  </div>
  <div class=" first:w-full float-right text-right">
    <NavigationButton
      text="Go Back"
      action={() => {
        wizard_state.set(WizardState.GROUP_QUESTIONS);
      }}
    />
    <NavigationButton
      text="Start Over"
      action={() => {
        wizard_state.set(WizardState.DOWNLOAD_TEMPLATE);
      }}
    />
  </div>
  <div class=" flex flex-1 justify-evenly text-center items-start mt-8">
    <button on:click={downloadExam} type="button" class="btn w-1/4">
      Download</button
    >
    <button on:click={downloadAsTemplate} type="button" class="btn w-1/4">
      Download As Template</button
    >
    <button on:click={saveExamSetting} type="button" class="btn w-1/4">
      Save Setting</button
    >

    <form action="https://www.overleaf.com/docs" method="post" target="_blank">
      <textarea hidden={true} rows="8" cols="60" name="snip">{exam}</textarea>
      <input class="btn " type="submit" value="Open in Overleaf" />
    </form>
  </div>
</div>
