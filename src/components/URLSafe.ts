export default function (string: string) {
    return string.toLowerCase().replace(/\s/g, "-").replace(/[^A-Za-z0-9-]+/g, "")
}