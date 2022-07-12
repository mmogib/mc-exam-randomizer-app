export interface FrontExam {
  name: string;
  preamble?: string;
  questions?: [Question];
  ordering: [number];
  ketp_in_one_page?: number[];
}

export interface Question {
  text: string;
  order: number;
  group: number;
  choices: Choices;
}

export type Choices = [[Choice], CorrectChoice, [ChoiceOrdering]];

export interface Choice {
  text: string;
}

export type CorrectChoice = number;

export type ChoiceOrdering = number;

export interface Setting {
  university: string;
  department: string;
  term: string;
  coursecode: string;
  examname: string;
  examdate: Date;
  timeallowed: string;
  numberofvestions: number;
  groups: string;
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
}

export enum OrderDirection {
  UP,
  DOWN,
}

export interface ValidationError {
  valid: "valid" | "invalid";
  message: string;
}
