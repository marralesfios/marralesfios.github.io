type HasID = { id: string; };
type ViewportBounds<T> = {
    xmin: T, ymin: T, xmax: T, ymax: T
};
export type Expression = HasID & {
    type: "expression",
    color: string,
    latex: string
} & ({
    connectToNotebook?: false
} | {
    connectToNotebook: true,
    notebookTokenLatex: string
});
export type Folder = HasID & {
    type: "folder",
    secret?: boolean,
    title: string
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
