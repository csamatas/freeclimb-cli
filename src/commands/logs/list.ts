/* WARNING: This file is automatically generated. Please edit the files in the /generation/commands directory. */
import { Command, flags } from "@oclif/command"
import chalk from "chalk"
import { Output } from "../../output"
import { FreeClimbApi, FreeClimbResponse } from "../../freeclimb"
import * as Errors from "../../errors"
import { sleep } from "../../timeout"

let lastTime: number

export class logsList extends Command {
    static description = ` Returns all Logs associated with the specified account or a specific page of Logs as indicated by the URI in the request. Note: A PQL query should not be included with this GET request.`

    static flags = {
        maxItem: flags.integer({
            char: "m",
            description: "Show only a certain number of the most recent logs on this page.",
        }),
        sleep: flags.integer({
            char: "q",
            description: "i do not know what it should be yet",
            default: 1000,
        }),
        next: flags.boolean({ char: "n", description: "Displays the next page of output." }),
        help: flags.help({ char: "h" }),
    }

    static args = [
        {
            name: "tail",
            description: "also dont know what it should be",
            required: false,
            options: ["tail"],
        },
    ]

    async run() {
        const out = new Output(this)
        const { args, flags } = (() => {
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
                out.out(
                    chalk.green(
                        "Received a success code from FreeClimb. There is no further output."
                    )
                )
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

        const tailResponse = (response: FreeClimbResponse) => {
            if (response.data.end !== 0) {
                lastTime = response.data.logs[0].timestamp
                out.out(JSON.stringify(response.data.logs.reverse(), null, 2))
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

        if (args.tail) {
            lastTime = 0

            while (args.tail) {
                await fcApi.apiCall(
                    "POST",
                    {
                        data: {
                            pql: `timestamp>${lastTime}`,
                        },
                    },
                    tailResponse
                )
                await sleep(flags.sleep)
            }
        } else {
            await fcApi.apiCall("GET", {}, normalResponse)
        }
    }
}
