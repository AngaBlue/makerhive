export default function (string: string) {
    //Convert any string to something that can be used in the URL.
    //Lowercase, spaces replaced with "-", non alphanumeric characters removed, length capped to 128 chars
    return string
        .toLowerCase()
        .replace(/\s/g, "-")
        .replace(/[^A-Za-z0-9-]+/g, "")
        .slice(0, 128);
}
