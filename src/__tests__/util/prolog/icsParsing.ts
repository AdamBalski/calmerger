import {test} from "@jest/globals";
import {icsParsingPro} from "../../../app/util/prolog/icsParsing";
import {
    expectOutputToBe,
    expectTo,
    expectToBeFalse,
    expectToBeTrue
} from "../../../app/util/testing-utils/prologTestFacade";
import {returnStatement} from "@babel/types";
import {intervalsPro} from "@/app/util/prolog/intervals";

const pl = require("tau-prolog");
require("tau-prolog/modules/promises.js")(pl);
require("tau-prolog/modules/lists.js")(pl);
const session = pl.create();

describe("rewriteToFirstNewLineChar/3", () => {
   test("isNewLineChar/1 1", expectToBeTrue(
       session,
       icsParsingPro,
       String.raw`isNewLineChar('\n').`
   ));
   test("isNewLineChar/1 2", expectToBeTrue(
       session,
       icsParsingPro,
       String.raw`isNewLineChar('\r').`
   ));
   test("isNewLineChar/1 false 1", expectToBeFalse(
       session,
       icsParsingPro,
       String.raw`isNewLineChar(x).`
   ));
   test("isNewLineChar/1 false 2", expectToBeFalse(
       session,
       icsParsingPro,
       String.raw`isNewLineChar('\t').`
   ));

   test("rewriteToFirstNewLineChar/3 search 2", expectOutputToBe(
       session,
       icsParsingPro,
       String.raw`
          rewriteToFirstNewLineChar("kqdle\nklwd", X, Y).
       `,
       ["X = [k,q,d,l,e], Y = [k,l,w,d]"]
   ));
   test("rewriteToFirstNewLineChar/3 search 3", expectOutputToBe(
       session,
       icsParsingPro,
       String.raw`
          rewriteToFirstNewLineChar("kqdle\r", X, Y).
       `,
       ["X = [k,q,d,l,e], Y = []"]
   ));
});

describe("fileToLines/2", () => {
   test("omitEmptyArrays/2 1", expectOutputToBe(
       session,
       icsParsingPro,
       "omitEmptyArrays([[], [], []], R).",
       ["R = []"]
   ));
    test("omitEmptyArrays/2 2", expectOutputToBe(
        session,
        icsParsingPro,
        "omitEmptyArrays([[], [l], [ri]], R).",
        ["R = [[l],[ri]]"]
    ));
    test("omitEmptyArrays/2 3", expectOutputToBe(
        session,
        icsParsingPro,
        "omitEmptyArrays([[x], [l], [ri]], R).",
        ["R = [[x],[l],[ri]]"]
    ));
    test("omitEmptyArrays/2 4", expectOutputToBe(
        session,
        icsParsingPro,
        "omitEmptyArrays([], R).",
        ["R = []"]
    ));

    test("split/2 1", expectToBeTrue(
       session,
       icsParsingPro,
       "split([], [[]])."
    ));
    test("split/2 2", expectOutputToBe(
        session,
        icsParsingPro,
        'split("\n\naa", R).',
        ["R = [[],[],[a,a]]"]
    ));
    test("split/2 3", expectToBeTrue(
        session,
        icsParsingPro,
        'split("xd", ["xd"]).'
    ));
});

describe("unfold/2", () => {
    test("unfold/2 1", expectOutputToBe(
        session,
        icsParsingPro,
        'unfold(["DESCRIPTION:This is a lo", " ng description", "  that exists on a long line"], R).',
        ["R = [[D,E,S,C,R,I,P,T,I,O,N,:,T,h,i,s, ,i,s, ,a, ,l,o,n,g, ,d,e,s,c,r,i,p,t,i,o,n, ,t,h,a,t, ,e,x,i,s,t,s, ,o,n, ,a, ,l,o,n,g, ,l,i,n,e]]"]
    ));
    test("unfold/2 2", expectOutputToBe(
        session,
        icsParsingPro,
        'unfold(["a", "xd"]).',
        ["R = [[a],[x,d]]"]
    ));
    test("unfold/2 2", expectOutputToBe(
        session,
        icsParsingPro,
        'unfold([], R).',
        ["R = []"]
    ));
});

describe("fileToLines/2", () => {
    test("unfold/2 1", expectOutputToBe(
        session,
        icsParsingPro,
        'fileToLines("DESCRIPTION:This is a lo\\n ng description\\n  that exists on a long line", R).',
        ["R = [[D,E,S,C,R,I,P,T,I,O,N,:,T,h,i,s, ,i,s, ,a, ,l,o,n,g, ,d,e,s,c,r,i,p,t,i,o,n, ,t,h,a,t, ,e,x,i,s,t,s, ,o,n, ,a, ,l,o,n,g, ,l,i,n,e]]"]
    ));
    test("unfold/2 2", expectOutputToBe(
        session,
        icsParsingPro,
        'fileToLines([], R).',
        ["R = []"]
    ));
    test("split/2 2", expectOutputToBe(
        session,
        icsParsingPro,
        'fileToLines("\n\naa", R).',
        ["R = [[a,a]]"]
    ));
});