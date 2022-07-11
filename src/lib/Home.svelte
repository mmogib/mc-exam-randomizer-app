<script lang="ts">
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { Steps } from "svelte-steps";

  import DownloadTemplate from "./DownloadTemplate.svelte";
  import FileUpload from "./UploadQuestions.svelte";
  import ExamSettings from "./EditExamSettings.svelte";
  import DownloadExam from "./DownloadExam.svelte";
  import { getSettings, setting, wizard_state } from "../store";
  import { WizardState } from "../types";
  import OrderQuestions from "./OrderQuestions.svelte";
  import GroupQuestions from "./GroupQuestions.svelte";

  let w_state: WizardState = WizardState.NEW;
  let steps = [
    { text: "new/open" },
    { text: "upload questions" },
    { text: "exam setting" },
    { text: "questions/options" },
    { text: "download/save  " },
  ];
  let current: number = 0;

  $: w_state = $wizard_state;

  $: current = $wizard_state;

  onMount(async () => {
    const s = await getSettings();
    setting.update((v) => ({ ...v, ...s }));
  });
  const goToStep = (e) => {
    const current_step = e.detail.current;

    let w: WizardState;
    switch (current_step) {
      case 0:
        w = WizardState.DOWNLOAD_TEMPLATE;
        break;
      case 1:
        w = WizardState.NEW;
        break;
      case 2:
        w = WizardState.FILL_SETTING;
        break;
      case 3:
        w = WizardState.ORDER_OPTIONS;
        break;
      case 4:
        w = WizardState.DOWNLOAD_EXAM;
        break;
    }

    wizard_state.set(w);
  };
</script>

<div class=" p-6 my-2 w-full">
  <div class="text-center text-lg m-2 font-semibold">
    {$setting.coursecode}
    {$setting.examname ? `(${$setting.examname})` : ""}
    {$setting.examdate ? `(${new Date($setting.examdate).toDateString()})` : ""}
  </div>

  <div>
    <div class="flex  flex-col justify-between">
      <div>
        <Steps {steps} {current} on:click={goToStep} clickable={false} />
      </div>

      <div class="grid grid-cols-2  gap-2 mt-5">
        {#if w_state === WizardState.DOWNLOAD_TEMPLATE}
          <div class="col-span-2" transition:slide>
            <DownloadTemplate />
          </div>
        {/if}

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

        {#if w_state === WizardState.ORDER_OPTIONS}
          <div class="col-span-2" transition:slide>
            <OrderQuestions />
          </div>
        {/if}

        {#if w_state === WizardState.GROUP_QUESTIONS}
          <div class="col-span-2" transition:slide>
            <GroupQuestions />
          </div>
        {/if}

        {#if w_state === WizardState.DOWNLOAD_EXAM}
          <div class="col-span-2" transition:slide>
            <DownloadExam />
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
