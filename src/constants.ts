export const tex_template: string = `\\documentclass{article}
\\usepackage{amsfonts}
\\usepackage{amsmath}
\\usepackage{amssymb}

\\begin{document}

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


%{#q}
This is the body of question 3
%{//q}
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


\\end{document}
`;

export const csv_template = `Question 1 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5
Question 2 text goes here	Answer 1	Answer 2	Answer 3	Answer 4	Answer 5`;
