import { copy_snippet, paste_snippet } from "./libdesmos.js";
const workspace = [{
        type: "folder",
        title: "generated",
        id: "0"
    }];
const wsp_element = document.getElementById("workspace");
const DESMOS_COLORS = [
    "#c74440",
    "#2d70b3",
    "#348543",
    "#fa7e19",
    "#6042a6",
    "#000"
];
let colorind = 0;
function find_free_id() {
    let id = 0;
    for (const used of workspace.map(x => Number(x.id)).sort()) {
        if (id !== used)
            break;
        ++id;
    }
    return id;
}
function countlines(s) {
    let n = 1;
    for (const char of s) {
        if (char === '\n')
            ++n;
    }
    return n;
}
function mktextarea(init = "") {
    const elem = document.createElement("textarea");
    elem.autocorrect = false;
    elem.spellcheck = false;
    elem.autocapitalize = "off";
    function update() {
        elem.style.height = `${countlines(elem.value)}lh`;
    }
    elem.addEventListener("input", update);
    elem.value = init;
    update();
    return elem;
}
function paragraph(text) {
    const el = document.createElement("p");
    el.textContent = text;
    return el;
}
function summary(text) {
    const el = document.createElement("summary");
    el.textContent = text;
    return el;
}
function render_line(ln) {
    const el = document.createElement("div");
    el.classList.add("line");
    if (ln.type === "expression") {
        el.style.setProperty("--expr-color", ln.color);
    }
    const idrow = document.createElement("div");
    const idbox = document.createElement("input");
    idbox.type = "number";
    idbox.min = "0";
    idbox.size = 3;
    idbox.value = ln.id;
    idbox.addEventListener("input", () => {
        ln.id = idbox.value;
    });
    const colorsquare = document.createElement("span");
    colorsquare.classList.add("color-square");
    idrow.append(colorsquare, "#", idbox);
    el.append(idrow);
    if (ln.type === "expression") {
        const latexbox = mktextarea(ln.latex);
        latexbox.classList.add("latex-input");
        latexbox.addEventListener("input", () => {
            ln.latex = latexbox.value;
        });
        const sliderbox = document.createElement("details");
        const sliderdetails = document.createElement("div");
        const smin = mktextarea(ln.slider?.min);
        smin.classList.add("latex-input");
        smin.addEventListener("input", () => {
            ln.slider ??= {};
            ln.slider.min = smin.value;
        });
        const sminlabel = paragraph("min | hard: ");
        const smincbox = document.createElement("input");
        smincbox.type = "checkbox";
        smincbox.checked = ln.slider?.hardMin ?? false;
        smincbox.addEventListener("input", () => {
            ln.slider ??= {};
            ln.slider.hardMin = smincbox.checked;
        });
        sminlabel.append(smincbox);
        const smax = mktextarea(ln.slider?.min);
        smax.classList.add("latex-input");
        smax.addEventListener("input", () => {
            ln.slider ??= {};
            ln.slider.max = smax.value;
        });
        const smaxlabel = paragraph("max | hard: ");
        const smaxcbox = document.createElement("input");
        smaxcbox.type = "checkbox";
        smaxcbox.checked = ln.slider?.hardMax ?? false;
        smaxcbox.addEventListener("input", () => {
            ln.slider ??= {};
            ln.slider.hardMax = smaxcbox.checked;
        });
        smaxlabel.append(smaxcbox);
        sliderdetails.append(sminlabel, smin, smaxlabel, smax);
        sliderbox.append(summary("slider"), sliderdetails);
        el.append(latexbox, sliderbox);
    }
    return el;
}
function add_line(ln) {
    workspace.push(ln);
    wsp_element.append(render_line(ln));
}
document.getElementById("add").addEventListener("click", () => {
    const ln = {
        type: "expression",
        id: find_free_id().toString(),
        color: DESMOS_COLORS[colorind],
        latex: "",
        folderId: "0"
    };
    add_line(ln);
    if (++colorind == DESMOS_COLORS.length) {
        colorind = 0;
    }
});
const copybtn = document.getElementById("copy");
copybtn.addEventListener("click", async () => {
    await copy_snippet({
        format: "dcg-copy-expression",
        data: workspace
    });
    copybtn.textContent = "Copied!";
    setTimeout(() => { copybtn.textContent = "Copy to clipboard"; }, 1000);
});
document.getElementById("paste").addEventListener("click", async () => {
    const snpt = await paste_snippet();
    if (snpt.format === "dcg-copy-expression") {
        workspace.splice(1);
        wsp_element.replaceChildren();
        for (const ln of snpt.data) {
            if (ln.type === "expression") {
                ln.folderId = "0";
            }
            add_line(ln);
        }
        alert(JSON.stringify(snpt.data));
    }
});
