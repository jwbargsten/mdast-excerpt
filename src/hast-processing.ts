import toString from "lodash/toString"
import { Node, NodeData } from "unist"

export interface Parent<ChildNode extends Node<object> = Node, TData extends object = NodeData<ChildNode>>
  extends Node<TData> {
  children?: ChildNode[]
  value?: unknown
}

function duplicateNode(node: Parent) {
  return node.children ? { ...node, children: [] } : { ...node }
}

function getConcatenatedValue(node: Parent | undefined): string {
  if (!node) {
    return ``
  }
  if (node.type === "text") {
    return toString(node.value)
  }
  if (node.children?.length) {
    return (node.children as Parent[])
      .map(getConcatenatedValue)
      .filter((value) => value)
      .join("")
  }
  return ""
}

function cloneTreeUntil(
  root: Parent,
  endCondition: (args: { root: Parent | undefined; nextNode?: Parent }) => boolean
): { tree: Parent; is_pruned: boolean } {
  let clonedRoot: Parent | undefined
  let endConditionMet = false

  function preOrderTraversal(node: Parent) {
    if (endConditionMet || endCondition({ root: clonedRoot, nextNode: node })) {
      endConditionMet = true
      return
    }

    const newNode = duplicateNode(node)
    if (clonedRoot) {
      if (!clonedRoot.children) {
        clonedRoot.children = []
      }
      clonedRoot.children.push(newNode)
    } else {
      clonedRoot = newNode
    }

    if (node.children) {
      ;(node.children as Parent[]).forEach((child) => {
        clonedRoot = newNode
        preOrderTraversal(child)
      })
      clonedRoot = newNode
    }
  }
  preOrderTraversal(root)
  return { tree: clonedRoot || duplicateNode(root), is_pruned: endConditionMet }
}

function findLastTextNode(node: Parent, parentTextNode?: Parent): Parent | undefined {
  let textNode = parentTextNode

  if (node.type === `text`) {
    textNode = node
  }
  if (node.children) {
    ;(node.children as Parent[]).forEach((child) => {
      const laterTextNode = findLastTextNode(child, textNode)
      if (laterTextNode !== textNode) {
        textNode = laterTextNode
      }
    })
  }
  return textNode
}

export { getConcatenatedValue, cloneTreeUntil, findLastTextNode }
