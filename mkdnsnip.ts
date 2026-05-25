import type { CalculatorState } from "./desmos";
const ibox = document.getElementById("ncol") as HTMLInputElement;
const genb = document.getElementById("gen") as HTMLButtonElement;
type ReferenceCell<T extends string> = {
    type: T,
    attrs: { id: number }
};
type GraphCell = ReferenceCell<"graph-cell">;
type SliderCell = ReferenceCell<"slider-cell">;
type ContainerCell<T extends string> = {
    type: T,
    content: Cell[]
};
type ColumnCell = ContainerCell<"column">;
type RowCell = ContainerCell<"row">;
type Cell = GraphCell | SliderCell | ColumnCell | RowCell;
function row(things: Cell[]): RowCell{
    return {type: "row", content: things};
}
function column(things: Cell[]): ColumnCell{
    return {type: "column", content: things};
}
function graphref(id: number): GraphCell{
    return {type: "graph-cell", attrs: {id}};
}
function sliderref(id: number): SliderCell{
    return {type: "slider-cell", attrs: {id}};
}
type HasID = { id: string; };
type GraphCellData = HasID & {
    type: "graph-cell",
    calculatorState: CalculatorState
};
type SliderCellData = HasID & {
    type: "slider-cell",
    showLabel: boolean,
    label?: string,
    showValue: boolean,
    variable: string
}
type CellData = GraphCellData | SliderCellData;
type NotebookData = {
    slice: { content: Cell[] },
    cells: {
        [N: string]: CellData
    }
};
type NotebookClip = {
    type: "application/desmos-notebook+json",
    data: NotebookData
};
genb.addEventListener("click",async () => {
    const n: number = ibox.valueAsNumber;
    if(Number.isNaN(n)){ alert("Bad number"); return; }
    const cd: GraphCellData[] = [];
    for(let i=0;i<n;++i){
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
    const data: NotebookClip = {
        type: "application/desmos-notebook+json",
        data: {
            slice: {
                content: [
                    row(Array.from(cd,(_,id: number) => column([graphref(id)])))
                ]
            },
            cells: Object.fromEntries(cd.entries())
        }
    };
    const elem = document.createElement("div");
    elem.setAttribute("data-dcg-clipboard-format","dcg-notebook-slice");
    elem.setAttribute("data-dcg-clipboard-payload",JSON.stringify(data));
    await navigator.clipboard.write([new ClipboardItem({"text/html": elem.outerHTML})]);
    console.log(elem.outerHTML);
    console.log(JSON.stringify(data));
    genb.textContent = "Copied!";
    setTimeout(() => {genb.textContent = "Copy snippet to clipboard";},1000);
});
