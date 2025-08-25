import { Products } from "../models/Products.models.js";
import { Users } from "../models/users.models.js";
import { Address } from "../models/Address.models.js";


export async function createproductpartner(req, res) {
    try {
        const { name, email, password, phone, address, country, city, state, isPartnerid } = req.body
        if (!name || !email || !password || !phone || !address || !country || !city || !state || !isPartnerid) { return res.json({ message: "required field is not filled" }) }

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
            isPartnerid: isPartnerid
        })

        const existuser = await Users.findById(createuser?._id);

        if (!existuser) { return res.end("error if") }


        return res.json({
            message: "branf created succesfully created successfully",
            user: createuser,
        });


    } catch (error) {
        return res.json({
            message: "catch eerror you are not productpartner"
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


export async function productcreate(req, res) {
    try {

        const existeduser = await Users.findById(req.user?._id)

        if (existeduser.isPartnerid == "shivamcoder") {
            const { productname, price, description, stock, brands } = req.body;
            if ([productname, price, description, stock, brands].some((field) => field?.trim() === "")) {
                throw new error(400, "All fields are required")
            }

            const createdproduct = await Products.create({
                productname,
                price,
                description,
                stock,
                brands
            })

            return res.status(200).json({
                message: "produdct created successfully",
                product_details: createdproduct
            })

        }
        return res.json({
            message: " you are not authorized brand from controller"
        })


    } catch (error) {
        return res.status(400).json({
            message: "catch error" && error.message
        })
    }

}