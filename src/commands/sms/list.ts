/* WARNING: This file is automatically generated. Please edit the files in the /generation/commands directory. */
import { Command, flags } from "@oclif/command"
import chalk from "chalk"
import { Output } from "../../output"
import { FreeClimbApi, FreeClimbResponse } from "../../freeclimb"
import * as Errors from "../../errors"

export class smsList extends Command {
    static description = ` Retrieve a list of SMS Messages made to and from the specified Account, sorted from latest created to oldest.`

    static flags = {
        to: flags.string({
            char: "T",
            description: "Only show Messages to this phone number.",
            required: false,
        }),
        from: flags.string({
            char: "f",
            description: "Only show Messages from this phone number.",
            required: false,
        }),
        beginTime: flags.string({
            char: "b",
            description:
                "Only show Messages sent at or after this time (GMT), given as YYYY-MM-DD hh:mm:ss.",
            required: false,
        }),
        endTime: flags.string({
            char: "e",
            description:
                "Only show messages sent at or before this time (GMT), given as YYYY-MM-DD hh:mm..",
            required: false,
        }),
        direction: flags.string({
            char: "d",
            description:
                "Either inbound or outbound. Only show Messages that were either sent from or received by FreeClimb.",
            required: false,
        }),
        accountID: flags.string({
            char: "a",
            description: "String that uniquely identifies this account resource.",
            required: false,
        }),
        next: flags.boolean({ char: "n", description: "Displays the next page of output." }),
        help: flags.help({ char: "h" }),
    }

    async run() {
        const out = new Output(this)
        const { flags } = (() => {
            try {
                return this.parse(smsList)
            } catch (error) {
                const err = new Errors.ParseError(error)
                this.error(err.message, { exit: err.code })
            }
        })()
        const fcApi = new FreeClimbApi(`Messages`, true, this)
        const normalResponse = (response: FreeClimbResponse) => {
            if (response.status === 204) {
                out.out(
                    chalk.green(
                        "Received a success code from FreeClimb. There is no further output."
                    )
                )
            } else if (response.data) {
                out.out(JSON.stringify(response.data, null, 2))
            } else {
                throw new Errors.UndefinedResponseError()
            }
        }
        const nextResponse = (response: FreeClimbResponse) => {
            if (response.data) {
                out.out(JSON.stringify(response.data, null, 2))
            } else {
                throw new Errors.UndefinedResponseError()
            }
            if (out.next === null) {
                out.out("== You are on the last page of output. ==")
            }
        }

        if (flags.next) {
            if (out.next === undefined || out.next === "freeclimbUnnamedTest") {
                const error = new Errors.NoNextPage()
                this.error(error.message, { exit: error.code })
            } else {
                await fcApi.apiCall("GET", { params: { cursor: out.next } }, nextResponse)
            }
            return
        }

        await fcApi.apiCall(
            "GET",
            {
                params: {
                    to: flags.to,
                    from: flags.from,
                    beginTime: flags.beginTime,
                    endTime: flags.endTime,
                    direction: flags.direction,
                    accountID: flags.accountID,
                },
            },
            normalResponse
        )
    }
}
