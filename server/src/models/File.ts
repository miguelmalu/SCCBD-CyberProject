import { Schema, model } from 'mongoose'

const FileSchema = new Schema({
  filename: {type: String}
})

export default model('uploads.files', FileSchema)
