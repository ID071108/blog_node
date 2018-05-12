function getParams(str) {
    let serializeArr = str.split("&")
    let data = {}
    for (let serializeItem of serializeArr) {
        let arr = serializeItem.split("=")
        data[arr[0]] = arr[1]
    }
    return data
}
module.export = {
    getParams: getParams
}