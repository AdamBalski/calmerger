import {expect} from "@jest/globals";

const pl = require("tau-prolog");
require("tau-prolog/modules/promises.js")(pl);


const expectOutputToBe =
    (session: any, program: string, goal: string, expected: Array<string>) => {
    return async () => {
        await session.promiseConsult(program);
        await session.promiseQuery(goal);
        const answers = [];
        for await (let answer of session.promiseAnswers()) {
            answers.push(session.format_answer(answer));
        }
        expect(answers).toStrictEqual(expected);
    }
}
const expectToBeTrue = (session: any, program: string, goal: string) =>
    expectOutputToBe(session, program, goal, ["true"]);

const expectToBeFalse = (session: any, program: string, goal: string) =>
    expectOutputToBe(session, program, goal, []);

export {expectToBeTrue, expectOutputToBe, expectToBeFalse};
