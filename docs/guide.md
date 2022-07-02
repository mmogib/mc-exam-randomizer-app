
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

The body of the question is `What is 1 + 1?`and the options are `2,1,3,4,5`. In order to use this, you need upload your questions in a specific format. The formats supported so far are

## LaTeX: 
You need to format your question according to the follwoing convention (see the file below). For example you may write the above example as
`{q}`. 
- __Note__ the question body has to between the tags `{qTags.qS}` before the body and `{qTags.qE}` after the body. 
- Also each answer is between the tags __`{qTags.oS}`__ and __`{qTags.oE}`__.
- Each tag is on a separate line. Further the correct answer is always the first one. 
- You can add your own packaged between the tags __`{qTags.pS}`__  and __`{qTags.pE}`__

## CSV/TEXT
This option is simpler. You can use Excel sheet without header. The
first column contains the question body. Each subsequent column
contains an answer. The first is always the correct answer. Then save
your file as `tab-delimited` text file or a `comma-separated` csv
file. The resulting file should be similar to the file template below.

```latex 
\begin{docuemnt}

\end{docuemnt}

```