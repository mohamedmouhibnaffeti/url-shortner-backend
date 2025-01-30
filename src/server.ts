import express from "express"
import mongoose from "mongoose"
import urlShorter from "./routes/UrlsRouter.js"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(express.json())

app.use("/api", urlShorter)

mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connected to database")
}).catch((err) => {
    console.log(err)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})