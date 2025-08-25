import express from "express"
import {Ordercreation} from "../controllers/order.controller.js";
import { veriftyjwttoken } from '../middleware/Authenticate.middleware.js'

const orderrouter = express.Router()

orderrouter.route('/placeorder').post(veriftyjwttoken,Ordercreation)

export default orderrouter