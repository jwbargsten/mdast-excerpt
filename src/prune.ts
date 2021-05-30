import { toString as makeString } from "lodash"
/**
 * Ensure some object is a coerced to a string
 **/

function escapeRegExp(str: string): string {
  return makeString(str).replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1")
}
function defaultToWhiteSpace(characters?: string): string {
  return characters == null ? "\\s" : "[" + escapeRegExp(characters) + "]"
}

const nativeTrimRight = String.prototype.trimRight

function rtrim(str: string, characters?: string): string {
  str = makeString(str)
  if (!characters && nativeTrimRight) return nativeTrimRight.call(str)
  characters = defaultToWhiteSpace(characters)
  return str.replace(new RegExp(characters + "+$"), "")
}

/**
 * _s.prune: a more elegant version of truncate
 * prune extra chars, never leaving a half-chopped word.
 * @author github.com/rwz
 */

function prune(str: string, length: number, pruneStr: string): string {
  str = makeString(str)
  length = ~~length
  pruneStr = pruneStr != null ? String(pruneStr) : "..."

  if (str.length <= length) return str

  const tmpl = (c: string): string => (c.toUpperCase() !== c.toLowerCase() ? "A" : " ")

  let template = str.slice(0, length + 1).replace(/.(?=\W*\w*$)/g, tmpl) // 'Hello, world' -> 'HellAA AAAAA'

  if (template.slice(template.length - 2).match(/\w\w/)) template = template.replace(/\s*\S+$/, "")
  else template = rtrim(template.slice(0, template.length - 1))

  return (template + pruneStr).length > str.length ? str : str.slice(0, template.length) + pruneStr
}

export { prune }
