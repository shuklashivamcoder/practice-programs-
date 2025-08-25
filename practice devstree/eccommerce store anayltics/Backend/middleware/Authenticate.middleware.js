import jwt from "jsonwebtoken"
import { Users } from "../models/users.models.js"


export async function veriftyjwttoken(req, res, next) {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) { return res.json({ message: "you are not authorized" }) }

        const veriftyjwt = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

        const user = await Users.findById(veriftyjwt._id)

        if (!user) { return res.json({ message: "invaild access token" }) }

        req.user = user
        next()
    } catch (error) {
        return res.json({
            message: "catch error"
        })
    }
} 