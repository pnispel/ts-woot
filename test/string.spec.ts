import { expect } from 'chai'
import * as utils from './../lib/string'

describe('wstring', () => {
  describe('#nthVisible', () => {
    const visibleEl = [null, true]
    let wstring

    beforeEach(() => {
      wstring = Array.from(new Array(10),(val,index)=> [null, false])
    })

    it('should find the correct visible element', () => {
      wstring.splice(5, 0, visibleEl)

      expect(utils.nthVisible(wstring, 0)).to.equal(visibleEl)
    })

    it('should return null if the element isnt found', () => {
      expect(utils.nthVisible(wstring, 0)).to.equal(null)
    })

    it('should find the element if it is at end of array', () => {
      wstring.push(visibleEl)
      expect(utils.nthVisible(wstring, 0)).to.equal(visibleEl)
    })

    it('should find the element if it is at beginning of array', () => {
      wstring.unshift(visibleEl)
      expect(utils.nthVisible(wstring, 0)).to.equal(visibleEl)
    })

    it('should find one element out of multiple', () => {
      wstring.unshift([null, true])
      wstring.splice(5, 0, visibleEl)
      wstring.push([null, true])
      expect(utils.nthVisible(wstring, 1)).to.equal(visibleEl)
    })
  })

  describe('#contains', () => {
    const containsEl = ['testId', true]
    let wstring

    beforeEach(() => {
      wstring = Array.from(new Array(10),(val,index)=> [null, false])
    })

    it('should return true when string contains the element', () => {
      wstring.splice(5, 0, containsEl)
      expect(utils.contains(wstring, containsEl)).to.be.true
    })

    it('should return false when string does not contain the element', () => {
      expect(utils.contains(wstring, containsEl)).to.be.false
    })
  })

  describe('#subseq', () => {
    let wstring

    beforeEach(() => {
      wstring = Array.from(new Array(10),(val,index)=> [null])
      wstring.unshift(['head'])
      wstring.push(['tail'])
    })

    // TODO: when one or neither of the elements are in the string

    it('should return all elements between two others', () => {
      expect(
        utils.subseq(wstring, wstring[0], wstring[wstring.length -1]).length
      ).to.equal(10)
    })

    it('should return an empty array if elements are right by each other', () => {
      const head = ['head']
      const tail = ['tail']
      const twoElementString = [head, tail]

      expect(utils.subseq(twoElementString, head, tail).length).to.equal(0)
    })
  })

  describe('#insert', () => {
    let wstring

    beforeEach(() => {
      wstring = Array.from(new Array(10),(val,index)=> [
        index, false, null, index - 1, index + 1
      ])
    })

    // TODO: what to do when insert index is past the end?

    it('should insert the character at the correct position', () => {
      const toInsert = ['insert']
      utils.insert(wstring, toInsert, 3)
      expect(wstring[3]).to.equal(toInsert)
    })

    it('should update previous and next values', () => {
      const toInsert = ['insert', false, null, null, null]

      utils.insert(wstring, toInsert, 3)

      expect(wstring[3][3]).to.equal(2)
      expect(wstring[3][4]).to.equal(3)
      expect(wstring[4][3]).to.equal('insert')
      expect(wstring[2][4]).to.equal('insert')
    })
  })

  describe('#indexOf', () => {
    let wstring

    beforeEach(() => {
      wstring = Array.from(new Array(10),(val,index)=> [null])
      wstring.unshift(['head'])
      wstring.push(['tail'])
    })

    it('should give 0 for the first element in the string', () => {
      expect(utils.indexOf(wstring, ['head'])).to.equal(0)
      expect(utils.indexOf(wstring, 'head')).to.equal(0)
    })

    it('should give length for the first element in the string', () => {
      expect(utils.indexOf(wstring, ['tail'])).to.equal(11)
      expect(utils.indexOf(wstring, 'tail')).to.equal(11)
    })

    it('should give the index inserted at', () => {
      wstring.splice(5, 0, ['testid'])
      expect(utils.indexOf(wstring, ['testid'])).to.equal(5)
      expect(utils.indexOf(wstring, 'testid')).to.equal(5)
    })

    it('should give -1 when the element is not found', () => {
      expect(utils.indexOf(wstring, ['foo'])).to.equal(-1)
      expect(utils.indexOf(wstring, 'foo')).to.equal(-1)
    })
  })

  describe('#visibleIndex', () => {
    let wstring

    beforeEach(() => {
      wstring = Array.from(new Array(10),(val,index)=> [null, false])
    })

    it('should return the visible index', () => {
      wstring.splice(5, 0, [null, true])
      expect(utils.visibleIndex(wstring, 5)).to.equal(0)
    })
  })
})
