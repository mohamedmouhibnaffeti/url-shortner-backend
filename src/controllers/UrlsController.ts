import { Request, Response } from 'express';
import { checkIsURL, GenerateRandomID } from '../helpers/Strings.js';
import { Url } from '../models/UrlsSchema.js';
import qrcode from 'qrcode'

const ShortenUrl = async(req: Request, res: Response): Promise<any> => {
    try{
        const { originalUrl } = req.body
        if(!originalUrl){
            return res.status(400).json({message: "Please provide a url"})
        }
        if(!checkIsURL(originalUrl)){
            return res.status(400).json({message: "Please provide a valid url"})
        }

        const qrBuffer = await qrcode.toDataURL(originalUrl, {type: 'image/png', errorCorrectionLevel: 'H', width: 400})

        const id = GenerateRandomID(6)

        const newUrl = new Url({originalUrl: originalUrl, shortCode: id, qrCode: qrBuffer})
        await newUrl.save()

        res.status(201).json({shortUrl: `${process.env.BASE_URL}/api/${id}`, qrCode: newUrl.qrCode})
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal server error"})
    }
}

const ShortUrl = async(req: Request, res: Response): Promise<any> => {
    try{
        const { shortCode } = req.params
        const url = await Url.findOne({shortCode: shortCode})
        if(url){
            return res.redirect(url.originalUrl)
        }else{
            return res.status(404).json({message: "Url not found"})
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal server error"})
    }
}


export {
    ShortenUrl,
    ShortUrl,
}