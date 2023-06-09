export interface NodeOld {
    id: number;
    description: string;
    children: Node[];
}

export interface Node {
    id: string;
    key: number;
    value: number;
    left: string;
    right: string;
    height: number;
    bf: number;
    children?: Node[];
}

export interface TreeProperties {
    maxWidth: number;
    depth: number;
}
export interface PositionedNode extends Node {
    x: number;
    y: number;
    children: PositionedNode[];
    parentId: string;
    depth: number;
    weight: number;
    siblingsWidth: number;
}