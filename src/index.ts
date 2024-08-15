import { client, xml, jid } from "@xmpp/client";

console.log("Hello via Bun!");


interface ITest {
    a: number,
    b: number
}

enum TestEnum {
    A = 1,
    B = 2
}


const test = ({a, b}:ITest) => {
    return a + b
}

console.log(
    test(
        {
            a: TestEnum.A,
            b: TestEnum.B
        } as ITest
    )
)
