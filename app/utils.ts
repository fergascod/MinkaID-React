export function returnName(sp) {
    if ("preferred_common_name" in sp) {
        return `${sp["preferred_common_name"]} (${sp["name"]})`
    }
    return sp["name"]
}