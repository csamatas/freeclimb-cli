/* WARNING: This file is automatically generated. Please edit the files in the /generation/commands directory. */
import { Command, flags } from "@oclif/command"
import { Output } from "../../output"
import { FreeClimbApi, FreeClimbResponse } from "../../freeclimb"
import * as Errors from "../../errors"

export class callQueuesCreate extends Command {
    static description = ` Create a Queue within the specified account.`

    static flags = {
        alias: flags.string({
            char: "a",
            description: "A description for this Queue. Max length is 64 characters.",
            required: false,
        }),
        maxSize: flags.integer({
            char: "M",
            description:
                "Maximum number of Calls this queue can hold. Default is 1000. Maximum is 1000.",
            required: false,
        }),
        next: flags.boolean({ hidden: true }),
        help: flags.help(),
    }

    async run() {
        const out = new Output(this)
        const { flags } = (() => {
            try {
                return this.parse(callQueuesCreate)
            } catch (error) {
                const err = new Errors.ParseError(error)
                this.error(err.message, { exit: err.code })
            }
        })()
        const fcApi = new FreeClimbApi(`Queues`, true, this)
        const normalResponse = (response: FreeClimbResponse) => {
            const resp =
                response.status === 204
                    ? "Received a success code from FreeClimb. There is no further output."
                    : JSON.stringify(response.data, null, 2)
            out.out(resp)
        }
        if (flags.next) {
            const error = new Errors.NoNextPage()
            this.error(error.message, { exit: error.code })
        }
        const belowRangeError = new Errors.OutOfRange("maxSize", 0, "greater")
        const aboveRangeError = new Errors.OutOfRange("maxSize", 1000, "less")
        if (flags.maxSize && flags.maxSize < 0) {
            this.error(belowRangeError.message, { exit: belowRangeError.code })
        }
        if (flags.maxSize && flags.maxSize > 1000) {
            this.error(aboveRangeError.message, { exit: aboveRangeError.code })
        }

        await fcApi.apiCall(
            "POST",
            {
                data: {
                    alias: flags.alias,
                    maxSize: flags.maxSize,
                },
            },
            normalResponse
        )
    }
}
