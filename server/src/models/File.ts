import { Schema, model } from 'mongoose'

const FileSchema = new Schema({
    caption: {
        required: true,
        type: String,
    },
    filename: {
        required: true,
        type: String,
    },
/*     fileId: {
        required: true,
        type: String,
    }, */
    createdAt: {
        default: Date.now(),
        type: Date,
    },
})

export default model('File', FileSchema)
