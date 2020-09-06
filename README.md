# mdast-excerpt

[![Build Status](https://travis-ci.org/jwbargsten/mdast-excerpt.svg?branch=master)](https://travis-ci.org/jwbargsten/mdast-excerpt)

`mdast-excerpt` allows you to get an excerpt from a markdown post. The code is
"borrowed" from `gatsby-transformer-remark`, which makes it possible to use excerpt
generation in other contexts outside of [GatsbyJS](https://www.gatsbyjs.com/). If you
want to know how the result looks like, check
[Using Excerpts](https://using-remark.gatsbyjs.org/excerpts/) at GatsbyJS.

Input is a full markdown AST, output a pruned AST with the desired excerpt length and
intact markup.

This plugin becomes useful if the excerpt would stop in the middle of marked up text:

> `This is a **bold text**` -> This is a \*\*bold te...

when truncated by string length. With `mdast-excerpt`, then markup is truncated
correctly:

> `This is a **bold text**` -> This is a **bold te...**

My personal favourite is using `mdast-excerpt` in combination with
[react-markdown](https://www.npmjs.com/package/react-markdown) (see futher below for
usage).

## Install

```sh
npm install mdast-excerpt
```

## Use

```js
const remark = require("remark")
const html = require("remark-html")
const excerptAst = require("mdast-excerpt")

// fake the plugin
const asExcerpt = options => node => excerptAst(node, options || {})

const input = "abc abc **def ghi**"
remark()
  .use(asExcerpt, { omission: " Read More", pruneLength: 14 })
  .use(html)
  .processSync(input)
```

### Usage with `react-markdown`

You can use the `astPlugins` prop to supply the `excerptAst` transformer:

```jsx
import React from "react"
import ReactDOM from "react-dom"

import ReactMarkdown from "react-markdown"
import excerptAst from "mdast-excerpt"

const MarkdownExcerpt = ({ source, pruneLength = 14 }) => (
  <ReactMarkdown
    source={source}
    astPlugins={[ast => excerptAst(ast, { pruneLength })]}
  />
)

const App = () => {
  const input = "abc abc **def ghi**"
  return <MarkdownExcerpt source={input} pruneLength={13} />
}

React.ReactDOM.render(<App />, document.getElementById("root"))
```

## API

You can call `excerptAst` as follows:

`excerptAst(tree, { pruneLength: 1, truncate: false, omission:`…`})`

The options are

- `pruneLength`: max length of the excerpt (default 140)
- `truncate`: truncate on exact length (true) or stop at whole words (default false)
- `excerptSeparator`: supply an excerpt separator that is used to detect the excerpt. A
  common choice would be `<!-- end -->`. If the separator is not found, `excerptAst`
  falls back to `pruneLength` (default undefined).
- `omission`: the omission text to add after the excerpt (default `…`)
