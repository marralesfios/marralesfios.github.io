export type ReferenceCell<T extends string> = {
    type: T,
    attrs: { id: number }
};
export type GraphCell = ReferenceCell<"graph-cell">;
export type SliderCell = ReferenceCell<"slider-cell">;
export type ContainerCell<T extends string> = {
    type: T,
    content: Cell[]
};
export type ColumnCell = ContainerCell<"column">;
export type RowCell = ContainerCell<"row">;
export type Cell = GraphCell | SliderCell | ColumnCell | RowCell;

type HasID = { id: string; };
export type GraphCellData = HasID & {
    type: "graph-cell",
    calculatorState: CalculatorState
};
export type SliderCellData = HasID & {
    type: "slider-cell",
    showLabel: boolean,
    label?: string,
    showValue: boolean,
    variable: string
}
export type CellData = GraphCellData | SliderCellData;
export type NotebookData = {
    slice: { content: Cell[] },
    cells: {
        [N: string]: CellData
    }
};
export type NotebookClip = {
    type: "application/desmos-notebook+json",
    data: NotebookData
};
export type ViewportBounds<T> = {
    xmin: T, ymin: T, xmax: T, ymax: T
};
export type Slider = {
    min?: string,
    hardMin?: boolean,
    max?: string,
    hardMax?: boolean,
    step?: string
};
export type Expression = HasID & {
    type: "expression",
    color: string,
    latex: string,
    folderId?: string,
    slider?: Slider
} & ({
    connectToNotebook?: false
} | {
    connectToNotebook: true,
    notebookTokenLatex: string
});
export type Folder = HasID & {
    type: "folder",
    secret?: boolean,
    title: string,
    collapsed?: boolean
};
export type Line = Expression | Folder;
export type CalculatorState = {
    version: 11,
    randomSeed: string,
    graph: {
        viewport?: ViewportBounds<number>,
        __v12ViewportLatexStash?: ViewportBounds<string>,
        product?: "graphing" | "graphing-3d" | "geometry-calculator",
        degreeMode?: boolean
    },
    expressions: {
        list: Line[]
    },
    includeFunctionParametersInRandomSeed?: boolean,
    doNotMigrateMovablePointStyle?: boolean,
    doNotMigrate3dLineWidthZero?: boolean
};

export type JSONObject = {[K: string]: JSONObject} | JSONObject[] | number | string | boolean;

export type NotebookSnippet = {
    format: "dcg-notebook-slice",
    data: NotebookClip
};
export type CalculatorSnippet = {
    format: "dcg-copy-expression",
    data: Line[]
};
export type Snippet = NotebookSnippet | CalculatorSnippet;

function require<T extends {}>(x: T | null): T{
    if(x === null) throw new Error("unexpected null");
    return x;
}

export async function copy_snippet(data: Snippet){
    const elem = document.createElement("div");
    elem.setAttribute("data-dcg-clipboard-format",data.format);
    elem.setAttribute("data-dcg-clipboard-payload",JSON.stringify(data.data));
    await navigator.clipboard.write([new ClipboardItem({"text/html": elem.outerHTML})]);
}
export async function paste_snippet(): Promise<Snippet>{
    const elem = new DOMParser().parseFromString(await (await Promise.any((await navigator.clipboard.read()).map(x => x.getType("text/html")))).text(),"text/html").body.firstElementChild;
    if(elem === null) throw new Error("clipboard data is invalid.");
    return {
        format: require(elem.getAttribute("data-dcg-clipboard-format")),
        data: JSON.parse(require(elem.getAttribute("data-dcg-clipboard-payload")))
    } as Snippet;
}
