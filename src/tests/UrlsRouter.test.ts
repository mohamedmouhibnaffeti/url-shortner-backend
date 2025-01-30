import request from 'supertest'
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import urlShorter from '../routes/UrlsRouter.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', urlShorter)

beforeAll(async () => {
    const url = 'mongodb://127.0.0.1:27017/urlshortener-test'
    await mongoose.connect(url)
})

afterAll(async () => {
    await mongoose.connection.close()
})

describe('POST /api/shorten', () => {
    it('should shorten a valid URL', async () => {
        const response = await request(app)
            .post('/api/shorten')
            .send({ originalUrl: 'https://www.example.com' })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('shortUrl')
        expect(response.body.shortUrl).toMatch(/\/api\/\w{6}$/)
    })

    it('should return an error for invalid URL', async () => {
        const response = await request(app)
            .post('/api/shorten')
            .send({ originalUrl: 'invalid-url' })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Please provide a valid url')
    })

    it('should return an error if no URL is provided', async () => {
        const response = await request(app)
            .post('/api/shorten')
            .send({})

        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Please provide a url')
    })
})

describe('GET /api/:shortCode', () => {
    let shortUrl: string;

    beforeAll(async () => {
        const newUrl = await request(app)
            .post('/api/shorten')
            .send({ originalUrl: 'https://www.test.com' })

        shortUrl = newUrl.body.shortUrl
    })

    it('should redirect to the original URL for a valid shortCode', async () => {
        const response = await request(app).get(shortUrl.replace(`${process.env.BASE_URL}/api/`, ''))

        expect(response.status).toBe(302) // Expecting a redirect
        expect(response.headers.location).toBe('https://www.test.com')
    })

    it('should return an error for an invalid shortCode', async () => {
        const response = await request(app).get('/api/invalidcode')

        expect(response.status).toBe(404)
        expect(response.body.message).toBe('Url not found')
    })
})
