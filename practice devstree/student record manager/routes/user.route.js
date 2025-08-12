import express from 'express'
import { createuser, readuser, searchuser, deletestudent, updateuserdata, sortuserbyname ,countcourse,exportfile } from '../controllers/user.controllers.js'

const router = express.Router()


router.route('/create').post(createuser)
router.route('/read').get(readuser)
router.route('/search/:name').get(searchuser)
router.route('/delete/:name').delete(deletestudent)
router.route('/update/:name').patch(updateuserdata)
router.route('/sort').get(sortuserbyname)
router.route('/count/:cours').get(countcourse)
router.route('/export').get(exportfile)

export default router;