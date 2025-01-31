import express from "express"
import urlShorter from "./routes/UrlsRouter.js"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./db.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use("/api", urlShorter)

const PORT = process.env.PORT || 3001

export const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    });
  } catch (error) {
    console.error("Error starting the server:", error)
  }
};

startServer()

export default app
