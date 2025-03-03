const noteRouter = require('express').Router()
const Note = require('../models/note')


noteRouter.get('/',async (request , response) => {
  const result = await Note.find({})
  response.json(result)
})

noteRouter.get('/:id',async (request, response) => {

  const note = await Note.findById(request.params.id)

  if(note){
    response.json(note)
  }
  else{
    response.status(404).end()
  }
})

noteRouter.delete('/:id',async (request,response) => {

  const result = await  Note.findByIdAndDelete(request.params.id)
  console.log(result)
  response.status(204).end()

})


noteRouter.post('/',async (request,response) => {
  const body = request.body
  const note = new Note({
    content : body.content,
    important : body.important || false
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})

noteRouter.put('/:id',async (request,respone) => {
  const body = request.body

  const note = {
    content : body.content,
    important: body.important,
  }

  const updatedNote = await Note.findByIdAndUpdate(request.params.id,note,{ new : true,runValidators : true,context : 'query' })
  respone.json(updatedNote)

})

module.exports = noteRouter


