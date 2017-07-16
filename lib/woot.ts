import { indexOf, insert, subseq, contains, nthVisible, visibleIndex } from './string'
import { WString, Operation, CharId, WChar } from './types'

// https://hal.inria.fr/inria-00071240/document

function idIsLessThan(a, b) {
  const [siteIdA, logicalClockA] = a.split(':')
  const [siteIdB, logicalClockB] = b.split(':')

  if (siteIdA < siteIdB) {
    return true
  } else if (siteIdA === siteIdB && logicalClockA < logicalClockB) {
    return true
  }

  return false
}

class Woot {
  _onOpCallbacks: Array<Function> = []
  logicalClock = 0
  opPool: Array<Operation> = []
  siteId = ''
  wString: WString  = [
    ['HEAD', false, '', null, 'TAIL'],
    ['TAIL', false, '', 'HEAD', null]
  ]

  constructor(_siteId: string) {
    this.siteId = _siteId
  }

  onOp$(fn: Function) {
    this._onOpCallbacks.push(fn)
  }

  _handleOp(op, index) {
    this._onOpCallbacks.forEach(cb => cb.call(null, op, index))
  }

  pushOp(op) {
    const { opPool } = this

    opPool.push(op)

    for (let i = opPool.length - 1; i >= 0; i--) {
      const op = opPool[i]
      const c = op[1]
      const type = op[0]

      if (!this.isExecutable(op)) continue

      opPool.splice(i, 1)
      i--

      if (type === 'insert') {
        const index = this.integrateInsert(c, c[3], c[4])

        this._handleOp(op, index)
      } else if (type === 'remove') {
        const index = this.integrateRemove(c)

        this._handleOp(op, index)
      }
    }
  }

  isExecutable(op) {
    const { wString } = this

    const c = op[1]
    const type = op[0]

    if (type === 'insert') {
      return contains(wString, c[3]) && contains(wString, c[4])
    } else if (type === 'remove') {
      return contains(wString, c[0])
    } else {
      // FIXME
      throw 'ERR'
    }
  }

  integrateInsert(c, p, n) {
    const { wString } = this

    const characterPosition = indexOf(wString, c)

    if (characterPosition !== -1) {
      wString[characterPosition][1] = true
      return characterPosition
    }

    const insertPosition = indexOf(wString, n)
    const charactersBetween = subseq(wString, p, n)

    if (!charactersBetween.length) {
      insert(wString, c, insertPosition)

      return visibleIndex(wString, insertPosition)
    }

    charactersBetween.unshift(p)

    let i = 1

    while (
      i <= charactersBetween.length - 1 &&
      idIsLessThan(charactersBetween[i][0], c[0])
    ) i++

    return this.integrateInsert(c, charactersBetween[i - 1], charactersBetween[i])
  }

  integrateRemove(c) {
    const { wString } = this

    const position = indexOf(wString, c)

    wString[position][1] = false

    return visibleIndex(wString, position) + 1
  }

  incrementClock() {
    this.logicalClock++
  }

  generateInsert(insertIndex, value) {
    const { wString, siteId, logicalClock } = this

    const previous = nthVisible(wString, insertIndex - 1) || wString[0]
    const next = nthVisible(wString, insertIndex) || wString[wString.length - 1]
    const newId: CharId = `${siteId}:${logicalClock}`
    const newChar: WChar = [
      newId, true, value, previous[0], next[0]
    ]

    this.integrateInsert(newChar, previous, next)

    this.incrementClock()

    return ['insert', newChar]
  }

  generateRemove(removeIndex) {
    const { wString } = this

    const char = nthVisible(wString, removeIndex)

    this.integrateRemove(char)

    return ['remove', char]
  }

  asString() {
    const { wString } = this

    return wString.filter(c => c[1]).map(c => c[2]).join('')
  }

  asOperations() {
    const { wString } = this

    const chars = wString.slice(1, wString.length - 1)

    return chars.map((c) => [c[1] ? 'insert' : 'remove', c])
  }
}

export default Woot
