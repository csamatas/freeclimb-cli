/* WARNING: This file is automatically generated. Please edit the files in the /generation/commands directory. */
import { Command, flags } from "@oclif/command"
import chalk from "chalk"
import { Output } from '../../output'
import { FreeClimbApi, FreeClimbResponse } from '../../freeclimb'
import * as Errors from '../../errors'

export class conferenceParticipantsList extends Command {
    static description = ` Retrieve a list of Participants in the specified Conference, sorted by date created, newest to oldest.`
    
    static flags = {
		talk: flags.string({            char: "T",            description: "Only show Participants with the talk privilege.",             required: false,             options: ["true", "false"]}),
		listen: flags.string({            char: "l",            description: "Only show Participants with the listen privilege.",             required: false,             options: ["true", "false"]}),
		next: flags.boolean({char: 'n', description: 'Displays the next page of output.'}),
		help: flags.help({char: 'h'}),
	}
    
	static args = [		{name: "conferenceId", description: "ID of the conference this participant is in.", required: true},
]

    async run() {
        const out = new Output(this)
        const {args, flags} = (() => {
            try {
                return this.parse(conferenceParticipantsList)
            } catch(error) {
                const err = new Errors.ParseError(error)
                this.error(err.message, { exit: err.code })
            }
        })()
        const fcApi = new FreeClimbApi(`Conferences/${args.conferenceId}/Participants`, true, this)
        const normalResponse = (response: FreeClimbResponse) => {
            if (response.status === 204) { out.out(chalk.green("Received a success code from FreeClimb. There is no further output.")) } else if (response.data) { out.out(JSON.stringify(response.data, null, 2)) } else { throw new Errors.UndefinedResponseError() }
        }
        const nextResponse = (response: FreeClimbResponse) => {if (response.data) { out.out(JSON.stringify(response.data, null, 2)) } else { throw new Errors.UndefinedResponseError() }
            if(out.next === null) {
                out.out("== You are on the last page of output. ==")
            }
        }
        
        if(flags.next) {
            if(out.next === undefined || out.next === "freeclimbUnnamedTest") {
                const error = new Errors.NoNextPage();
                this.error(error.message, { exit: error.code});
            
            }
            else {
                await fcApi.apiCall("GET", { params: {cursor: out.next} }, nextResponse)
            }
            return
        }
        
        
// flags.talk === "true" sets talk to the boolean representation of the flag
		const talk = typeof flags.talk  === "undefined" ? undefined : flags.talk === "true"
// flags.listen === "true" sets listen to the boolean representation of the flag
		const listen = typeof flags.listen  === "undefined" ? undefined : flags.listen === "true"

        await fcApi.apiCall("GET", {params: {
				talk: talk,
				listen: listen,
			},
		}, normalResponse)
    }
}
