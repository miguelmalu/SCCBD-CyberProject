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
    aliases: {
        /* required: true, */
        type: String,
    }
})

export default model('File', FileSchema)
