import React, {Dispatch, FunctionComponent, RefObject, SetStateAction, useRef} from "react";
import {Leaf} from "./Leaf";
import {Branch} from "./Branch";
import {PositionedNode} from "../../types/Node";
import {AlignTreeNodesParam, NodeSelectionProps, TreeParams} from "./types";

export interface TreeNodeProps extends NodeSelectionProps {
    node: PositionedNode;
    alignParams: AlignTreeNodesParam;
    treeParams: TreeParams;
}

export const TreeNode: FunctionComponent<TreeNodeProps> = (props) => {

    const {
        node,
        alignParams,
        treeParams,
        selectedNodeId,
        hoveredNodeId,
        highlightPathIds
    } = props

    const pathHighlighted = highlightPathIds.includes(node.id);
    // The common ancestor is skipped from highlight, but the selected or hovered node can be the common ancestor
    const borderHighlighted = pathHighlighted || (highlightPathIds.length > 0 && selectedNodeId === node.id || hoveredNodeId === node.id);

    return <>
        {node.parentId!== "-1" ? <Branch node={node} treeParams={treeParams} alignParams={alignParams} highlighted={pathHighlighted} />
      : null}
        <>
            <Leaf {...props} borderHighlighted={borderHighlighted}>
                {/*ID: {node.id}<br/>*/}
                KEY: {node.key}<br/>
                VALUE: {node.value}<br/>
                {/*LEFT: {node.left}<br/>
                RIGHT: {node.right}<br/>
                HEIGHT: {node.height}<br/>
                BF: {node.bf}<br/>*/}
            </Leaf>
            {node.children && node.children.length > 0 && node.children.map((child, childIndex) => <TreeNode {...props} node={child}/> )}
        </>
    </>
}