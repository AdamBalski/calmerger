const intervalsPro: string = String.raw`
% Numbers: comparisons, mins and maxes
num(inf).
num(-inf).
num(A) :- number(A).

eq(inf, inf).
eq(-inf, -inf).
eq(A, B) :- number(A), number(B), A =:= B.

neq(A, B) :- \+ eq(A, B).

lt(-inf, A) :- number(A).
lt(A, inf) :- number(A).
lt(-inf, inf).
lt(A, B) :- number(A), number(B), A < B.

gt(A, B) :- lt(B, A).

leq(A, B) :- eq(A, B).
leq(A, B) :- lt(A, B).

geq(A, B) :- leq(B, A).

max(A, B, A) :- geq(A, B).
max(A, B, B) :- gt(B, A).
min(A, B, A) :- leq(A, B).
min(A, B, B) :- lt(B, A).

% valid/1
valid(interval(Start, End)) :- lt(Start, End).

% intersection/2
intersection([], interval(-inf, inf)).
intersection([Interval], Interval) :- 
    valid(Interval).
intersection([interval(A_start, A_end), interval(B_start, B_end)], interval(C_start, C_end)) :-
    max(A_start, B_start, C_start),
    min(A_end, B_end, C_end),
    valid(interval(C_start, C_end)).
intersection([A,B|T], R) :- 
    T \= [],
    intersection([A, B], C),
    intersection([C|T], R).
`;
export {intervalsPro};