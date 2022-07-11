<script lang="ts">
  import { save, open, message as diagMesg } from "@tauri-apps/api/dialog";
  import { writeTextFile, readTextFile } from "@tauri-apps/api/fs";
  import { WizardState, type ExamSettings, type TemplateExt } from "../types";
  import { tex_template, csv_template, txt_template } from "../constants";
  import { wizard_state, setting, store_exam } from "../store";

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
      if (save_path) {
        await writeTextFile(save_path, tex_template);
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
        await writeTextFile(save_path, txt_template);
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
        await writeTextFile(save_path, csv_template);
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
