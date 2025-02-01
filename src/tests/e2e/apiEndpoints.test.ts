import request from 'supertest';
import app from '../../server.js';
import { Url } from '../../models/UrlsSchema.js';
import { GenerateRandomID, checkIsURL } from "../../helpers/Strings.js";
import dotenv from 'dotenv';
import { closeDB, connectDB } from '../../db.js';

dotenv.config();

jest.mock('../../models/UrlsSchema.ts');
jest.mock('../../helpers/Strings.ts');

describe('API Endpoints', () => {
    beforeAll(async () => {
        await connectDB()
    });

    afterAll(async () => {
        await closeDB()
    });

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.BASE_URL = 'http://localhost:3001';
    });

    describe('POST /api/shorten', () => {
        it('should return 400 if no URL is provided', async () => {
            const response = await request(app).post('/api/shorten').send({});
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'Please provide a url' });
        });

        it('should return 400 if an invalid URL is provided', async () => {
            (checkIsURL as jest.Mock).mockReturnValue(false);
            const response = await request(app).post('/api/shorten').send({ originalUrl: 'invalid-url' });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'Please provide a valid url' });
        });

        it('should create a short URL and return 201', async () => {
            const mockShortCode = 'abc123';
            (checkIsURL as jest.Mock).mockReturnValue(true);
            (GenerateRandomID as jest.Mock).mockReturnValue(mockShortCode);
            (Url.prototype.save as jest.Mock).mockResolvedValue({ shortCode: mockShortCode });

            const response = await request(app)
                .post('/api/shorten')
                .send({ originalUrl: 'https://example.com' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ shortUrl: `http://localhost:3001/api/${mockShortCode}` });
        });

        it('should handle errors and return 500', async () => {
            (checkIsURL as jest.Mock).mockReturnValue(true);
            (Url.prototype.save as jest.Mock).mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/api/shorten')
                .send({ originalUrl: 'https://example.com' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('GET /api/:shortCode', () => {
        it('should redirect to the original URL if found', async () => {
            const mockUrl = { originalUrl: 'https://example.com' };
            (Url.findOne as jest.Mock).mockResolvedValue(mockUrl);

            const response = await request(app).get('/api/abc123');
            expect(response.status).toBe(302);
            expect(response.header.location).toBe('https://example.com');
        });

        it('should return 404 if the short URL is not found', async () => {
            (Url.findOne as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get('/api/abc123');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Url not found' });
        });

        it('should handle errors and return 500', async () => {
            (Url.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/api/abc123');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });
});