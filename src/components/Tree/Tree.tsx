import React, {FunctionComponent, useState} from "react";
import styled from "styled-components";
import {TreeNode} from "./TreeNode";
import {alignTreeNodes, calcDistance} from "./treeProcessing";
import { Node } from "../../types/Node";

interface TreeProps {
     treeData: Node;
}

// The nodes will be positioned relative to this container
const TreeCanvas = styled.div`
  position: relative;
`
// Define visual parameters of a node
const alignParams = {
     nodeWidth : 200,
     nodeHeight : 60,
     nodeMargin : 5,
     nodePadding : 2,
     branchLength : 80,
}
export const Tree: FunctionComponent<TreeProps> = ({treeData}) => {
     const {root, treeParams} = alignTreeNodes(treeData, alignParams);
     const [selectedNodeId, setSelectedNodeId] = useState<string>("-1")
     const [hoveredNodeId, setHoveredNodeId] = useState<string>("-1")
     const {distance, highlightPathIds} = calcDistance(selectedNodeId, hoveredNodeId, treeParams);

     const props = {
          node: root,
          alignParams,
          treeParams,
          selectedNodeId,
          setSelectedNodeId,
          hoveredNodeId,
          setHoveredNodeId,
          distance,
          highlightPathIds
     }

     return <TreeCanvas><TreeNode {...props}/></TreeCanvas>
}

