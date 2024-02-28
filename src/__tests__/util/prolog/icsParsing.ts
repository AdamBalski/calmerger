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
        'unfold(["a", "xd"], R).',
        ["R = [[a],[x,d]]"]
    ));
    test("unfold/2 3", expectOutputToBe(
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

// '\t', '👍', '\r', '\n', ' ', 'a', '!', '\', '\v', ';', ':', ',', '\"', 'ą', '漢', '𓀀'
describe("value_char//1", () => {
    test("value_char \\t", expectOutputToBe(
        session, icsParsingPro, "phrase(value_char(X), ['\\t']).", ["X = \t"]
    ));

    test("value_char 👍", expectOutputToBe(
        session, icsParsingPro, "phrase(value_char(X), ['👍']).", ["X = 👍"]
    ));

    test("value_char \\r", expectOutputToBe(
        session, icsParsingPro, "phrase(value_char(X), ['\\r']).", []
    ));

    test("value_char \\n", expectOutputToBe(
        session, icsParsingPro, "phrase(value_char(X), ['\\n']).", []
    ));

    test("value_char space", expectOutputToBe(
        session, icsParsingPro, "phrase(value_char(X), [' ']).", ["X =  "]
    ));

    test("value_char a", expectOutputToBe(
        session, icsParsingPro, "phrase(value_char(X), ['a']).", ["X = a"]
    ));

    test("value_char !", expectOutputToBe(
        session, icsParsingPro, "phrase(value_char(X), ['!']).", ["X = !"]
    ));

    test("value_char \\", expectOutputToBe(
        session, icsParsingPro, "phrase(value_char(X), ['\\\\']).", ["X = (\\)"]
    ));

    test("value_char \\v", expectOutputToBe(
        session, icsParsingPro, "phrase(value_char(X), ['\\v']).", []
    ));

    test("value_char DEL", expectOutputToBe(
        session, icsParsingPro, "phrase(value_char(X), ['\u007F']).", []
    ));

    test("value_char ;", expectOutputToBe(
        session, icsParsingPro, "phrase(value_char(X), [';']).", ["X = ;"]
    ));

    test("value_char :", expectOutputToBe(
        session, icsParsingPro, "phrase(value_char(X), [':']).", ["X = (:)"]
    ));

    test("value_char ,", expectOutputToBe(
        session, icsParsingPro, "phrase(value_char(X), [',']).", ["X = ,"]
    ));

    test("value_char \"", expectOutputToBe(
        session, icsParsingPro, "phrase(value_char(X), ['\"']).", ["X = \""]
    ));

    test("value_char ą", expectOutputToBe(
        session, icsParsingPro, "phrase(value_char(X), ['ą']).", ["X = ą"]
    ));

    test("value_char 漢", expectOutputToBe(
        session, icsParsingPro, "phrase(value_char(X), ['漢']).", ["X = 漢"]
    ));

    test("value_char 𓀀", expectOutputToBe(
        session, icsParsingPro, "phrase(value_char(X), ['𓀀']).", ["X = 𓀀"]
    ));
});
describe("qsafe_char//1", () => {
    test("qsafe_char \\t", expectOutputToBe(
        session, icsParsingPro, "phrase(qsafe_char(X), ['\\t']).", ["X = \t"]
    ));

    test("qsafe_char 👍", expectOutputToBe(
        session, icsParsingPro, "phrase(qsafe_char(X), ['👍']).", ["X = 👍"]
    ));

    test("qsafe_char \\r", expectOutputToBe(
        session, icsParsingPro, "phrase(qsafe_char(X), ['\\r']).", []
    ));

    test("qsafe_char \\n", expectOutputToBe(
        session, icsParsingPro, "phrase(qsafe_char(X), ['\\n']).", []
    ));

    test("qsafe_char space", expectOutputToBe(
        session, icsParsingPro, "phrase(qsafe_char(X), [' ']).", ["X =  "]
    ));

    test("qsafe_char a", expectOutputToBe(
        session, icsParsingPro, "phrase(qsafe_char(X), ['a']).", ["X = a"]
    ));

    test("qsafe_char !", expectOutputToBe(
        session, icsParsingPro, "phrase(qsafe_char(X), ['!']).", ["X = !"]
    ));

    test("qsafe_char \\", expectOutputToBe(
        session, icsParsingPro, "phrase(qsafe_char(X), ['\\\\']).", ["X = (\\)"]
    ));

    test("qsafe_char \\v", expectOutputToBe(
        session, icsParsingPro, "phrase(qsafe_char(X), ['\\v']).", []
    ));

    test("qsafe_char DEL", expectOutputToBe(
        session, icsParsingPro, "phrase(qsafe_char(X), ['\u007F']).", []
    ));

    test("qsafe_char ;", expectOutputToBe(
        session, icsParsingPro, "phrase(qsafe_char(X), [';']).", ["X = ;"]
    ));

    test("qsafe_char :", expectOutputToBe(
        session, icsParsingPro, "phrase(qsafe_char(X), [':']).", ["X = (:)"]
    ));

    test("qsafe_char ,", expectOutputToBe(
        session, icsParsingPro, "phrase(qsafe_char(X), [',']).", ["X = ,"]
    ));

    test("qsafe_char \"", expectOutputToBe(
        session, icsParsingPro, "phrase(qsafe_char(X), ['\"']).", []
    ));

    test("qsafe_char ą", expectOutputToBe(
        session, icsParsingPro, "phrase(qsafe_char(X), ['ą']).", ["X = ą"]
    ));

    test("qsafe_char 漢", expectOutputToBe(
        session, icsParsingPro, "phrase(qsafe_char(X), ['漢']).", ["X = 漢"]
    ));

    test("qsafe_char 𓀀", expectOutputToBe(
        session, icsParsingPro, "phrase(qsafe_char(X), ['𓀀']).", ["X = 𓀀"]
    ));
});

describe("safe_char//1", () => {
    test("safe_char \\t", expectOutputToBe(
        session, icsParsingPro, "phrase(safe_char(X), ['\\t']).", ["X = \t"]
    ));

    test("safe_char 👍", expectOutputToBe(
        session, icsParsingPro, "phrase(safe_char(X), ['👍']).", ["X = 👍"]
    ));

    test("safe_char \\r", expectOutputToBe(
        session, icsParsingPro, "phrase(safe_char(X), ['\\r']).", []
    ));

    test("safe_char \\n", expectOutputToBe(
        session, icsParsingPro, "phrase(safe_char(X), ['\\n']).", []
    ));

    test("safe_char space", expectOutputToBe(
        session, icsParsingPro, "phrase(safe_char(X), [' ']).", ["X =  "]
    ));

    test("safe_char a", expectOutputToBe(
        session, icsParsingPro, "phrase(safe_char(X), ['a']).", ["X = a"]
    ));

    test("safe_char !", expectOutputToBe(
        session, icsParsingPro, "phrase(safe_char(X), ['!']).", ["X = !"]
    ));

    test("safe_char \\", expectOutputToBe(
        session, icsParsingPro, "phrase(safe_char(X), ['\\\\']).", ["X = (\\)"]
    ));

    test("safe_char \\v", expectOutputToBe(
        session, icsParsingPro, "phrase(safe_char(X), ['\\v']).", []
    ));

    test("safe_char DEL", expectOutputToBe(
        session, icsParsingPro, "phrase(safe_char(X), ['\u007F']).", []
    ));

    test("safe_char ;", expectOutputToBe(
        session, icsParsingPro, "phrase(safe_char(X), [';']).", []
    ));

    test("safe_char :", expectOutputToBe(
        session, icsParsingPro, "phrase(safe_char(X), [':']).", []
    ));

    test("safe_char ,", expectOutputToBe(
        session, icsParsingPro, "phrase(safe_char(X), [',']).", []
    ));

    test("safe_char \"", expectOutputToBe(
        session, icsParsingPro, "phrase(safe_char(X), ['\"']).", []
    ));

    test("safe_char ą", expectOutputToBe(
        session, icsParsingPro, "phrase(safe_char(X), ['ą']).", ["X = ą"]
    ));

    test("safe_char 漢", expectOutputToBe(
        session, icsParsingPro, "phrase(safe_char(X), ['漢']).", ["X = 漢"]
    ));

    test("safe_char 𓀀", expectOutputToBe(
        session, icsParsingPro, "phrase(safe_char(X), ['𓀀']).", ["X = 𓀀"]
    ));
});

describe("value//1", () => {
   test("value 1", expectOutputToBe(
      session, icsParsingPro, `phrase(value(X), ['\\"'|"xd\\\\2137-_!e2;,."]).`, ['X = [\",x,d,\\,2,1,3,7,-,_,!,e,2,;,,,.]']
   ));

    test("value 2", expectOutputToBe(session,
        icsParsingPro,
        `phrase(value(X), "").`,
        ["X = []"]));

    test("value false", expectToBeFalse(
        session, icsParsingPro, `phrase(value(X), ['\v']).`
    ));
});

describe("param_value//1", () => {

    test("param_value 1", expectOutputToBe(
        session,
        icsParsingPro,
        String.raw`phrase(param_value(X), "\u0022xd\\2137-_!e2;\u0022").`,
        ["X = [x,d,\\,2,1,3,7,-,_,!,e,2,;]"]
    ));

    test("param_value 2", expectOutputToBe(session,
        icsParsingPro,
        `phrase(param_value(X), "xd\\\\2137-_!e2.").`,
        ["X = [x,d,\\,2,1,3,7,-,_,!,e,2,.]"]));

    test("param_value 3", expectOutputToBe(session,
        icsParsingPro,
        `phrase(param_value(X), "").`,
        ["X = []"]
    ));

    test("param_value 4", expectOutputToBe(session,
        icsParsingPro,
        `phrase(param_value(X), ['\u0022', '\u0022']).`,
        ["X = []"]
    ));

    test("param_value false 1", expectOutputToBe(
        session, icsParsingPro, `phrase(param_value(X), "\\u2022xd\\\\2137-_!e2;,.").`, []
    ));

    test("param_value false 2", expectToBeFalse(
        session, icsParsingPro, `phrase(param_value(X), ['\v']).`
    ));

    test("param_value false 3", expectOutputToBe(
        session, icsParsingPro, `phrase(param_value(X), "xd\\\\2137-_!e2;").`, []
    ));

    test("param_value false 4", expectOutputToBe(
        session,
        icsParsingPro,
        `phrase(param_value(X), "\\u0022xd\\\\2137\\u0022-_!e2;\\u0022").`,
        []
    ));
});


describe("name//1", () => {
    test("name 1", expectOutputToBe(
        session, icsParsingPro, `phrase(name(X), "abce").`, ["X = [a,b,c,e]"]
   ));

   test("name 2", expectOutputToBe(
       session, icsParsingPro, `phrase(name(X), "ef-u2AJ").`, ["X = [e,f,-,u,2,A,J]"]
   ));

    test("name false 1", expectOutputToBe(
        session, icsParsingPro, `phrase(name(X), "ef -u2AJ").`, []
    ));

    test("name false 2", expectOutputToBe(
        session, icsParsingPro, `phrase(name(X), "\\\\ef-u2AJ").`, []
    ));

    test("name false 3", expectOutputToBe(
        session, icsParsingPro, `phrase(name(X), "").`, []
    ));
});

describe("param_values//1", () => {
    test("param_values 1", expectOutputToBe(
        session, icsParsingPro, `phrase(param_values(X), "aee").`, ["X = [[a,e,e]]"]
    ));

    test("param_values 2", expectOutputToBe(
        session, icsParsingPro, `phrase(param_values(X), "aee,bce").`, ["X = [[a,e,e],[b,c,e]]"]
    ));
});

describe("params//1", () => {
    test("params 1", expectOutputToBe(
        session,
        icsParsingPro,
        `phrase(params(X), ";x=lol;x=xd;x=;l=,").`,
        ["X = [param([x],[[l,o,l]]),param([x],[[x,d]]),param([x],[[]]),param([l],[[],[]])]"]
    ));

    test("params 2", expectOutputToBe(
        session, icsParsingPro, `phrase(params(X), "x=lol;x=xd;x=;l:").`, []
    ));

    test("params 3", expectOutputToBe(
        session,
        icsParsingPro,
        String.raw`phrase(params(X), [';',x,'=','\u0022','\u0022']).`,
        ["X = [param([x],[[]])]"]
    ));

    test("params 4", expectOutputToBe(
        session, icsParsingPro, `phrase(params(X), "").`, ["X = []"]
    ));

    test("params 5", expectOutputToBe(
        session, icsParsingPro, `phrase(params(X), ";a=x,y,z").`, ["X = [param([a],[[x],[y],[z]])]"]
    ));

    test("params 6", expectOutputToBe(
        session, icsParsingPro, `phrase(params(X), ";a=,,").`, ["X = [param([a],[[],[],[]])]"]
    ));

    test("params 7", expectOutputToBe(
        session, icsParsingPro, `phrase(params(X), ";a=x;").`, []
    ));
});

describe("content_line//3", () => {
    test("content_line 1", expectOutputToBe(
        session,
        icsParsingPro,
        String.raw`phrase(content_line(Name, Params, Value), "BEGIN:VCALENDAR").`,
        ["Name = [B,E,G,I,N], Params = [], Value = [V,C,A,L,E,N,D,A,R]"]
    ));

    test("content_line 1", expectOutputToBe(
        session,
        icsParsingPro,
        String.raw`phrase(content_line(Name, Params, Value), "ORGANIZER;CN=John Doe:MAILTO:john.doe@example.com").`,
        ["Name = [O,R,G,A,N,I,Z,E,R], Params = [param([C,N],[[J,o,h,n, ,D,o,e]])], Value = [M,A,I,L,T,O,:,j,o,h,n,.,d,o,e,@,e,x,a,m,p,l,e,.,c,o,m]"]
    ));

});