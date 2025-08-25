import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema({
    productname: {
        type: String,
        require: true
    },
    price: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    stocks:{
        type: Boolean,
        default: true
    },
    brands:{
        type: String,
        require:true
    }
},{
    timestamps: true
})

export const Products = mongoose.model("Products", ProductsSchema)