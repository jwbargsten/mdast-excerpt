import { toString, truncate as truncateString } from "lodash"
import { prune } from "./prune"
import { getConcatenatedValue, cloneTreeUntil, findLastTextNode } from "./hast-processing"
import { Node, Parent } from "unist"

// stolen from gatsby/packages/gatsby-transformer-remark/src/extend-node-type.js

function excerptAst(
  node: Node,
  {
    pruneLength = 140,
    truncate = false,
    excerptSeparator,
    omission = `…`,
  }: { pruneLength?: number; truncate?: boolean; excerptSeparator?: string; omission?: string }
) {
  if (!(node as Parent)?.children?.length) {
    return node
  }

  if (excerptSeparator) {
    const { tree, is_pruned } = cloneTreeUntil(
      node as Parent,
      ({ nextNode }) => nextNode?.value === excerptSeparator
    )
    if (is_pruned) {
      return tree
    }
  } else if (!pruneLength || pruneLength < 0) {
    return node
  }

  const { tree: excerptAST } = cloneTreeUntil(node as Parent, ({ root }) => {
    const totalExcerptSoFar = getConcatenatedValue(root)
    return !!totalExcerptSoFar && totalExcerptSoFar.length > pruneLength
  })
  const unprunedExcerpt = getConcatenatedValue(excerptAST)
  if (!unprunedExcerpt || (pruneLength && unprunedExcerpt.length < pruneLength)) {
    return excerptAST
  }

  const lastTextNode = findLastTextNode(excerptAST)
  if (!lastTextNode) {
    return excerptAST
  }
  const lastTextNodeValue = toString(lastTextNode.value)
  const amountToPruneBy = unprunedExcerpt.length - pruneLength
  const desiredLengthOfLastNode = lastTextNodeValue.length - amountToPruneBy
  if (!truncate) {
    lastTextNode.value = prune(lastTextNodeValue, desiredLengthOfLastNode, omission)
  } else {
    lastTextNode.value = truncateString(lastTextNodeValue, {
      length: pruneLength,
      omission,
    })
  }
  return excerptAST
}

export default excerptAst
