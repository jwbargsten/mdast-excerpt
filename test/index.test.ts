import {remark} from "remark"
import stringify from "remark-stringify"
import excerptAst from "../src"
import { Node } from 'hast'

// fake the plugin
const asExcerpt = (options: any) => (node: Node) => excerptAst(node, options || {})

const runRemark = (md: any, options: any) => remark().use(asExcerpt, options).use(stringify).processSync(md)

test("should be able to prune only full words", () => {
  const res = runRemark("*Full emphasis* and _high stress_, you guys!", {
    pruneLength: 3,
  })
  expect(String(res)).toBe(`*…*\n`)
})

test("should not prune if pruneLength not > 0", () => {
  const res = runRemark("*Full emphasis* and _high stress_, you guys!", {
    pruneLength: 0,
  })
  expect(String(res)).toBe("*Full emphasis* and *high stress*, you guys!\n")
})

test("should be able to prune till first word", () => {
  const res = runRemark("*Full emphasis* and _high stress_, **you guys**!", {
    pruneLength: 4,
  })
  expect(String(res)).toBe(`*Full…*\n`)
})

test("should be able to prune in bold text", () => {
  const res = runRemark("*Full emphasis* and _high stress_, **you guys**!", {
    pruneLength: 34,
  })
  expect(String(res)).toBe(`*Full emphasis* and *high stress*, **you…**\n`)
})

test("should be able to deal with imgs", () => {
  const res = runRemark(
    "*Full emphasis* and _high stress_, **![text](https://via.placeholder.com/150) guys**!",
    {
      pruneLength: 34,
    }
  )
  expect(String(res)).toBe(
    `*Full emphasis* and *high stress*, **![text](https://via.placeholder.com/150)…**\n`
  )
})

test("should not deal with html stuff", () => {
  const res = runRemark("*Full emphasis* and _high stress_, <strong>some crazy html code</strong>", {
    pruneLength: 34,
  })
  // We don't deal with html in markdown, use rehype-raw to parse html in markdown beforehand
  expect(String(res).trimRight()).toBe("*Full emphasis* and *high stress*, <strong>…")
})

test("should handle excerpt separator correctly with html node", () => {
  const md = `
Where oh where is my little pony?
<!-- end -->
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi auctor sit amet velit id facilisis. Nulla viverra, eros at efficitur pulvinar, lectus orci accumsan nisi, eu blandit elit nulla nec lectus. Integer porttitor imperdiet sapien. Quisque in orci sed nisi consequat aliquam. Aenean id mollis nisi. Sed auctor odio id erat facilisis venenatis. Quisque posuere faucibus libero vel fringilla.

In quis lectus sed eros efficitur luctus. Morbi tempor, nisl eget feugiat tincidunt, sem velit vulputate enim, nec interdum augue enim nec mauris. Nulla iaculis ante sed enim placerat pretium. Nulla metus odio, facilisis vestibulum lobortis vitae, bibendum at nunc. Donec sit amet efficitur metus, in bibendum nisi. Vivamus tempus vel turpis sit amet auctor. Maecenas luctus vestibulum velit, at sagittis leo volutpat quis. Praesent posuere nec augue eget sodales. Pellentesque vitae arcu ut est varius venenatis id maximus sem. Curabitur non consectetur turpis.
      `

  const res = runRemark(md, {
    excerptSeparator: `<!-- end -->`,
    pruneLength: 34,
  })
  expect(String(res)).toBe(`Where oh where is my little pony?\n`)
})

test("should handle excerpt separator correctly with text node", () => {
  const md = `
Where oh where is my little pony?

ENDOFEXCERPT

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi auctor sit amet velit id facilisis. Nulla viverra, eros at efficitur pulvinar, lectus orci accumsan nisi, eu blandit elit nulla nec lectus. Integer porttitor imperdiet sapien. Quisque in orci sed nisi consequat aliquam. Aenean id mollis nisi. Sed auctor odio id erat facilisis venenatis. Quisque posuere faucibus libero vel fringilla.

In quis lectus sed eros efficitur luctus. Morbi tempor, nisl eget feugiat tincidunt, sem velit vulputate enim, nec interdum augue enim nec mauris. Nulla iaculis ante sed enim placerat pretium. Nulla metus odio, facilisis vestibulum lobortis vitae, bibendum at nunc. Donec sit amet efficitur metus, in bibendum nisi. Vivamus tempus vel turpis sit amet auctor. Maecenas luctus vestibulum velit, at sagittis leo volutpat quis. Praesent posuere nec augue eget sodales. Pellentesque vitae arcu ut est varius venenatis id maximus sem. Curabitur non consectetur turpis.
      `

  const res = runRemark(md, {
    excerptSeparator: `ENDOFEXCERPT`,
    pruneLength: 34,
  })
  expect(String(res)).toBe(`Where oh where is my little pony?\n\n`)
})

test("should fall back to pruneLength if no excerpt separator", () => {
  const md = `
Where oh where **is** my little pony? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi auctor sit amet velit id facilisis. Nulla viverra, eros at efficitur pulvinar, lectus orci accumsan nisi, eu blandit elit nulla nec lectus. Integer porttitor imperdiet sapien. Quisque in orci sed nisi consequat aliquam. Aenean id mollis nisi. Sed auctor odio id erat facilisis venenatis. Quisque posuere faucibus libero vel fringilla.

In quis lectus sed eros efficitur luctus. Morbi tempor, nisl eget feugiat tincidunt, sem velit vulputate enim, nec interdum augue enim nec mauris. Nulla iaculis ante sed enim placerat pretium. Nulla metus odio, facilisis vestibulum lobortis vitae, bibendum at nunc. Donec sit amet efficitur metus, in bibendum nisi. Vivamus tempus vel turpis sit amet auctor. Maecenas luctus vestibulum velit, at sagittis leo volutpat quis. Praesent posuere nec augue eget sodales. Pellentesque vitae arcu ut est varius venenatis id maximus sem. Curabitur non consectetur turpis.
`

  const res = runRemark(md, {
    excerptSeparator: `<!-- end -->`,
    pruneLength: 40,
  })
  expect(String(res)).toBe(`Where oh where **is** my little pony? Lorem…\n`)
})
