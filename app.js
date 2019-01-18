const express=require("express")
const bodyparser=require("body-parser")
const cors=require("cors")
const mainRouteHandler=require("./routes/mainRouteHandler")

const app=express()

app.use(cors())

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.use(mainRouteHandler)

module.exports=app





