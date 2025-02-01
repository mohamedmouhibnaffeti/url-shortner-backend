import {model, Schema} from 'mongoose'

const UrlsSchema = new Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        required: true
    },
    qrCode: {
        type: String,
        required: true
    }
})

export const Url = model('urls', UrlsSchema)