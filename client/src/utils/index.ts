import { DateTime } from 'luxon'

export function toISODate(date: Date) {
  return DateTime.fromJSDate(date).toISODate()
}

export function toISODateTime(date: Date) {
  return DateTime.fromJSDate(date).toISO({
    includeOffset: false,
  })
}

export function isDateString(str: string) {
  const date = new Date(str)
  return date.toString() !== 'Invalid Date'
}

export function sort<T>(items: T[], selector: (item: T) => any, asc: boolean = true): T[] {
  return [...items].sort((a, b) => {
    a = selector(a)
    b = selector(b)
    const mul = asc ? 1 : -1

    if (typeof a === 'number' && typeof b === 'number') {
      return (a - b) * mul
    }
    if (typeof a === 'string' && typeof b === 'string') {
      if (isDateString(a)) return (new Date(a).getTime() - new Date(b).getTime()) * mul
      if (!a) return 1 * mul
      if (!b) return -1 * mul
      return a.localeCompare(b) * mul
    }
    if (typeof a === 'boolean' && typeof b === 'boolean') {
      if (a) return -1 * mul
      return 1 * mul
    }
    return 0
  })
}

export function copyToClipboard(val: string) {
  const el = document.createElement('textarea')
  el.value = val
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

export function debounce<T extends (...args: any) => any>(func: T, delay = 1000) {
  let timeoutId: number = 0

  return function (...args) {
    window.clearTimeout(timeoutId)

    timeoutId = window.setTimeout(() => {
      func(...args)
    }, delay)
  } as T
}

export function complexSearch(needle: string, haystack: string) {
  const userData = haystack.toLowerCase()
  const search = needle.toLowerCase().trim().split(',').filter(Boolean)
  return search.length
    ? search.some((filter) =>
        filter.trim()
          ? filter
              .trim()
              .split(' ')
              .every((word) => userData.includes(word))
          : false,
      )
    : true
}
