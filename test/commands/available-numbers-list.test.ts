/* WARNING: This file is automatically generated. Please edit the files in the /generation/tests directory. */
import { expect, test } from "@oclif/test"
import { cred } from "../../src/credentials"

import { data } from "../../src/commands/data"
import { Environment } from "../../src/environment"

describe("available-numbers:list Data Test", function () {
    const testJson = {
        message: "Response from server",
    }

    const nockServerResponse = `{
  "message": "Response from server"
}`

    test.nock("https://www.freeclimb.com", async (api) =>
        api
            .get(`/apiserver/AvailablePhoneNumbers`, {})
            .query({})
            .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
            .reply(200, testJson)
    )
        .stdout()
        .command(["available-numbers:list"])
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
            .get(`/apiserver/AvailablePhoneNumbers`, {})
            .query({})
            .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
            .reply(500, testJsonErrorNoSuggestion)
    )
        .stdout()
        .command(["available-numbers:list"])
        .exit(3)
        .it("Test Freeclimb Api error repsonce is process correctly without a suggestion")

    test.nock("https://user-custom-domain.example.com", async (api) =>
        api
            .get(`/apiserver/AvailablePhoneNumbers`, {})
            .query({})
            .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
            .reply(200, testJson)
    )
        .stdout()
        .env({ FREECLIMB_CLI_BASE_URL: "https://user-custom-domain.example.com/apiserver" })
        .command(["available-numbers:list"])
        .it("Sends API requests to the base URL from an environment variable", async (ctx) => {
            expect(ctx.stdout).to.contain(nockServerResponse)
        })

    const testJsonErrorWithSuggestion = {
        code: 50,
        message: "Unauthorized To Make Request",
        url: "https://docs.freeclimb.com/reference/error-and-warning-dictionary#50",
        details: {},
    }

    const nockServerResponseErrorWithSuggestion = `starting test`

    test.nock("https://www.freeclimb.com", async (api) =>
        api
            .get(`/apiserver/AvailablePhoneNumbers`, {})
            .query({})
            .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
            .reply(500, testJsonErrorWithSuggestion)
    )
        .stdout()
        .command(["available-numbers:list"])
        .exit(3)
        .it("Test Freeclimb Api error repsonce is process correctly with a suggestion")

    test.stdout()
        .command(["available-numbers:list", "additionalArguments"])
        .exit(2)
        .it("Test parse error gets triggered when there is an additional argument")

    test.nock("https://www.freeclimb.com", async (api) =>
        api
            .get(`/apiserver/AvailablePhoneNumbers`, {})
            .query({})
            .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
            .reply(200, undefined)
    )
        .stdout()
        .command(["available-numbers:list"])
        .exit(3)
        .it("Test error resulting in an unreadable response")

    test.nock("https://www.freeclimb.com", async (api) =>
        api
            .get(`/apiserver/AvailablePhoneNumbers`, {})
            .query({
                alias: "123-456-7890",
                phoneNumber: "userInput-phoneNumber",
            })
            .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
            .reply(200, testJson)
    )
        .stdout()
        .command([
            "available-numbers:list",
            "--alias",
            "123-456-7890",
            "--phoneNumber",
            "userInput-phoneNumber",
        ])
        .it(
            "testing all query parameters and required body are sent through with request",
            async (ctx) => {
                expect(ctx.stdout).to.contain(nockServerResponse)
            }
        )

    describe("available-numbers:list query param flags", function () {
        test.nock("https://www.freeclimb.com", async (api) =>
            api
                .get(`/apiserver/AvailablePhoneNumbers`, {})
                .query({
                    alias: "123-456-7890",
                })
                .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
                .reply(200, testJson)
        )
            .stdout()
            .command(["available-numbers:list", "--alias", "123-456-7890"])
            .it(
                "required params and a query param is sent through with request-alias",
                async (ctx) => {
                    expect(ctx.stdout).to.contain(nockServerResponse)
                }
            )

        test.nock("https://www.freeclimb.com", async (api) =>
            api
                .get(`/apiserver/AvailablePhoneNumbers`, {})
                .query({
                    alias: "123-456-789",
                })
                .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
                .reply(200, testJson)
        )
            .stdout()
            .command(["available-numbers:list", "--alias", "123-456-789"])
            .hook("warn")
            .it("test that an incorrectly formated alias is responds with a warning")

        test.nock("https://www.freeclimb.com", async (api) =>
            api
                .get(`/apiserver/AvailablePhoneNumbers`, {})
                .query({
                    phoneNumber: "userInput-phoneNumber",
                })
                .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
                .reply(200, testJson)
        )
            .stdout()
            .command(["available-numbers:list", "--phoneNumber", "userInput-phoneNumber"])
            .it(
                "required params and a query param is sent through with request-phoneNumber",
                async (ctx) => {
                    expect(ctx.stdout).to.contain(nockServerResponse)
                }
            )
    })

    describe("available-numbers:list next flag test", function () {
        test.nock("https://www.freeclimb.com", async (api) =>
            api
                .get(`/apiserver/AvailablePhoneNumbers`, {})
                .query({})
                .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
                .reply(200, testJson)
        )
            .stdout()
            .env({ FREECLIMB_AVAILABLE_NUMBERS_LIST_NEXT: undefined })
            .command(["available-numbers:list"])
            .command(["available-numbers:list", "--next"])
            .exit(3)
            .it("Tests return of Exit Code 3 when flag next is not available")

        const testJsonNext = {
            total: 1,
            start: 0,
            end: 0,
            page: 1,
            numPages: 1,
            pageSize: 100,
            nextPageUri: null,
        }

        const nockServerResponseNext = `== You are on the last page of output. ==`

        const testJsonNext2 = {
            total: 2,
            start: 0,
            end: 0,
            page: 1,
            numPages: 2,
            pageSize: 100,
            nextPageUri: "",
        }

        const nockServerResponseNext2 = `== Currently on page 1. Run this command again with the -n flag to go to the next page. ==`

        test.nock("https://www.freeclimb.com", async (api) =>
            api
                .get(`/apiserver/AvailablePhoneNumbers`)
                .query({ cursor: "617661696c61626c652d6e756d626572733a6c697374" })
                .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
                .reply(200, testJsonNext)
        )
            .stdout()
            .env({
                FREECLIMB_AVAILABLE_NUMBERS_LIST_NEXT:
                    "617661696c61626c652d6e756d626572733a6c697374",
            })
            .command(["available-numbers:list", "--next"])
            .it(
                "Test flag next works as expected when available with on last page",
                async (ctx) => {
                    expect(ctx.stdout).to.contain(nockServerResponseNext)
                }
            )

        const finalCursor = "freeClimbCLIAutomatedTestCursor"

        before(() => {
            ;(async () => {
                testJsonNext2.nextPageUri = `https://www.freeclimb.com/apiserver/AvailablePhoneNumbers?cursor=${finalCursor}`
            })()
        })
        after(() => {
            const dataDir = data.run([]).then(
                (dataDir) => {
                    const environment = new Environment(dataDir)
                    environment.clearString("FREECLIMB_AVAILABLE_NUMBERS_LIST_NEXT")
                },
                (reason) => console.log(reason)
            )
        })
        test.nock("https://www.freeclimb.com", async (api) =>
            api
                .get(`/apiserver/AvailablePhoneNumbers`)
                .query({ cursor: "617661696c61626c652d6e756d626572733a6c697374" })
                .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
                .reply(200, testJsonNext2)
        )
            .stdout()
            .env({
                FREECLIMB_AVAILABLE_NUMBERS_LIST_NEXT:
                    "617661696c61626c652d6e756d626572733a6c697374",
            })
            .command(["available-numbers:list", "--next"])
            .it(
                "Test flag next works as expected when available with has more pages",
                async (ctx) => {
                    expect(ctx.stdout).to.contain(nockServerResponseNext2)
                }
            )

        test.nock("https://www.freeclimb.com", async (api) =>
            api
                .get(`/apiserver/AvailablePhoneNumbers`)
                .query({ cursor: "617661696c61626c652d6e756d626572733a6c697374" })
                .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
                .reply(200, undefined)
        )
            .stdout()
            .env({
                FREECLIMB_AVAILABLE_NUMBERS_LIST_NEXT:
                    "617661696c61626c652d6e756d626572733a6c697374",
            })
            .command(["available-numbers:list", "--next"])
            .exit(3)
            .it(
                "Test error is caught when when using next flag and no reponse is given",
                async (ctx) => {}
            )
    })
})

describe("available-numbers:list Status Test", function () {
    const testJsonStatus = ""

    const statusResponse = `Received a success code from FreeClimb. There is no further output.
`

    test.nock("https://www.freeclimb.com", async (api) =>
        api
            .get(`/apiserver/AvailablePhoneNumbers`, {})
            .query({})
            .basicAuth({ user: await cred.accountId, pass: await cred.authToken })
            .reply(204, testJsonStatus)
    )
        .stdout()
        .command(["available-numbers:list"])
        .it("Test all required paramaters", async (ctx) => {
            expect(ctx.stdout).to.contain(statusResponse)
        })
})
