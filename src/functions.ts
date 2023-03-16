import { invoke } from "@tauri-apps/api";
import { store_frozen_options, setting, store_exam_codes } from "./store";

import {
  ANSWER_COUNT,
  CODE_COVER_PAGE,
  code_template,
  COVER_PAGE,
  DOC_PREAMBLE,
  even_question,
  exam_template,
  get_setting_string,
  KEY_ANSWER,
  MASTER_COVER_PAGE,
  odd_question,
  questions_template,
  TEMPLATE_COMMANDS_DEFINITIONS,
  TEMPLATE_COVER_PAGE,
} from "./template";
import {
  PaperSize,
  type Choices,
  type ExamCodes,
  type FrontExam,
  type Question,
  type Setting,
} from "./types";

let foptions;

store_frozen_options.subscribe((options) => (foptions = options));

export const parse_master_only = async (
  exam: FrontExam,
  stored_setting: Setting
): Promise<string> => {
  const qs_master = parse_questions(
    exam.questions,
    null,
    true,
    true,
    exam.kept_in_one_page
  );
  const q_temp_master = questions_template.replace(`%{QUESTIONS}`, qs_master);
  const master_code = code_template
    .replace(`%{CODE_COVER_PAGE}`, TEMPLATE_COVER_PAGE)
    .replace(`%{QUESTIONS_TEMPLATE}`, q_temp_master);
  const exam_doc = exam_template
    .replace(
      `%{DOC_PREAMBLE}`,
      DOC_PREAMBLE(
        exam.questions?.length || 0,
        true,
        stored_setting?.paper_size || PaperSize.A4
      )
    )

    .replace("%{USER_PREAMBLE}", "")
    .replace("%{COVER_PAGE}", "")
    .replace("%{VERSIONS}", master_code)
    .replace(`%{KEY_ANSWER}`, ``)
    .replace(`%{ANSWER_COUNT}`, ``)
    .replaceAll("{UNIVERSITY_NAME}", stored_setting.university)
    .replaceAll("{DEPT_NAME}", stored_setting.department)
    .replaceAll("{COURSE_CODE}", stored_setting.coursecode)
    .replaceAll("{EXAM_NAME}", stored_setting.examname)
    .replaceAll("{TERM}", stored_setting.term)
    .replaceAll("{EXAM_DATE}", stored_setting.examdate)
    .replaceAll("{NUM_OF_VERSIONS}", stored_setting.numberofvestions + "")
    .replaceAll("{NUM_OF_QUESTIONS}", exam.questions.length + "")
    .replaceAll("{TIME_ALLOWED}", stored_setting.timeallowed)
    .replaceAll("{NUM_PAGES}", number_of_pages(exam) + "")
    .replace(
      `%{COMMANDS_DEFINITIONS}`,
      TEMPLATE_COMMANDS_DEFINITIONS({
        old_preamble: exam.preamble ? exam.preamble : "",
        isTemplate: true,
      })
    );
  return `${get_setting_string()}
  ${exam_doc}`;
};

const get_code_name = (setting: Setting, i: number) => {
  const alphas = "ABCDEFGHIJKLMNOPQRS";
  const code_number =
    setting.code_numbering === "ARABIC"
      ? `${i + 101}`.slice(1, 3)
      : alphas.at(i);
  const code_name = `${setting.code_name}${code_number}`;
  return code_name;
};

export const parse_exam = async (
  exam: FrontExam,
  stored_setting: Setting
): Promise<string> => {
  const qs_master = parse_questions(
    exam.questions,
    null,
    false,
    true,
    exam.kept_in_one_page
  );
  const q_temp_master = questions_template.replace(`%{QUESTIONS}`, qs_master);
  const command = `get_random_version`;
  const master_code = code_template
    .replace(`%{CODE_COVER_PAGE}`, MASTER_COVER_PAGE(stored_setting.examtype))
    .replace(`%{QUESTIONS_TEMPLATE}`, q_temp_master);
  let exam_codes = [] as unknown as ExamCodes;
  const codes = (
    await Promise.all(
      Array(stored_setting.numberofvestions)
        .fill(0)
        .map(async (_, i) => {
          const code_name = get_code_name(stored_setting, i);
          const ex = (await invoke(command, {
            exam: exam,
            name: code_name,
          })) as FrontExam;
          const ex_quuestions = process_questions_options(ex.questions, exam);

          exam_codes.push({ ...ex, questions: ex_quuestions });
          const questions = parse_questions(
            ex_quuestions,
            ex.ordering,
            false,
            false,
            exam.kept_in_one_page
          );

          const q_template = questions_template.replace(
            `%{QUESTIONS}`,
            questions
          );
          return code_template
            .replace(`%{CODE_COVER_PAGE}`, CODE_COVER_PAGE())
            .replace(`%{QUESTIONS_TEMPLATE}`, q_template)
            .replaceAll(`{CODE_NAME}`, ex.name);
        })
    )
  ).join("");
  const versions = `${master_code}
${codes}
`;
  store_exam_codes.set(exam_codes);

  const num_of_answer_keys_pages = Math.ceil(exam_codes.length / 7);
  const parsed_answer_keys = Array(num_of_answer_keys_pages)
    .fill(0)
    .map((_, i) => i)
    .map((i) =>
      parse_answer_key(exam, exam_codes.slice(i * 7, i * 7 + 7) as [FrontExam])
    )
    .join("\\newpage\n");
  const exam_doc = exam_template
    .replace(
      `%{DOC_PREAMBLE}`,
      DOC_PREAMBLE(
        exam.questions?.length || 0,
        false,
        stored_setting?.paper_size || PaperSize.A4
      )
    )
    .replace(
      `%{COMMANDS_DEFINITIONS}`,
      TEMPLATE_COMMANDS_DEFINITIONS({ old_preamble: "", isTemplate: false })
    )
    .replace("%{USER_PREAMBLE}", exam.preamble ? exam.preamble : "")
    .replace("%{COVER_PAGE}", COVER_PAGE)
    .replace("%{VERSIONS}", versions)
    .replace(`%{KEY_ANSWER}`, parsed_answer_keys)
    .replace(`%{ANSWER_COUNT}`, parse_answer_count(exam_codes as [FrontExam]))
    .replaceAll("{UNIVERSITY_NAME}", stored_setting.university)
    .replaceAll("{DEPT_NAME}", stored_setting.department)
    .replaceAll("{COURSE_CODE}", stored_setting.coursecode)
    .replaceAll("{EXAM_NAME}", stored_setting.examname)
    .replaceAll("{TERM}", stored_setting.term)
    .replaceAll("{EXAM_DATE}", stored_setting.examdate)
    .replaceAll("{NUM_OF_VERSIONS}", stored_setting.numberofvestions + "")
    .replaceAll("{NUM_OF_QUESTIONS}", exam.questions.length + "")
    .replaceAll("{TIME_ALLOWED}", stored_setting.timeallowed)
    .replaceAll("{NUM_PAGES}", number_of_pages(exam) + "");

  return exam_doc;
};

const number_of_pages = (exam: FrontExam): number => {
  const num_of_questions = exam.questions.length;
  const num_of_questions_kept_in_ones = exam.kept_in_one_page
    ? exam.kept_in_one_page.length
    : 0;
  const num_of_questions_kept_in_twos =
    num_of_questions - num_of_questions_kept_in_ones;
  return (
    Math.ceil(num_of_questions_kept_in_twos / 2) + num_of_questions_kept_in_ones
  );
};

const order_questions = (
  questions: [Question],
  ordering: [number] | null
): [Question] => {
  return (
    ordering
      ? ordering
          .map((indx) => questions[indx])
          .sort((a, b) => (a.group >= b.group ? 1 : -1))
      : questions
  ) as [Question];
};
const parse_questions = (
  questions: [Question],
  ordering: [number] | null = null,
  isForTemplete: boolean = false,
  master: boolean = false,
  qs_in_pne_page: number[] = []
): string => {
  const odd_q = odd_question;
  const even_q = even_question;
  const qs = order_questions(questions, ordering);
  let counter = 0;
  return qs
    .map((q, i) => {
      let opts = "";
      if (q.choices) {
        const oooptions = q.choices[0].filter((o) => o.text !== "");

        if (oooptions.length > 0) {
          opts = `\n\\begin{enumerate}`;
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
          opts += !master
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
          opts += `\\end{enumerate}`;
        }
      }
      let q_str = "";
      if (qs_in_pne_page.includes(q.order)) {
        const temp_q_str = isForTemplete ? even_q(counter + 1) : even_q(null);
        q_str = `\\newpage\n ${temp_q_str}`
          .replace(
            `#{QUESTION_TEXT}`,
            `${isForTemplete ? "\n%{#q}\n" : ""}${q.text}${
              isForTemplete ? "\n%{/q}\n" : ""
            }`
          )
          .replace("#{QUESTION_OPTION}", opts);
        counter = 0;
      } else {
        if ((counter + 1) % 2 === 1) {
          const temp_q_str = isForTemplete ? odd_q(counter + 1) : odd_q(null);
          q_str += temp_q_str
            .replace(
              `#{QUESTION_TEXT}`,
              `${isForTemplete ? "\n%{#q}\n" : ""}${q.text}${
                isForTemplete ? "\n%{/q}\n" : ""
              }`
            )
            .replace("#{QUESTION_OPTION}", opts);
        } else {
          const temp_q_str = isForTemplete ? even_q(counter + 1) : even_q(null);
          q_str += temp_q_str
            .replace(
              `#{QUESTION_TEXT}`,
              `${isForTemplete ? "\n%{#q}\n" : ""}${q.text}${
                isForTemplete ? "\n%{/q}\n" : ""
              }`
            )
            .replace("#{QUESTION_OPTION}", opts);
        }
        counter++;
      }
      return q_str;
    })
    .join("");
};
const alphabets = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const check_options = (opt: Choices | null): boolean =>
  opt !== null && opt[0].filter((o) => o.text !== "").length > 0;

const parse_answer_key = (master: FrontExam, codes: [FrontExam]): string => {
  // const master_questions = master.questions.filter(
  //   (q) =>
  //     q.choices !== null && q.choices[0].filter((o) => o.text !== "").length > 0
  // );
  const master_questions = master.questions;
  const num_questions = master_questions.length;
  const answer_template = KEY_ANSWER;
  const tabs = codes.map((_) => "c").join("|");
  const header = [`Q`, `MASTER`, ...codes.map((c) => c.name)].join("&");
  const body = Array(num_questions)
    .fill(0)
    .map((_, q_num) => {
      return [
        master_questions[q_num].order,
        check_options(master_questions[q_num].choices)
          ? alphabets[master_questions[q_num].choices[1]]
          : "",
        ...codes
          // .map((c: FrontExam) => ({
          //   ...c,
          //   questions: c.questions.filter(
          //     (q) =>
          //       q.choices !== null &&
          //       q.choices[0].filter((o) => o.text !== "").length > 0
          //   ) as [Question],
          // }))
          .map((c: FrontExam) => ({
            ...c,
            questions: order_questions(c.questions, c.ordering),
          }))
          .map((code: FrontExam) => {
            const q_in_master = master_questions.find((vv) => {
              return vv.order === code.questions[q_num].order;
            });
            const code_q = code.questions[q_num];
            let r_str = "";
            if (check_options(code_q.choices)) {
              if (q_in_master.choices[2]) {
                r_str += alphabets[q_in_master.choices[1]];
              } else {
                r_str += alphabets[code_q.choices[1]];
              }
            }
            r_str += `\\; {\\tiny $_{${q_in_master.order}}$}`;
            return r_str;
          }),
      ].join("&");
    })
    .join(`\\\\ \\hline`);

  return answer_template(num_questions)
    .replace(`{AKEY_TABS}`, tabs)
    .replace(`{HEADER}`, header)
    .replace(`{KEY_BODY}`, body);
};

const parse_answer_count = (codes: [FrontExam]): string => {
  const filtered_dump_options = codes[0].questions.filter(
    (q) => q.choices !== null
  );
  const dum_options = filtered_dump_options.sort(
    (a, b) => b.choices[0].length - a.choices[0].length
  )[0].choices[0];
  const table_header = dum_options.map((_) => "c").join("|");
  const header = [
    `V`,
    ...alphabets.filter((_, i) => i < dum_options.length),
  ].join("&");
  const answer_count_template = ANSWER_COUNT;
  const temp_counts = Array(dum_options.length).fill(0);
  const body = codes
    .map((code, i) => {
      return [
        i + 1,
        ...temp_counts.map((_, ii) => {
          return code.questions
            .filter((q) => q.choices !== null)
            .filter((q) => q.choices[1] === ii)
            .reduce((c, _) => c + 1, 0);
        }),
      ].join("&");
    })
    .join("\\\\ \\hline");

  return answer_count_template
    .replace(`{ANSWER_COUNT_TABLE_HEADER}`, table_header)
    .replace(`{ANSWER_COUNT_HEADER}`, header)
    .replace(`{ANSWER_COUNT_BODY}`, body);
};

export const get_question_groups = (exam: FrontExam): string => {
  const num_of_questions = exam.questions.length;
  const groups = new Set(exam.questions.map((q) => q.group));
  if (groups.size === 1) {
    return `${num_of_questions}`;
  }
  return [...groups]
    .sort((a, b) => a - b)
    .map((g) => {
      return exam.questions.filter((q) => q.group === g).length;
    })
    .join(",");
};

export const get_question_groups_from_str = (str: string): string => {
  return str
    .split(",")
    .map((g) => g.trim())
    .map((g) => parseInt(g))
    .filter((q) => !Number.isNaN(q))
    .join(",");
};

export const order_questions_by_groups = (exam: FrontExam): FrontExam => {
  const qs = exam.questions
    .sort((a, b) => b.order - a.order)
    .sort((a, b) => (a.group > b.group ? 1 : -1))
    .map((q, i) => {
      return { ...q, order: i + 1 };
    }) as [Question];
  return { ...exam, questions: qs };
};

const process_questions_options = (
  exam_questions: [Question],
  master_exam: FrontExam
): [Question] => {
  return exam_questions.map((q) => {
    const master_q = master_exam.questions.find((vv) => vv.order === q.order);
    if (!master_q.choices) {
      return { ...q, choices: null };
    } else {
      const [ops, correct_answer] = get_new_options_order(master_q, q);

      return { ...q, choices: [q.choices[0], correct_answer, ops] };
    }
  }) as [Question];
};

const get_new_options_order = (
  master_q: Question,
  exam_q: Question
): [number[], number] => {
  if (master_q.choices[2]) {
    return [master_q.choices[2], master_q.choices[1]];
  }
  const options = foptions[exam_q.order] || null;

  if (!options) {
    return [exam_q.choices[2], exam_q.choices[1]];
  }

  const dum_array = Array(master_q.choices[0].length)
    .fill(0)
    .map((_, i) => i);
  const options_to_sort = dum_array.filter((o) => !options.includes(o));
  const sorted_options = options_to_sort.sort(() => 0.5 - Math.random());

  const new_options = dum_array.map((o) => {
    if (options.includes(o)) {
      return o;
    } else {
      return sorted_options.shift();
    }
  });
  const correct_option_index = new_options.findIndex(
    (o) => o === master_q.choices[1]
  );

  return [new_options, correct_option_index];
};

export const prepare_item_analysis_data = (codes: ExamCodes): string => {
  const number_of_codes = codes.length;
  const csv_to_download: string = new Array(number_of_codes)
    .fill(0)
    .map((_, i) => {
      const code = i + 1;
      const qs_codes: string[] = codes[i]?.ordering.map((qj, j) => {
        const q = qj + 1;
        const options =
          codes[i]?.questions[qj].choices === null
            ? null
            : codes[i]?.questions[qj].choices[2];
        if (options === null) {
          return "nothing";
        }
        const options_q: string[] = options.map((o, indx) => {
          return `${code},${j + 1},${q},${indx + 1},${o + 1},${
            codes[i]?.questions[qj].choices[1] === indx ? "*" : ""
          }`;
        });

        return options_q.join("\n");
      });

      return `${qs_codes.filter((v) => v !== "nothing").join("\n")}`;
    })
    .join("\n");
  const csv_with_header = `code,order,order in master,option,option in master,correct\n${csv_to_download}`;
  return csv_with_header;
};
