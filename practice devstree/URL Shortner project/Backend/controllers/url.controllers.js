import { URL } from "../models/url.models.js";
import { nanoid } from "nanoid";

export async function handleurlhandler(req, res) {
    try {
        const { mainurl } = req.body;
        if (!mainurl) return res.json('url not valid')
        const shortid = nanoid(8);
        const urlentry = await URL.create({
            shortid,
            mainurl
        })
        return res.json({
            message: 'url generated successfully',
            urlentry: urlentry.shortid
        })

    } catch (error) {
        return res, json({
            error: error
        })
    }
}

export async function gotoweb(req,res) {
    try{
     const { shortid } = req.params;
    const existurl = await URL.findOne({ shortid }) 
    if(existurl){
      res.redirect(existurl.mainurl)
    }else{
     return res.json({
        message: 'goto console'
     })
    }
    }catch(error){
        return res.json({
            message: 'error'
        })
    }
    
}

