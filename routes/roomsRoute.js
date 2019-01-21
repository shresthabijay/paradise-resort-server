const express=require("express")
const route=express.Router()
const authTokenVerify=require("../middleware/authTokenVerify")


route.get("/get/roomdata",(req,res)=>{
    let query=`SELECT  r.room_no, rt.name as room_type, rt.room_category_name,rt.quantity, rt.price_per_night as room_price, r.status
               FROM rooms as r
               INNER JOIN room_types as rt on r.room_type_id=rt.id
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


route.post("/search/roomtypeid",(req,res)=>{
    let {room_type_id}=req.body

    let query= `SELECT  r.room_no,r.status FROM rooms as r
                INNER JOIN room_types as rt
                ON rt.id=r.room_type_id 
                WHERE rt.id=?
    `

    db.query(query,[room_type_id],(err,results)=>{
        if(err){
            console.log(err)
            res.status(400).send({errno:err.errno,code:err.code})
        }
        else{
            res.status(200).send(results)
        }
    })
})

route.post("/add/room",authTokenVerify,(req,res)=>{
    let {room_no,room_type_id,status}=req.body

    let data=[[room_no,room_type_id,status || "available"]]

    let query=`INSERT INTO rooms (room_no,room_type_id,status)
               VALUES ?;`

    db.query(query,[data],(err,results)=>{
        if(err){
            res.status(400).send({errno:err.errno,code:err.code})
        }
        else{
            res.status(200).send(results)
        }
    })
})

route.get("/getRoomCategories",(req,res)=>{
    let query=`SELECT * FROM room_categories;`

    db.query(query,(err,results)=>{
        if(err){
            res.status(400).send({errno:err.errno,code:err.code})
        }
        else{
            res.status(200).send(results)
        }
    })
})

route.post("/getRoomTypesByCategory",(req,res)=>{
    console.log(req.body.room_category_name)
    let query=`SELECT * FROM room_types WHERE room_category_name=?;`

    db.query(query,[req.body.room_category_name],(err,results)=>{
        if(err){
            res.status(400).send({errno:err.errno,code:err.code})
        }
        else{
            console.log(req.body.room_category_name,results)
            res.status(200).send(results)
        }
    })
})

route.post("/add/roomtype",authTokenVerify,(req,res)=>{
    let {name,description,price_per_night,quantity,room_category_name}=req.body

    let data=[[name,description,price_per_night,quantity,room_category_name]]

    let query=`INSERT INTO room_types (name,description,price_per_night,quantity,room_category_name)
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

route.post("/update/room",authTokenVerify,(req,res)=>{

    let {name,description,price_per_night,quantity,room_category_name,room_no}=req.body

    let query=`UPDATE rooms SET room_no=?,room_type_id=?,status=?,quantity=?,room_category_name=?
               WHERE room_no=?;`

    try{
        room_no=parseInt(room_no)
        room_type_id=parseInt(room_type_id)
    }

    catch(err){
        res.status(400).send({message:"Invalid data types"})
        return 
    }

    db.query(query,[room_no,room_type_id,status,quantity,room_category_name,room_no],(err,results)=>{
        if(err){
            res.status(400).send(err)
        }
        else{
            res.status(200).send(results)
        }
    })
})




module.exports=route