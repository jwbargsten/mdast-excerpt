import makeString from "lodash/toString"
/**
 * Ensure some object is a coerced to a string
 * */

function escapeRegExp(str: string): string {
  return makeString(str).replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1")
}
function defaultToWhiteSpace(characters?: string): string {
  return characters == null ? "\\s" : `[${escapeRegExp(characters)}]`
}

const nativeTrimRight = String.prototype.trimRight

function rtrim(oldStr: string, oldCharacters?: string): string {
  let characters = oldCharacters
  const str = makeString(oldStr)
  if (!characters && nativeTrimRight) return nativeTrimRight.call(str)
  characters = defaultToWhiteSpace(characters)
  return str.replace(new RegExp(`${characters}+$`), "")
}

/**
 * _s.prune: a more elegant version of truncate
 * prune extra chars, never leaving a half-chopped word.
 * @author github.com/rwz
 */

function prune(oldStr: string, oldLength: number, oldPruneStr: string): string {
  const str = makeString(oldStr)
  const length = ~~oldLength
  const pruneStr = oldPruneStr != null ? String(oldPruneStr) : "..."

  if (str.length <= length) return str

  const tmpl = (c: string): string => (c.toUpperCase() !== c.toLowerCase() ? "A" : " ")

  let template = str.slice(0, length + 1).replace(/.(?=\W*\w*$)/g, tmpl) // 'Hello, world' -> 'HellAA AAAAA'

  if (template.slice(template.length - 2).match(/\w\w/)) template = template.replace(/\s*\S+$/, "")
  else template = rtrim(template.slice(0, template.length - 1))

  return (template + pruneStr).length > str.length ? str : str.slice(0, template.length) + pruneStr
}

export { prune }
