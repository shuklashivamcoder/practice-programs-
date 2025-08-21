import mongoose from 'mongoose'

const urlSchema = new mongoose.Schema({
    shortid : {
        type: String,
        require: true,
        unique: true
    },
    mainurl: {
        type: String,
        require: true,
        unique:true
    }
},{timestamps: true})

export const URL = mongoose.model('URL',urlSchema)