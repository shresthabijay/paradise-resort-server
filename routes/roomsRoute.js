const express=require("express")
const route=express.Router()


route.get("/get/roomdata",(req,res)=>{
    let query=`SELECT  r.room_no, rt.name as room_type, rt.price_per_night as room_price, r.status
               FROM rooms as r
               INNER JOIN room_types as rt on r.room_type_id=rt.id
               `

    db.query(query,(err,results)=>{
        if(err){
            console.log(err)
            res.status(400).send({errno:err.errno,code:err.code})
        }
        else{
            res.status(200).send(results)
        }
    })
})

route.get("/get/roomtypes",(req,res)=>{
    let query='SELECT * FROM room_types;'

    db.query(query,(err,results)=>{
        if(err){
            res.status(400).send({errno:err.errno,code:err.code})
        }
        else{
            res.status(200).send(results)
        }
    })
})

route.post("/add/room",(req,res)=>{
    let {room_no,room_type_id,status}=req.body

    let data=[[room_no,room_type_id,status || "available"]]

    let query=`INSERT INTO rooms (room_no,room_type_id,status)
               VALUES ?;`

    db.query(query,[data],(err,results)=>{
        if(err){
            console.log(err)
            res.status(400).send({errno:err.errno,code:err.code})
        }
        else{
            res.status(200).send(results)
        }
    })
})

route.post("/add/roomtype",(req,res)=>{
    let {name,description,price_per_night}=req.body

    let data=[[name,description,price_per_night]]

    let query=`INSERT INTO room_types (name,description,price_per_night)
               VALUES ?;`

    db.query(query,[data],(err,results)=>{
        if(err){
            console.log(err)
            res.status(400).send({errno:err.errno,code:err.code})
        }
        else{
            res.status(200).send(results)
        }
    })
})

route.post("/update/room",(req,res)=>{

    let {room_no,room_type_id,status}=req.body

    let query=`UPDATE rooms SET room_no=?,room_type_id=?,status=?
               WHERE room_no=?;`

    try{
        room_no=parseInt(room_no)
        room_type_id=parseInt(room_type_id)
    }

    catch(err){
        res.status(400).send({message:"Invalid data types"})
        return 
    }

    db.query(query,[room_no,room_type_id,status,room_no],(err,results)=>{
        if(err){
            res.status(400).send(err)
        }
        else{
            res.status(200).send(results)
        }
    })
})




module.exports=route