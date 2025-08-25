import express from 'express'
import { productcreate, createproductpartner, logout } from '../controllers/product.controller.js'
import { veriftyjwttoken } from '../middleware/Authenticate.middleware.js'
import { loginuser } from '../controllers/user.controller.js'

const productrouter = express.Router()

productrouter.route('/create-product').post(veriftyjwttoken , productcreate)
productrouter.route('/create-product-partner').post(createproductpartner)
productrouter.route('/login-product-partner').post(loginuser)
productrouter.route('/logout-product-partner').post(veriftyjwttoken, logout)

export default productrouter

