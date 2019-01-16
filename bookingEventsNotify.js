const moment=require("moment")

const checkBookings=(minBeforeNotification)=>{

    let query=`SELECT * FROM booking`

    db.query(query,(err,results)=>{
        if(results.length===0) return;

        for (var i = 0, len = results.length; i < len; i++) {
            let data=results[i]
            let now=moment(Date.now())
            let checkInTimeStamp=moment(data["date_check_in"])
            let checkOutTimeStamp=moment(data["date_check_out"])

            if(now.isSameOrAfter(checkInTimeStamp.subtract(20,"minutes"))){
                //
            }

            if(now.isSameOrAfter(checkOutTimeStamp.subtract(20,"minutes"))){
                //
            }

        }
    })

}

const checkEvents=()=>{

    let query=`SELECT * FROM events`

    db.query(query,(err,results)=>{
        if(results.length===0) return;

        for (var i = 0, len = results.length; i < len; i++) {
            let data=results[i]
            let now=moment(Date.now())
            let eventTimeStamp=moment(data["date_time"])

            if(now.isSameOrAfter(eventTimeStamp.subtract(60,"minutes"))){

            }
        }
    })
}

const check=(bookingCheckInterval,eventsCheckInterval)=>{
    setInterval(checkBookings,bookingCheckInterval*60*1000)
    setInterval(checkEvents,eventsCheckInterval*60*1000)
}

module.exports=checkBookings
