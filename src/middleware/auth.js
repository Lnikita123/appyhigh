const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try{
        let token = req.headers['x-Api-key']
        token = req.headers['x-api-key']
        if(!token){
            return res.status(401).send({status: false, message: "Token must be present"})
        }
        let decodedToken = jwt.verify(token, "appyhigh")
        if(!decodedToken) return res.status(401).send({status: false , message: "Invalid token id"})
        

        next()
    }catch(err){
        if(err.message == "jwt expired") return res.status(401).send({ status: false, message: "JWT token has expired, login again" })
        if(err.message == "invalid signature") return res.status(401).send({ status: false, message: "Token is incorrect" })
        return res.status(501).send({Status: false, Error: err.message})
    }
}

module.exports = {auth}