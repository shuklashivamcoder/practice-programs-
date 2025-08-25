import { Address } from "../models/Address.models.js";
import { Users } from "../models/users.models.js";
import jwt from "jsonwebtoken"


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await Users.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.RefreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

export async function usercreate(req, res) {
    try {
        const { name, email, password, phone, address, country, city, state } = req.body
        if (!name || !email || !password || !phone || !address || !country || !city || !state) { return res.json({ message: "required field is not filled" }) }

        const createaddress = await Address.create({
            properaddress: address,
            country: country,
            city: city,
            state: state
        })

        const createuser = await Users.create({
            name,
            email,
            password,
            phone,
            address: createaddress._id,
        })

        const existuser = await Users.findById(createuser?._id);

        if (!existuser) { return res.end("error if") }


        return res.json({
            message: "User created successfully",
            user: createuser,
        });


    } catch (error) {
        return res.json({
            message: "catch error"
        })
    }

}

export async function loginuser(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) { return res.json({ message: " please enter valid details" }) }

        const existuser = await Users.findOne({ email: email } || { password: password })
        if (!existuser) { return res.json({ message: "user not found" }) }

        const accessToken = existuser.generateAccessToken();
        const refreshToken = existuser.generateRefreshToken();


        existuser.RefreshToken = refreshToken;
        await existuser.save();


        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        return res.json({
            message: "logged in successfully",
            user: existuser,
        });


    } catch (error) {
        return res.json({
            message: "catch error"
        })
    }
}

export async function logout(req, res) {
    try {

        await Users.findByIdAndUpdate(req.user._id, {
            $unset: {
                RefreshToken: 1,
            },
        }, {
            new: true,
        })

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json({
            message: "loggedout successfully"
        })

    } catch (error) {
        return res.json({
            message: "catch error"
        })
    }
}

export async function changeCurrentPassword(req, res) {
    const { oldPassword, newPassword } = req.body



    const user = await Users.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
}

export async function refreshtoken(req, res) {
    const comingrefreshtoken = req.cookie.refreshToken || req.body.refreshToken

    if (!comingrefreshtoken) {
        return res.json({
            message: "unauthorized access"
        })
    }
    try {
        const decodedtoken = jwt.verify(comingrefreshtoken, process.env.REFRESH_TOKEN_SECRET)
        if (!decodedtoken) { return res.json({ message: "refreshtoken not matched" }) }

        const user = await Users.findById(decodedtoken._id)
        if (!user) {
            return res.json({
                message: "invalid refreshtoken"
            })
        }
        if (comingrefreshtoken !== user?.RefreshToken) { return res.json({ messgae: " refresh token is expired or use" }) }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )

    } catch (error) {
        return res.json({
            message: error.message
        })
    }

}