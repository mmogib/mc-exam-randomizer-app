import { invoke } from "@tauri-apps/api";

import {
  ANSWER_COUNT,
  CODE_COVER_PAGE,
  code_template,
  COVER_PAGE,
  DOC_PREAMBLE,
  even_question,
  exam_template,
  KEY_ANSWER,
  MASTER_COVER_PAGE,
  odd_question,
  questions_template,
} from "./template";
import type { FrontExam, Question, Setting, TemplateExt } from "./types";

export const parse_exam = async (
  exam: FrontExam,
  filename: string,
  stored_setting: Setting,
  extension: TemplateExt = "TEX"
): Promise<string> => {
  const qs_master = parse_questions(exam.questions);
  const q_temp_master = questions_template.replace(`%{QUESTIONS}`, qs_master);
  const command =
    extension === "TXT"
      ? `get_random_version_csv`
      : `get_random_version_${extension.toLowerCase()}`;
  const master_code = code_template
    .replace(`%{CODE_COVER_PAGE}`, MASTER_COVER_PAGE)
    .replace(`%{QUESTIONS_TEMPLATE}`, q_temp_master);
  let exam_codes = [];
  const codes = (
    await Promise.all(
      Array(stored_setting.numberofvestions)
        .fill(0)
        .map(async (_, i) => {
          const code_number = `${i + 101}`.slice(1, 3);
          const code_name = `CODE${code_number}`;
          const ex = (await invoke(command, {
            filename,
            name: code_name,
          })) as FrontExam;
          exam_codes.push(ex);
          const questions = parse_questions(ex.questions, ex.ordering);
          const q_template = questions_template.replace(
            `%{QUESTIONS}`,
            questions
          );
          return code_template
            .replace(`%{CODE_COVER_PAGE}`, CODE_COVER_PAGE)
            .replace(`%{QUESTIONS_TEMPLATE}`, q_template)
            .replaceAll(`{CODE_NAME}`, ex.name);
        })
    )
  ).join("");
  const versions = `${master_code}
${codes}
`;

  const exam_doc = exam_template
    .replace(`%{DOC_PREAMBLE}`, DOC_PREAMBLE)
    .replace("%{COVER_PAGE}", COVER_PAGE)
    .replace("%{VERSIONS}", versions)
    .replace(`%{KEY_ANSWER}`, parse_answer_key(exam, exam_codes as [FrontExam]))
    .replace(`%{ANSWER_COUNT}`, parse_answer_count(exam_codes as [FrontExam]))
    .replaceAll("{UNIVERSITY_NAME}", stored_setting.university)
    .replaceAll("{DEPT_NAME}", stored_setting.department)
    .replaceAll("{COURSE_CODE}", stored_setting.coursecode)
    .replaceAll("{EXAM_NAME}", stored_setting.examname)
    .replaceAll("{TERM}", stored_setting.term)
    .replaceAll(
      "{EXAM_DATE}",
      new Date(stored_setting.examdate).toLocaleDateString("en-us", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    )
    .replaceAll("{NUM_OF_VERSIONS}", stored_setting.numberofvestions + "")
    .replaceAll("{NUM_OF_QUESTIONS}", exam.questions.length + "")
    .replaceAll("{TIME_ALLOWED}", stored_setting.timeallowed)
    .replaceAll("{NUM_PAGES}", Math.ceil(exam.questions.length / 2) + "");

  return exam_doc;
};

const parse_questions = (
  questions: [Question],
  ordering: [number] | null = null
): string => {
  const odd_q = odd_question;
  const even_q = even_question;
  const qs = ordering ? ordering.map((indx) => questions[indx]) : questions;
  return qs
    .map((q, i) => {
      const correctIndex = q.choices[1];
      const opts = q.choices[2]
        ? q.choices[2]
            .map((indx) => `\\item  ${q.choices[0][indx].text}\n`)
            .join("")
        : q.choices[0]
            .map(
              (o, i) =>
                `\\item ${o.text}${
                  correctIndex === i ? "\\hrulefill {\\small (correct)}" : ""
                }\n`
            )
            .join("");

      let q_str = "";
      if ((i + 1) % 2 === 1) {
        q_str += odd_q
          .replace(`#{QUESTION_TEXT}`, q.text)
          .replace("#{QUESTION_OPTION}", opts);
      } else {
        q_str += even_q
          .replace(`#{QUESTION_TEXT}`, q.text)
          .replace("#{QUESTION_OPTION}", opts);
      }
      return q_str;
    })
    .join("");
};
const alphabets = ["A", "B", "C", "D", "E"];

const parse_answer_key = (master: FrontExam, codes: [FrontExam]): string => {
  const num_questions = master.questions.length;
  const answer_template = KEY_ANSWER;

  const header = [`Q`, `MASTER`, ...codes.map((c) => c.name)].join("&");
  const body = Array(num_questions)
    .fill(0)
    .map((_, q_num) => {
      return [
        q_num + 1,
        alphabets[master.questions[q_num].choices[1]],
        ...codes.map((code) => alphabets[code.questions[q_num].choices[1]]),
      ].join("&");
    })
    .join(`\\\\ \\hline`);
  return answer_template
    .replace(`{HEADER}`, header)
    .replace(`{KEY_BODY}`, body);
};

/**
 *   V & A&B&C&D&E \\\\ \\hline 
1 & 3&7&2&3&3\\\\ \\hline 
 */

const parse_answer_count = (codes: [FrontExam]): string => {
  const header = [`V`, ...alphabets].join("&");
  const answer_count_template = ANSWER_COUNT;
  const temp_counts = Array(alphabets.length).fill(0);
  const body = codes
    .map((code, i) => {
      return [
        i + 1,
        ...temp_counts.map((_, ii) => {
          return code.questions
            .filter((q) => q.choices[1] === ii)
            .reduce((c, _) => c + 1, 0);
        }),
      ].join("&");
    })
    .join("\\\\ \\hline");

  return answer_count_template
    .replace(`{ANSWER_COUNT_HEADER}`, header)
    .replace(`{ANSWER_COUNT_BODY}`, body);
};
