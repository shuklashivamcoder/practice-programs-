import express from 'express';
import connectdb from './connectDB/DB.config.js';
import router from './routes/user.route.js';
const app = express();

app.use(express.json())



const PORT = 3000;
connectdb('mongodb://localhost:27017/studentdata').then(() => {
    app.listen(PORT, () => {
        console.log('app is listeninig at PORT-3000')
    })
})

app.get('/', (req, res) => {
    res.end('hello shivam')
})



app.use('/api/user', router)



// connectdb('mongodb://localhost:27017/studentdata/users').then(()=>{
// app.listen(PORT,()=>{
//     console.log('app is listeninig at PORT-3000')
// })
// })

