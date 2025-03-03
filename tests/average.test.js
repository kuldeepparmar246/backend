const { test , describe } = require('node:test')
const assert = require('node:assert')

const { average } = require('../utils/for_testing')

describe('average', () => {

  test('of one element is itself', () => {
    assert.strictEqual(average([1]),1)
  })

  test('of array is ', () => {
    assert.strictEqual(average([1,2,3,4,5]),3)
  })

  test('of empty array is zero',() => {
    assert.strictEqual(average([]),0)
  })

})