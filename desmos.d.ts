type ViewportBounds<T> = {
    xmin: T, ymin: T, xmax: T, ymax: T
};
export type Expression = {
    type: "expression",
    id: string,
    color: string,
    latex: string
};
export type CalculatorState2D = {
    version: 11,
    randomSeed: string,
    graph: {
        viewport?: ViewportBounds<number>,
        __v12ViewportLatexStash?: ViewportBounds<string>
    },
    expressions: {
        list: Expression[]
    },
    includeFunctionParametersInRandomSeed?: boolean,
    doNotMigrateMovablePointStyle?: boolean
};
