import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
    cityname: {
        type: String,
        require: true
    },
    state:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        require:true
    }
},{timestamps :true})

export const City = mongoose.model('City',citySchema)