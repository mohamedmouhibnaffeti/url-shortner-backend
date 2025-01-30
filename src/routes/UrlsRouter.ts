import { Router } from "express"
import { ShortenUrl, ShortUrl } from "../controllers/UrlsController.js"

const router = Router()

router.post("/shorten", ShortenUrl)
router.get("/:shortCode", ShortUrl)

export default router