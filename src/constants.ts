export const tex_template = (no_qs: number): string => {
  const str_start = `\\documentclass{article}
%{#preamble}
    
%%  put your preamble here
%% You can also redefine the following commans
%% \\bodyoptionseparator, \\questionseparator, \\newcodecover
%% by typing
%\\renewcommand{\\bodyoptionseparator}{\\vspace {0.8cm}}
%\\renewcommand{\\questionseparator}{\\vspace {3.5cm}}
%\\renewcommand{\\newcodecover}[1]{ }

%{/preamble}

\\begin{document}
    
\\begin{enumerate}
    `;
  const str_qs = Array(no_qs)
    .fill(0)
    .map((_, i) => {
      return `\\item
%{#q}
This is the body of question ${i + 1}
%{/q}
    \\begin{enumerate}
    \\item
    %{#o}
    question ${i + 1}, Item 1
    %{/o}
    \\item
    %{#o}
    question ${i + 1}, Item 2
    %{/o}
    \\item
    %{#o}
    question ${i + 1}, Item 3
    %{/o}
    \\item
    %{#o}
    question ${i + 1}, Item 4
    %{/o}
    \\item
    %{#o}
    question ${i + 1}, Item 5
    %{/o}
    \\end{enumerate}`;
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
// export const txt_template = `1	Question 1 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5
// 2	Question 2 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5
// 2	Question 3 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5
// 4	Question 4 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5
// 3	Question 5 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5
// 3	Question 6 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5
// 4	Question 7 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5
// 3	Question 8 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5`;

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

// export const csv_template = `1,"Question 1 $\\int_0^1 x = \\frac{x^2}{2}+C$ text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
// 2,"Question, 2 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
// 3,"Question, 3 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
// 3,"Question, 4 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
// 4,"Question, 5 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
// 2,"Question, 6 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
// 3,"Question, 7 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
// 4,"Question, 8 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5`;
