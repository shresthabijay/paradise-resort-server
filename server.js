const http=require("http")
db=require("./database.js")
const app=require("./app")
const BookingsEventsNotify=require("./bookingEventsNotify")
const port=7000

let server=http.createServer(app)

BookingsEventsNotify(10,40)//checking bookings and events and sending notifcations accordingly.Checks regularly in given interval of time in min//

server.listen(port,(err)=>{
    console.log("server started at: ",port)
})