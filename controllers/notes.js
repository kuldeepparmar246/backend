const noteRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



noteRouter.get('/',async (request , response) => {
  const result = await Note.find({}).populate('user',{ username : 1, name : 1 })
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

const getUserToken = (request) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ','')
  }

  return null
}

noteRouter.post('/',async (request,response) => {
  const body = request.body

  const decodedToken = jwt.verify(getUserToken(request),process.env.SECRET)

  if(!decodedToken.id) {
    return response.status(401).json({ error : 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content : body.content,
    important : body.important || false,
    user : user.id
  })


  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

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


