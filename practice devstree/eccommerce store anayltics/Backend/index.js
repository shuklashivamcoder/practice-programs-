import dotenv from 'dotenv';
import express from "express"
import router from "./routes/user.route.js"
import productrouter from './routes/product.route.js';
import { connectdb } from "./configDB/connectDB.js"
import cookieParser from "cookie-parser"
import orderrouter from './routes/order.router.js';
import reportrouter from './routes/reports.routes.js';
dotenv.config()

const app = express()
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"))
app.use(cookieParser());
const port = 3000

app.get('/',(req, res)=>{
    res.end("hello world")
})
connectdb("mongodb://localhost:27017/eccomstore")
app.use('/storedb', router)
app.use('/product', productrouter)
app.use('/buy', orderrouter)
app.use('/reports', reportrouter)
app.listen(port, ()=>{
    console.log('server is listening at port 3000')
})