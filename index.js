const _ = require(`lodash`)
const prune = require(`underscore.string/prune`)
const { getConcatenatedValue, cloneTreeUntil, findLastTextNode } = require(`./hast-processing`)

// stolen from ../gatsby/packages/gatsby-transformer-remark/src/extend-node-type.js
// canibalize https://github.com/syntax-tree/mdast-squeeze-paragraphs

function getExcerptAst(node, { pruneLength = 1, truncate = false, excerptSeparator, omission = `…` }) {
  if (excerptSeparator) {
    return cloneTreeUntil(
      node,
      ({ nextNode }) => nextNode.type === `raw` && nextNode.value === excerptSeparator
    )
  }
  if (!node.children.length) {
    return node
  }

  const excerptAST = cloneTreeUntil(node, ({ root }) => {
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

module.exports = getExcerptAst
