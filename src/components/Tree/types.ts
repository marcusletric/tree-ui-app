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
    siblingsMap: Map<number,string[]>;
    nodeMap: Map<string,PositionedNode>;
}

export interface NodeSelectionProps {
    selectedNodeId: string;
    setSelectedNodeId:  Dispatch<SetStateAction<string>>;
    hoveredNodeId: string;
    setHoveredNodeId:  Dispatch<SetStateAction<string>>;

    distance: number;
    highlightPathIds: string[];
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