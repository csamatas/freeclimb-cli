/* WARNING: This file is automatically generated. Please edit the files in the /generation/commands directory. */
import { Command, flags } from "@oclif/command"
import chalk from "chalk"
import { Output } from "../../output"
import { FreeClimbApi, FreeClimbResponse } from "../../freeclimb"
import * as Errors from "../../errors"

export class callsMake extends Command {
    static description = ` Making a Call may take time. A 202 status code is returned if the Call request was successfully queued by FreeClimb, otherwise, a 500 error is returned. The asynchronous callback for the result will occur after some time through the callConnectUrl. Note: International Calling is disabled by default. A synchronous callback for the result will occur after some time through the callConnectUrl of the associated application. The pause duration is equal to n × 0.5 s (the default pause interval). As a result, {2} equals a 1-second pause, {3} equals a 1.5-second pause, and so on.  A digits string such as 12{2}34{4}# is rendered as follows:  This attribute can be set to one of the following values: if the ifMachine attribute is empty, processing of the Call continues normally. Note ifMachine uses the tone stream to detect an answering machine. Therefore, it is not perfectly accurate and may not work reliably in all countries.
callConnectUrl almost always is invoked before the ifMachineUrl. Therefore, if PerCL returned by callConnectUrl is being executed when a machine is detected, the execution is affected as follows if this flag is set to redirect or hangup: Note A PerCL response is expected to control the Call. ifMachineUrl is invoked using HTTP POST with the following parameters (in addition to the standard request parameters):`

    static flags = {
        sendDigits: flags.string({
            char: "s",
            description:
                "String of digits to dial after connecting to the number. It can include digits 0-9, *, and #, and allows embedding a pause between the output of individual digits. The default pause is 500 milliseconds. So, a string such as 1234# will be played in 2 seconds because of the 4 standard pauses implied within the string. A custom pause is specified by including a positive integer wrapped in curly braces: {n}. For more information, see sendDigits examples below.",
            required: false,
        }),
        ifMachine: flags.string({
            char: "i",
            description:
                "Specifies how FreeClimb should handle this Call if an answering machine answers it.",
            required: false,
        }),
        ifMachineUrl: flags.string({
            char: "I",
            description:
                "This attribute specifies a URL to which FreeClimb will make a POST request when an answering machine or a fax machine is detected. This URL is required if the ifMachine flag is set to redirect. When ifMachine is set to hangup, ifMachineUrl must not be included in the request. For more information, see ifMachineUrl example below.",
            required: false,
        }),
        timeout: flags.integer({
            char: "t",
            description:
                "Number of seconds that FreeClimb should allow the phone to ring before assuming there is no answer. Default is 30 seconds. Maximum allowed ring-time is determined by the target phone's provider. Note that most providers limit ring-time to 120 seconds.",
            required: false,
        }),
        parentCallId: flags.string({
            char: "P",
            description:
                "The ID of the parent Call in the case that this new Call is meant to be treated as a child of an existing Call. This attribute should be included when possible to reduce latency when adding child calls to Conferences containing the parent Call. A call can only be used as a parent once the call is in progress or as an inbound call that is still ringing.  An outbound call is considered to be in progress once the outdialConnect or outdialApiConnect webhook is invoked.  An inbound call is ringing when the inbound webhook is invoked.",
            required: false,
        }),
        next: flags.boolean({ hidden: true }),
        help: flags.help({ char: "h" }),
    }

    static args = [
        {
            name: "from",
            description:
                "Phone number to use as the caller ID. This can be: (a) The To or From number provided in FreeClimb's initial request to your app or (b) Any incoming phone number you have purchased from FreeClimb.",
            required: true,
        },
        {
            name: "to",
            description:
                "Phone number to place the Call to. For trial accounts, this must be a Verified Number.",
            required: true,
        },
        {
            name: "applicationId",
            description:
                "ID of the application FreeClimb should use to handle this phone call. FreeClimb will use the callConnectUrl and statusCallbackUrl set on the application. The application must have a callConnectUrl associated with it or an error will be returned. The application’s voiceUrl parameter is not used for outbound calls.",
            required: true,
        },
    ]

    async run() {
        const out = new Output(this)
        const { args, flags } = (() => {
            try {
                return this.parse(callsMake)
            } catch (error) {
                const err = new Errors.ParseError(error)
                this.error(err.message, { exit: err.code })
            }
        })()
        const fcApi = new FreeClimbApi(`Calls`, true, this)
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
        if (flags.next) {
            const error = new Errors.NoNextPage()
            this.error(error.message, { exit: error.code })
        }
        const belowRangeError = new Errors.OutOfRange("timeout", 0, "greater")
        const aboveRangeError = new Errors.OutOfRange("timeout", 120, "less")
        if (flags.timeout && flags.timeout < 0) {
            this.error(belowRangeError.message, { exit: belowRangeError.code })
        }
        if (flags.timeout && flags.timeout > 120) {
            this.error(aboveRangeError.message, { exit: aboveRangeError.code })
        }

        await fcApi.apiCall(
            "POST",
            {
                data: {
                    from: args.from,
                    to: args.to,
                    applicationId: args.applicationId,
                    sendDigits: flags.sendDigits,
                    ifMachine: flags.ifMachine,
                    ifMachineUrl: flags.ifMachineUrl,
                    timeout: flags.timeout,
                    parentCallId: flags.parentCallId,
                },
            },
            normalResponse
        )
    }
}
