import {Node, PositionedNode} from "../../types/Node";
import {AlignTreeNodesParam, TreeParams} from "./types";

export const calcDistance = (nodeId1: string, nodeId2: string, treeParams: TreeParams): {distance: number, highlightPathIds: string[]} => {
    const returnValue = {
        distance: 0,
        highlightPathIds: []
    }

    const {nodeMap} = treeParams;

    if(nodeId1 === "-1" || nodeId2 === "-1" || nodeId1 === nodeId2) {
        return returnValue
    }

    let idPair = [nodeId1, nodeId2];
    let workIndex = 0;
    let touchedNodes: string[][] = [[],[]];
    let commonAncestor = null;

    while(!commonAncestor) {
        touchedNodes[workIndex].push(idPair[workIndex])
        const parentId = (nodeMap.get(idPair[workIndex]) || {parentId: "-1"}).parentId
        idPair[workIndex] = parentId;
        workIndex = Math.abs(workIndex-1);
        commonAncestor = touchedNodes[0].find(node => touchedNodes[1].includes(node))
    }

    const highlightPathIds = [...(touchedNodes[0].slice(0,touchedNodes[0].indexOf(commonAncestor))), ...(touchedNodes[1].slice(0,touchedNodes[1].indexOf(commonAncestor)))];

    return {
        distance: highlightPathIds.length - (commonAncestor === nodeId1 || commonAncestor === nodeId2 ? 0 : 1),
        highlightPathIds
    }
}
const sumWeightAtDepth = (node: PositionedNode, treeParams: TreeParams ):number => {
    const {siblingsMap, nodeMap} = treeParams;
    return Array.from(siblingsMap.get(node.depth) || [])
        .reduce((acc, siblingId) => acc + (nodeMap.get(siblingId) || {weight: 0}).weight, 0);
}
const calcNodeSpace = (node: PositionedNode, treeParams: TreeParams, alignParams: AlignTreeNodesParam) => {
    const {
        nodeHeight,
        nodePadding,
        nodeMargin
    } = alignParams;
    const {siblingsMap, treeMaxWidth} = treeParams;
    const fullNodeHeight = (nodeHeight + 2 * (nodePadding + nodeMargin));
    const siblingsNum = (siblingsMap.get(node.depth) || []).length;
    if(siblingsNum < treeMaxWidth) {
        const depthWeight = sumWeightAtDepth(node, treeParams);
        const maxHeight = (fullNodeHeight * treeMaxWidth);
        const freeSpace = maxHeight - (fullNodeHeight * siblingsNum)
        return fullNodeHeight + freeSpace * (depthWeight ? (node.weight / depthWeight) : 1/siblingsNum)
    } else {
        return fullNodeHeight;
    }
}

const calcNodeY = (prevY: number, nodeSpace: number, alignParams: AlignTreeNodesParam) => {
    const {
        nodeHeight,
        nodePadding,
        nodeMargin
    } = alignParams;
    const fullNodeHeight = (nodeHeight + 2 * (nodePadding + nodeMargin));

    return prevY + nodeSpace /2 - fullNodeHeight /2
}

const calcNodeX = (node:PositionedNode, alignParams: AlignTreeNodesParam) => {
    const {
        branchLength,
        nodePadding,
        nodeMargin,
        nodeWidth,
    } = alignParams;

    return node.depth * (branchLength + (nodeWidth + 2 * nodePadding))
}


const positionNodes = (
    node: PositionedNode,
    alignParams: AlignTreeNodesParam,
    treeParams: TreeParams,
    index: number = 0,
    parent?: PositionedNode,
    depth: number = 0,
    depthYPos: Map<number,number> = new Map<number, number>(),
) => {
    const {
        nodeHeight,
        nodeWidth,
        nodePadding,
        nodeMargin,
        branchLength
    } = alignParams

    const { nodeMap } = treeParams;

    const fullNodeHeight = (nodeHeight + 2 * (nodePadding + nodeMargin));

    if(node.children && node.children.length) {
        let newChildren: PositionedNode[];
        let newNode = {
            ...node,
            x: 0,
            y: 0,
            children: [] as PositionedNode[],
            parent,
        }

        newChildren = node.children.map((child, index) => positionNodes(child,
            alignParams,
            treeParams,
            index,
            newNode,
            depth + 1,
            depthYPos));

        newNode.children = newChildren;
        newNode.x = calcNodeX(node, alignParams);

        const nodeSpace = calcNodeSpace(node, treeParams, alignParams);
        const depthY = (depthYPos.get(depth) || 0);

        newNode.y = calcNodeY(depthY,nodeSpace,alignParams);
        depthYPos.set(depth, depthY + nodeSpace);
        nodeMap.set(node.id, newNode);

        return newNode;
    } else {
        const nodeSpace = calcNodeSpace(node, treeParams,alignParams);
        const depthY = (depthYPos.get(depth) || 0);

        const newNode = {
            ...node,
            children: [] as PositionedNode[],
            x: calcNodeX(node, alignParams),
            y: calcNodeY(depthY,nodeSpace,alignParams),
            parent
        }

        depthYPos.set(depth, (depthYPos.get(depth) || 0) + nodeSpace);
        nodeMap.set(node.id, newNode);

        return newNode
    }
}

/**
 * Function that analyses the tree and augments a Node with parameters later used
 * to calculate the tree layout
 *
 * @param node Root of tree to be analysed
 * @param depth Keeps track of the depth we are currently recursing
 * @param parentId Passes parent ID to child
 * @param siblingsMap Map of ID - sibling ID []
 * @param nodeMap Map of ID - PositionedNode
 *
 * return TreeParams
 */
const analyzeTree = (
    node: PositionedNode,
    depth: number = 0,
    parentId: string = "-1",
    siblingsMap: Map<number,string[]> = new Map<number,string[]>(),
    nodeMap: Map<string,PositionedNode> = new Map<string,PositionedNode>(),
):TreeParams => {
    let numDescendants = 0;

    nodeMap.set(node.id, node);
    if(parentId == "-1") {
        siblingsMap.set(0, [node.id]);
    }
    if(node.children && node.children.length) {
        numDescendants += node.children.length;
        const siblings = node.children.map(child => child.id);
        siblingsMap.set(depth + 1,[...(siblingsMap.get(depth + 1) || []), ...siblings]);
        let subTreeParams = node.children.map(child => {
            return analyzeTree(child, depth +1, node.id, siblingsMap, nodeMap);
        });
        numDescendants += subTreeParams.reduce((acc, treeparam) => acc + treeparam.descendants,0);
    }

    node.weight = numDescendants;
    node.depth = depth;
    node.parentId = parentId;

    return {
        descendants: numDescendants,
        siblingsMap,
        nodeMap,
        treeMaxWidth: Array.from(siblingsMap.values()).reduce((acc, siblings) => siblings.length > acc ? siblings.length : acc,0)
    }
}

export const alignTreeNodes = (node: Node, alignParams: AlignTreeNodesParam) => {
   let treeParams: TreeParams = analyzeTree(node as PositionedNode);
   return {
       root: positionNodes(node as PositionedNode, alignParams, treeParams),
       treeParams
   }
}

export const calcNodeDiff = (node1: Node, node2: Node) => {
    const flatNodes1 = Array.from(analyzeTree(node1 as PositionedNode).nodeMap, ([, node]) => JSON.stringify({key: `${node.key}`, value: node.value}))
    const flatNodes2 = Array.from(analyzeTree(node2 as PositionedNode).nodeMap, ([, node]) => JSON.stringify({key: `${node.key}`, value: node.value}))

    return [...flatNodes2.filter(node => !flatNodes1.includes(node)), ...flatNodes1.filter(node => !flatNodes2.includes(node))].map(node => JSON.parse(node))
}

