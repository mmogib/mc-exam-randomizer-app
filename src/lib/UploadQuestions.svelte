<script lang="ts">
  import { open, message as diagMesg } from "@tauri-apps/api/dialog";

  import { type FrontExam, WizardState, type Setting } from "../types";

  import {
    questions_file_path,
    wizard_state,
    store_exam,
    setting,
    exam_string,
    store_frozen_options,
  } from "../store";
  import { extname } from "@tauri-apps/api/path";
  import { invoke } from "@tauri-apps/api";
  import {
    get_question_groups,
    order_questions_by_groups,
    parse_exam,
  } from "../functions";

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
      let tex_settings: Setting | null = null;
      try {
        const ext = await extname(source_filename);

        let content: FrontExam | null = null;
        if (ext === "tex") {
          const tex_back = await invoke("read_tex", {
            filename: source_filename,
          });
          content = tex_back[0] as FrontExam;
          tex_settings = tex_back[1] as Setting;
        } else if (ext === "txt") {
          content = (await invoke("read_txt", {
            filename: source_filename,
          })) as FrontExam;
        } else {
          content = (await invoke("read_csv", {
            filename: source_filename,
          })) as FrontExam;
        }
        if (!content) {
          await diagMesg("Error parsing file", {
            title: "Error Parsing",
            type: "error",
          });
          return;
        }
        content = order_questions_by_groups(content);
        store_exam.set(content);
        questions_file_path.set(source_filename);
        if (tex_settings) {
          setting.set(tex_settings);
        } else {
          const groups = get_question_groups(content);
          setting.update((v) => ({ ...v, groups }));
        }
        store_frozen_options.set({});
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
  <p class="text-xl mb-10">
    Write your questions according to the template and upload
  </p>
  <div class="flex justify-between">
    <button on:click={uploadQuestionsFromFile} type="button" class="btn w-1/2">
      Upload Questions</button
    >
    <button
      on:click={() => {
        wizard_state.set(WizardState.DOWNLOAD_TEMPLATE);
      }}
      type="button"
      class="btn w-1/2"
    >
      Start over</button
    >
  </div>
</div>
