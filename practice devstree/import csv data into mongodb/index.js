import express from 'express'
import router from './routes/user.routes.js';
import { connectdb } from './conntectDB/connectionDB.js';
const app = express()
const PORT = 3000;
app.use(express.json())
app.use('/student',router)
connectdb('mongodb://localhost:27017/studentInformation')

   app.listen(PORT,()=>{
    console.log('server is listening at 3000')
})