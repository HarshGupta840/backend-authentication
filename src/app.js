import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()


// for cors related allowed origin to request your server
app.use(cors({
    origin: process.env.CORS_ORIGIN
}))


//to handle json data accept json from the request  and limit the size of the json data
app.use(express.json({
    limit: "16kb"
}))

// when data come from url ie params it has its own encode like  %20 you see whenyou send data across url so to remove this we use this
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

//when we want to use static data such as some favicon pdf some images
app.use(express.static("public"))

//to make safe crud operation on users cookie
app.use(cookieParser())



//routes import 
import userRouter from "./routes/user.routes.js"

// routes declaration 
app.use("/api/v1/users", userRouter)





export { app }