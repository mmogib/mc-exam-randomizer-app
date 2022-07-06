export const tex_template: string = `\\documentclass{article}
%{#preamble}

%%  put your preamble here
%% You can also redefine the following commans
%% \\bodyoptionseparator, \\questionseparator, \\newcodecover
%% by typing
%% \\renewcommand{\\bodyoptionseparator}{\\vspace {0.3in}}
%% \\renewcommand{\\questionseparator}{\\vspace {3.5cm}}
%% \\renewcommand{\\newcodecover}[1]{ }


%{/preamble}



\\begin{document}

\\begin{enumerate}
\\item
%{#q}
This is the body of question 1
%{/q}
\\begin{enumerate}
    \\item
    %{#o}
    Item 1
    %{/o}
    \\item
    %{#o}
    Item 2
    %{/o}
    \\item
    %{#o}
    Item 3
    %{/o}
    \\item
    %{#o}
    Item 4
    %{/o}
    \\item
    %{#o}
    Item 5
    %{/o}
\\end{enumerate}



\\item
%{#q}
This is the body of question 2
%{/q}
\\begin{enumerate}
    \\item
    %{#o}
    Item 1
    %{/o}
    \\item
    %{#o}
    Item 2
    %{/o}
    \\item
    %{#o}
    Item 3
    %{/o}
    \\item
    %{#o}
    Item 4
    %{/o}
    \\item
    %{#o}
    Item 5
    %{/o}
\\end{enumerate}

\\item
%{#q}
This is the body of question 3
%{/q}
\\begin{enumerate}
    \\item
    %{#o}
    Item 1
    %{/o}
    \\item
    %{#o}
    Item 2
    %{/o}
    \\item
    %{#o}
    Item 3
    %{/o}
    \\item
    %{#o}
    Item 4
    %{/o}
    \\item
    %{#o}
    Item 5
    %{/o}
\\end{enumerate}


\\item
%{#q}
This is the body of question 4
%{/q}
\\begin{enumerate}
    \\item
    %{#o}
    Item 1
    %{/o}
    \\item
    %{#o}
    Item 2
    %{/o}
    \\item
    %{#o}
    Item 3
    %{/o}
    \\item
    %{#o}
    Item 4
    %{/o}
    \\item
    %{#o}
    Item 5
    %{/o}
\\end{enumerate}

\\end{enumerate} % end of questions items

\\end{document}
`;

export const txt_template = `1	Question 1 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5
2	Question 2 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5
2	Question 3 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5
4	Question 4 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5
3	Question 5 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5
3	Question 6 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5
4	Question 7 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5
3	Question 8 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5`;

export const csv_template = `1,"Question 1 $\\int_0^1 x = \\frac{x^2}{2}+C$ text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
2,"Question, 2 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
3,"Question, 3 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
3,"Question, 4 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
4,"Question, 5 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
2,"Question, 6 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
3,"Question, 7 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
4,"Question, 8 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5`;
