export function returnName(sp: any) {
    if ("preferred_common_name" in sp) {
        return `${sp["preferred_common_name"]} (${sp["name"]})`
    }
    return sp["name"]
}