const express=require("express")
const route=express.Router()
const moment=require("moment")
const khalti_token_verifier=require("../khaltiVerification")


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

route.post("/add",(req,res)=>{

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
                            console.log(err2)
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

route.post("/book",async (req,res)=>{

    let {token,amount}=req.body


    let khaltiResponse=null

    try{
        khaltiResponse=await khalti_token_verifier(token,amount)
    }
    catch(err){
        res.status(406).send({message:"transaction token is invalid!"})
        return 
    }


    let {name,phone_no,email,address,date_check_in,date_check_out,room_no,has_paid,food_service}=req.body

    let timestamp=new Date


    let data=[[name,phone_no,email,address,timestamp,date_check_in,date_check_out,room_no,"yet to arrive",1,food_service]]

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
                            console.log(err2)
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

route.post("/update",(req,res)=>{

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