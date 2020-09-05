const remark = require("remark")
const stringify = require("remark-stringify")
const excerptAst = require(".")

// fake the plugin
const asExcerpt = (options) => (node) => excerptAst(node, options || {})

const runRemark = (md, options) =>
  remark()
    .use(asExcerpt, { omission: "...", ...options })
    .use(stringify)
    .processSync(md)

test("should be able to prune only full words", () => {
  const res = runRemark("*Full emphasis* and _high stress_, you guys!", { pruneLength: 3 })
  expect(String(res).trimRight()).toBe("_..._")
})

test("should be able to prune till first word", () => {
  const res = runRemark("*Full emphasis* and _high stress_, **you guys**!", { pruneLength: 4 })
  expect(String(res).trimRight()).toBe("_Full..._")
})

test("should be able to prune in bold text", () => {
  const res = runRemark("*Full emphasis* and _high stress_, **you guys**!", { pruneLength: 34 })
  expect(String(res).trimRight()).toBe("_Full emphasis_ and _high stress_, **you...**")
})

test("should be able to deal with imgs", () => {
  const res = runRemark(
    "*Full emphasis* and _high stress_, **![text](https://via.placeholder.com/150) guys**!",
    {
      pruneLength: 34,
    }
  )
  expect(String(res).trimRight()).toBe(
    "_Full emphasis_ and _high stress_, **![text](https://via.placeholder.com/150)...**"
  )
})

test("should not deal with html stuff", () => {
  const res = runRemark("*Full emphasis* and _high stress_, <strong>some crazy html code</strong>", {
    pruneLength: 34,
  })
  // We don't deal with html in markdown, use rehype-raw to parse html in markdown beforehand
  expect(String(res).trimRight()).toBe("_Full emphasis_ and _high stress_, <strong>...")
})
