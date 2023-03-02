import React, {FunctionComponent} from "react";
import styled from "styled-components";
import {AlignTreeNodesParam, NodeAlignmentProps, TreeParams, Vector2D} from "./types";
import {PositionedNode} from "../../types/Node";
import {theme} from "../../styles/theme";

enum BranchDirection {
    UP = "UP",
    DOWN = "DOWN"
}
interface BranchProps {
    node: PositionedNode,
    treeParams: TreeParams,
    alignParams: AlignTreeNodesParam,
    highlighted?: boolean,
}

const StyledBranch = styled.svg<NodeAlignmentProps>`
  position: absolute;
  width: ${({alignParams: {branchLength}}) => branchLength}px;
  height: ${({height}) => height}px;
  left: ${({x}) => x}px;
  top: ${({y}) => y}px;
`


export const Branch: FunctionComponent<BranchProps> = ({ node, treeParams, alignParams, highlighted}) => {
    const { nodeMap } = treeParams
    const {
        branchLength,
        nodeHeight,
        nodePadding,
        nodeMargin
    } = alignParams

    const parent: PositionedNode | undefined = nodeMap.get(node.parentId);
    const parentY: number = (parent || {y:0}).y;
    const branchHeight: number = Math.max(Math.abs(parentY - node.y), 1);
    const fullNodeHeight: number = (nodeHeight + 2 * (nodePadding + nodeMargin));
    const direction: BranchDirection = parentY > node.y ? BranchDirection.UP : BranchDirection.DOWN
    const strokeColor = highlighted ? theme.colors.pathHighlight : theme.colors.strokeColor;

    const svgPos: Vector2D = {
        x : node.x - branchLength,
        y: direction === BranchDirection.UP ? node.y + fullNodeHeight / 2 : parentY + fullNodeHeight / 2
    }

    const curveStartPoint: Vector2D = {
        x: 0,
        y: direction === BranchDirection.DOWN ? 0 : branchHeight
    }

    const curveMidPoint: Vector2D = {
        x: branchLength / 2,
        y: branchHeight / 2
    }

    const curveEndPoint: Vector2D = {
        x: branchLength,
        y: direction === BranchDirection.DOWN ? branchHeight : 0,
    }

    return <StyledBranch
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${branchLength} ${branchHeight}`}
        height={branchHeight}
        x={svgPos.x}
        y={svgPos.y}
        alignParams={alignParams}
    >
        <filter id='highlight' color-interpolation-filters="sRGB">
            <feDropShadow dx="3" dy="3" stdDeviation="3" flood-opacity="0.7" flood-color={theme.colors.pathHighlight}/>
        </filter>
        <g filter={highlighted ? "url(#highlight)": ""}>
            {branchHeight > 10
                ? <>
                    <path
                        d={`M ${curveStartPoint.x} ${curveStartPoint.y} C ${curveMidPoint.x} ${curveStartPoint.y}, ${curveMidPoint.x} ${curveStartPoint.y}, ${curveMidPoint.x} ${curveMidPoint.y}`}
                        stroke={strokeColor} fill="transparent"/>
                    <path
                        d={`M ${curveMidPoint.x} ${curveMidPoint.y} C ${curveMidPoint.x} ${curveMidPoint.y}, ${curveMidPoint.x} ${curveEndPoint.y}, ${curveEndPoint.x} ${curveEndPoint.y}`}
                        stroke={strokeColor} fill="transparent"/>
                </>
                :
                <path d={`M ${curveStartPoint.x} ${curveStartPoint.y} C ${curveEndPoint.x} ${curveStartPoint.y}, ${curveEndPoint.x} ${curveEndPoint.y}, ${curveEndPoint.x} ${curveEndPoint.y}`}
                      stroke={strokeColor} fill="transparent"/>}
        </g>
    </StyledBranch>
}