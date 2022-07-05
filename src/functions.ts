import { invoke } from "@tauri-apps/api";

import {
  ANSWER_COUNT,
  CODE_COVER_PAGE,
  code_template,
  COMMANDS_DEFINITIONS,
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

export const parse_master_only = async (
  exam: FrontExam,
  stored_setting: Setting
): Promise<string> => {
  const qs_master = parse_questions(exam.questions, null, true, true);
  const q_temp_master = questions_template.replace(`%{QUESTIONS}`, qs_master);
  const master_code = code_template
    .replace(`%{CODE_COVER_PAGE}`, MASTER_COVER_PAGE)
    .replace(`%{QUESTIONS_TEMPLATE}`, q_temp_master);
  const exam_doc = exam_template
    .replace(`%{DOC_PREAMBLE}`, DOC_PREAMBLE)
    .replace(`%{COMMANDS_DEFINITIONS}`, "")

    .replace("%{USER_PREAMBLE}", exam.preamble || "")
    .replace("%{COVER_PAGE}", "")
    .replace("%{VERSIONS}", master_code)
    .replace(`%{KEY_ANSWER}`, ``)
    .replace(`%{ANSWER_COUNT}`, ``)
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

export const parse_exam = async (
  exam: FrontExam,
  stored_setting: Setting
): Promise<string> => {
  const qs_master = parse_questions(exam.questions, null, false, true);
  const q_temp_master = questions_template.replace(`%{QUESTIONS}`, qs_master);
  const command = `get_random_version`;
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
            exam: exam,
            name: code_name,
          })) as FrontExam;
          exam_codes.push(ex);
          const ex_quuestions = ex.questions.map((q) => {
            const exam_q = exam.questions.find((vv) => vv.order === q.order);
            const correct_answer = exam_q.choices[2]
              ? exam_q.choices[1]
              : q.choices[1];
            const ops = exam_q.choices[2] ? exam_q.choices[2] : q.choices[2];

            return { ...q, choices: [q.choices[0], correct_answer, ops] };
          });
          const questions = parse_questions(
            ex_quuestions as [Question],
            ex.ordering
          );
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
    .replace(`%{COMMANDS_DEFINITIONS}`, COMMANDS_DEFINITIONS)
    .replace("%{USER_PREAMBLE}", exam.preamble || "")
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
  ordering: [number] | null = null,
  isForTemplete: boolean = false,
  master: boolean = false
): string => {
  const odd_q = odd_question;
  const even_q = even_question;
  const qs = ordering
    ? ordering
        .map((indx) => questions[indx])
        .sort((a, b) => (a.group > b.group ? 1 : -1))
    : questions;

  return qs
    .map((q, i) => {
      const correctIndex = q.choices[1];
      let orderedOptions = q.choices[2]
        ? [...q.choices[2]]
        : [...q.choices[0].map((_, i) => i)];
      orderedOptions = isForTemplete
        ? [
            correctIndex,
            ...orderedOptions.filter((vvv) => vvv !== correctIndex),
          ]
        : orderedOptions;
      const opts = !master
        ? q.choices[2]
            .map((indx) =>
              isForTemplete
                ? `\\item  \n%{#o}\n${q.choices[0][indx].text}\n%{/o}\n`
                : `\\item  ${q.choices[0][indx].text}\n`
            )
            .join("")
        : orderedOptions
            .map(
              (i) =>
                `\\item ${isForTemplete ? "\n%{#o}\n" : ""}${
                  q.choices[0][i].text
                }${
                  correctIndex === i && !isForTemplete
                    ? "\\;\\;\\hrulefill {\\small (correct)}"
                    : ""
                }\n${isForTemplete ? "%{/o}\n" : ""}`
            )
            .join("");

      let q_str = "";
      if ((i + 1) % 2 === 1) {
        q_str += odd_q
          .replace(
            `#{QUESTION_TEXT}`,
            `${isForTemplete ? "\n%{#q}\n" : ""}${q.text}${
              isForTemplete ? "\n%{/q}\n" : ""
            }`
          )
          .replace("#{QUESTION_OPTION}", opts);
      } else {
        q_str += even_q
          .replace(
            `#{QUESTION_TEXT}`,
            `${isForTemplete ? "\n%{#q}\n" : ""}${q.text}${
              isForTemplete ? "\n%{/q}\n" : ""
            }`
          )
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
  const tabs = codes.map((_) => "c").join("|");
  const header = [`Q`, `MASTER`, ...codes.map((c) => c.name)].join("&");
  const body = Array(num_questions)
    .fill(0)
    .map((_, q_num) => {
      return [
        q_num + 1,
        alphabets[master.questions[q_num].choices[1]],
        ...codes.map((code) => {
          const q_in_master = master.questions.find((vv) => {
            return vv.order === code.questions[q_num].order;
          });
          if (q_in_master.choices[2]) {
            return alphabets[q_in_master.choices[1]];
          }
          return alphabets[code.questions[q_num].choices[1]]; //code.questions[q_num].choices[1]
        }),
      ].join("&");
    })
    .join(`\\\\ \\hline`);
  return answer_template
    .replace(`{AKEY_TABS}`, tabs)
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
