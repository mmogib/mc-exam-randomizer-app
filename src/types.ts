export enum PaperSize {
  A4 = "A4",
  F4 = "F4",
}

export type Choices = [[Choice], CorrectChoice, [ChoiceOrdering]];

export interface Choice {
  text: string;
}

export type CorrectChoice = number;

export type ChoiceOrdering = number;

export interface Question {
  text: string;
  order: number;
  group: number;
  choices?: Choices;
}

export interface FrontExam {
  name: string;
  preamble?: string;
  questions?: [Question];
  ordering: [number];
  kept_in_one_page?: number[];
}

export type ExamCodes = [FrontExam];

export interface FrozenOptions {
  [key: number]: number[];
}
export interface Setting {
  university: string;
  department: string;
  term: string;
  coursecode: string;
  examname: string;
  examdate: string;
  timeallowed: string;
  numberofvestions: number;
  groups: string;
  paper_size?: PaperSize;
}

export type QuestionsFilePath = string;

export type TemplateExt = "TEX" | "CSV" | "TXT";

export enum WizardState {
  DOWNLOAD_TEMPLATE,
  NEW,
  FILL_SETTING,
  ORDER_OPTIONS,
  GROUP_QUESTIONS,
  DOWNLOAD_EXAM,
}

export interface ExamSettings {
  setting: Setting;
  exam: FrontExam;
  options_order: FrozenOptions;
}

export enum OrderDirection {
  UP,
  DOWN,
}

export interface ValidationError {
  valid: "valid" | "invalid";
  message: string;
}
