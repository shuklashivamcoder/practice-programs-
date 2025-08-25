import mongoose, { mongo } from "mongoose";

const AddressSchema = new mongoose.Schema({
    properaddress:{
        type:String,
        require: true
    },
    country: {
        type:String,
        require:true
    },
    city: {
        type:String,
        require:true
    },
    state:{
        type: String,
        require: true
    }
},{
    timestamps: true
})

export const Address = mongoose.model('Address', AddressSchema)