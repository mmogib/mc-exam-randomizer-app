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

const COVER_PAGE_COMMAND_TEXT = (comment = false): string => `
%
${comment ? "%" : ""}\\newpage

${comment ? "%" : ""}\\thispagestyle{empty}
${comment ? "%" : ""}\\begin{center}
${comment ? "%" : ""}    \\begin{large}
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

${comment ? "%" : ""}    \\end{large}
${comment ? "%" : ""}\\end{center}

${comment ? "%" : ""}\\large{Name:  }\\hrulefill

${comment ? "%" : ""}\\vspace{3mm}

${
  comment ? "%" : ""
}\\large{ID: } \\hrulefill \\large{  Sec: } \\hrulefill \\large{

${comment ? "%" : ""}\\vspace{1cm}

${
  comment ? "%" : ""
}\\large{\\bf{Check that this exam has {\\underline{ {NUM_OF_QUESTIONS} }} questions.}}

${comment ? "%" : ""}\\vspace{1cm}

${comment ? "%" : ""}\\underline{\\large{\\bf Important Instructions:}}
${comment ? "%" : ""}\\begin{enumerate}
${comment ? "%" : ""}    \\begin{normalsize}
${
  comment ? "%" : ""
}        \\item  All types of calculators, pagers or mobile phones are NOT allowed during the examination.
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
${comment ? "%" : ""}}

${comment ? "%" : ""}\\newpage
`;

export const TEMPLATE_COMMANDS_DEFINITIONS = `
\\newcommand{\\newcodecover}[1]{%
}
%{#preamble}
%%  put your preamble here
%% You can also redefine the following commans
%% \\bodyoptionseparator, \\questionseparator, \\newcodecover
%% by typing
% \\renewcommand{\\bodyoptionseparator}{\\vspace {0.8cm}}
% \\renewcommand{\\questionseparator}{\\vspace {3.5cm}}
% \\renewcommand{\\newcodecover}[1]{ %
${COVER_PAGE_COMMAND_TEXT(true)}
%}

%{/preamble}
`;
export const COMMANDS_DEFINITIONS = `
\\newcommand{\\newcodecover}[1]{%
${COVER_PAGE_COMMAND_TEXT(false)}
}
`;
export const DOC_PREAMBLE = `\\documentclass[leqno,fleqn,12pt,a4paper]{article}
\\usepackage{amsfonts}
\\usepackage{graphicx}
\\usepackage[final]{qrcode}
\\usepackage[overlay]{textpos}
\\setlength{\\TPHorizModule}{1mm}
\\setlength{\\TPVertModule}{1mm}
\\topmargin=-1.9cm
\\textheight=26.5cm
\\footskip=.8cm
\\oddsidemargin=-.1cm
\\textwidth=16.95cm
\\arraycolsep=.4cm
\\labelsep=.75cm
\\renewcommand{\\theequation}{\\alph{equation}}
\\thicklines
\\pagestyle{myheadings}
\\newcommand{\\bodyoptionseparator}{\\vspace {0.8cm}}
\\newcommand{\\questionseparator}{\\vspace {3.5cm}}
`;

export const COVER_PAGE = `
\\thispagestyle{empty}
\\begin{center}
    \\begin{large}
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
    \\end{large}

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

\\newpage`;

export const TEMPLATE_COVER_PAGE = `
\\thispagestyle{empty}
\\begin{center}
    \\begin{large}
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
    \\end{large}
\\end{center}

\\newpage


\\renewcommand{\\thepage}{\\noindent {TERM}, {COURSE_CODE}, {EXAM_NAME} \\hfill Page {\\bf \\arabic{page} of {NUM_PAGES} } \\hfill {\\bf \\fbox{ MASTER }}}
\\setcounter{page}{1}
`;

export const MASTER_COVER_PAGE = `
\\thispagestyle{empty}
\\begin{center}
    \\begin{large}
        {UNIVERSITY_NAME} \\\\
        {DEPT_NAME}  \\\\
        {\\bf {COURSE_CODE} } \\\\ 
        {\\bf {EXAM_NAME}  } \\\\
        {\\bf  {TERM} }  \\\\
        {\\bf {EXAM_DATE} }  \\\\ 
        {\\bf Net Time Allowed: {TIME_ALLOWED} }  \\\\
        \\vspace*{6cm}
        {\\bf {\\Huge{MASTER VERSION}}}  \\\\
    \\end{large}
\\end{center}

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

\\newpage

`;

export const code_template = `%{CODE_COVER_PAGE}
%{QUESTIONS_TEMPLATE}
`;

export const CODE_COVER_PAGE = `

\\newcodecover{{CODE_NAME}}

\\renewcommand{\\thepage}{\\noindent {TERM}, {COURSE_CODE}, {EXAM_NAME} \\hfill Page {\\bf \\arabic{page} of {NUM_PAGES} } \\hfill {\\bf \\fbox{ {CODE_NAME} }}}
\\setcounter{page}{1}`;

export const KEY_ANSWER = `

\\newpage

\\renewcommand{\\thepage}{\\noindent {COURSE_CODE}, {TERM}, {EXAM_NAME} \\hfill {\\bf \\fbox{Answer KEY}}}
\\begin{normalsize}
\\setcounter{page}{1}
\\vspace {1cm}

\\begin{center}

  \\begin{tabular}{|c||c | {AKEY_TABS}|}
  \\hline
  {HEADER} \\\\ \\hline 
  {KEY_BODY}
  \\\\ \\hline 
  \\end{tabular}
    
\\end{center}
\\end{normalsize}
`;

export const ANSWER_COUNT = `
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

export const questions_template = `
\\begin{large}
\\begin{enumerate}
%{QUESTIONS}
\\end{enumerate}
\\end{large}`;
