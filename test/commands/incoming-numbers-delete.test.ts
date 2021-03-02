/* WARNING: This file is automatically generated. Please edit the files in the /generation/tests directory. */
import { expect, test } from "@oclif/test"
import { cred } from "../../src/credentials"

const phoneNumberId = "userInput-phoneNumberId"

describe("incoming-numbers:delete Data Test", function () {
    const testJson = {
        message: "Response from server",
    }

    const nockServerResponse = `{
  "message": "Response from server"
}`

    test.nock("https://www.freeclimb.com", async (api) =>
        api
            .delete(
                `/apiserver/Accounts/${await cred.accountId}/IncomingPhoneNumbers/${phoneNumberId}`,
                {}
            )
            .query({})
            .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
            .reply(200, testJson)
    )
        .stdout()
        .command(["incoming-numbers:delete", "userInput-phoneNumberId"])
        .it("Test all required paramaters", async (ctx) => {
            expect(ctx.stdout).to.contain(nockServerResponse)
        })

    const testJsonErrorNoSuggestion = {
        code: 2,
        message: "Method Not Allowed",
        url: "https://docs.freeclimb.com/reference/error-and-warning-dictionary#2",
        details: {},
    }

    const nockServerResponseErrorNoSuggestion = `starting test`

    test.nock("https://www.freeclimb.com", async (api) =>
        api
            .delete(
                `/apiserver/Accounts/${await cred.accountId}/IncomingPhoneNumbers/${phoneNumberId}`,
                {}
            )
            .query({})
            .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
            .reply(500, testJsonErrorNoSuggestion)
    )
        .stdout()
        .command(["incoming-numbers:delete", "userInput-phoneNumberId"])
        .exit(3)
        .it("Test Freeclimb Api error repsonce is process correctly without a suggestion")

    const testJsonErrorWithSuggestion = {
        code: 50,
        message: "Unauthorized To Make Request",
        url: "https://docs.freeclimb.com/reference/error-and-warning-dictionary#50",
        details: {},
    }

    const nockServerResponseErrorWithSuggestion = `starting test`

    test.nock("https://www.freeclimb.com", async (api) =>
        api
            .delete(
                `/apiserver/Accounts/${await cred.accountId}/IncomingPhoneNumbers/${phoneNumberId}`,
                {}
            )
            .query({})
            .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
            .reply(500, testJsonErrorWithSuggestion)
    )
        .stdout()
        .command(["incoming-numbers:delete", "userInput-phoneNumberId"])
        .exit(3)
        .it("Test Freeclimb Api error repsonce is process correctly with a suggestion")

    test.stdout()
        .command(["incoming-numbers:delete", "userInput-phoneNumberId", "additionalArguments"])
        .exit(2)
        .it("Test parse error gets triggered when there is an additional argument")

    test.nock("https://www.freeclimb.com", async (api) =>
        api
            .delete(
                `/apiserver/Accounts/${await cred.accountId}/IncomingPhoneNumbers/${phoneNumberId}`,
                {}
            )
            .query({})
            .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
            .reply(200, undefined)
    )
        .stdout()
        .command(["incoming-numbers:delete", "userInput-phoneNumberId"])
        .exit(3)
        .it("Test error resulting in an unreadable response")

    describe("incoming-numbers:delete next flag test", function () {
        test.nock("https://www.freeclimb.com", async (api) =>
            api
                .delete(
                    `/apiserver/Accounts/${await cred.accountId}/IncomingPhoneNumbers/${phoneNumberId}`,
                    {}
                )
                .query({})
                .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
                .reply(200, testJson)
        )
            .stdout()
            .env({ FREECLIMB_INCOMING_NUMBERS_DELETE_NEXT: undefined })
            .command(["incoming-numbers:delete", "userInput-phoneNumberId"])
            .command(["incoming-numbers:delete", "userInput-phoneNumberId", "--next"])
            .exit(3)
            .it("Tests return of Exit Code 3 when flag next is not available")
    })
})

describe("incoming-numbers:delete Status Test", function () {
    const testJsonStatus = ""

    const statusResponse = `Received a success code from FreeClimb. There is no further output.
`

    test.nock("https://www.freeclimb.com", async (api) =>
        api
            .delete(
                `/apiserver/Accounts/${await cred.accountId}/IncomingPhoneNumbers/${phoneNumberId}`,
                {}
            )
            .query({})
            .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
            .reply(204, testJsonStatus)
    )
        .stdout()
        .command(["incoming-numbers:delete", "userInput-phoneNumberId"])
        .it("Test all required paramaters", async (ctx) => {
            expect(ctx.stdout).to.contain(statusResponse)
        })
})
