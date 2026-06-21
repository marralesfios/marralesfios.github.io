function require(x) {
    if (x === null)
        throw new Error("unexpected null");
    return x;
}
export async function copy_snippet(data) {
    const elem = document.createElement("div");
    elem.setAttribute("data-dcg-clipboard-format", data.format);
    elem.setAttribute("data-dcg-clipboard-payload", JSON.stringify(data.data));
    await navigator.clipboard.write([new ClipboardItem({ "text/html": elem.outerHTML })]);
}
export async function paste_snippet() {
    const elem = new DOMParser().parseFromString(await (await Promise.any((await navigator.clipboard.read()).map(x => x.getType("text/html")))).text(), "text/html").body.firstElementChild;
    if (elem === null)
        throw new Error("clipboard data is invalid.");
    return {
        format: require(elem.getAttribute("data-dcg-clipboard-format")),
        data: JSON.parse(require(elem.getAttribute("data-dcg-clipboard-payload")))
    };
}
