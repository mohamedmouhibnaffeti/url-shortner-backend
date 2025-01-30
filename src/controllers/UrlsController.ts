import { Request, Response } from 'express';
import { GenerateRandomID } from '../helpers/Strings.js';
import { Url } from '../models/UrlsSchema.js';

const ShortenUrl = async(req: Request, res: Response): Promise<any> => {
    try{
        const { originalUrl } = req.body
        const id = GenerateRandomID(6)

        const newUrl = new Url({originalUrl: originalUrl, shortCode: id})
        await newUrl.save()

        res.status(201).json({shortUrl: `${process.env.BASE_URL}/api/${id}`})
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
    ShortUrl
}