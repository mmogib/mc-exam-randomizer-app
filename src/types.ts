export interface FrontExam {
  name: string;
  questions: [Question];
  ordering: [number];
}

export interface Question {
  text: string;
  order: number;
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
  numberofgroups: number;
}

export type QuestionsFilePath = string;

export type TemplateExt = "TEX" | "CSV";

export enum WizardState {
  NEW,
  FILL_SETTING,
  DOWNLOAD_EXAM,
}
