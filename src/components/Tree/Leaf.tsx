import styled from "styled-components";
import {AlignTreeNodesParam, NodeAlignmentProps, NodeSelectionProps} from "./types";
import {FunctionComponent, PropsWithChildren} from "react";
import {PositionedNode} from "../../types/Node";
import {Tooltip} from "../Tooltip/Tooltip";

export interface LeafStyleProps {
    highlighted?: boolean
    borderHighlighted?: boolean
}

interface LeafProps extends LeafStyleProps, NodeSelectionProps {
    node: PositionedNode
    alignParams: AlignTreeNodesParam
}

export const StyledLeaf = styled.div<LeafStyleProps&NodeAlignmentProps>`
  position: absolute;
  width: ${({alignParams: {nodeWidth}}) =>nodeWidth}px;
  height: ${({alignParams: {nodeHeight}}) =>nodeHeight}px;
  left: ${({x}) => x}px;
  top: ${({y}) => y}px;
  line-height: ${({alignParams: {nodeHeight}}) =>nodeHeight}px;
  border: 1px solid ${({theme, borderHighlighted}) => borderHighlighted ? theme.colors.pathHighlight : theme.colors.strokeColor};
  ${({theme, borderHighlighted}) => borderHighlighted ? `box-shadow: 0px 0px 3px ${theme.colors.pathHighlight}, 0px 0px 3px ${theme.colors.pathHighlight};` : ""};
  border-radius: ${({alignParams: {nodeHeight}}) =>nodeHeight /2}px;
  padding: ${({alignParams: {nodePadding}}) =>nodePadding}px;
  margin: ${({alignParams: {nodeMargin}}) =>nodeMargin}px 0;
  background-color: ${({theme, highlighted}) => highlighted ? theme.colors.nodeHighlight : theme.colors.nodeBackground};
`

export const Leaf: FunctionComponent<PropsWithChildren<LeafProps>> = ({
    children,
    node,
    alignParams,
    selectedNodeId,
    setSelectedNodeId,
    hoveredNodeId,
    setHoveredNodeId,
    borderHighlighted,
    distance
}) => {

    return <StyledLeaf
        x={node.x}
        y={node.y}
        alignParams={alignParams}
        highlighted={selectedNodeId === node.id || hoveredNodeId === node.id}
        borderHighlighted={borderHighlighted}
        onClick={() => setSelectedNodeId(node.id)}
        onMouseOver={() => setHoveredNodeId(node.id)}
        onMouseOut={() => setHoveredNodeId(-1)}
        className='noTextSelect'
    >
        {children}
        {hoveredNodeId === node.id && distance > 0 ? <Tooltip>Distance: {distance}</Tooltip> : null}
    </StyledLeaf>
}
