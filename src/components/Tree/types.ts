import {Dispatch, SetStateAction} from "react";
import {PositionedNode} from "../../types/Node";

export interface AlignTreeNodesParam {
    nodeHeight: number;
    nodeWidth: number;
    nodePadding: number;
    nodeMargin: number;

    branchLength: number;
}

export interface TreeParams {
    descendants: number;
    treeMaxWidth: number;
    siblingsMap: Map<number,number[]>;
    nodeMap: Map<number,PositionedNode>;
}

export interface NodeSelectionProps {
    selectedNodeId: number;
    setSelectedNodeId:  Dispatch<SetStateAction<number>>;
    hoveredNodeId: number;
    setHoveredNodeId:  Dispatch<SetStateAction<number>>;

    distance: number;
    highlightPathIds: number[];
}
export interface NodeAlignmentProps {
    x: number;
    y:number;
    alignParams: AlignTreeNodesParam;
}

export interface Vector2D {
    x: number;
    y:number;
}