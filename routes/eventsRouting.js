const express=require("express")
const route=express.Router()
const authTokenVerify=require("../middleware/authTokenVerify")


route.get("/get/all",(req,res)=>{
    let query=`SELECT * FROM events;
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

route.post("/add",authTokenVerify,(req,res)=>{

    let {name,description,date_time,image_url}=req.body

    let data=[[name,description,date_time,image_url]]


    let query=`INSERT INTO events (name,description,date_time,image_url)
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

module.exports=route