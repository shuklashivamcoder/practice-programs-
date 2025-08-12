import mongoose from "mongoose";

 const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    age: {
        type:Number
    },
    course : {
        type: String,
        enum: ['cse','it']

    }
},{
    timestamps: true,
})

export const User =  mongoose.model('User', userSchema)



// import mongoose from 'mongoose'

// const userSchema = new mongoose.Schema({
//     name : String,
//     age: { type: Number,},
//     course: String,
    
// });

// export const User = mongoose.model('User', userSchema)
