<script lang="ts">
  import { saveSetting, setting, wizard_state } from "../store";

  import { Setting, WizardState } from "../types";

  let exam_setting: Setting;
  setting.subscribe((v) => {
    exam_setting = v;
  });

  const saveMySetting = async () => {
    await saveSetting(exam_setting);
    setting.set(exam_setting);
  };

  const goNext = async () => {
    await saveSetting(exam_setting);
    setting.set(exam_setting);
    wizard_state.set(WizardState.DOWNLOAD_EXAM);
  };

  const goPrevious = async () => {
    await saveSetting(exam_setting);
    setting.set(exam_setting);
    wizard_state.set(WizardState.NEW);
  };
</script>

<div class="mb-6">
  <label
    for="university"
    class="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300"
    >University</label
  >
  <input
    type="text"
    id="university"
    bind:value={exam_setting.university}
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
</div>

<div class="mb-6">
  <label
    for="department"
    class="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300"
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
  <label
    for="exam-term"
    class="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300"
    >Term</label
  >
  <input
    type="text"
    bind:value={exam_setting.term}
    id="exam-term"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
</div>

<div class="mb-6">
  <label
    for="coursecode"
    class="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300"
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
  <label
    for="exam-name"
    class="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300"
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
  <label
    for="exam-date"
    class="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300"
    >Exam Date</label
  >
  <input
    type="date"
    id="exam-date"
    bind:value={exam_setting.examdate}
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
</div>

<div>
  <label
    for="time-allowed"
    class="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300"
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
  <label
    for="versions"
    class="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300"
    >Number of Versions</label
  >
  <input
    type="number"
    id="versions"
    bind:value={exam_setting.numberofvestions}
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
</div>

<div class="mb-6">
  <label
    for="groups"
    class="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300"
    >Number of Groups</label
  >
  <input
    type="number"
    id="groups"
    bind:value={exam_setting.numberofgroups}
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
</div>

<div
  class="mt-5 
    border border-blue-900
    p-5
    col-span-2 flex   text-center w-auto justify-center "
>
  <button
    on:click={goPrevious}
    type="button"
    class="text-blue 
  
  hover:bg-blue-800 hover:text-white
  focus:ring-4 
  focus:ring-blue-300 
  
  text-lg 
  rounded-lg 
  
  px-5 py-2.5 mr-2 mb-2 
  underline underline-light-600
  dark:bg-blue-600 dark:hover:bg-blue-700 
  focus:outline-none dark:focus:ring-blue-800"
  >
    Previous</button
  >
  <button
    on:click={saveMySetting}
    type="button"
    class="text-blue 
  
  hover:bg-blue-800 hover:text-white
  focus:ring-4 
  focus:ring-blue-300 
  
  text-lg 
  rounded-lg 
  
  px-5 py-2.5 mr-2 mb-2 
  underline underline-light-600
  dark:bg-blue-600 dark:hover:bg-blue-700 
  focus:outline-none dark:focus:ring-blue-800"
  >
    Save</button
  >
  <button
    on:click={goNext}
    type="button"
    class="text-blue 
  
  hover:bg-blue-800 hover:text-white
  focus:ring-4 
  focus:ring-blue-300 
  
  text-lg 
  rounded-lg 
  
  px-5 py-2.5 mr-2 mb-2 
  underline underline-light-600
  dark:bg-blue-600 dark:hover:bg-blue-700 
  focus:outline-none dark:focus:ring-blue-800"
  >
    Next</button
  >
</div>
