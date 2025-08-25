import express from 'express'
import { loginuser, logout, changeCurrentPassword, usercreate, refreshtoken } from '../controllers/user.controller.js';
import { veriftyjwttoken } from '../middleware/Authenticate.middleware.js';

const router = express.Router();

router.route('/create-user').post(usercreate)
router.route('/loginuser').post(loginuser)
router.route('/logout').post(veriftyjwttoken, logout)
router.route('/update').post(veriftyjwttoken, changeCurrentPassword)
router.route("refreshToken").get(veriftyjwttoken,refreshtoken)
// router.route('/:cruduser/:username').post( loginuser )

export default router