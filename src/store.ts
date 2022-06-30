import { writable } from "svelte/store";
import {
  FrontExam,
  Processing,
  QuestionsFilePath,
  Setting,
  WizardState,
} from "./types";
import { Store } from "tauri-plugin-store-api";
const store = new Store(".settings.dat");

export const saveSetting = async (s: Setting) => {
  await store.set("setting", s);
  setting.set(s);
};

export const getSettings = async () => {
  const s = (await store.get("setting")) as Setting;
  return s;
};
//

export const setting = writable<Setting>({
  university: "King Fahd University of Petroleum and Minerals",
  department: "Department of Mathematics",
  term: "",
  coursecode: "",
  examname: "",
  examdate: new Date(Date.now()),
  timeallowed: "",
  numberofvestions: 4,
  numberofgroups: 1,
});

export const questions_file_path = writable<QuestionsFilePath>("nothing");

export const exam_string = writable<string>("");

export const wizard_state = writable<WizardState>(
  WizardState.DOWNLOAD_TEMPLATE
);

export const store_exam = writable<FrontExam>({
  name: "",
  ordering: null,
  questions: null,
  preamble: null,
});

export const store_processing = writable<Processing>(Processing.NEW);
