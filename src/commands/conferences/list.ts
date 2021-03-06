/* WARNING: This file is automatically generated. Please edit the files in the /generation/commands directory. */
import { Command, flags } from "@oclif/command"
import chalk from "chalk"
import { Output } from "../../output"
import { FreeClimbApi, FreeClimbResponse } from "../../freeclimb"
import * as Errors from "../../errors"

export class conferencesList extends Command {
    static description = ` Retrieve a list of Conferences associated with the specified account, sorted by creation date, newest to oldest.`

    static flags = {
        status: flags.string({
            char: "S",
            description:
                "Only show conferences that currently have the specified status. Valid values: empty, populated, inProgress, or terminated.",
            required: false,
        }),
        alias: flags.string({
            char: "a",
            description: "List Conferences whose alias exactly matches this string.",
            required: false,
        }),
        dateCreated: flags.string({
            char: "d",
            description:
                "Only show Conferences that were created on the specified date, in the form YYYY-MM-DD.",
            required: false,
        }),
        dateUpdated: flags.string({
            char: "D",
            description:
                "Only show Conferences that were last updated on the specified date, in the form YYYY-MM-DD.",
            required: false,
        }),
        next: flags.boolean({ char: "n", description: "Displays the next page of output." }),
        help: flags.help({ char: "h" }),
    }

    async run() {
        const out = new Output(this)
        const { flags } = (() => {
            try {
                return this.parse(conferencesList)
            } catch (error) {
                const err = new Errors.ParseError(error)
                this.error(err.message, { exit: err.code })
            }
        })()
        const fcApi = new FreeClimbApi(`Conferences`, true, this)
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
                    status: flags.status,
                    alias: flags.alias,
                    dateCreated: flags.dateCreated,
                    dateUpdated: flags.dateUpdated,
                },
            },
            normalResponse
        )
    }
}
