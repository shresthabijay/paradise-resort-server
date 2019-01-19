const jwt=require("jsonwebtoken")
const config=require("../server.config")

const authTokenVerify=(req,res,next)=>{
    var token = req.headers['x-access-token'];

    if (!token) {
        res.status(401).send({ auth: false, message: 'No token provided.' });
        return
    }
    
    let secret=config.jwt.secretkey

    jwt.verify(token,secret, function(err, decoded) {
        if (err){
            res.status(500).send({ auth: false, message: 'Failed to authenticate token.' })
            return 
        };
        req.decoded=decoded
        next()
    });
}

module.exports=authTokenVerify