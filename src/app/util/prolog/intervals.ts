// language=Prolog
const intervalsPro: string = String.raw`
:- use_module(library(lists)).

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
    
% subtract/3
% comments bellow signify tha amount of intervals in sum constructs
% n - 0
subtract(sum(A), sum([]), B) :-
    member(B, A),
    valid(B).
% 1 - 1
subtract(sum([A]), sum([interval(B_s, _)]), R) :-
    intersection([A, interval(-inf, B_s)], R).
subtract(sum([A]), sum([interval(_, B_e)]), R) :-
    intersection([A, interval(B_e, inf)], R).
% 1 - n, n >= 2
subtract(A, sum([B|T]), R) :-
    T \= [],
    A = sum([_]),
    subtract(A, sum([B]), P),
    subtract(sum([P]), sum(T), R).
% m - n, m, n >= 1
subtract(sum([A|T]), S, R) :-
    S = sum([_|_]),
    T \= [],
    (
        ( subtract(sum([A]), S, R) )
        ; ( subtract(sum(T), S, R) )
    ).

% negate/2
negate(sum([]), interval(-inf, inf)).
negate(sum([Interval|T]), R) :- 
    subtract(sum([interval(-inf, inf)]), sum([Interval]), NegatedInterval),
    negate(sum(T), NegatedTail),
    intersection([NegatedInterval, NegatedTail], R).
    
% negate_to_sum/2
negate_to_sum(L, sum(R)) :-
    findall(X, negate(L, X), R).
    
% common_window_allowlist/2
% sum intersection
% one allowlist case
common_window_allowlist([sum([A|T])], R) :- 
    (valid(A), A = R)
    ; common_window_allowlist([sum(T)], R).
% two allowlists case
% 1 and 1
common_window_allowlist([sum([A_event]), sum([B_event])], R) :-
    intersection([A_event, B_event], R).
% n >= 2 and 1
common_window_allowlist([sum([A_event|[_|_]]), sum([B_event])], R) :-
    common_window_allowlist([sum([A_event]), sum([B_event])], R).
common_window_allowlist([sum([_|A_tail]), sum([B_event])], R) :-
    A_tail = [_|_],
    common_window_allowlist([sum(A_tail), sum([B_event])], R).
% n and m >= 2
common_window_allowlist([A_allowlist, sum([B_event|[_|_]])], R) :-
    common_window_allowlist([A_allowlist, sum([B_event])], R).
common_window_allowlist([A_allowlist, sum([_|B_tail])], R) :-
    B_tail \= [],
    common_window_allowlist([A_allowlist, sum(B_tail)], R).
% n allowlists case
common_window_allowlist([A, B|T], R) :- 
    T \= [],
    common_window_allowlist([A, B], S),
    common_window_allowlist([sum([S])|T], R).
    
    
% common_window_blocklist/2
% returns all intervals that are not blocked by any blocklist
common_window_blocklist([], interval(-inf, inf)).
common_window_blocklist([L|T], R) :-
    findall(BL, common_window_blocklist(T, BL), List),
    subtract(sum(List), L, R),
    valid(R).
    

% common_window/2
% takes: array of two element arrays (allowlist and blocklist) representing
%           when the people represented by the arrays 
%           can or cannot schedule another event
% returns: all intervals when the people can schedule another event

% transpose_n_by_2_array/2 (used only by common_window/2)
transpose_n_by_2_array([[], []], []).
transpose_n_by_2_array([[A|T1], [B|T2]], [[A, B]| T3]) :-
    transpose_n_by_2_array([T1, T2], T3).
common_window(List, R) :-
    transpose_n_by_2_array([Allowlist, Blocklist], List),
    findall(OneAllowed, common_window_allowlist(Allowlist, OneAllowed), AllAllowed),
    findall(OneNotBlocked, common_window_blocklist(Blocklist, OneNotBlocked), AllNotBlocked),
    negate_to_sum(sum(AllNotBlocked), sum(AllBlocked)),
    subtract(sum(AllAllowed), sum(AllBlocked), R).
`;
export {intervalsPro};