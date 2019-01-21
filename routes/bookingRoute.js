const express=require("express")
const route=express.Router()
const moment=require("moment")
const khalti_token_verifier=require("../khaltiVerification")
const authTokenVerify=require("../middleware/authTokenVerify")


route.get("/get/all",(req,res)=>{
    let query=`SELECT * FROM booking;
               `

    db.query(query,(err,results)=>{
        if(err){
            res.status(400).send({errno:err.errno,code:err.code})
        }
        else{
            res.status(200).send(results)
        }
    })
})

route.post("/is-room-available",(req,res)=>{

    let {room_type_id}=req.body

    let room_find_query=`SELECT r.room_no ,r.status ,r.room_type_id,rt.id,rt.name as room_type_name,rt.price_per_night as price FROM room_types as rt
               INNER JOIN rooms as r ON r.room_type_id=rt.id
               WHERE rt.id=? AND r.status="available"
               `

    db.query(room_find_query,[room_type_id],(err,results)=>{
        if(err){
                res.status(400).send({message:"cannot find room"})
                return
        }
        else{
            if(results.length===0){
                res.status(400).send({message:"cannot find room"})
                return
            }
            else{
                res.status(200).send({message:"room available"})
            }
        }
    }
    
    )
}
)

route.post("/add",authTokenVerify,(req,res)=>{

    let {name,phone_no,email,address,date_check_in,date_check_out,room_no,has_paid,food_service}=req.body

    let timestamp=new Date


    let data=[[name,phone_no,email,address,timestamp,date_check_in,date_check_out,room_no,"yet to arrive",has_paid,food_service]]

    let q1=`SELECT status FROM rooms WHERE room_no=?`

    let query=`INSERT INTO booking (name,phone_no,email,address,timestamp,date_check_in,date_check_out,room_no,status,has_paid,food_service)
               VALUES ?;`
    let q2=`UPDATE rooms SET status="booked" WHERE room_no=?`

    db.query(q1,[room_no],(err1,results1)=>{
        if(err1){
            res.status(400).send({message:"Something went wrong"})
        }
        else{
            if(results1.length===0){
                res.status(400).send({message:"No record found with this room no"})
            }
            else{

                if(results1[0].status==="available"){
                    db.query(query,[data],(err2,results2)=>{
                        if(err2){

                            res.status(400).send({message:"something went wrong"})
                        }
                        else{
                            db.query(q2,[room_no],(err3,results3)=>{
                                if(err3){
                                    res.status(400).send({message:"something went wrong"})
                                }
                                else{
                                    res.status(200).send({message:"Room booked sucessfully!"})
                                }
                            })
                        }
                    })
                }
                
            }

        }
    })

})

route.post("/book",(req,res)=>{

    let {token,room_type_id}=req.body
    let {name,phone_no,email,address,date_check_in,date_check_out,has_paid,food_service}=req.body


    let room_find_query=`SELECT r.room_no ,r.status ,r.room_type_id,rt.id,rt.name as room_type_name,rt.price_per_night as price FROM room_types as rt
               INNER JOIN rooms as r ON r.room_type_id=rt.id
               WHERE rt.id=? AND r.status="available"
               `

    db.query(room_find_query,[room_type_id],(err,results)=>{
        if(err){
                res.status(400).send({message:"cannot find room"})
                return
        }
        else{
            if(results.length===0){
                res.status(400).send({message:"cannot find room"})
                return
            }
            else{
                let selected_room=results[0]

    

                khalti_token_verifier(token,selected_room.price*100).then((results)=>{

                    let timestamp=moment(new Date).utc().format("YYYY-MM-DD HH:mm:ss")

                    let data=[[name,phone_no,email,address,timestamp,date_check_in,date_check_out,selected_room.room_no,"yet to arrive",1,food_service]]
                
                    let q1=`SELECT status FROM rooms WHERE room_no=?`
                
                    let query=`INSERT INTO booking (name,phone_no,email,address,timestamp,date_check_in,date_check_out,room_no,status,has_paid,food_service) VALUES ?`

                    let q2=`UPDATE rooms SET status="booked" WHERE room_no=?`
                
                    db.query(q1,[selected_room.room_no],(err1,results1)=>{
                        if(err1){
                            res.status(400).send({message:"Something went wrong"})
                        }
                        else{
                            if(results1.length===0){
                                res.status(400).send({message:"No record found with this room no"})
                            }
                            else{
                
                                if(results1[0].status==="available"){
                                    db.query(query,[data],(err2,results2)=>{
                                        if(err2){
                                            res.status(400).send({message:"something went wrong"})
                                        }
                                        else{
                                            db.query(q2,[selected_room.room_no],(err3,results3)=>{
                                                if(err3){
                                                    res.status(400).send({message:"something went wrong"})
                                                }
                                                else{
                                                    res.status(200).send(results2)
                                                }
                                            })
                                        }
                                    })
                                }
                                
                            }
                
                        }
                    })

                }).catch((err)=>{
                    console.log(err)
                    res.status(406).send({message:"transaction token is invalid!"})
                    return
                })

                    


                

            }
        }
    })
})

route.post("/update",authTokenVerify,(req,res)=>{

    let {id,name,phone_no,email,address,date_check_in,date_check_out,status,room_no,has_paid,food_service}=req.body

    let timestamp=new Date

    let data=[name,phone_no,email,address,timestamp,date_check_in,date_check_out,status,room_no,has_paid,food_service,id]

    let q1=`SELECT status FROM booking WHERE id=?`

    let query=`UPDATE booking SET name=?,phone_no=?,email=?,address=?,timestamp=?,date_check_in=?,date_check_out=?,status=?,room_no=?,has_paid=?,food_service=?
    WHERE id=?;`

    let q2=`UPDATE rooms SET status=? WHERE room_no=?`

    console.log(has_paid)

    db.query(q1,[id],(err,results)=>{
        let currentData=results[0]
        if(err){
            res.status(400).send({message:"No such record"})
        }
        else{
            if(results[0].status==="checked out" || results[0].status==="expired" || results[0].status==="did not arrive"){
                res.status(400).send({message:"This record cannot be updated!"})
            }
            else{

                if(!has_paid==1 && status==="checked out" ){
                    console.log("lol")
                    res.status(200).send({err:1,id:"payment-error",message:"Cannot checkout until has paid is true!"})
                    return
                }
                
                db.query(query,data,(err,results)=>{
                    if(err){
                        res.status(400).send(err)
                    }
                    else{
                        if(status==="checked in"){
                            res.status(200).send({message:"checkin success"})
                        }
                        else if(status==="checked out" || status==="did not arrive" || status==="expired"){

                           db.query(q2,["available",room_no],(err,results)=>{
                                if(err){
                                    res.status(400).send({message:"something went wrong"})
                                }
                                else{
                                    res.status(200).send({message:"checkout success"})
                                }
                            })
                        }
                        else{
                            res.status(200).send({message:"update sucessfull",data:results})
                        }
                    }
                })

            }
        }
    })

   
    

    
})

module.exports=route