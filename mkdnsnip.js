import { copy_snippet } from "./desmos/libdesmos.js";
const ibox = document.getElementById("ncol");
const genb = document.getElementById("gen");
function row(things) {
    return { type: "row", content: things };
}
function column(things) {
    return { type: "column", content: things };
}
function graphref(id) {
    return { type: "graph-cell", attrs: { id } };
}
genb.addEventListener("click", async () => {
    const n = ibox.valueAsNumber;
    if (Number.isNaN(n)) {
        alert("Bad number");
        return;
    }
    const cd = [];
    for (let i = 0; i < n; ++i) {
        cd.push({
            id: String(i),
            type: "graph-cell",
            calculatorState: {
                version: 11,
                randomSeed: "",
                graph: {
                    viewport: {
                        xmin: -10,
                        xmax: 10,
                        ymin: -10,
                        ymax: 10
                    }
                },
                expressions: { list: [] }
            }
        });
    }
    await copy_snippet({
        format: "dcg-notebook-slice",
        data: {
            type: "application/desmos-notebook+json",
            data: {
                slice: {
                    content: [
                        row(Array.from(cd, (_, id) => column([graphref(id)])))
                    ]
                },
                cells: Object.fromEntries(cd.entries())
            }
        }
    });
    genb.textContent = "Copied!";
    setTimeout(() => { genb.textContent = "Copy snippet to clipboard"; }, 1000);
});
