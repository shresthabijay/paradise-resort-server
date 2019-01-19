const express=require("express")
const roomsRoute=require("./roomsRoute")
const bookingRoute=require("./bookingRoute")
const eventsRoute=require("./eventsRouting")
const authenticationRoute=require("./authenticationRoute")
const authTokenVerify=require("../middleware/authTokenVerify")

const app=express.Router()

app.use("/rooms",authTokenVerify,roomsRoute)
app.use("/bookings",authTokenVerify,bookingRoute)
app.use("/events",authTokenVerify,eventsRoute)
app.use("/authenticate",authenticationRoute)

module.exports=app