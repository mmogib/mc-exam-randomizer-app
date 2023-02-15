<script lang="ts">
  import { saveSetting, setting, wizard_state } from "../store";
  import { message as diagMesg } from "@tauri-apps/api/dialog";
  import {
    type Setting,
    WizardState,
    type ValidationError,
    PaperSize,
  } from "../types";
  import NavigationButton from "../components/NavigationButton.svelte";

  let exam_setting: Setting = $setting;
  // let paper_size: PaperSize = $setting.paper_size;

  function onChange(event) {
    exam_setting.examtype = event.currentTarget.value;
  }

  enum FormField {
    university = "university",
    department = "department",
    term = "term",
    coursecode = "coursecode",
    examname = "examname",
    examdate = "examdate",
    examtype = "examtype",
    timeallowed = "timeallowed",
    numberofvestions = "numberofvestions",
    papersize = "papersize",
    code_name = "code_name",
    code_numbering = "code_numbering",
  }

  interface SettingFormError {
    field: FormField;
    message: string;
    valid: boolean;
  }

  let form_errors: SettingFormError[] = Object.keys($setting).map((field) => ({
    field: field as FormField,
    message: "",
    valid: true,
  }));

  const isValid = (field: FormField) => (e) => {
    const value = e.target.value;
    let message = "";
    let valid = true;
    switch (field) {
      case FormField.university:
      case FormField.department:
      case FormField.term:
      case FormField.coursecode:
      case FormField.examname:
      case FormField.examdate:
      case FormField.timeallowed:
        if (value === "") {
          message = `${field} is required`;
          valid = false;
        }
        break;
      case FormField.numberofvestions:
        if (value === "") {
          message = `${field} is required`;
          valid = false;
        }
        const numValue = Number(parseInt(value));

        if (isNaN(numValue)) {
          message = message === "" ? `` : `${message},`;
          message += `this field must be a number`;
          valid = false;
        }
        if (numValue !== parseFloat(value) || Number(parseInt(value)) <= 0) {
          message = message === "" ? `` : `${message},`;
          message += `this field must be a positive integer`;
          valid = false;
        }
        break;
    }
    form_errors = form_errors.map((error) => {
      if (error.field === field) {
        return { ...error, message, valid };
      }
      return error;
    });
  };
  const validateSetting = (): ValidationError => {
    if (
      exam_setting.university === "" ||
      exam_setting.coursecode === "" ||
      exam_setting.department === "" ||
      exam_setting.examdate === "" ||
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

  const saveItAll = async () => {
    // await saveSetting(exam_setting);
    // setting.set(exam_setting);
    const updated_setting = {
      ...exam_setting,
      paper_size:
        exam_setting.paper_size === "A4" ? PaperSize.A4 : PaperSize.F4,
    };
    await saveSetting(updated_setting);
    setting.set(updated_setting);
  };
  const saveMySetting = async () => {
    const { message, valid } = validateSetting();
    if (valid === "valid") {
      await saveItAll();
    } else {
      await errMsg(message);
    }
  };

  const goNext = async () => {
    const { message, valid } = validateSetting();
    if (valid === "valid") {
      await saveItAll();
      wizard_state.set(WizardState.ORDER_OPTIONS);
    } else {
      await errMsg(message);
    }
  };

  const goPrevious = async () => {
    const { message, valid } = validateSetting();
    if (valid === "valid") {
      await saveItAll();
      wizard_state.set(WizardState.NEW);
    } else {
      await errMsg(message);
    }
  };
</script>

<div
  class="mt-1 
   w-full
    col-span-2 flex   text-center  justify-end"
>
  <NavigationButton text="Go Back" action={goPrevious} />
  <NavigationButton text="Save" action={saveMySetting} />
  <NavigationButton text="Next" action={goNext} />
</div>
<div class="flex justify-center">
  <div
    class="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 px-5 w-1/4 mr-5"
  >
    <input
      on:change={onChange}
      checked={exam_setting.examtype === "MAJOR"}
      id="exam_type_major"
      type="radio"
      value="MAJOR"
      name="exam_type"
      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
    />
    <label
      for="exam_type_major"
      class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >MAJOR/FINAL EXAM</label
    >
  </div>
  <div
    class="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 px-5 w-1/4"
  >
    <input
      on:change={onChange}
      checked={exam_setting.examtype !== "MAJOR"}
      id="exam_type_quiz"
      type="radio"
      value="QUIZ"
      name="exam_type"
      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
    />
    <label
      for="exam_type_quiz"
      class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >QUIZ</label
    >
  </div>
</div>

<div class="my-6">
  <label
    for="university"
    class="block mb-2 text-lg font-medium 
    ">University</label
  >
  <input
    on:blur={isValid(FormField.university)}
    placeholder="Name of University"
    type="text"
    id="university"
    bind:value={exam_setting.university}
    class="bg-gray-50 border border-gray-300 
    text-gray-900 text-sm rounded-lg 
    focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
  <p class=" text-red-600 dark:text-red-300">
    {form_errors.find((v) => v.field === FormField.university).message}
  </p>
</div>

<div class="mb-6">
  <label for="department" class="block mb-2 text-lg font-medium "
    >Department</label
  >
  <input
    on:blur={isValid(FormField.department)}
    type="text"
    id="department"
    bind:value={exam_setting.department}
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
  <p class=" text-red-600 dark:text-red-300">
    {form_errors.find((v) => v.field === FormField.department).message}
  </p>
</div>

<div class="mb-6">
  <label for="exam-term" class="block mb-2 text-lg font-medium ">Term</label>
  <input
    on:blur={isValid(FormField.term)}
    type="text"
    bind:value={exam_setting.term}
    id="exam-term"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
  <p class=" text-red-600 dark:text-red-300">
    {form_errors.find((v) => v.field === FormField.term).message}
  </p>
</div>

<div class="mb-6">
  <label for="coursecode" class="block mb-2 text-lg font-medium "
    >Course Code</label
  >
  <input
    on:blur={isValid(FormField.coursecode)}
    type="text"
    id="coursecode"
    bind:value={exam_setting.coursecode}
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
  <p class=" text-red-600 dark:text-red-300">
    {form_errors.find((v) => v.field === FormField.coursecode).message}
  </p>
</div>
<div class="mb-6">
  <label for="exam-name" class="block mb-2 text-lg font-medium "
    >Exam Name</label
  >
  <input
    on:blur={isValid(FormField.examname)}
    type="text"
    id="exam-name"
    bind:value={exam_setting.examname}
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
  <p class=" text-red-600 dark:text-red-300">
    {form_errors.find((v) => v.field === FormField.examname).message}
  </p>
</div>

<div class="mb-6">
  <label for="exam-date" class="block mb-2 text-lg font-medium "
    >Exam Date</label
  >
  <input
    on:blur={isValid(FormField.examdate)}
    type="string"
    id="exam-date"
    bind:value={exam_setting.examdate}
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
  <p class=" text-red-600 dark:text-red-300">
    {form_errors.find((v) => v.field === FormField.examdate).message}
  </p>
</div>

<div class="mb-6">
  <label for="time-allowed" class="block mb-2 text-lg font-medium "
    >Time Allowed</label
  >
  <input
    on:blur={isValid(FormField.timeallowed)}
    type="text"
    bind:value={exam_setting.timeallowed}
    id="time-allowed"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
  <p class=" text-red-600 dark:text-red-300">
    {form_errors.find((v) => v.field === FormField.timeallowed).message}
  </p>
</div>

<div class="mb-6">
  <label for="versions" class="block mb-2 text-lg font-medium "
    >Number of Versions</label
  >
  <input
    on:blur={isValid(FormField.numberofvestions)}
    type="number"
    id="versions"
    bind:value={exam_setting.numberofvestions}
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
  <p class=" text-red-600 dark:text-red-300">
    {form_errors.find((v) => v.field === FormField.numberofvestions).message}
  </p>
</div>

<div class="mb-6">
  <label for="code_name" class="block mb-2 text-lg font-medium "
    >Code name</label
  >
  <select
    id="code_name"
    name="code_name"
    bind:value={exam_setting.code_name}
    class="form-select px-4 py-3 w-full"
  >
    <option value="CODE">CODE</option>
    <option value="VERSION">VERSION</option>
  </select>
  <p class=" text-red-600 dark:text-red-300">
    {form_errors.find((v) => v.field === FormField.code_name)?.message || ""}
  </p>
</div>

<div class="mb-6">
  <label for="code_numbering" class="block mb-2 text-lg font-medium "
    >Code numebering</label
  >
  <select
    id="code_numbering"
    name="code_numbering"
    bind:value={exam_setting.code_numbering}
    class="form-select px-4 py-3 w-full"
  >
    <option value="ARABIC">ARABIC</option>
    <option value="ALPHA">Capital Letters (A, B, C, ...)</option>
  </select>
  <p class=" text-red-600 dark:text-red-300">
    {form_errors.find((v) => v.field === FormField.code_numbering)?.message ||
      ""}
  </p>
</div>

<div class="mb-6">
  <label for="papersize" class="block mb-2 text-lg font-medium "
    >Paper size</label
  >
  <select
    id="papersize"
    name="papersize"
    bind:value={exam_setting.paper_size}
    class="form-select px-4 py-3 w-full"
  >
    <option value="A4">A4</option>
    <option value="F4">F4 (exam center paper)</option>
  </select>
  <p class=" text-red-600 dark:text-red-300">
    {form_errors.find((v) => v.field === FormField.papersize)?.message || ""}
  </p>
</div>
