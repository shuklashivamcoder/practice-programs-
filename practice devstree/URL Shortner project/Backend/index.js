import express, { urlencoded } from 'express'
import router from './routes/user.routes.js'
import { connectdb } from './Dbconnect/connectionDb.js';
const app = express()
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended:true }))

app.use('/url', router)


connectdb('mongodb://localhost:27017/urlshortner').then(()=>{
    app.listen(PORT,()=>{
    console.log('server is runing at 4000')
})
})
