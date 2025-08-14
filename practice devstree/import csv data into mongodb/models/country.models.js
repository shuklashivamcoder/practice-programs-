import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
    countryname: {
        type: String,
        unique: true,
        require: true
    }
},{timestamps :true})

export const Country = mongoose.model('Country',countrySchema)