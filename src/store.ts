import { writable } from "svelte/store";
import {
  PaperSize,
  type FrontExam,
  type FrozenOptions,
  type QuestionsFilePath,
  type Setting,
} from "./types";
import { WizardState } from "./types";
import { Store } from "tauri-plugin-store-api";
const store = new Store(".settings.dat");

const initial_setting: Setting = {
  university: "King Fahd University of Petroleum and Minerals",
  department: "Department of Mathematics",
  term: "",
  coursecode: "",
  examname: "",
  examdate: "",
  timeallowed: "",
  numberofvestions: 4,
  groups: "1",
  paper_size: PaperSize.A4,
};

export const saveSetting = async (s: Setting) => {
  await store.set("setting", s);
  setting.set(s);
};

export const getSettings = async () => {
  const s = (await store.get("setting")) as Setting;
  return s;
};
//

export const setting = writable<Setting>(initial_setting);

export const questions_file_path = writable<QuestionsFilePath>("nothing");

export const exam_string = writable<string>("");
export const template_exam_string = writable<string>("");

export const wizard_state = writable<WizardState>(
  WizardState.DOWNLOAD_TEMPLATE
);

export const store_exam = writable<FrontExam>({
  name: "",
  ordering: null,
  questions: null,
  preamble: null,
  kept_in_one_page: [],
});

export const store_frozen_options = writable<FrozenOptions>({});
