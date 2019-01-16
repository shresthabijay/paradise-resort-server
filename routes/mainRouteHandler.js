const express=require("express")
const roomsRoute=require("./roomsRoute")
const bookingRoute=require("./bookingRoute")
const eventsRoute=require("./eventsRouting")

const app=express.Router()

app.use("/rooms",roomsRoute)
app.use("/bookings",bookingRoute)
app.use("/events",eventsRoute)

module.exports=app