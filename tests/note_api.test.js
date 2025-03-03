const mongoose = require('mongoose')
const app = require('../app')
const { test ,after , beforeEach , describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const Note = require('../models/note')
const helper = require('./test_helper')

const api = supertest(app)

describe('when note are saved intially', () => {
  beforeEach(async () => {
    await Note.deleteMany({})
    await Note.insertMany(helper.initialNotes)
  })

  test('note are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type',/application\/json/)
  })

  test('there are 2 notes',async () => {
    const response = await api.get('/api/notes')
    assert.strictEqual(response.body.length,helper.initialNotes.length)
  })

  test('The first note is about HTTP method',async () => {
    const response = await api.get('/api/notes')
    const content = response.body.map(e => e.content)
    assert(content.includes('HTML is easy'),true)
  })

  describe('viewing a note',() => {
    test('a specific note can be viewed', async () => {
      const notes = await helper.notesInDb()

      const noteAtStart = notes[0]

      const response = await api
        .get(`/api/notes/${noteAtStart.id}`)
        .expect(200)
        .expect('Content-Type',/application\/json/)
      assert.deepStrictEqual(response.body,noteAtStart)
    })

    test('failed with a status code 404 if id is invalid', async () => {
      const nonExistingId = await helper.nonExistingId()
      await api
        .get(`/api/notes/${nonExistingId}`)
        .expect(404)
    })
  })

  describe('addition of note', () => {
    test('a valid note can be added', async () => {
      const note = {
        content : 'async/await make it easy for async funtions',
        important : true
      }
      await api
        .post('/api/notes')
        .send(note)
        .expect(201)
        .expect('Content-Type',/application\/json/)

      const notesInEnd = await helper.notesInDb()
      const contents = notesInEnd.map(r => r.content)

      assert.strictEqual(contents.length,helper.initialNotes.length+1)

      assert(contents.includes('async/await make it easy for async funtions'))
    })

    test('note without content is not added', async () => {
      const newNote = {
        important: true
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

      const notesAtEnd = await helper.notesInDb()

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)

    })
  })

  describe('deletion of note', () => {
    test('a note to delete', async () => {
      const noteAtStart = await helper.notesInDb()

      const noteToDelete = noteAtStart[0]

      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

      const notesAtEnd = await helper.notesInDb()

      const contents = notesAtEnd.map(r => r.content)

      assert(!contents.includes(noteToDelete.content))

      assert.strictEqual(notesAtEnd.length,helper.initialNotes.length-1)
    })
  })

})

after(async () => {
  await mongoose.connection.close()
})


