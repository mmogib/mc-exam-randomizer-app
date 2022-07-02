<script lang="ts">
  import { saveSetting, setting, wizard_state, store_exam } from "../store";
  import { message as diagMesg } from "@tauri-apps/api/dialog";
  import { FrontExam, Question, Setting, WizardState } from "../types";

  let exam_setting: Setting;
  let current_exam: FrontExam;
  store_exam.subscribe((v) => {
    current_exam = v;
  });
  setting.subscribe((v) => {
    exam_setting = v;
  });

  interface ValidationError {
    valid: "valid" | "invalid";
    message: string;
  }
  const validateSetting = (): ValidationError => {
    if (
      exam_setting.university === "" ||
      exam_setting.coursecode === "" ||
      exam_setting.department === "" ||
      !exam_setting.examdate ||
      exam_setting.examname === "" ||
      exam_setting.groups === "" ||
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

    const num_of_questions = current_exam.questions.length;
    const groups = exam_setting.groups.split(",");
    if (groups.length < 1) {
      return { message: "Please check the groups field", valid: "invalid" };
    }
    let group_numbers = groups
      .map((v) => parseInt(v))
      .filter((v) => Number.isInteger(v));
    if (groups.length === 1 && group_numbers[0] === 1) {
      group_numbers = [num_of_questions];
    }

    const number_of_questions_in_groups = group_numbers.reduce(
      (acc, v) => acc + v,
      0
    );
    if (num_of_questions !== number_of_questions_in_groups) {
      return {
        message: `Number of questions ${num_of_questions} whereas your groups includes ${number_of_questions_in_groups} questions`,
        valid: "invalid",
      };
    }

    const groups_running_total = group_numbers.map((v, i) => {
      if (i === 0) {
        return v;
      }
      return v + group_numbers.slice(0, i).reduce((acc, v) => acc + v, 0);
    });

    const qs = current_exam.questions.slice(0).map((v, i) => {
      const group = groups_running_total
        .map((v2, i2) => {
          if (i < v2) {
            return i2 + 1;
          } else {
            return 0;
          }
        })
        .filter((v2) => v2 !== 0)[0];
      return { ...v, group };
    });
    current_exam = { ...current_exam, questions: qs as [Question] };

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
      wizard_state.set(WizardState.DOWNLOAD_EXAM);
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
    >Grouping</label
  >
  <input
    type="text"
    id="groups"
    bind:value={exam_setting.groups}
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
  <p class="mt-2 text-sm text-gray-600 dark:text-gray-500">
    <span class="font-medium">comma sparated numbers, like: 5,5,6</span>
  </p>
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
