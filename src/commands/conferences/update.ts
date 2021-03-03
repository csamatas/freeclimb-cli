/* WARNING: This file is automatically generated. Please edit the files in the /generation/commands directory. */
import { Command, flags } from "@oclif/command"
import chalk from "chalk"
import { Output } from '../../output'
import { FreeClimbApi, FreeClimbResponse } from '../../freeclimb'
import * as Errors from '../../errors'

export class conferencesUpdate extends Command {
    static description = ` Update the properties of the specified conference. The statusCallbackUrl (specified upon creating the Conference) is invoked whenever a Conference is emptied or terminated. Participants are automatically disconnected. When updating the Conference status to terminated, FreeClimb returns an HTTP 204 response with no body. Once a Conference is terminated,FreeClimb will not reuse the conferenceId.`
    
    static flags = {
		alias: flags.string({            char: "a",            description: "Description for this conference. Maximum 64 characters.",             required: false,             }),
		playBeep: flags.string({            char: "b",            description: "Controls when a beep is played. Valid values: always, never, entryOnly, exitOnly.",             required: false,             }),
		status: flags.string({            char: "S",            description: "New status of the conference. Valid values: empty or terminated. For more information, see Status Parameter below.**",             required: false,             }),
		next: flags.boolean({hidden: true}),
		help: flags.help({char: 'h'}),
	}
    
	static args = [		{name: "conferenceId", description: "String that uniquely identifies this conference resource.", required: true},
]

    async run() {
        const out = new Output(this)
        const {args, flags} = (() => {
            try {
                return this.parse(conferencesUpdate)
            } catch(error) {
                const err = new Errors.ParseError(error)
                this.error(err.message, { exit: err.code })
            }
        })()
        const fcApi = new FreeClimbApi(`Conferences/${args.conferenceId}`, true, this)
        const normalResponse = (response: FreeClimbResponse) => {
            if (response.status === 204) { out.out(chalk.green("Received a success code from FreeClimb. There is no further output.")) } else if (response.data) { out.out(JSON.stringify(response.data, null, 2)) } else { throw new Errors.UndefinedResponseError() }
        }
        if(flags.next) {
            
                const error = new Errors.NoNextPage();
                this.error(error.message, { exit: error.code});
            
        }
        if(Object.entries(flags).length === 0) { this.warn(chalk.yellow("Nothing Has Been Updated: Please enter a parameter to update ('freeclimb conferences:update -h' for a list of parameters to be updated)"))}

        
        await fcApi.apiCall("POST", {data: {
				alias: flags.alias,
				playBeep: flags.playBeep,
				status: flags.status,
			},
		}, normalResponse)
    }
}
