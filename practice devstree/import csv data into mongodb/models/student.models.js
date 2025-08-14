import mongoose, { mongo } from "mongoose";

const studentSchema = new mongoose.Schema({
    name : {
        type: String,
        require: true
    },
    email:{
        type: String,
    },
    phone: {
        type : Number,
    },
    country:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    state:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
    },
    course: [{
        type:  mongoose.Schema.Types.ObjectId ,
        ref: 'Course'

    }]

},{timestamps: true})

export const Student = mongoose.model('Student',studentSchema)