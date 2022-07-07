<script lang="ts">
  import { save, message as diagMesg } from "@tauri-apps/api/dialog";
  import { onMount } from "svelte";
  import { writeTextFile } from "@tauri-apps/api/fs";

  import { store_exam, wizard_state, setting } from "../store";
  import { type FrontExam, WizardState } from "../types";
  import { parse_exam, parse_master_only } from "../functions";

  let content: FrontExam;
  let exam: string;

  onMount(() => {
    store_exam.subscribe(async (v) => {
      content = v;
      exam = await parse_exam(content, $setting);
    });
  });

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
    <span>Your exam is ready.</span>
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
  <div class=" first:w-full float-right text-right">
    <button
      on:click={() => {
        wizard_state.set(WizardState.ORDER_OPTIONS);
      }}
      type="button"
      class="btn w-1/4"
    >
      Go back</button
    >
    <button
      on:click={() => {
        wizard_state.set(WizardState.DOWNLOAD_TEMPLATE);
      }}
      type="button"
      class="btn w-1/4"
    >
      Start over</button
    >
  </div>
</div>
