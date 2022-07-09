<script lang="ts">
  import { saveSetting, setting, wizard_state, store_exam } from "../store";
  import { message as diagMesg } from "@tauri-apps/api/dialog";
  import {
    type FrontExam,
    type Setting,
    WizardState,
    type ValidationError,
  } from "../types";

  let exam_setting: Setting;
  let current_exam: FrontExam;
  store_exam.subscribe((v) => {
    current_exam = v;
  });
  setting.subscribe((v) => {
    exam_setting = v;
  });

  const validateSetting = (): ValidationError => {
    if (
      exam_setting.university === "" ||
      exam_setting.coursecode === "" ||
      exam_setting.department === "" ||
      !exam_setting.examdate ||
      exam_setting.examname === "" ||
      !Number.isInteger(exam_setting.numberofvestions) ||
      exam_setting.numberofvestions <= 0 ||
      exam_setting.timeallowed === "" ||
      exam_setting.term === ""
    ) {
      return {
        message: "Please fill in all the fields correctly",
        valid: "invalid",
      };
    }

    return { valid: "valid", message: "" };
  };
  const errMsg = async (message: string) =>
    diagMesg(message, {
      title: "Validation Error",
      type: "error",
    });
  const saveMySetting = async () => {
    const { message, valid } = validateSetting();
    if (valid === "valid") {
      await saveSetting(exam_setting);
      setting.set(exam_setting);
      store_exam.set(current_exam);
    } else {
      await errMsg(message);
    }
  };

  const goNext = async () => {
    const { message, valid } = validateSetting();
    if (valid === "valid") {
      await saveSetting(exam_setting);
      setting.set(exam_setting);
      store_exam.set(current_exam);
      wizard_state.set(WizardState.ORDER_OPTIONS);
    } else {
      await errMsg(message);
    }
  };

  const goPrevious = async () => {
    const { message, valid } = validateSetting();
    if (valid === "valid") {
      await saveSetting(exam_setting);
      setting.set(exam_setting);
      store_exam.set(current_exam);
      wizard_state.set(WizardState.NEW);
    } else {
      await errMsg(message);
    }
  };
</script>

<div
  class="mt-1 
   w-full
    col-span-2 flex   text-center  justify-between"
>
  <button on:click={goPrevious} type="button" class="btn"> Previous</button>
  <button on:click={saveMySetting} type="button" class="btn"> Save</button>
  <button on:click={goNext} type="button" class="btn"> Next</button>
</div>
<div class="my-6">
  <label
    for="university"
    class="block mb-2 text-lg font-medium 
    ">University</label
  >
  <input
    type="text"
    id="university"
    bind:value={exam_setting.university}
    class="bg-gray-50 border border-gray-300 
    text-gray-900 text-sm rounded-lg 
    focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
</div>

<div class="mb-6">
  <label for="department" class="block mb-2 text-lg font-medium "
    >Department</label
  >
  <input
    type="text"
    id="department"
    bind:value={exam_setting.department}
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
</div>

<div class="mb-6">
  <label for="exam-term" class="block mb-2 text-lg font-medium ">Term</label>
  <input
    type="text"
    bind:value={exam_setting.term}
    id="exam-term"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
</div>

<div class="mb-6">
  <label for="coursecode" class="block mb-2 text-lg font-medium "
    >Course Code</label
  >
  <input
    type="text"
    id="coursecode"
    bind:value={exam_setting.coursecode}
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
</div>
<div class="mb-6">
  <label for="exam-name" class="block mb-2 text-lg font-medium "
    >Exam Name</label
  >
  <input
    type="text"
    id="exam-name"
    bind:value={exam_setting.examname}
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
</div>

<div class="mb-6">
  <label for="exam-date" class="block mb-2 text-lg font-medium "
    >Exam Date</label
  >
  <input
    type="date"
    id="exam-date"
    bind:value={exam_setting.examdate}
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
</div>

<div class="mb-6">
  <label for="time-allowed" class="block mb-2 text-lg font-medium "
    >Time Allowed</label
  >
  <input
    type="text"
    bind:value={exam_setting.timeallowed}
    id="time-allowed"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
</div>

<div class="mb-6">
  <label for="versions" class="block mb-2 text-lg font-medium "
    >Number of Versions</label
  >
  <input
    type="number"
    id="versions"
    bind:value={exam_setting.numberofvestions}
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
</div>
