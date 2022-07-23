import { setting } from "./store";
import { PaperSize, type Setting } from "./types";

const get_store_setting = (): Setting => {
  let settings: Setting;
  setting.subscribe((s) => (settings = s));
  return settings;
};
export const get_setting_string = (): string => {
  const settings: Setting = get_store_setting();
  const keys = Object.keys(settings);
  return `%{#setting}\n${keys
    .filter((k) => k !== "exam" && k !== "paper_size")
    .map((k) => `%\t\t${k}=${settings[k]}`)
    .join("\n")}\n%{/setting}`;
};

const COVER_PAGE_COMMAND_TEXT = (comment: boolean): string => `
%% exam code cover page
${comment ? "%" : ""}\\newpage
${comment ? "%" : ""}\\thispagestyle{empty}
${comment ? "%" : ""}\\begin{large}
${comment ? "%" : ""}\\begin{center}
${comment ? "%" : ""}        {UNIVERSITY_NAME} \\\\ 
${comment ? "%" : ""}        {DEPT_NAME}  \\\\ 
${comment ? "%" : ""}        \\vspace*{4.5cm}
${
  comment ? "%" : ""
}        {\\bf \\fbox{ #1 } }  \\hfill {\\bf \\fbox{ #1 }} \\\\
${comment ? "%" : ""}        {\\bf {COURSE_CODE} }  \\\\
${comment ? "%" : ""}        {\\bf {EXAM_NAME} }  \\\\
${comment ? "%" : ""}        {\\bf {TERM} }  \\\\
${comment ? "%" : ""}        {\\bf {EXAM_DATE} }  \\\\ 
${comment ? "%" : ""}        {\\bf Net Time Allowed: {TIME_ALLOWED} }  \\\\
${comment ? "%" : ""}        \\vspace*{0.2cm}
${comment ? "%" : ""}\\end{center}
${
  comment ? "%" : ""
}\\begin{tcbraster}[raster columns=1, raster column skip=0pt, raster equal height, colback=white, before skip=0pt]
${
  comment ? "%" : ""
}\\begin{tcolorbox}[coltitle=black, enhanced jigsaw, boxrule=1pt ,segmentation style={solid,black,line width=1pt},sidebyside,lefthand width=1cm]
${comment ? "%" : ""}    \\hspace*{-4pt}\\begin{large}\\textbf{Name}\\end{large}
${comment ? "%" : ""}\\end{tcolorbox}
${
  comment ? "%" : ""
}\\begin{tcbraster}[raster columns=2, raster column skip=2pt, raster equal height, colback=white, before skip=0pt]
${
  comment ? "%" : ""
}\\begin{tcolorbox}[coltitle=black, enhanced jigsaw, boxrule=1pt ,segmentation style={solid,black,line width=1pt},sidebyside,lefthand width=1cm]
${comment ? "%" : ""}    \\hspace*{-4pt}\\begin{large}\\textbf{ID}\\end{large}
${comment ? "%" : ""}\\end{tcolorbox}
${
  comment ? "%" : ""
}\\begin{tcolorbox}[coltitle=black, enhanced jigsaw, boxrule=1pt ,segmentation style={solid,black,line width=1pt},sidebyside,lefthand width=1cm]
${comment ? "%" : ""}    \\begin{large}\\textbf{Sec}\\end{large}
${comment ? "%" : ""}\\end{tcolorbox}
${comment ? "%" : ""}\\end{tcbraster}
${
  comment ? "%" : ""
}% \\begin{tcbraster}[raster columns=2, raster column skip=2pt, raster equal height, colback=white, before skip=0pt]
${
  comment ? "%" : ""
}% \\begin{tcolorbox}[coltitle=black, enhanced jigsaw, boxrule=1pt ,segmentation style={solid,black,line width=1pt},sidebyside,lefthand width=2cm]
${comment ? "%" : ""}%     \\hspace*{-4pt}\\textbf{Instructor}
${comment ? "%" : ""}% \\end{tcolorbox}
${
  comment ? "%" : ""
}% \\begin{tcolorbox}[coltitle=black, enhanced jigsaw, boxrule=1pt ,segmentation style={solid,black,line width=1pt},sidebyside,lefthand width=1cm]
${comment ? "%" : ""}%     \\textbf{Serial}
${comment ? "%" : ""}% \\end{tcolorbox}
${comment ? "%" : ""}% \\end{tcbraster}
${comment ? "%" : ""}\\end{tcbraster}
${
  comment ? "%" : ""
}\\begin{center}\\bf{Check that this exam has {\\underline{ {NUM_OF_QUESTIONS} }} questions.} \\end{center}
${comment ? "%" : ""}\n${comment ? "%" : ""}\\vspace{2cm} \n
${comment ? "%" : ""}\\underline{\\bf Important Instructions:} \n ${
  comment ? "%" : ""
}
${comment ? "%" : ""}\\begin{enumerate}
${comment ? "%" : ""}    \\begin{normalsize}
${
  comment ? "%" : ""
}        \\item  All types of calculators, smart watches or mobile phones are NOT allowed during the examination.
${comment ? "%" : ""}        \\item  Use HB 2.5 pencils only.
${
  comment ? "%" : ""
}        \\item  Use a good eraser. DO NOT use the erasers attached to the pencil.
${
  comment ? "%" : ""
}        \\item  Write your name, ID number and Section number on the examination paper and in the upper left corner of the answer sheet.
${
  comment ? "%" : ""
}        \\item  When bubbling your ID number and Section number, be sure that the bubbles match with the numbers that you write.
${
  comment ? "%" : ""
}        \\item  The Test Code Number is already bubbled in your answer sheet. Make sure that it is the same as that printed on your question paper.
${
  comment ? "%" : ""
}        \\item  When bubbling, make sure that the bubbled space is fully covered.
${
  comment ? "%" : ""
}        \\item  When erasing a bubble, make sure that you do not leave any trace of penciling.
${comment ? "%" : ""}    \\end{normalsize}
${comment ? "%" : ""}\\end{enumerate}
${comment ? "%" : ""}\\end{large}
${comment ? "%" : ""}\n ${comment ? "%" : ""}\\vspace*{\\fill}\n${
  comment ? "%" : ""
}\\newpage
`;

const PREDEFINED_COMMANDS = (
  isForTemplete: boolean
): string => `%% Predefined commands
\\newcommand{\\bodyoptionseparator}{\n\\vspace {0.8cm}\n}
\\newcommand{\\questionseparator}{\n\\vspace*{\\fill}\n}
\\newcommand{\\eogseparator}{\n\\vspace*{\\fill}\n \\newpage\n}
\\newcommand{\\newcodecover}[1]{${
  isForTemplete ? "" : "\n" + COVER_PAGE_COMMAND_TEXT(false) + "\n"
}}`;

const SHARED_FROM_MATTER = `%% put your preamble between the two tags {#preamble} and {/preamble} below
%% You can also redefine the following commans
%% \\bodyoptionseparator, \\questionseparator, \\eogseparator, \\newcodecover
%% by typing
%\\renewcommand{\\bodyoptionseparator}{\n%\\vspace {0.8cm}\n%}
%\\renewcommand{\\questionseparator}{\n%\\vspace*{\\fill}\n%}
%\\renewcommand{\\eogseparator}{\n%\\vspace*{\\fill}\n %\\newpage}\n`;
const TEX_TEMPLATE_FRONT_MATTER = (hasPlots = false) => `${get_setting_string()}
\\documentclass{article}
\\usepackage{graphicx}
${SHARED_FROM_MATTER}
${PREDEFINED_COMMANDS(true)}
%\\renewcommand{\\newcodecover}[1]{%
${COVER_PAGE_COMMAND_TEXT(true)}
%}
%% You can add your own packages and commands below
%{#preamble}
${
  hasPlots
    ? `\\usepackage{pgfplots}
\\pgfplotsset{compat=newest}
\\usetikzlibrary{patterns,arrows.meta}
\\usepgfplotslibrary{fillbetween}
`
    : ``
}
%{/preamble}
%% document body
\\begin{document}
`;

const tex_template_options = (no_options: number, q_no: number): string => {
  return `
  \\begin{enumerate}
${Array(no_options)
  .fill(0)
  .map((_, j) => {
    return `
    \\item
    %{#o}
    question ${q_no + 1}, Item ${j + 1}
    %{/o}`;
  })
  .join("\n")}

  \\end{enumerate}
  `;
};

export const tex_template_with_image = (no_qs: number): string => {
  const str_start = `${TEX_TEMPLATE_FRONT_MATTER()}
    
\\begin{enumerate}
\\item
%{#q}
    %% play with parameters of the minipage, vspace*, hspace* environments to control the positioning of your text and figures
    \\begin{minipage}[t][10cm][t]{0.5\\textwidth}
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi facilisis nulla semper justo convallis feugiat. Mauris ac orci ut nibh iaculis feugiat. Pellentesque nec molestie felis. Fusce condimentum risus quis nulla mollis, nec posuere augue rutrum. Sed semper orci a urna fermentum bibendum. Fusce tempor nunc in magna elementum convallis. Donec hendrerit consectetur orci a rutrum. Nullam nec nisi mattis, scelerisque dolor in, porta lectus. Cras non lectus turpis. Ut neque metus, accumsan at odio commodo, finibus faucibus felis. Proin ultricies erat sed nulla imperdiet, a molestie diam tincidunt. Donec tempus dui orci, sed eleifend purus dignissim sit amet. Fusce nibh arcu, sodales ac dignissim sed, finibus sit amet sapien.
    \\end{minipage}
    \\begin{minipage}[t][5cm][t]{0.5\\textwidth}
    %% replace the image(example-image) with your own
    \\vspace*{0.5cm}\\hspace*{1cm}%
    \\includegraphics[width=70mm,height=80mm]{example-image}
    \\end{minipage}
%{/q}
  ${tex_template_options(5, 0)}
    `;
  const str_qs = Array(no_qs - 1)
    .fill(0)
    .map((_, i) => {
      return `\\item
%{#q}
This is the body of question ${i + 2}
%{/q}
    ${tex_template_options(5, i + 1)}`;
    })
    .join("\n");
  const str_end = `\\end{enumerate} % end of questions items
\\end{document}
    `;
  return `${str_start}\n${str_qs}\n${str_end}`;
};

export const tex_template_with_plots = (no_qs: number): string => {
  const str_start = `${TEX_TEMPLATE_FRONT_MATTER(true)}
    
\\begin{enumerate}
\\item
%{#q}
    %% play with parameters of the minipage and textblock environments to control the positioning of your text and figures
    \\begin{minipage}[t][10cm][t]{0.5\\textwidth}
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi facilisis nulla semper justo convallis feugiat. Mauris ac orci ut nibh iaculis feugiat. Pellentesque nec molestie felis. Fusce condimentum risus quis nulla mollis, nec posuere augue rutrum. Sed semper orci a urna fermentum bibendum. Fusce tempor nunc in magna elementum convallis. Donec hendrerit consectetur orci a rutrum. Nullam nec nisi mattis, scelerisque dolor in, porta lectus. Cras non lectus turpis. Ut neque metus, accumsan at odio commodo, finibus faucibus felis. Proin ultricies erat sed nulla imperdiet, a molestie diam tincidunt. Donec tempus dui orci, sed eleifend purus dignissim sit amet. Fusce nibh arcu, sodales ac dignissim sed, finibus sit amet sapien.
    \\end{minipage}
    \\begin{minipage}[t][5cm][t]{0.5\\textwidth}
    %% to modify the plot, you can constult the documentation of pgfplots or use geogebra to create a plot and export as tikz
    \\vspace*{0.5cm}\\hspace*{1cm}%
    \\begin{tikzpicture}
    \\begin{axis}[
            axis x line=middle,
            axis y line=middle,
            axis on top,
            minor xtick={-2,-1,1,2},
            minor ytick={1,2},
            ytick={2},
            samples=1000,
            xlabel={$x$},
            ylabel={$y$},
            xmin=-3,xmax=3,
            ymin=-1,ymax=3,
            clip=false,
            ]

            \\node[node font=\\small, anchor=center, below left, inner sep=1pt] at (0,0){$O$};
            \\addplot[name path=F,domain={-3:2}]{sqrt(2-x)};
            \\node [node font=\\small, pin={[pin distance=6mm, pin edge={red!55!green, shorten <=-4pt,-Stealth}]-120:{}}] at (1.2,1.7) {$y=\\sqrt{2-x}$};
            \\addplot[name path=G, domain={-3:1}]{-x};
            \\path [name path=ox] (0,0) -- (2,0);
            \\addplot[fill=black, fill opacity=0.2] fill between [of=F and G, soft clip={domain=-2:0}];
            \\addplot[fill=black, fill opacity=0.2] fill between [of=F and ox, soft clip={domain=0:2}];
    \\end{axis}
    \\end{tikzpicture}
    \\end{minipage}
%{/q}
  ${tex_template_options(5, 0)}
    `;
  const str_qs = Array(no_qs - 1)
    .fill(0)
    .map((_, i) => {
      return `\\item
%{#q}
This is the body of question ${i + 2}
%{/q}
    ${tex_template_options(5, i + 1)}`;
    })
    .join("\n");
  const str_end = `\\end{enumerate} % end of questions items
\\end{document}
    `;
  return `${str_start}\n${str_qs}\n${str_end}`;
};

export const tex_template = (no_qs: number): string => {
  const str_start = `${TEX_TEMPLATE_FRONT_MATTER()}
    
\\begin{enumerate}
    `;
  const str_qs = Array(no_qs)
    .fill(0)
    .map((_, i) => {
      return `\\item
%{#q}
This is the body of question ${i + 1}
%{/q}
    ${tex_template_options(5, i)}`;
    })
    .join("\n");
  const str_end = `\\end{enumerate} % end of questions items
\\end{document}
    `;
  return `${str_start}\n${str_qs}\n${str_end}`;
};

export const txt_template = (no_qs: number): string => {
  return Array(no_qs)
    .fill(0)
    .map((_, i) => {
      const group = Array(5)
        .fill(0)
        .map((_, j) => j + 1)
        .sort(() => Math.random() - 0.5)[1];
      return `${group}	This is the body of question ${i + 1}	question ${
        i + 1
      },Item 1	question ${i + 1},Item 2	question ${i + 1},Item 3	question ${
        i + 1
      },Item 4	question ${i + 1},Item 5`;
    })
    .join("\n");
};

export const csv_template = (no_qs: number): string => {
  return Array(no_qs)
    .fill(0)
    .map((_, i) => {
      const group = Array(5)
        .fill(0)
        .map((_, j) => j + 1)
        .sort(() => Math.random() - 0.5)[1];
      return `${group},"This is the body of question ${i + 1}","question ${
        i + 1
      },Item 1","question ${i + 1},Item 2","question ${
        i + 1
      },Item 3","question ${i + 1},Item 4","question ${i + 1},Item 5"`;
    })
    .join("\n");
};
export const exam_template = `%{DOC_PREAMBLE}
%{COMMANDS_DEFINITIONS}
%{USER_PREAMBLE}
\\begin{document}
%{COVER_PAGE}
%{VERSIONS}
%{KEY_ANSWER}
%{ANSWER_COUNT}
\\end{document}
`;

export const TEMPLATE_COMMANDS_DEFINITIONS = ({
  old_preamble,
  isTemplate,
}: {
  old_preamble: string;
  isTemplate: boolean;
}): string => `
${SHARED_FROM_MATTER}
%\\renewcommand{\\newcodecover}[1]{${
  isTemplate ? "\n" + COVER_PAGE_COMMAND_TEXT(true) + "\n%}" : "}"
}
%{#preamble}${old_preamble === "" ? "" : "\n" + old_preamble + "\n"}
%{/preamble}
`;

export const DOC_PREAMBLE = (
  no_qs: number,
  isForTemplete: boolean,
  paperSize: PaperSize = PaperSize.A4
): string => `\\documentclass[leqno,fleqn,12pt]{article}
% exam paper size and margins
\\usepackage[${
  paperSize === PaperSize.A4 ? "a4paper" : "paperheight=33cm,paperwidth=21.5cm"
},top=2cm,bottom=1cm,left=1cm,right=1cm]{geometry}

% math packages
\\usepackage{mathtools}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{amsfonts}

% graphics packages
\\usepackage{graphicx}
\\usepackage[final]{qrcode}
\\usepackage[most]{tcolorbox}
${no_qs > 49 ? "\\usepackage{longtable}" : ""}
\\renewcommand{\\theequation}{\\alph{equation}}
\\thicklines
\\pagestyle{myheadings}
${PREDEFINED_COMMANDS(isForTemplete)}
`;

export const COVER_PAGE = `
%% MASTER COVER PAGE
\\thispagestyle{empty}
\\begin{large}
    \\begin{center}
        {UNIVERSITY_NAME}\\\\ 
        {DEPT_NAME} \\\\ 
        \\vspace*{2cm}
        {\\bf {COURSE_CODE} }  \\\\
        {\\bf {EXAM_NAME} }  \\\\
        {\\bf {TERM} }  \\\\
        {\\bf {EXAM_DATE} }  \\\\ 

        \\vspace*{3cm}
        {\\bf{\\Huge{\\fbox{EXAM COVER}}}}\\\\
        \\vspace*{2cm}
        {\\bf Number of versions: {NUM_OF_VERSIONS} }  \\\\
        {\\bf Number of questions: {NUM_OF_QUESTIONS} }  \\\\
        % {\\bf Number of Answers: {NUM_OF_ANSWERS}  }  \\\\
        \\vspace*{0.2cm}
    
    \\vfill

    \\begin{minipage}[b][3ex][b]{0.6\\textwidth}
    \\tiny{This exam was prepared using MC Exam Randomizer.}\\\\
    \\tiny{For questions send an email to Dr. Mohammed Alshahrani (mshahrani@kfupm.edu.sa) }
    \\tiny{You can download it by scanning the code}
    \\end{minipage}
    \\begin{minipage}{0.3\\textwidth}
    \\hfill \\tiny{\\qrcode{https://github.com/mmogib/mc-exam-randomizer-app/releases}}\\\\
    \\end{minipage}
    
\\end{center}
\\end{large}
\\newpage`;

export const TEMPLATE_COVER_PAGE = `
%% This is the cover page for the template
\\thispagestyle{empty}
\\begin{large}
  \\begin{center}
        {UNIVERSITY_NAME} \\\\
        {DEPT_NAME}  \\\\
        {\\bf {COURSE_CODE} } \\\\ 
        {\\bf {EXAM_NAME}  } \\\\
        {\\bf  {TERM} }  \\\\
        {\\bf {EXAM_DATE} }  \\\\ 
        {\\bf Net Time Allowed: {TIME_ALLOWED} }  \\\\
        \\vspace*{6cm}
        {\\bf {\\Huge{USE THIS AS A TEMPLATE}}}  \\\\
        \\vspace*{2cm}
        {\\bf Write your questions, once you are satisfied upload this file.}  \\\\
        \\end{center}
  \\end{large}
\\newpage
\\renewcommand{\\thepage}{\\noindent {TERM}, {COURSE_CODE}, {EXAM_NAME} \\hfill Page {\\bf \\arabic{page} of {NUM_PAGES} } \\hfill {\\bf \\fbox{ MASTER }}}
\\setcounter{page}{1}
`;

export const MASTER_COVER_PAGE = `
\\thispagestyle{empty}
\\begin{large}
    \\begin{center}
        {UNIVERSITY_NAME} \\\\
        {DEPT_NAME}  \\\\
        {\\bf {COURSE_CODE} } \\\\ 
        {\\bf {EXAM_NAME}  } \\\\
        {\\bf  {TERM} }  \\\\
        {\\bf {EXAM_DATE} }  \\\\ 
        {\\bf Net Time Allowed: {TIME_ALLOWED} }  \\\\
        \\vspace*{6cm}
        {\\bf {\\Huge{MASTER VERSION}}}  \\\\
      \\end{center}
\\end{large}
\\newpage
\\renewcommand{\\thepage}{\\noindent {TERM}, {COURSE_CODE}, {EXAM_NAME} \\hfill Page {\\bf \\arabic{page} of {NUM_PAGES} } \\hfill {\\bf \\fbox{ MASTER }}}
\\setcounter{page}{1}
`;

export const odd_question = `
\\item #{QUESTION_TEXT}
\\bodyoptionseparator
\\setcounter{equation}{0}
#{QUESTION_OPTION}
\\questionseparator
`;

export const even_question = `
\\item #{QUESTION_TEXT}
\\bodyoptionseparator
\\setcounter{equation}{0}
#{QUESTION_OPTION}
\\eogseparator
`;

export const code_template = `%{CODE_COVER_PAGE}
%{QUESTIONS_TEMPLATE}
`;

export const CODE_COVER_PAGE = `
\\newcodecover{{CODE_NAME}}
\\renewcommand{\\thepage}{\\noindent {TERM}, {COURSE_CODE}, {EXAM_NAME} \\hfill Page {\\bf \\arabic{page} of {NUM_PAGES} } \\hfill {\\bf \\fbox{ {CODE_NAME} }}}
\\setcounter{page}{1}`;

export const KEY_ANSWER = (no_qs: number): string => `%% KEY ANSWER Page
\\newpage
\\renewcommand{\\thepage}{\\noindent {COURSE_CODE}, {TERM}, {EXAM_NAME} \\hfill {\\bf \\fbox{Answer KEY}}}
\\begin{normalsize}
\\setcounter{page}{1}
\\vspace {1cm}

\\begin{center}

  ${
    no_qs > 49 ? "\\begin{longtable}" : "\\begin{tabular}"
  }{|c||c | {AKEY_TABS}|}
  \\hline
  {HEADER} \\\\ \\hline 
  {KEY_BODY}
  \\\\ \\hline 
  ${no_qs > 49 ? "\\end{longtable}" : "\\end{tabular}"}
    
\\end{center}
\\end{normalsize}
`;

export const ANSWER_COUNT = `%% This is the answer count page
\\newpage
\\renewcommand{\\thepage}{\\noindent {COURSE_CODE}, {TERM}, {EXAM_NAME} \\hfill {\\bf \\fbox{Answer Counts}}}
\\begin{normalsize}
\\begin{center}
\\vspace {1cm}

\\begin{Large}
Answer Counts \\\\
\\end{Large}
\\vspace {1cm}

  \\begin{tabular}{|c||{ANSWER_COUNT_TABLE_HEADER}| 
}
  \\hline
  {ANSWER_COUNT_HEADER}\\\\ \\hline
  {ANSWER_COUNT_BODY}
  \\\\ \\hline 

  \\end{tabular}

\\end{center}
\\end{normalsize}
\\newpage`;

export const questions_template = ` %% questions start here
\\begin{large}
\\begin{enumerate}
%{QUESTIONS}
\\end{enumerate}
\\end{large}`;
