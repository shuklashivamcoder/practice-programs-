import mongoose from 'mongoose'

export async function connectdb(url){
    try{
mongoose.connect(url).then(()=>{
    console.log('mongodb connected succesfully')
}).catch('error to connect mongodb')
    }catch(error){
        console.log(error)
    }
}