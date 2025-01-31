import { Router } from "express"
import { retrieveQrCode, ShortenUrl, ShortUrl } from "../controllers/UrlsController.js"

const router = Router()

router.post("/shorten", ShortenUrl)
router.get("/:shortCode", ShortUrl)
router.get("/qr/:id", retrieveQrCode)

export default router