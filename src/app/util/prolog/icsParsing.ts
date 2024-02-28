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
unfold([A, [BHead|BTail]|T], [A|PartialResult]) :-
    BHead \= ' ',
    unfold([[BHead|BTail]|T], PartialResult).
    
    
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

% iCal grammar
content_line(N, Params, V) --> name(N), params(Params), value_char(':'), value(V).

% params
params([]) --> [].
params([A|T]) --> param(A), params(T).
param(param(N, V)) --> value_char(';'), name(N), value_char('='), param_values(V).
param_values([V]) --> param_value(V).
param_values([V|T]) --> param_value(V), value_char(','), param_values(T).

% no distinction between iana-tokens and x-names for now
alphanumdash(A) --> [A], { member(A, "ABCDEFGHIJKLMNOPQRSTUVWXYZ-abcdefghijklmnopqrstuvwxyz0123456789") }.
name([A]) --> alphanumdash(A).
name([A|T]) --> alphanumdash(A), name(T).

param_value(A) --> paramtext(A) ; quoted(A).
paramtext([]) --> [].
paramtext([A|T]) --> safe_char(A), paramtext(T).
% non empty quoted string
quoted(A) --> value(['"']), qsafe_string(A), value(['"']).
qsafe_string([]) --> [].
qsafe_string([A|T]) --> qsafe_char(A), qsafe_string(T).

value([]) --> [].
value([A|T]) --> value_char(A), value(T).

value_char(Char) --> [Char], { char_code(Char, Code), (Code \= 127, (Code = 9 ; Code > 31)) }.
qsafe_char(Char) --> [Char], { phrase(value_char(Char), [Char]), Char \= '\"' }.
safe_char(Char) --> [Char], { phrase(qsafe_char(Char), [Char]), Char \= ':', Char \= ';', Char \= ',' }.
`;
export {icsParsingPro};