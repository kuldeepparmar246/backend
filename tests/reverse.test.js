const { test, describe } = require('node:test')
const assert = require('node:assert')

const { reverse } = require('../utils/for_testing')

test('reverse of a', () => {
  const result = reverse('a')

  assert.strictEqual(result,'a')
})

describe('Reverse Testing', () => {
  test('reverse of react', () => {
    const result = reverse('react')

    assert.strictEqual(result,'tcaer')
  })

  test('reverse of saippuakauppias', () => {
    const result = reverse('saippuakauppias')
    assert.strictEqual(result, 'saippuakauppias')
  })
})