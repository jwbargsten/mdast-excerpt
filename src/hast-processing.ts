import toString from "lodash/toString"
import { Parent as UnistParent } from "unist"

export interface Parent extends UnistParent {
  value?: unknown
}

function duplicateNode(node: Parent) {
  return {
    ...node,
    children: [],
  }
}

function getConcatenatedValue(node: Parent | undefined): string {
  if (!node) {
    return ``
  }
  if (node.type === "text") {
    return toString(node.value)
  } else if (node.children?.length) {
    return (node.children as Parent[])
      .map(getConcatenatedValue)
      .filter((value) => value)
      .join("")
  }
  return ""
}

function cloneTreeUntil(
  root: Parent,
  endCondition: ({ root, nextNode }: { root: Parent | undefined; nextNode?: Parent }) => boolean
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
      ;(clonedRoot.children as Parent[]).push(newNode)
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

function findLastTextNode(node: Parent, textNode?: Parent): Parent | undefined {
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
