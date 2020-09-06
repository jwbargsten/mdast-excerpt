const _ = require(`lodash`)
const prune = require(`underscore.string/prune`)
const { getConcatenatedValue, cloneTreeUntil, findLastTextNode } = require(`./hast-processing`)

// stolen from gatsby/packages/gatsby-transformer-remark/src/extend-node-type.js

function excerptAst(node, { pruneLength = 140, truncate = false, excerptSeparator, omission = `…` }) {
  if (!node.children.length) {
    return node
  }

  if (excerptSeparator) {
    const { tree, is_pruned } = cloneTreeUntil(node, ({ nextNode }) => nextNode.value === excerptSeparator)
    if (is_pruned) {
      return tree
    }
  } else if (!pruneLength || pruneLength < 0) {
    return node
  }

  const { tree: excerptAST } = cloneTreeUntil(node, ({ root }) => {
    const totalExcerptSoFar = getConcatenatedValue(root)
    return totalExcerptSoFar && totalExcerptSoFar.length > pruneLength
  })
  const unprunedExcerpt = getConcatenatedValue(excerptAST)
  if (!unprunedExcerpt || (pruneLength && unprunedExcerpt.length < pruneLength)) {
    return excerptAST
  }

  const lastTextNode = findLastTextNode(excerptAST)
  const amountToPruneBy = unprunedExcerpt.length - pruneLength
  const desiredLengthOfLastNode = lastTextNode.value.length - amountToPruneBy
  if (!truncate) {
    lastTextNode.value = prune(lastTextNode.value, desiredLengthOfLastNode, omission)
  } else {
    lastTextNode.value = _.truncate(lastTextNode.value, {
      length: pruneLength,
      omission,
    })
  }
  return excerptAST
}

module.exports = excerptAst
