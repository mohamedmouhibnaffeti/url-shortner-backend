import { Router } from "express"
import { ShortenUrl, ShortUrl } from "../controllers/UrlsController.js"

const router = Router()

router.post("/", ShortenUrl)
router.get("/:shortCode", ShortUrl)

export default router