/**
 * This file creates, or overrides, the src directory containing command
 * files which are used by the CLI. For each FreeClimb command, this file
 * composes a typescript file by creating an ApiCommand object and using
 * helper method to retrieve necessary components. generate-commands-files.js
 * is not a part of the CLI but rather a necessary component for generating
 * command files. Changes made to this file may affect generated command files.
 */
const fs = require("fs")
const { exec } = require("child_process")
const { isEmpty } = require("lodash")
const apiInfo = require("../schema/generated-api-schema.json")
const descriptionOverrides = require("../schema/description-overrides.json")
const localFlags = require("../schema/local-flags.json")
const ApiCommand = require("./api-command.js")
const mapChars = require("./character-mapping")

// Mapping of the names of flags to the characters to use for those flags
const charMap = mapChars(apiInfo, localFlags)

let commandsWithTail = new Map()
commandsWithTail.set("logs", ["filter", "list"])
// Create src/commands if directory does not already exist
fs.mkdirSync("./src/commands", { recursive: true })

// Generated files to be linted
const generatedFiles = []

// Delete old topic descriptions from package.json
const packageFilepath = `${__dirname}/../../package.json`
const topicsKey = /( {2}"oclif": {[\s\S]* {2}"topics": {)([\s\S]*)(}[\s\S]*},\n {2}"do-not-move": {)/
let packageContents = fs.readFileSync(packageFilepath, "utf-8")
packageContents = packageContents.replace(topicsKey, "$1$3") // clears the previous contents of the topics key

// Create directories and files in /commands
apiInfo.forEach((topic, index, arr) => {
    // Create topic directory
    const path = `./src/commands/${topic.topic.replace(" ", "_")}`
    if (!fs.existsSync(path)) fs.mkdirSync(path)

    // Add topic description to package.json
    packageContents = packageContents.replace(
        topicsKey,
        `$1${index === arr.length - 1 ? "" : ","}"${
            topic.topic
        }": { "description": "${getTopicDescription(topic)
            .replace(/\n/g, " ")
            .replace(/"/g, '\\"')}" }$2$3`
    )

    // Create typescript files for each command in current topic
    topic.commands.forEach((command) => {
        const currentCommand = new ApiCommand(topic, command)
        const fileContents = getFileContents(currentCommand)

        const newFilepath = `${path}/${command.commandName}.ts`
        fs.writeFileSync(newFilepath, fileContents)
        generatedFiles.push(newFilepath)
    })
})

// Write to package.json
fs.writeFileSync(packageFilepath, JSON.stringify(JSON.parse(packageContents), null, 2)) // this is to beautify the output
generatedFiles.push(packageFilepath)

// Run linter on generated files
exec(
    `git add ${generatedFiles.join(
        " "
    )} && yarn lint-staged --allow-empty; git restore --staged ${generatedFiles.join(" ")}`,
    (err, stdout, stderr) => {
        // Stages to allow lint and then unstages
        if (err) {
            console.log("Linter errors were found.")
        }
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
    }
)

// Return description of topic
function getTopicDescription(topic) {
    let description = ""

    // First looks for description in descriptionOverrides
    // If not found, use description from apiInfo
    try {
        description = descriptionOverrides.topics[topic.topic].self
        if (!description) {
            throw new Error("No override exists")
        }
    } catch (error) {
        ;({ description } = topic)
    }

    return description
}

// Return contents for the typescript file of current command
function getFileContents(command) {
    return `/* WARNING: This file is automatically generated. Please edit the files in the /generation/commands directory. */
import { Command, flags } from "@oclif/command"
import chalk from "chalk"
import { Output } from '../../output'
import { FreeClimbApi, FreeClimbResponse } from '../../freeclimb'
import * as Errors from '../../errors'

export class ${command.className} extends Command {
    static description = \`${command.description}\`
    
    static flags = {${getAxiosFlags(command.flags)}${getAdditionalFlags(
        command.topic,
        command.pagination
    )}}
    ${getAxiosArgs(command.args)}
    async run() {
        const out = new Output(this)
        const {${setConstArgs(command.args)}flags} = (() => {
            try {
                return this.parse(${command.className})
            } catch(error) {
                const err = new Errors.ParseError(error)
                this.error(err.message, { exit: err.code })
            }
        })()
        const fcApi = new FreeClimbApi(\`${command.endpoint}\`, ${command.usesAuthentication}, this)
        const normalResponse = (response: FreeClimbResponse) => {
            ${getAxiosResponse(command.topic)}
        }${
            command.pagination
                ? `
        const nextResponse = (response: FreeClimbResponse) => {${getAxiosResponseNextFlag(
            command.topic
        )}
            if(out.next === null) {
                out.out("== You are on the last page of output. ==")
            }
        }
        `
                : ""
        }
        if(flags.next) {
            ${
                command.pagination
                    ? `if(out.next === undefined || out.next === "freeclimbUnnamedTest") {`
                    : ""
            }
                const error = new Errors.NoNextPage();
                this.error(error.message, { exit: error.code});
            ${
                command.pagination
                    ? `
            }
            else {
                await fcApi.apiCall("GET", { params: {cursor: out.next} }, nextResponse)
            }
            return`
                    : ""
            }
        }
        ${getErrorHandling(command)}
        ${getBooleanParams(command.booleanParams)}
        await fcApi.apiCall("${command.method}", {${getAxiosParams(
        command.bodyParams,
        command.queryParams
    )}}, normalResponse)
    }
}
`
}

// Return flags used in axios request
function getAxiosFlags(flags) {
    let data = ""

    flags.forEach((flag) => {
        data += `\n\t\t${flag.name}: flags.${getFlagType(flag)}({\
            ${getAxiosFlagsCharHelper(flag)}\
            description: "${flag.description}", \
            required: ${flag.required}, \
            ${getAxiosFlagsBooleanHelper(flag)}}),`
    })

    return data
}

// Return type of flag
function getFlagType(flag) {
    return flag.dataType === "int32" ? "integer" : "string"
}

// Return char option for flags with chars
function getAxiosFlagsCharHelper(flag) {
    return charMap.has(flag.name) ? `char: "${charMap.get(flag.name)}",` : ""
}

// Return flag options for boolean parameters
function getAxiosFlagsBooleanHelper(flag) {
    return flag.dataType === "boolean" ? 'options: ["true", "false"]' : ""
}

// Return flags not used in axios request
function getAdditionalFlags(topicName, pagination) {
    data = ""

    if (topicName === "logs") {
        data += `\n\t\tmaxItem: flags.integer({ char: "m", description: "${localFlags.maxItem.description}"}),`
    }

    if (pagination) {
        data += `\n\t\tnext: flags.boolean({char: 'n', description: '${localFlags.next.description}'}),`
    } else {
        data += "\n\t\tnext: flags.boolean({hidden: true})," // so that the command can still parse, but users will not see this flag
    }

    data += "\n\t\thelp: flags.help({char: 'h'}),\n\t"

    return data
}

// Return arguments used in Axios request
function getAxiosArgs(args) {
    let data = ""

    if (!isEmpty(args)) {
        data += "\n\tstatic args = ["
        args.forEach((arg) => {
            data += `\t\t{name: "${arg.name}", description: "${arg.description}", required: ${arg.required}},\n`
        })
        data += "]\n"
    }

    return data
}

// Add args to deconstructor if the command requires arguments
// "freeclimb topic:command -h" will not work if flags are not in deconstructor. So flags
// must be in the deconstructor even when no Axios flags are present.
function setConstArgs(args) {
    return isEmpty(args) ? "" : "args, "
}

// Return Error Handling
function getErrorHandling(command) {
    let data = ""

    // If a update/manage command has a non-path argument, then the command will update that
    // attribute in freeclimb. Thus this should only be added if all arguments are path
    // parameters. This is relevant in calls:update
    if (
        (command.name === "update" || command.name === "manage") &&
        command.args.every((arg) => arg.paramType === "path")
    ) {
        data += createWarning(
            `Object.entries(flags).length === 0`,
            `Nothing Has Been Updated: Please enter a parameter to update ('freeclimb ${command.topic}:` +
                `${command.name} -h' for a list of parameters to be updated)`
        )
    }

    // Bounds for integer parameters
    command.integerParams.forEach((param) => {
        let { min, max } = getIntegerBounds(param)
        data += `const belowRangeError = new Errors.OutOfRange("${param.name}", ${min}, "greater")\n`
        data += `const aboveRangeError = new Errors.OutOfRange("${param.name}", ${max}, "less")\n`
        data += createError(
            `${accessSpecifier(param)}.${param.name} && ${accessSpecifier(param)}.${
                param.name
            } < ${min}`,
            `belowRangeError.message`,
            `belowRangeError.code`
        )
        data += createError(
            `${accessSpecifier(param)}.${param.name} && ${accessSpecifier(param)}.${
                param.name
            } > ${max}`,
            `aboveRangeError.message`,
            `aboveRangeError.code`
        )
    })

    // Aliases for available numbers are always in this format "123-456-7890"
    if (command.topic === "available-numbers" && command.name === "list") {
        data += createWarning(
            `flags.alias && !/\\d{3}-\\d{3}-\\d{4}/.test(flags.alias)`,
            `Incorrect Format: Please enter an alias in the format '123-456-7890'`
        )
    }

    if (command.topic === "logs" && command.name === "filter") {
        data += createWarning(
            `args.pql.includes("'")`,
            `A single quote has been detected in your pql. Keep in mind that all strings must be encapsulated by double quotes for the pql to be valid. If this was a mistake, please rerun the command with your rewritten pql. The command will now run.`
        )
    }

    return data
}

// Return if statement that gives the user a error
function createError(conditional, errorMessage, exitCode) {
    return `if(${conditional}) { this.error(${errorMessage}, {exit: ${exitCode}}) }\n`
}

// Return if statement that gives the user a warning
function createWarning(conditional, errorMessage) {
    return `if(${conditional}) { this.warn(chalk.yellow("${errorMessage}"))}\n`
}

// Return integer bounds for specific parameter
function getIntegerBounds(flag) {
    // Freeclimb ignores parameter when 0 is passed to it
    switch (flag.name) {
        case "timeout":
            return {
                min: 0,
                max: 120,
            }
        case "maxSize":
            return {
                min: 0,
                max: 1000,
            }
    }
}

// Return boolean parsing logic for each boolean parameter
function getBooleanParams(booleanParams) {
    let data = ""

    if (!isEmpty(booleanParams)) {
        data += "\n"
        booleanParams.forEach((param) => {
            data += `// ${accessSpecifier(param)}.${param.name} === "true" sets ${
                param.name
            } to the boolean representation of the flag\n\t\t`
            data += `const ${param.name} = typeof ${accessSpecifier(param)}.${
                param.name
            }  === "undefined" ? undefined : ${accessSpecifier(param)}.${param.name} === "true"\n`
        })
    }

    return data
}

// Return body and query parameters to be added to the Axios request
function getAxiosParams(bodyParams, queryParams) {
    let data = ""

    if (!isEmpty(bodyParams)) {
        data += "data: {"
        bodyParams.forEach((param) => {
            data +=
                param.dataType === "boolean"
                    ? `\n\t\t\t\t${param.name}: ${param.name},`
                    : `\n\t\t\t\t${param.name}: ${accessSpecifier(param)}.${param.name},`
        })
        data += "\n\t\t\t},\n\t\t"
    }

    if (!isEmpty(queryParams)) {
        data += "params: {"

        queryParams.forEach((param) => {
            if (param.paramType === "query") {
                data +=
                    param.dataType === "boolean"
                        ? `\n\t\t\t\t${param.name}: ${param.name},`
                        : `\n\t\t\t\t${param.name}: ${accessSpecifier(param)}.${param.name},`
            }
        })
        data += "\n\t\t\t},\n\t\t"
    }

    return data
}

// Return response of Axios request
function getAxiosResponse(topicName) {
    return topicName === "logs"
        ? `if (response.status === 204) { out.out( chalk.green("Received a success code from FreeClimb. There is no further output.") ) } else if (response.data) { out.out(flags.maxItem?JSON.stringify(response.data.logs.splice(0, flags.maxItem), null, 2): JSON.stringify(response.data, null, 2)) } else { throw new Errors.UndefinedResponseError() }`
        : `if (response.status === 204) { out.out( chalk.green("Received a success code from FreeClimb. There is no further output.") ) } else if (response.data) { out.out(JSON.stringify(response.data, null, 2)) } else { throw new Errors.UndefinedResponseError() }`
}

function getAxiosResponseNextFlag(topicName) {
    return topicName === "logs"
        ? `if (response.data) { out.out(flags.maxItem?JSON.stringify(response.data.logs.splice(0, flags.maxItem), null, 2): JSON.stringify(response.data, null, 2)) } else { throw new Errors.UndefinedResponseError()}`
        : `if (response.data) { out.out(JSON.stringify(response.data, null, 2)) } else { throw new Errors.UndefinedResponseError() }`
}

function accessSpecifier(param) {
    return param.required ? "args" : "flags"
}
