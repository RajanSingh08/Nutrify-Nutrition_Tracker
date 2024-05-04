const jwt = require("jsonwebtoken")

function verifyToken(req,res,next){
    if(req.headers.authorization !== undefined){
        let token = req.headers.authorization.split(" ")[1];
        jwt.verify(token,"token",(err,data)=>{
            if(!err){
                next();
            }else{
                console.log(err);
                res.status(403).send({message : "Inval token"});
            }
        })
    }else{
        res.send({message : "Please send the token"})
    }
}

module.exports = verifyToken;