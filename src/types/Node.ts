export interface Node {
    id: number;
    description: string;
    children: Node[];
}

export interface TreeProperties {
    maxWidth: number;
    depth: number;
}
export interface PositionedNode extends Node {
    x: number;
    y: number;
    children: PositionedNode[];
    parentId: number;
    depth: number;
    weight: number;
    siblingsWidth: number;
}