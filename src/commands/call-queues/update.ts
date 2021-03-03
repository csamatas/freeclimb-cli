/* WARNING: This file is automatically generated. Please edit the files in the /generation/commands directory. */
import { Command, flags } from "@oclif/command"
import chalk from "chalk"
import { Output } from '../../output'
import { FreeClimbApi, FreeClimbResponse } from '../../freeclimb'
import * as Errors from '../../errors'

export class callQueuesUpdate extends Command {
    static description = ` Update the properties of the specified queue.`
    
    static flags = {
		alias: flags.string({            char: "a",            description: "Description for this Queue. Max length is 64 characters.",             required: false,             }),
		maxSize: flags.integer({            char: "M",            description: "Maximum number of calls this queue can hold. Default is 100. Maximum is 1000. Note: Reducing the maxSize of a Queue causes the Queue to reject incoming requests until it shrinks below the new value of maxSize.",             required: false,             }),
		next: flags.boolean({hidden: true}),
		help: flags.help({char: 'h'}),
	}
    
	static args = [		{name: "queueId", description: "A string that uniquely identifies this Queue resource.", required: true},
]

    async run() {
        const out = new Output(this)
        const {args, flags} = (() => {
            try {
                return this.parse(callQueuesUpdate)
            } catch(error) {
                const err = new Errors.ParseError(error)
                this.error(err.message, { exit: err.code })
            }
        })()
        const fcApi = new FreeClimbApi(`Queues/${args.queueId}`, true, this)
        const normalResponse = (response: FreeClimbResponse) => {
            if (response.status === 204) { out.out(chalk.green("Received a success code from FreeClimb. There is no further output.")) } else if (response.data) { out.out(JSON.stringify(response.data, null, 2)) } else { throw new Errors.UndefinedResponseError() }
        }
        if(flags.next) {
            
                const error = new Errors.NoNextPage();
                this.error(error.message, { exit: error.code});
            
        }
        if(Object.entries(flags).length === 0) { this.warn(chalk.yellow("Nothing Has Been Updated: Please enter a parameter to update ('freeclimb call-queues:update -h' for a list of parameters to be updated)"))}
const belowRangeError = new Errors.OutOfRange("maxSize", 0, "greater")
const aboveRangeError = new Errors.OutOfRange("maxSize", 1000, "less")
if(flags.maxSize && flags.maxSize < 0) { this.error(belowRangeError.message, {exit: belowRangeError.code}) }
if(flags.maxSize && flags.maxSize > 1000) { this.error(aboveRangeError.message, {exit: aboveRangeError.code}) }

        
        await fcApi.apiCall("POST", {data: {
				alias: flags.alias,
				maxSize: flags.maxSize,
			},
		}, normalResponse)
    }
}
