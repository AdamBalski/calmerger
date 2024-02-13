import {test} from "@jest/globals";
import {intervalsPro} from "../../../app/util/prolog/intervals";
import {expectOutputToBe, expectToBeFalse, expectToBeTrue} from "../../../app/util/testing-utils/prologTestFacade";

const pl = require("tau-prolog");
require("tau-prolog/modules/promises.js")(pl);
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
    test('eq false 2', expectToBeFalse(session, intervalsPro, "eq(ninf, inf).")) ;
    test('eq false 3', expectToBeFalse(session, intervalsPro, "eq(ninf, 4).")) ;
    test('eq false 4', expectToBeFalse(session, intervalsPro, "eq(4.0, nan).")) ;
    test('eq 1', expectToBeTrue(session, intervalsPro, "eq(ninf, ninf).")) ;
    test('eq 2', expectToBeTrue(session, intervalsPro, "eq(4.0, 4).")) ;

    test('neq 1', expectToBeTrue(session, intervalsPro, "neq(3.0, 4).")) ;
    test('neq 2', expectToBeTrue(session, intervalsPro, "neq(ninf, inf).")) ;
    test('neq 3', expectToBeTrue(session, intervalsPro, "neq(ninf, 4).")) ;
    test('neq 4', expectToBeTrue(session, intervalsPro, "neq(4.0, nan).")) ;
    test('neq false 1', expectToBeFalse(session, intervalsPro, "neq(ninf, ninf)."));
    test('neq false 2', expectToBeFalse(session, intervalsPro, "neq(4.0, 4)."));

    test('lt 1', expectToBeTrue(session, intervalsPro, "lt(1, 2.0)."));
    test('lt 2', expectToBeTrue(session, intervalsPro, "lt(1, 10)."));
    test('lt 3', expectToBeTrue(session, intervalsPro, "lt(1, inf)."));
    test('lt 4', expectToBeTrue(session, intervalsPro, "lt(ninf, inf)."));
    test('lt 5', expectToBeTrue(session, intervalsPro, "lt(ninf, -0.9)."));
    test('lt false 1', expectToBeFalse(session, intervalsPro, "lt(2, 1.0)."));
    test('lt false 2', expectToBeFalse(session, intervalsPro, "lt(inf, 2.0)."));
    test('lt false 3', expectToBeFalse(session, intervalsPro, "lt(inf, ninf)."));
    test('lt false 4', expectToBeFalse(session, intervalsPro, "lt(ninf, ninf)."));

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

    test('max 1', expectToBeTrue(session, intervalsPro,  "max(4, 3, 4)."));
    test('max 2', expectToBeTrue(session, intervalsPro,  "max(ninf, 3, 3)."));
    test('max 3', expectToBeTrue(session, intervalsPro,  "max(4, inf, inf)."));
    test('max false ', expectToBeFalse(session, intervalsPro,  "max(4, 3, 40)."));
    test('max search 1', expectOutputToBe(session, intervalsPro,  "max(4, 3, R).", ["R = 4"]));
    test('max search 2', expectOutputToBe(session, intervalsPro,  "max(inf, 3, R).", ["R = inf"]));
    test('max search 3', expectOutputToBe(session, intervalsPro,  "max(ninf, 3, R).", ["R = 3"]));
});

describe("valid/1", () => {
   test('invalid 1', expectToBeFalse(
       session, intervalsPro, "valid(interval(5, 5))."
   ));
    test('invalid 2', expectToBeFalse(
        session, intervalsPro, "valid(interval(7, 6))."
    ));
    test('invalid 3', expectToBeFalse(
        session, intervalsPro, "valid(interval(5, ninf))."
    ));
    test('invalid 4', expectToBeFalse(
        session, intervalsPro, "valid(interval(inf, ninf))."
    ));
    test('valid 1', expectToBeTrue(
        session, intervalsPro, "valid(interval(ninf, 3))."
    ));
    test('valid 2', expectToBeTrue(
        session, intervalsPro, "valid(interval(-6, 3.3))."
    ));
    test('valid 3', expectToBeTrue(
        session, intervalsPro, "valid(interval(ninf, inf))."
    ));
});