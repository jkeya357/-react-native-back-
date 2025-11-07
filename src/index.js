import express from "express"
import "dotenv/config"
import cors from "cors"
import job from "./lib/cron.js"

import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import {connectDB} from "./lib/db.js"
import { corsOptions } from "./lib/corsOptions.js"

job.start()
const app = express()
app.use(cors(corsOptions))
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use("/api", authRoutes)
app.use("/api", bookRoutes)

app.listen(PORT, () => {
  console.log(`Server is listenin on Port ${PORT}`)
  connectDB()
})