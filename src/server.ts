import express from "express"
import mongoose from "mongoose"
import urlShorter from "./routes/UrlsRouter.js"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./db.js"

dotenv.config()

const app = express()

app.use(cors())

app.use(express.json())

app.use("/api", urlShorter)

const PORT = process.env.PORT
export const startServer = async () => {
    await connectDB()
    return app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

if (require.main === module) {
    startServer()
}

export default app