import mongoose from "mongoose";

export async function  connectdb(url) {
    try{
   mongoose.connect(url).then(()=>{
    console.log("mongodb connected db")
   })
    }catch(error){
        return res.json({
            message : "hello world"
        })
    }
}