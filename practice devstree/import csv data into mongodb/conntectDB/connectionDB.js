import mongoose from 'mongoose'

export async function connectdb(url){
    try{
        mongoose.connect(url).then(()=>{
            console.log('mongodb connected successfully')
        }).catch('connection failed ')
    }catch(error){
        return res.json({
            error : error
        })
    }
}