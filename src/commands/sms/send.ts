/* WARNING: This file is automatically generated. Please edit the files in the /generation/commands directory. */
import { Command, flags } from "@oclif/command"
import { Output } from "../../output"
import { FreeClimbApi, FreeClimbResponse } from "../../freeclimb"
import * as Errors from "../../errors"

export class smsSend extends Command {
    static description = `This command allows a user to send a sms message.`

    static flags = {
        notificationUrl: flags.string({
            char: "n",
            description:
                "When the Message changes status, this URL is invoked using HTTP POST with the messageStatus parameters.  Note: This is a notification only; any PerCL returned is ignored.",
            required: false,
        }),
        accountId: flags.string({
            char: "a",
            description: "String that uniquely identifies this account resource.",
            required: false,
        }),
        next: flags.boolean({ hidden: true }),
        help: flags.help({ char: "h" }),
    }

    static args = [
        {
            name: "from",
            description:
                "Phone number to use as the sender. This must be an incoming phone number that you have purchased from FreeClimb.",
            required: true,
        },
        {
            name: "to",
            description:
                "Phone number to receive the message. Must be within FreeClimb's service area. For trial accounts, must be a Verified Number.",
            required: true,
        },
        {
            name: "text",
            description:
                "Text contained in the message (maximum 160 characters).   Note: For text, only ASCII characters are supported.",
            required: true,
        },
    ]

    async run() {
        const out = new Output(this)
        const { args, flags } = (() => {
            try {
                return this.parse(smsSend)
            } catch (error) {
                const err = new Errors.ParseError(error)
                this.error(err.message, { exit: err.code })
            }
        })()
        const fcApi = new FreeClimbApi(`Messages`, true, this)
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

        await fcApi.apiCall(
            "POST",
            {
                data: {
                    from: args.from,
                    to: args.to,
                    text: args.text,
                    notificationUrl: flags.notificationUrl,
                    accountId: flags.accountId,
                },
            },
            normalResponse
        )
    }
}
