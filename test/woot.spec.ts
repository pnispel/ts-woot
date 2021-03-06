import { expect } from 'chai';
import { spy, match } from 'sinon';
import Woot from './../lib/woot'
import { Operation } from './../lib/types'

describe('woot', () => {
  let id = '1'
  let inst

  beforeEach(() => {
    inst = new Woot(id)
  })

  it('should take a siteId as an argument', () => {
    expect(inst.siteId).to.equal(id)
  })

  it('should contain a head and tail', () => {
    expect(inst.wString[0][0]).to.equal('HEAD')
    expect(inst.wString[1][0]).to.equal('TAIL')
  })

  it('should return no operations when empty', () => {
    const operations = inst.asOperations()

    expect(operations.length).to.equal(0)
  })

  it('should return operations between head and tail when not empty', () => {
    inst.generateInsert(0, 'c')
    inst.generateInsert(0, 'a')
    const operations = inst.asOperations()
    expect(operations.length).to.equal(2)
    expect(operations).to.deep.equal([
      ['insert', ['1:1', true, 'a', 'HEAD', '1:0']],
      ['insert', ['1:0', true, 'c', 'HEAD', 'TAIL']]
    ])
  })

  it('should mark as invisible if remove', () => {
    inst.generateInsert(0, 'c')
    inst.generateRemove(0)

    const operations = inst.asOperations()

    expect(operations.length).to.equal(1)
    expect(operations).to.deep.equal([
      ['remove', ['1:0', false, 'c', 'HEAD', 'TAIL']]
    ])
  })

  it('should return the string value expected', () => {
    inst.generateInsert(0, 'a')
    inst.generateInsert(1, 'b')
    inst.generateInsert(2, 'c')
    inst.generateRemove(1)

    expect(inst.asString()).to.equal('ac')
  })

  describe('#generateInsert', () => {
    it('should return the correct operation', () => {
      const op = inst.generateInsert(0, 'c')
      expect(op).to.deep.equal(['insert', ['1:0', true, 'c', 'HEAD', 'TAIL']])
    })

    it('should match the inserted text', () => {
      const template = `
        function () {
          const i = 0;
        }
      `

      template.split('').forEach((c, i) => inst.generateInsert(i, c))

      expect(inst.asString()).to.equal(template)
    })
  })

  describe('#generateRemove', () => {
    it('should return the correct operation', () => {
      inst.generateInsert(0, 'c')
      const op = inst.generateRemove(0)
      expect(op).to.deep.equal(['remove', ['1:0', false, 'c', 'HEAD', 'TAIL']])
    })

    it('should match the inserted text ca', () => {
      inst.generateInsert(0, 'c')
      inst.generateInsert(0, 'c')
      inst.generateRemove(1)
      inst.generateInsert(1, 'a')

      expect(inst.asString()).to.equal('ca')
    })

    it('should match the inserted text aac', () => {
      inst.generateInsert(0, 'a')
      inst.generateInsert(1, 'a')
      inst.generateInsert(2, 'c')
      inst.generateRemove(1)
      inst.generateInsert(1, 'a')

      expect(inst.asString()).to.equal('aac')
    })
  })

  describe('#integrateInsert', () => {
    it('should return the visible index', () => {
      const index = inst.integrateInsert(
        ['1:0', true, 'c', 'HEAD', 'TAIl'],
        inst.wString[0],
        inst.wString[1]
      )

      expect(index).to.equal(0)
    })
  })

  describe('#integrateRemove', () => {
    it('should return the visible index', () => {
      const op = inst.generateInsert(0, 'c')
      const index = inst.integrateRemove(op[1])

      expect(index).to.equal(0)
    })
  })

  describe('pool', () => {
    let otherInstance

    beforeEach(() => {
      otherInstance = new Woot('2')
    })

    it('should allow you to copy from one instance to another', () => {
      ['a', 'b', 'c', 'd', 'e', 'f'].forEach((c, i) => {
        const op = inst.generateInsert(i, c)
      })

      const ops = inst.asOperations()

      ops.forEach((op) => otherInstance.pushOp(op))

      expect(ops.length).to.equal(6)
      expect(otherInstance.asString()).to.equal('abcdef')
    })

    it('should order inserts based on siteID with other site being greater than', () => {
      const op = otherInstance.generateInsert(0, 'm') // HEAD, op, TAIL
      inst.generateInsert(0, 'a')
      inst.generateInsert(1, 'b')
      inst.generateInsert(2, 'c')

      inst.pushOp(op)
      expect(inst.asString()).to.equal('abcm')
    })

    it('should order inserts based on siteID with other site being less than', () => {
      const op = inst.generateInsert(0, 'm') // HEAD, op, TAIL
      otherInstance.generateInsert(0, 'a')
      otherInstance.generateInsert(1, 'b')
      otherInstance.generateInsert(2, 'c')

      otherInstance.pushOp(op)
      expect(otherInstance.asString()).to.equal('mabc')
    })

    it('should call a handler whenever a pool op is executed', () => {
      const op = inst.generateInsert(0, 'a')
      const spyFn1 = spy();
      const spyFn2 = spy();
      otherInstance.onOp$(spyFn1)
      otherInstance.onOp$(spyFn2)
      otherInstance.pushOp(op)

      expect(spyFn1.withArgs(match.array.deepEquals(op), 0).calledOnce).to.be.true
      expect(spyFn2.withArgs(match.array.deepEquals(op), 0).calledOnce).to.be.true
    })
  })
})
