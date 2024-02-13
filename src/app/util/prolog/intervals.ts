const intervalsPro: string = String.raw`
% Numbers: comparisons, mins and maxes
num(inf).
num(ninf).
num(A) :- number(A).


eq(inf, inf).
eq(ninf, ninf).
eq(A, B) :- number(A), number(B), A =:= B.

neq(A, B) :- \+ eq(A, B).

lt(ninf, A) :- number(A).
lt(A, inf) :- number(A).
lt(ninf, inf).
lt(A, B) :- number(A), number(B), A < B.

gt(A, B) :- lt(B, A).

leq(A, B) :- eq(A, B).
leq(A, B) :- lt(A, B).

geq(A, B) :- leq(B, A).

max(A, B, A) :- geq(A, B).
max(A, B, B) :- gt(B, A).
max(inf, inf, inf).
min(A, B, A) :- leq(A, B).
min(A, B, B) :- lt(B, A).
min(ninf, ninf, ninf).

valid(interval(Start, End)) :- lt(Start, End).
`;
export {intervalsPro};