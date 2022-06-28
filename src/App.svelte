<script lang="ts">
  import { onMount } from "svelte";
  import { fade, slide } from "svelte/transition";

  import FileUpload from "./lib/FileUpload.svelte";
  import ExamSettings from "./lib/ExamSettings.svelte";
  import DownloadExam from "./lib/DownloadExam.svelte";
  import { getSettings, setting, wizard_state } from "./store";
  import { WizardState } from "./types";

  let w_state: WizardState = WizardState.NEW;

  $: w_state = $wizard_state;

  onMount(async () => {
    const s = await getSettings();
    setting.update((v) => ({ ...v, ...s }));
  });
</script>

<main
  class="relative container mx-auto p-6 my-5 border border-light-300 border"
>
  <h1 class="text-2xl text-center font-bold">Multiple Choice Exam Only</h1>
  <div
    class="flex  justify-between 
  border border-transparent border-b-orange-700
  "
  >
    <div
      class="text-gray-500 p-4 rounded"
      class:text-red-600={w_state === WizardState.NEW}
      class:bg-blue-100={w_state === WizardState.NEW}
    >
      Step 1
    </div>
    <div
      class="text-gray-500 p-4 rounded"
      class:text-red-600={w_state === WizardState.FILL_SETTING}
      class:bg-blue-100={w_state === WizardState.FILL_SETTING}
    >
      Step 2
    </div>
    <div
      class="text-gray-500 p-4 rounded"
      class:text-red-600={w_state === WizardState.DOWNLOAD_EXAM}
      class:bg-blue-100={w_state === WizardState.DOWNLOAD_EXAM}
    >
      Step 3
    </div>
  </div>
  <div class="grid grid-cols-2  gap-2 mt-5">
    {#if w_state === WizardState.NEW}
      <div class="col-span-2" transition:slide>
        <FileUpload />
      </div>
    {/if}
    {#if w_state === WizardState.FILL_SETTING}
      <div class="col-span-2" transition:slide>
        <ExamSettings />
      </div>
    {/if}
    {#if w_state === WizardState.DOWNLOAD_EXAM}
      <div class="col-span-2" transition:slide>
        <DownloadExam />
      </div>
    {/if}
  </div>
</main>
