exports.printDate = function () {
    const date = new Date()
    
    const options = {
        weekday :"long",
        day:"numeric",
        year:"numeric"
    }

    return date.toLocaleDateString("en-US",options)
}
