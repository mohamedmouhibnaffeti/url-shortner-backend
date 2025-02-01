import { Router } from "express";
import { ShortenUrl, ShortUrl } from "../controllers/UrlsController.js";

const router = Router();

/**
 * @openapi
 * /api/shorten:
 *   post:
 *     tags:
 *       - URL Shortener
 *     description: Shorten a given URL and generate a QR code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 description: The original URL to be shortened
 *                 example: "https://example.com"
 *     responses:
 *       201:
 *         description: URL successfully shortened
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The shortened URL
 *                   example: "backend_url/api/abc123"
 *                 qrCode:
 *                   type: string
 *                   description: Base64 encoded QR code image
 *                   example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *       400:
 *         description: Invalid URL provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please provide a valid url"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/shorten", ShortenUrl);

/**
 * @openapi
 * /api/{shortCode}:
 *   get:
 *     tags:
 *       - URL Shortener
 *     description: Redirect to the original URL using the short code
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The short code for the URL
 *         example: "abc123"
 *     responses:
 *       302:
 *         description: Redirect to the original URL
 *       404:
 *         description: URL not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Url not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/:shortCode", ShortUrl);

export default router;