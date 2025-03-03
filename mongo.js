const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://parmarkuldeep246:${password}@cluster0.sqwab.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=Cluster0`


mongoose.set('strictQuery', false)

console.log('Connecting to database')

mongoose.connect(url)
  .then( () => {
    console.log('connected successfully')
  })



const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
const note = new Note({
  content: 'TCP is hard',
  important: true,
})


note.save().then(() => {
  console.log('note saved!')
  mongoose.connection.close()
})


//   Note.find({}).then(result => {
//     result.forEach(note => {
//       console.log(note)
//     })
//     mongoose.connection.close()
//   })
// })
