/* WARNING: This file is automatically generated. Please edit the files in the /generation/commands directory. */
import { Command, flags } from "@oclif/command"
import { Output } from "../../output"
import { FreeClimbApi, FreeClimbResponse } from "../../freeclimb"
import * as Errors from "../../errors"

export class incomingNumbersDelete extends Command {
    static description = ` Delete the specified incoming number. FreeClimb will no longer answer calls to the number. When the phone number is no longer configured as an incoming phone number, it will be recycled and made available for purchase again after a three-day holding period. If successful, FreeClimb will return an HTTP 204 response with no body.`

    static flags = {
        next: flags.boolean({ hidden: true }),
        help: flags.help({ char: "h" }),
    }

    static args = [
        {
            name: "phoneNumberId",
            description: "String that uniquely identifies this phone number resource.",
            required: true,
        },
    ]

    async run() {
        const out = new Output(this)
        const { args, flags } = (() => {
            try {
                return this.parse(incomingNumbersDelete)
            } catch (error) {
                const err = new Errors.ParseError(error)
                this.error(err.message, { exit: err.code })
            }
        })()
        const fcApi = new FreeClimbApi(`IncomingPhoneNumbers/${args.phoneNumberId}`, true, this)
        const normalResponse = (response: FreeClimbResponse) => {
            if (response.status === 204) {
                out.out("Received a success code from FreeClimb. There is no further output.")
            } else if (response.data) {
                out.out(JSON.stringify(response.data, null, 2))
            } else {
                throw new Errors.UndefinedResponseError()
            }
        }
        if (flags.next) {
            const error = new Errors.NoNextPage()
            this.error(error.message, { exit: error.code })
        }

        await fcApi.apiCall("DELETE", {}, normalResponse)
    }
}
