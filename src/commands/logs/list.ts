/* WARNING: This file is automatically generated. Please edit the files in the /generation/commands directory. */
import { Command, flags } from "@oclif/command"
import { Output } from "../../output"
import { FreeClimbApi, FreeClimbResponse } from "../../freeclimb"
import * as Errors from "../../errors"

export class logsList extends Command {
    static description = ` Returns all Logs associated with the specified account or a specific page of Logs as indicated by the URI in the request. Note: A PQL query should not be included with this GET request.`

    static flags = {
        maxItem: flags.integer({
            char: "m",
            description: "Show only a certain number of the most recent logs on this page.",
        }),
        next: flags.boolean({ char: "n", description: "Displays the next page of output." }),
        help: flags.help({ char: "h" }),
    }

    async run() {
        const out = new Output(this)
        const { flags } = (() => {
            try {
                return this.parse(logsList)
            } catch (error) {
                const err = new Errors.ParseError(error)
                this.error(err.message, { exit: err.code })
            }
        })()
        const fcApi = new FreeClimbApi(`Logs`, true, this)
        const normalResponse = (response: FreeClimbResponse) => {
            if (response.status === 204) {
                out.out("Received a success code from FreeClimb. There is no further output.")
            } else if (response.data) {
                out.out(
                    flags.maxItem
                        ? JSON.stringify(response.data.logs.splice(0, flags.maxItem), null, 2)
                        : JSON.stringify(response.data, null, 2)
                )
            } else {
                throw new Errors.UndefinedResponseError()
            }
        }
        const nextResponse = (response: FreeClimbResponse) => {
            if (response.data) {
                out.out(
                    flags.maxItem
                        ? JSON.stringify(response.data.logs.splice(0, flags.maxItem), null, 2)
                        : JSON.stringify(response.data, null, 2)
                )
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

        await fcApi.apiCall("GET", {}, normalResponse)
    }
}
