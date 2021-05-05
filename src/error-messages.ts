const errorMessage = new Map([
    [
        0,
        "Either a service was inaccessible or was configured wrong. This error can occurs if login credentials are not valid. Re-run the login command. If error persists, something went wrong on FreeClimb's end. Plese try Our engineers are hard at work resolving this problem.",
    ],
    [1, "Check for typos or misspelling."],
    [
        3,
        "Make sure that all necessary flags and arguments have been formatted and/or spelled correctly.",
    ],
    [
        5,
        "Check formatting of PQL request. For more details on formatting visit: https://docs.freeclimb.com/reference/logs#filter-logs.",
    ],
    [
        6,
        "Update your profile to ensure you have the correct information on file: https://freeclimb.com/dashboard/portal/account/profile.",
    ],
    [
        9,
        "Check formatting of flags and arguements. Note: Numbers should be in e.164 format: +12223334444",
    ],
    [10, "Use a different number that is SMS enabled."],
    [
        11,
        "You currently do not have access to international numbers. To gain access to international numbers, contact support@freeclimb.com",
    ],
    [
        15,
        "The system was unable to create a calling number. This is an internal error. Please try again. \nIf the error persists, please contact support@freeclimb.com.",
    ],
    [
        16,
        "The system was unable to create a call. This is an internal error. Please try again. \nIf the error persists, please contact support@freeclimb.com.",
    ],
    [
        17,
        "The system failed to update the call. This is an internal error. Please try again. \nIf the error persists, please contact support@freeclimb.com",
    ],
    [
        18,
        "The system was unable to update a participant in the conference. This is an internal error. Please try again. \nIf the error persists, please contact support@freeclimb.com.",
    ],
    [
        19,
        "The system was unable to hang up a participant from the call. This is an internal error. Please try again. \nIf the error persists, please contact support@freeclimb.com.",
    ],
    [
        20,
        "The system failed to delete a participant from the conference. This is an internal error \nIf the error persists, please contact support@freeclimb.com.",
    ],
    [24, "Wait and retry your request."],
    [
        27,
        "If you have upgraded your account, please remove any functionality associated with trial accounts, such as verified numbers.",
    ],
    [29, "Check that the outbound number you are using is verified in the dashboard."],
    [30, "Contact support@freeclimb.com for assistance."],
    [31, "If the error persists, contact support@freeclimb.com for more information."],
    [
        43,
        "Your account type is not recognized by our system. This is an internal error. \nIf the error persists, please contact support@freeclimb.com.",
    ],
    [
        44,
        "Your account status is not recognized by our system. This is an internal error. \n If the error persists, please contact support@freeclimb.com.",
    ],
    [46, "Check for any typos. Check if your account owns the number."],
    [47, "To gain access to international numbers, please contact support@freeclimb.com"],
    [49, "Please contact support@freeclimb.com."],
    [
        50,
        "Saved login credentials could be incorrect. Try command freeclimb login to reset credentials.",
    ],
    [
        51,
        "Login with new account credentials. /nIf the error persists, please contact support@freeclimb.com.",
    ],
    [55, "The server will be back sortly."],
    [56, "Wait until the call is no longer in a conference."],
    [59, "The system was unable to create a Queue. This is an internal error."],
    [
        61,
        "An attempt was made to reuse a resource ID. This is an internal error. If the problem persists, contact support@freeclimb.com",
    ],
    [
        62,
        "The system was unable to create a Conference. This is an internal error. If the problem persists, contact support@freeclimb.com",
    ],
    [66, "Check for any typos with the conferenceId or callId associated with the conference."],
    [
        67,
        "The system was unable to add member a member to the queue. This is an internal error. \n If the error persists, please contact support@freeclimb.com.",
    ],
    [
        68,
        "Check recordingId is correct. /nIf the error persists, please contact support@freeclimb.com.",
    ],
    [69, "Ensure the file URL is returning a non-empty response body."],
    [
        76,
        "To resolve choose one of the following and retry command. /nDelete an exsisting number /nor /nupgrade to full account",
    ],
    [
        77,
        "The resource you attempted to retrieve or modify has been deleted and can no longer be accessed.",
    ],
])

export function errorWithSuggestions(errorM: any) {
    const suggestion = errorMessage.get(errorM.code) || "Refer to URL"
    return returnFormat(errorM.code, errorM.message, errorM.url, suggestion)
}

export function returnFormat(code: number, message: string, url: string, suggestion: string) {
    return `
    Code : ${code}
    Message : ${message}
    Suggestion : ${suggestion}
    For further information on this error visit :
    ${url}
    `
}
