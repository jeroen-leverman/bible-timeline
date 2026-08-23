/**
 * Canonical book names used to connect scripture references to filters and people.
 *
 * The atlas also cites ancient sources such as Josephus and Tacitus. They remain visible
 * as primary-text references, but are intentionally not classified as biblical books.
 * 1 Maccabees is kept in its own Deuterocanon group so the interface does not silently
 * impose one community's canon on every reader.
 */

const B = (name, group, aliases = []) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  name,
  group,
  aliases,
})

export const BOOK_GROUP_LABEL = {
  old: 'Old Testament',
  deuterocanon: 'Deuterocanon',
  new: 'New Testament',
}

export const BOOKS = [
  B('Genesis', 'old'), B('Exodus', 'old'), B('Leviticus', 'old'), B('Numbers', 'old'),
  B('Deuteronomy', 'old'), B('Joshua', 'old'), B('Judges', 'old'), B('Ruth', 'old'),
  B('1 Samuel', 'old'), B('2 Samuel', 'old'), B('1 Kings', 'old'), B('2 Kings', 'old'),
  B('1 Chronicles', 'old'), B('2 Chronicles', 'old'), B('Ezra', 'old'), B('Nehemiah', 'old'),
  B('Esther', 'old'), B('Job', 'old'), B('Psalms', 'old', ['Psalm']), B('Proverbs', 'old'),
  B('Ecclesiastes', 'old'), B('Song of Songs', 'old', ['Song of Solomon']), B('Isaiah', 'old'),
  B('Jeremiah', 'old'), B('Lamentations', 'old'), B('Ezekiel', 'old'), B('Daniel', 'old'),
  B('Hosea', 'old'), B('Joel', 'old'), B('Amos', 'old'), B('Obadiah', 'old'), B('Jonah', 'old'),
  B('Micah', 'old'), B('Nahum', 'old'), B('Habakkuk', 'old'), B('Zephaniah', 'old'),
  B('Haggai', 'old'), B('Zechariah', 'old'), B('Malachi', 'old'),
  B('1 Maccabees', 'deuterocanon'),
  B('Matthew', 'new'), B('Mark', 'new'), B('Luke', 'new'), B('John', 'new'), B('Acts', 'new'),
  B('Romans', 'new'), B('1 Corinthians', 'new'), B('2 Corinthians', 'new'),
  B('Galatians', 'new'), B('Ephesians', 'new'), B('Philippians', 'new'), B('Colossians', 'new'),
  B('1 Thessalonians', 'new'), B('2 Thessalonians', 'new'), B('1 Timothy', 'new'),
  B('2 Timothy', 'new'), B('Titus', 'new'), B('Philemon', 'new'), B('Hebrews', 'new'),
  B('James', 'new'), B('1 Peter', 'new'), B('2 Peter', 'new'), B('1 John', 'new'),
  B('2 John', 'new'), B('3 John', 'new'), B('Jude', 'new'), B('Revelation', 'new'),
]

export const BOOK_BY_NAME = Object.fromEntries(BOOKS.map((book) => [book.name, book]))

const tokenToBook = new Map()
for (const book of BOOKS) {
  tokenToBook.set(book.name, book.name)
  book.aliases.forEach((alias) => tokenToBook.set(alias, book.name))
}

const escapePattern = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const bookPattern = new RegExp(
  `(^|[^A-Za-z0-9])(${[...tokenToBook.keys()]
    .sort((a, b) => b.length - a.length)
    .map(escapePattern)
    .join('|')})(?=$|[^A-Za-z])`,
  'g',
)

/** Return canonical book names in Bible order, without duplicate parallel references. */
export function booksForReferences(references = []) {
  const found = new Set()
  for (const reference of references) {
    bookPattern.lastIndex = 0
    for (const match of String(reference).matchAll(bookPattern)) {
      found.add(tokenToBook.get(match[2]))
    }
  }
  return BOOKS.map(({ name }) => name).filter((name) => found.has(name))
}

