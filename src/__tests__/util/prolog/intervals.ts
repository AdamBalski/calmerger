import {test} from "@jest/globals";
import {intervalsPro} from "../../../app/util/prolog/intervals";
import {expectOutputToBe, expectToBeFalse, expectToBeTrue} from "../../../app/util/testing-utils/prologTestFacade";

const pl = require("tau-prolog");
require("tau-prolog/modules/promises.js")(pl);
require("tau-prolog/modules/lists.js")(pl);
const session = pl.create();

describe("num/1", () => {
    test('num 1', expectToBeTrue(session, intervalsPro, "num(1.0)."));
    test('num 2', expectToBeTrue(session, intervalsPro, "num(-2)."));
    test('num 3', expectToBeTrue(session, intervalsPro, "num(inf)."));
    test('num false 1', expectToBeFalse(session, intervalsPro, "num(apple)."));
    test('num false 2', expectToBeFalse(session, intervalsPro, "num([3])."));
})

describe("eq/2, neq/2, lt/2, gt/2, leq/2, geq/2", () => {
   test('eq false 1', expectToBeFalse(session, intervalsPro, "eq(3.0, 4).")) ;
    test('eq false 2', expectToBeFalse(session, intervalsPro, "eq(-inf, inf).")) ;
    test('eq false 3', expectToBeFalse(session, intervalsPro, "eq(-inf, 4).")) ;
    test('eq false 4', expectToBeFalse(session, intervalsPro, "eq(4.0, nan).")) ;
    test('eq 1', expectToBeTrue(session, intervalsPro, "eq(-inf, -inf).")) ;
    test('eq 2', expectToBeTrue(session, intervalsPro, "eq(4.0, 4).")) ;

    test('neq 1', expectToBeTrue(session, intervalsPro, "neq(3.0, 4).")) ;
    test('neq 2', expectToBeTrue(session, intervalsPro, "neq(-inf, inf).")) ;
    test('neq 3', expectToBeTrue(session, intervalsPro, "neq(-inf, 4).")) ;
    test('neq 4', expectToBeTrue(session, intervalsPro, "neq(4.0, nan).")) ;
    test('neq false 1', expectToBeFalse(session, intervalsPro, "neq(-inf, -inf)."));
    test('neq false 2', expectToBeFalse(session, intervalsPro, "neq(4.0, 4)."));

    test('lt 1', expectToBeTrue(session, intervalsPro, "lt(1, 2.0)."));
    test('lt 2', expectToBeTrue(session, intervalsPro, "lt(1, 10)."));
    test('lt 3', expectToBeTrue(session, intervalsPro, "lt(1, inf)."));
    test('lt 4', expectToBeTrue(session, intervalsPro, "lt(-inf, inf)."));
    test('lt 5', expectToBeTrue(session, intervalsPro, "lt(-inf, -0.9)."));
    test('lt false 1', expectToBeFalse(session, intervalsPro, "lt(2, 1.0)."));
    test('lt false 2', expectToBeFalse(session, intervalsPro, "lt(inf, 2.0)."));
    test('lt false 3', expectToBeFalse(session, intervalsPro, "lt(inf, -inf)."));
    test('lt false 4', expectToBeFalse(session, intervalsPro, "lt(-inf, -inf)."));

    test('gt', expectToBeTrue(session, intervalsPro, "gt(3, 2.0)."));
    test('gt false', expectToBeFalse(session, intervalsPro, "gt(1, 2.0)."));

    test('geq', expectToBeTrue(session, intervalsPro, "geq(2, 2.0)."));
    test('geq', expectToBeTrue(session, intervalsPro, "geq(3, 2.0)."));
    test('geq false', expectToBeFalse(session, intervalsPro, "geq(1, 2.0)."));

    test('leq', expectToBeTrue(session, intervalsPro, "leq(1, 2.0)."));
    test('leq false', expectToBeFalse(session, intervalsPro, "leq(3.0, 2)."));
});

describe("min/3, max/3", () => {
    test('min', expectToBeTrue(session, intervalsPro,  "min(4, 3, 3)."));
    test('min false', expectToBeFalse(session, intervalsPro,  "min(4, 3, 4)."));
    test('min search', expectOutputToBe(session, intervalsPro,  "min(4, 3, R).", ["R = 3"]));
    test('min search 2', expectOutputToBe(session, intervalsPro,  "min(-inf, -inf, R).", ["R = - inf"]));

    test('max 1', expectToBeTrue(session, intervalsPro,  "max(4, 3, 4)."));
    test('max 2', expectToBeTrue(session, intervalsPro,  "max(-inf, 3, 3)."));
    test('max 3', expectToBeTrue(session, intervalsPro,  "max(4, inf, inf)."));
    test('max false ', expectToBeFalse(session, intervalsPro,  "max(4, 3, 40)."));
    test('max search 1', expectOutputToBe(session, intervalsPro,  "max(4, 3, R).", ["R = 4"]));
    test('max search 2', expectOutputToBe(session, intervalsPro,  "max(inf, 3, R).", ["R = inf"]));
    test('max search 3', expectOutputToBe(session, intervalsPro,  "max(-inf, 3, R).", ["R = 3"]));
    test('max search 4', expectOutputToBe(session, intervalsPro,  "max(-inf, -inf, R).", ["R = - inf"]));
});

describe("valid/1", () => {
   test('invalid 1', expectToBeFalse(
       session, intervalsPro, "valid(interval(5, 5))."
   ));
    test('invalid 2', expectToBeFalse(
        session, intervalsPro, "valid(interval(7, 6))."
    ));
    test('invalid 3', expectToBeFalse(
        session, intervalsPro, "valid(interval(5, -inf))."
    ));
    test('invalid 4', expectToBeFalse(
        session, intervalsPro, "valid(interval(inf, -inf))."
    ));
    test('valid 1', expectToBeTrue(
        session, intervalsPro, "valid(interval(-inf, 3))."
    ));
    test('valid 2', expectToBeTrue(
        session, intervalsPro, "valid(interval(-6, 3.3))."
    ));
    test('valid 3', expectToBeTrue(
        session, intervalsPro, "valid(interval(-inf, inf))."
    ));
});

describe("intersection/2", () => {
   test('intersection (0 intervals)', expectToBeTrue(
       session,
       intervalsPro,
       "intersection([], interval(-inf, inf))."
   ));
    test('intersection (0 intervals) search', expectOutputToBe(
        session,
        intervalsPro,
        "intersection([], R).",
        ["R = interval(- inf,inf)"]
    ));

    test('intersection (1 interval) search 1', expectOutputToBe(
        session,
        intervalsPro,
        "intersection([interval(3, 5)], R).",
        ["R = interval(3,5)"]
    ));
    test('intersection (1 interval) search 2', expectToBeFalse(
        session,
        intervalsPro,
        "intersection([interval(5.0, 5)], R).",
    ));
    test('intersection (1 interval) search 3', expectOutputToBe(
        session,
        intervalsPro,
        "intersection([interval(3, inf)], R).",
        ["R = interval(3,inf)"]
    ));

    test('intersection (2 intervals) search 1', expectOutputToBe(
        session,
        intervalsPro,
        "intersection([interval(1, 10), interval(2, inf)], R).",
        ["R = interval(2,10)"]
    ));
    test('intersection (2 intervals) search 2', expectOutputToBe(
        session,
        intervalsPro,
        "intersection([interval(1, 10), interval(-inf, 3)], R).",
        ["R = interval(1,3)"]
    ));
    test('intersection (2 intervals) search 3', expectOutputToBe(
        session,
        intervalsPro,
        "intersection([interval(-inf, inf), interval(3, 4)], R).",
        ["R = interval(3,4)"]
    ));
    test('intersection (2 intervals) search 4', expectOutputToBe(
        session,
        intervalsPro,
        "intersection([interval(1, 3), interval(1.4, 1.4)], R).",
        []
    ));
    test('intersection (2 intervals) search 4', expectOutputToBe(
        session,
        intervalsPro,
        "intersection([interval(1, 3), interval(4, 5)], R).",
        []
    ));
    test('intersection (2 intervals) search 4', expectOutputToBe(
        session,
        intervalsPro,
        "intersection([interval(4, 5), interval(1, 3)], R).",
        []
    ));

    test('intersection (n intervals) search', expectOutputToBe(
        session,
        intervalsPro,
        "intersection([interval(-inf, 3), interval(-10, inf), interval(-8, 4)], R).",
        ["R = interval(-8,3)"]
    ));
});

describe('subtract/3', () => {
    test("subtract (n-0) search 1", expectOutputToBe(
        session,
        intervalsPro,
        "subtract(sum([interval(-inf, 2)]), sum([]), R).",
        ["R = interval(- inf,2)"]
    ));
    test("subtract (n-0) search 2", expectOutputToBe(
        session,
        intervalsPro,
        "subtract(sum([interval(inf, -3)]), sum([]), R).",
        []
    ));
    test("subtract (n-0) search 3", expectOutputToBe(
        session,
        intervalsPro,
        "subtract(sum([interval(-inf, 3), interval(4, 5.5)]), sum([]), R).",
        [
            "R = interval(- inf,3)",
            "R = interval(4,5.5)"
        ]
    ));

    test("subtract (1-1) search 1", expectOutputToBe(
        session,
        intervalsPro,
        "subtract(sum([interval(1, 3)]), sum([interval(-4, -5)]), R).",
        ["R = interval(1,3)"]
    ));
    test("subtract (1-1) search 2", expectOutputToBe(
        session,
        intervalsPro,
        "subtract(sum([interval(1, 2)]), sum([interval(1, 3)]), R).",
        []
    ));
    test("subtract (1-1) search 3", expectOutputToBe(
        session,
        intervalsPro,
        "subtract(sum([interval(1, 10)]), sum([interval(2, 4)]), R).",
        [
            "R = interval(1,2)",
            "R = interval(4,10)"
        ]
    ));

    test("subtract (1-n, n>=2) search 1", expectOutputToBe(
        session,
        intervalsPro,
        "subtract(sum([interval(1, 10)]), sum([interval(0, 5), interval(5, 4.0), interval(5, 10)]), R).",
        []
    ));
    test("subtract (1-n, n>=2) search 2", expectOutputToBe(
        session,
        intervalsPro,
        "subtract(sum([interval(1, 10)]), sum([interval(0, 5), interval(5, 4.0), interval(6, 10)]), R).",
        ["R = interval(5,6)"]
    ));
    test("subtract (1-n, n>=2) search 3", expectOutputToBe(
        session,
        intervalsPro,
        "subtract(sum([interval(1, 10)]), sum([interval(1, 3), interval(5, 4.0), interval(6, 9)]), R).",
        ["R = interval(3,5)", "R = interval(4.0,6)", "R = interval(9,10)"]
    ));

    test("subtract (m - n; m, n >= 1) search 1", expectOutputToBe(
        session,
        intervalsPro,
        "subtract(sum([interval(1, 10), interval(11, 20)]), sum([interval(3, 4), interval(9, 19)]), R).",
        ["R = interval(1,3)", "R = interval(4,9)", "R = interval(19,20)"]
    ));
});

describe("negate/2", () => {
    test("negate (0 intervals) search 1", expectOutputToBe(
        session,
        intervalsPro,
        "negate(sum([]), R).",
        ["R = interval(- inf,inf)"]
    ));

    test("negate (1 interval) search 1", expectOutputToBe(
        session,
        intervalsPro,
        "negate(sum([interval(1, 2)]), R).",
        ["R = interval(- inf,1)", "R = interval(2,inf)"]
    ));
    test("negate (1 interval) search 1", expectOutputToBe(
        session,
        intervalsPro,
        "negate(sum([interval(-inf, 2)]), R).",
        ["R = interval(2,inf)"]
    ));
    test("negate (1 interval) search 3", expectOutputToBe(
        session,
        intervalsPro,
        "negate(sum([interval(-inf, inf)]), R).",
        []
    ));

    test("negate (n intervals) search 1", expectOutputToBe(
        session,
        intervalsPro,
        "negate(sum([interval(0, 1), interval(2, 3)]), R).",
        ["R = interval(- inf,0)", "R = interval(1,2)", "R = interval(3,inf)"]
    ));
});

describe("negate_to_sum/2", () => {
    test("negate_to_sum search 1", expectOutputToBe(
        session,
        intervalsPro,
        "negate_to_sum(sum([interval(0, 1), interval(2, 3)]), R).",
        ["R = sum([interval(- inf,0),interval(1,2),interval(3,inf)])"]
    ));
});

describe("common_window_allowlist/2", () => {
    test("common_window_allowlist (1) search 1", expectOutputToBe(
        session,
        intervalsPro,
        "common_window_allowlist([sum([interval(1, 2), interval(3, 4), interval(5, 5)])], R).",
        ["R = interval(1,2)", "R = interval(3,4)"]
    ));

    test("common_window_allowlist (2) search 1", expectOutputToBe(
        session,
        intervalsPro,
        `common_window_allowlist([
            sum([interval(1, 2), interval(3, 4)]),
            sum([interval(1, 6)])
        ], R).`,
        ["R = interval(1,2)", "R = interval(3,4)"]
    ));

    test("common_window_allowlist (2) search 2", expectOutputToBe(
        session,
        intervalsPro,
        `common_window_allowlist([
            sum([interval(1, 2), interval(3, 4), interval(5, 4)]),
            sum([interval(1, 6)])
        ], R).`,
        ["R = interval(1,2)", "R = interval(3,4)"]
    ));
    test("common_window_allowlist (2) search 3", expectOutputToBe(
        session,
        intervalsPro,
        `common_window_allowlist([
            sum([interval(1, 2), interval(3, 4), interval(5, 5.6)]),
            sum([interval(2.5, 3.5), interval(4.5, 6)])
        ], R).`,
        ["R = interval(3,3.5)", "R = interval(5,5.6)"]
    ));

    test("common_window_allowlist (n, m times) search 1", expectOutputToBe(
        session,
        intervalsPro,
        `common_window_allowlist([
            sum([interval(1, 2), interval(3, 4), interval(5, 5.6)]),
            sum([interval(2.5, 3.5), interval(4.5, 6)]),
            sum([interval(2.75, 5.3), interval(5.4, inf)])
        ], R).`,
        ["R = interval(3,3.5)", "R = interval(5,5.3)", "R = interval(5.4,5.6)"]
    ));
});

describe("common_window_blocklist/2", () => {
   test("common_window_blocklist (0 intervals) search 1", expectOutputToBe(
       session,
       intervalsPro,
       "common_window_blocklist([], R).",
       ["R = interval(- inf,inf)"]
   ));

   test("common_window_blocklist (1 list) search 1", expectOutputToBe(
       session,
       intervalsPro,
       "common_window_blocklist([sum([interval(1, 2), interval(3, 4)])], R).",
       ["R = interval(- inf,1)", "R = interval(2,3)", "R = interval(4,inf)"]
   ));

    test("common_window_blocklist (3 lists) search 1", expectOutputToBe(session, intervalsPro, `common_window_blocklist([
            sum([interval(1, 2), interval(3, 4)]),
            sum([interval(5, 6)]),
            sum([interval(2, 2.7)])
        ], R).`,
        [
            "R = interval(- inf,1)",
            "R = interval(2.7,3)",
            "R = interval(4,5)",
            "R = interval(6,inf)"
        ]));
});