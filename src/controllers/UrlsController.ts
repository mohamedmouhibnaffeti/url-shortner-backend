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

        const newUrl = new Url({originalUrl: originalUrl, shortCode: id, qrCode: qrBuffer, ContentType: "image/png"})
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

const retrieveQrCode = async(req: Request, res: Response): Promise<any> => {
    const {id} = req.params
    try{
        const shortUrl = await Url.findById(id)
        if(!shortUrl){
            return res.status(404).json({message: "QR Code not found"})
        }
        res.setHeader('Content-Type', shortUrl.ContentType)
        return res.send(shortUrl.qrCode)
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal server error"})
    }
}

export {
    ShortenUrl,
    ShortUrl,
    retrieveQrCode
}