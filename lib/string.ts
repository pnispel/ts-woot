import { WString } from './types'

/*
TODO: add types in this file
*/

export function visibleIndex(S, trueIndex) {
  let visibleCount = 0

  for (var i = 0; i <= trueIndex; i++) {
    if (S[i][1] === true) {
      visibleCount++
    }
  }

  return visibleCount - 1
}

export function indexOf(S, c) {
  if (!c) return -1

  let id = c

  // c is a full char
  if (Array.isArray(c)) {
    id = c[0]
  }

  let idx = 0

  while (idx <= (S.length - 1)) {
    if (S[idx][0] === id) {
      return idx
    }

    idx++
  }

  return -1
}

export function insert(S, c, index) {
  const previous = S[index - 1]
  const next = S[index]

  // set next and previous ids
  if (previous) {
    previous[4] = c[0]
    c[3] = previous[0]
  }
  if (next) {
    next[3] = c[0]
    c[4] = next[0]
  }

  S.splice(index, 0, c)
}

export function subseq(S, c, d) {
  const idxStart = indexOf(S, c)
  const idxEnd = indexOf(S, d)

  return S.slice(idxStart + 1, idxEnd)
}

export function contains(S, c) {
  return indexOf(S, c) !== -1
}

// TODO: convert to nth
export function nthVisible(S: WString, i) {
  let idx = 0
  let count = 0

  while (idx <= (S.length - 1) && count <= i) {
    if (S[idx][1] === true) {
      if (count === i) {
        return S[idx]
      }

      count++
    }

    idx++
  }

  return null
}

// DEPRECATE
export function ithVisible(S, i) {
  let idx = 0
  let count = 0

  while (idx <= (S.length - 1) && count <= i) {
    if (S[idx][1] === true) {
      count++

      if (count === i) {
        return S[idx]
      }
    }

    idx++
  }

  return null
}
