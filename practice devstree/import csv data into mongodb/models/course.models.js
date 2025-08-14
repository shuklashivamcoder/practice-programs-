import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    coursename: {
        type: String,
        unique: true,
        require: true
    }
},{timestamps :true})

export const Course = mongoose.model('Course',courseSchema)