import express from 'express'
import { gotoweb, handleurlhandler } from "../controllers/url.controllers.js";

const router = express.Router()

router.route('/short').post(handleurlhandler)
router.route('/:shortid').get( gotoweb )
export default router