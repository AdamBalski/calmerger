// relevant documentation:
// https://www.ietf.org/rfc/rfc5545.txt
// language=Prolog
const icsParsingPro: string = String.raw`
:- use_module(library(lists)).

% split a file into lines (file/2)
isNewLineChar(Char) :- 
    char_code(Char, 10) % \n
    ; char_code(Char, 13). % \r
% !/0 is needed so that containsNewLineChar(['\\n', '\\n']). would provide only one choice point
containsNewLineChar([A|T]) :-
    (isNewLineChar(A)
    ; containsNewLineChar(T)), !.
doesntContainNewLineChar([]).
doesntContainNewLineChar([L|T]) :-
    \+ isNewLineChar(L), doesntContainNewLineChar(T).
rewriteToFirstNewLineChar([A|T], [A|TR], RestOfFile) :-
    \+ isNewLineChar(A),
    rewriteToFirstNewLineChar(T, TR, RestOfFile).
rewriteToFirstNewLineChar([A|T], [], T) :-
    isNewLineChar(A).
    
% unfold/2
unfold([], []).
unfold([A], [A]).
unfold([A, [' '|BTail]|T], R) :- 
    append(A, BTail, ABTail),
    unfold([ABTail|T], R).
    
split(File, [File]) :-
    doesntContainNewLineChar(File).
split(File, [Line|LinesTail]) :-
    containsNewLineChar(File),
    rewriteToFirstNewLineChar(File, Line, RestOfFile),
    split(RestOfFile, LinesTail).

omitEmptyArrays([], []).
omitEmptyArrays([A|T], [A|R]) :- 
    A \= [],
    omitEmptyArrays(T, R).
omitEmptyArrays([[]|T], R) :- omitEmptyArrays(T, R).

fileToLines(File, Lines) :-
    split(File, Split),
    omitEmptyArrays(Split, NonEmptyArrays),
    unfold(NonEmptyArrays, Lines).
`;
export {icsParsingPro};