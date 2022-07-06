
# MC Exam Randomizer

This app is designed to produce multiple choice exam with randomized
questions and randomized choices. Each question needs to have a body and
choices (answers). For example

> What is 1 + 1?
        <li>2</li>
        <li>1</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>

The body of the question is `What is 1 + 1?`and the options are `2,1,3,4,5`. In order to use this, you need upload your questions in a specific format. The formats supported so far are **LaTeX**, **CSV** (comma-separated) and **TXT** (tab-separated)

### LaTeX
You need to format your question according to the follwoing convention (see the file below). For example you may write the above example as
`{q}`. 
- __Note__ the question body has to between the tags `{qTags.qS}` before the body and `{qTags.qE}` after the body. 
- Also each answer is between the tags __`{qTags.oS}`__ and __`{qTags.oE}`__.
- Each tag is on a separate line. Further the correct answer is always the first one. 
- You can add your own packaged between the tags __`{qTags.pS}`__  and __`{qTags.pE}`__
- The correct answer must be always the first one. (You can change this through the app)

The app provides a template you can start from. Let's go through this template and explain how you can use it.


```latex 
\documentclass{article}
%{#preamble}

%%  put your preamble here
%% You can also redefine the following commans
%% \bodyoptionseparator, \questionseparator, \newcodecover
%% by typing
%% \renewcommand{\bodyoptionseparator}{\vspace {0.3in}}
%% \renewcommand{\questionseparator}{\vspace {3.5cm}}
%% \renewcommand{\newcodecover}[1]{ }


%{/preamble}



\begin{document}

\begin{enumerate}
\item
%{#q}
This is the body of question 1
%{/q}
\begin{enumerate}
    \item
    %{#o}
    Item 1
    %{/o}
    \item
    %{#o}
    Item 2
    %{/o}
    \item
    %{#o}
    Item 3
    %{/o}
    \item
    %{#o}
    Item 4
    %{/o}
    \item
    %{#o}
    Item 5
    %{/o}
\end{enumerate}



\item
%{#q}
This is the body of question 2
%{/q}
\begin{enumerate}
    \item
    %{#o}
    Item 1
    %{/o}
    \item
    %{#o}
    Item 2
    %{/o}
    \item
    %{#o}
    Item 3
    %{/o}
    \item
    %{#o}
    Item 4
    %{/o}
    \item
    %{#o}
    Item 5
    %{/o}
\end{enumerate}

\item
%{#q}
This is the body of question 3
%{/q}
\begin{enumerate}
    \item
    %{#o}
    Item 1
    %{/o}
    \item
    %{#o}
    Item 2
    %{/o}
    \item
    %{#o}
    Item 3
    %{/o}
    \item
    %{#o}
    Item 4
    %{/o}
    \item
    %{#o}
    Item 5
    %{/o}
\end{enumerate}


\item
%{#q}
This is the body of question 4
%{/q}
\begin{enumerate}
    \item
    %{#o}
    Item 1
    %{/o}
    \item
    %{#o}
    Item 2
    %{/o}
    \item
    %{#o}
    Item 3
    %{/o}
    \item
    %{#o}
    Item 4
    %{/o}
    \item
    %{#o}
    Item 5
    %{/o}
\end{enumerate}

\end{enumerate} % end of questions items

\end{document}

```
In this template there are three different pairs of tags.

- The first pair is `%{#preamble}` and `%{/preamble}`. Any latex code you write between these tags will be included in your exam before the `\begin{document}`. So you should use it for adding your own packages and commands. 
- The pair `%{#q}` and `%{/q}`. Here you write your question here. Any latex code you write here will be copied as is in the body of that question. 
- The pair  `%{#o}` and `%{/o}`. Here you write the content of the option. 

::: warning
Please note that each tag of these tags in always on a separate line. 
:::

The generated exam will define three commands `\bodyoptionseparator`, `\questionseparator` and `\newcodecover`.
- `\bodyoptionseparator`: it defines the spacing between the body of the question and the list of the options. The default is `0.3in`.
- `\questionseparator`: This defines the spacing between the first question on a page and the second question on the same page. The default is `3.5cm`.
- `\newcodecover`: This deines the content of cover page of the exam. This is where the students write their names and ids.
::: tip
You can change the above commands by redefining them and putting them between the tags `%{#preamble}` and `%{/preamble}`. Something like this 
```latex
%{#preamble} 
\renewcommand{\bodyoptionseparator}{\vspace {0.8cm}}
\renewcommand{\questionseparator}{\vspace {3.8cm}}
\renewcommand{\newcodecover}[1]{ %
%% what ever you like
%%
%
}
%{/preamble}
```
:::

### CSV/TEXT
This option is simpler. You can use Excel sheet without header. The first 
column is for the group of the question, the second column contains the question body. 
Each subsequent column
contains an answer. The first is always the correct answer. Then save
your file as `tab-separated` text file or a `comma-separated` csv
file. The resulting file should be similar to the file template below.

```csv 
1,"Question 1 $\\int_0^1 x = \\frac{x^2}{2}+C$ text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
2,"Question, 2 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
3,"Question, 3 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
3,"Question, 4 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
4,"Question, 5 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
2,"Question, 6 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
3,"Question, 7 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
4,"Question, 8 text goes here",Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
```
Let's try to unerstand this format. Here we have comma-separated format (`.csv` file). In this file we have 8 questions. The first column contains the group number of the question. This means the questions with the same group number will be randomized within this group. So question is group 1 and its the only one in this group which means that the app will keep this question always in the first position. Questions 2 and 6 belong to the same group 2. So after question 1 a random order of questions 2 and 6 will appear. And so on so forth.  