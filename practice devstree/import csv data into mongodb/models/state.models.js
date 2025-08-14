import mongoose from "mongoose";

const stateSchema = new mongoose.Schema({
    statename: {
        type: String,
        require: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        require:true

    }
},{timestamps :true})

export const State = mongoose.model('State',stateSchema)