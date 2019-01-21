const express=require("express")
const router=express.Router()
const jwt =require("jsonwebtoken")
const bcrypt=require("bcrypt-nodejs")
const config=require("../server.config")
const authTokenVerify=require("../middleware/authTokenVerify")


router.post("/login",(req,res)=>{
    let {username,password}=req.body

    if(!username || !password ){
        res.status(400).send({message:"username or password is incorrect"})
        return 
    }

    let query="SELECT * FROM admin WHERE username=?"

    db.query(query,[username],(err,results)=>{

        if(err){
            res.status(400).send({message:"something is wrong"})
            return 
        }

        if(results.length===0){
            res.status(400).send({message:"username or password is incorrect"})
            return 
        }
        else{
            hashPassword=results[0].password
            if(bcrypt.compareSync(password,hashPassword)){
                let secret=config.jwt.secretkey
                var token = jwt.sign({ id: results[0].id },secret, {
                    expiresIn: 8444444400 // expires in 24 hours
                });
                           
                res.status(200).send({token:token})
            }
            else{
                res.status(400).send({message:"username or password incorrect"})
            }

        }
    })

})

router.post("/signup",authTokenVerify,(req,res)=>{
    let {username,password}=req.body

    if(!username || !password ){
        res.status(400).send({type:"authentication-error",message:"Username or Password is incorrect!"})
    }

    let query="SELECT * FROM admin WHERE username=?"
    let hashPassword=bcrypt.hashSync(password,bcrypt.genSaltSync(10))
    db.query(query,[username],(err,results)=>{
        if(results.length===0){
            let q="INSERT INTO admin (username,password) VALUES ?"
            db.query(q,[[[username,hashPassword]]],(err,results)=>{
                console.log(err)
                if(err){
                    res.status(400).send({type:"unknown",message:"something went wrong!"})
                }
                else{
                    res.status(200).send({message:"successfull sign up!"})
                }
            })
        }
        else{
            res.status(400).send({type:"authentication-error",message:"Username or Password is incorrect!"})
        }
    })

})

router.post("/admin",authTokenVerify,(req,res)=>{
    let q="SELECT * FROM admin WHERE id=?"

    db.query(q,[req.decoded.id],(err,results)=>{
        if(err){
            res.status(401).send()
        }
        else{
            if(results.length===0){
                res.status(401).send()
            }
            else{

                res.status(200).send({username:results[0].username,id:results[0].id})
            }
        }
    })
    
    
})

module.exports=router