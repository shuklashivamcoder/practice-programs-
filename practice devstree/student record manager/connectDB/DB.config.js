import mongoose from 'mongoose'

async function connectdb(url){
mongoose.connect(url).then(()=>{
    console.log('mongodb connected')
}).catch((error)=>{
    console.log('failed to connect mongodb',error)
})
}

export default connectdb;