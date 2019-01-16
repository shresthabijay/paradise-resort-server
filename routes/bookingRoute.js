const express=require("express")
const route=express.Router()
const moment=require("moment")


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

    let {name,phone_no,email,address,date_check_in,date_check_out,room_no}=req.body

    let timestamp=new Date

    let data=[[name,phone_no,email,address,timestamp,date_check_in,date_check_out,room_no,"yet to arrive"]]


    let query=`INSERT INTO booking (name,phone_no,email,address,timestamp,date_check_in,date_check_out,room_no,status)
               VALUES ?;`

    db.query(query,[data],(err,results)=>{
        if(err){
            res.status(400).send(err)
        }
        else{
            res.status(200).send(results)
        }
    })
})

route.post("/update",(req,res)=>{

    let {id,name,phone_no,email,address,date_check_in,date_check_out,status,room_no}=req.body

    console.log(req.body)

    let timestamp=new Date

    let data=[name,phone_no,email,address,timestamp,date_check_in,date_check_out,status,room_no,id]


    let query=`UPDATE booking SET name=?,phone_no=?,email=?,address=?,timestamp=?,date_check_in=?,date_check_out=?,status=?,room_no=?
               WHERE id=?;`

    db.query(query,data,(err,results)=>{
        if(err){
            res.status(400).send(err)
        }
        else{
            console.log(results)
            res.status(200).send(results)
        }
    })
})

module.exports=route