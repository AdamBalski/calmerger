import {expect} from "@jest/globals";

const pl = require("tau-prolog");
require("tau-prolog/modules/promises.js")(pl);


const expectTo =
    (session: any, program: string, goal: string, test: (output: string[]) => void) => {
    return async () => {
        await session.promiseConsult(program);
        await session.promiseQuery(goal);
        const answers = [];
        for await (let answer of session.promiseAnswers()) {
            answers.push(session.format_answer(answer));
        }
        test(answers);
    }
}

const expectOutputToBe = (session: any, program: string, goal: string, expectedAnswer: string[]) =>
    expectTo(session, program, goal, output => expect(output).toStrictEqual(expectedAnswer));

const expectToBeTrue = (session: any, program: string, goal: string) =>
    expectOutputToBe(session, program, goal, ["true"]);

const expectToBeFalse = (session: any, program: string, goal: string) =>
    expectOutputToBe(session, program, goal, []);

export {expectTo, expectToBeTrue, expectOutputToBe, expectToBeFalse};
