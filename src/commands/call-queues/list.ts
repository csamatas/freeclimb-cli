/* WARNING: This file is automatically generated. Please edit the files in the /generation/commands directory. */
import { Command, flags } from "@oclif/command"
import { Output } from "../../output"
import { FreeClimbApi, FreeClimbResponse } from "../../freeclimb"
import * as Errors from "../../errors"

export class callQueuesList extends Command {
    static description = ` Retrieve a list of active Queues associated with the specified account.`

    static flags = {
        alias: flags.string({
            char: "a",
            description:
                "Return only the Queue resources with aliases that exactly match this name.",
            required: false,
        }),
        next: flags.boolean({ char: "n", description: "Displays the next page of output." }),
        help: flags.help({ char: "h" }),
    }

    async run() {
        const out = new Output(this)
        const { flags } = (() => {
            try {
                return this.parse(callQueuesList)
            } catch (error) {
                const err = new Errors.ParseError(error)
                this.error(err.message, { exit: err.code })
            }
        })()
        const fcApi = new FreeClimbApi(`Queues`, true, this)
        const normalResponse = (response: FreeClimbResponse) => {
            if (response.status === 204) {
                out.out("Received a success code from FreeClimb. There is no further output.")
            } else if (response.data) {
                out.out(JSON.stringify(response.data, null, 2))
            } else {
                throw Error
            }
        }
        const nextResponse = (response: FreeClimbResponse) => {
            if (response.data) {
                out.out(JSON.stringify(response.data, null, 2))
            } else {
                throw Error
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
                    alias: flags.alias,
                },
            },
            normalResponse
        )
    }
}
