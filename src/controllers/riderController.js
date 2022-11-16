const riderModel = require('../models/riderModel')
const activityModel = require('../models/driverActivityModel')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const { isValid,isValidBody, validString, validMobileNum,  validEmail,validPwd, isValidObjectId}= require('../utils/validation')
  


const createRider = async (req, res) => {
    try {
        let requestBody = req.body

        //check body of requestBody
        if(isValidBody(requestBody)) return res.status(400).send({status: false, message: "Enter user details"})

        //check key & value of Data is Present or not
        if(!requestBody.first_name) {
            return res.status(400).send({status: false, message: "FirstName is required"})
        }
        if(!requestBody.last_name){
             return res.status(400).send({status: false, message: "LastName is required"})
        }
        if(!requestBody.email){
            return res.status(400).send({status: false, message: "Email ID is required"})
        }
        if(!requestBody.username) {
            return res.status(400).send({status: false, message: "Username is required"})
        }
        if(!requestBody.phone) {
            return res.status(400).send({status: false, message: "Mobile number is required"})
        }
        if(!requestBody.password) {
            return res.status(400).send({status: false, message: "Password is required"})
        }


        
        if(validString(requestBody.first_name) ||validString(requestBody.last_name) ) {
            return res.status(400).send({status: false, message: "FirstName and LastName should be characters and should not contains any numbers"})
        }
    
        if(!validEmail(requestBody.email)) {
            return res.status(400).send({status: false, message: "Enter a valid email-id"})
        }

        
        if(!validMobileNum(requestBody.phone)) {
            return res.status(400).send({status: false, message: "Enter a 10-digit Indian phone number exluding (+91)"})
        }
        
        if(!validPwd(requestBody.password)) {
            return res.status(400).send({status: false, message: "Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters"})
        }
        //create password to hash password
        const salt = await bcrypt.genSalt(10)
        requestBody.password = await bcrypt.hash(requestBody.password, salt)

    
        let checkUniqueValues = await riderModel.findOne({ $or: [{phone: requestBody.phone},{email: requestBody.email}]
        });

        if (checkUniqueValues) return res.status(400).send({ status: false, message: "E-Mail or phone number already exist"})
            
        let checkUsername = await riderModel.findOne({username: requestBody.username})
        if(checkUsername) return res.status(400).send({status: false, message: "This username is already exist"})


        // here we can start user creation
        let riderData = await riderModel.create(requestBody)
        res.status(201).send({  status: true,  message: "Created successfully", requestBody: riderData})
        
    } catch (err) { res.status(500).send({ status: false, Error: err.message})
       
    }
}


const loginRider = async (req, res) => {
    try {
        let requestBody = req.body;
        const {
            email,
            password
        } = requestBody

        //check requestBody is present or not
        if (Object.keys(requestBody).length == 0) return res.status(400).send({
            status: false,
            message: "Email and Password is required for login"
        })

        //check email or password is present in body or not
        if (!requestBody.email) return res.status(400).send({
            status: false,
            message: "Email field is empty"
        })
        if (!requestBody.password) return res.status(400).send({
            status: false,
            message: "Password field is empty"
        })

        //validate email
        if (!validEmail(requestBody.email)) return res.status(400).send({
            status: false,
            message: "Enter a valid email-id"
        })

        //validate password
        if (!validPwd(requestBody.password)) return res.status(400).send({
            status: false,
            message: "Enter a valid password"
        })

        //check email is corrrect or not
        let getEmailData = await riderModel.findOne({
            email
        })
        if (!getEmailData) return res.status(400).send({
            status: false,
            message: `Rider does not signin of this email please sigin first`
        })

        //check password is correct or not
        let passwordData = await bcrypt.compare(password, getEmailData.password)
        if (!passwordData) return res.status(400).send({
            status: false,
            message: "Password is incorrect"
        })

        //generate token
        let token = jwt.sign({
            riderId: getEmailData._id
        }, "appyhigh", {
            expiresIn: '5d'
        });

       
        res.status(200).send({
            status: true,
            message: "LoggedIn",
            token: token
        })

    } catch (err) {
        res.status(500).send({
            status: false,
            Error: err.message
        })
    }
}



const riderSearchNearestCab = async (req, res) => {
    try{
        let searchCab = req.body;

        let {riderid, latitude, longitude, distance} = searchCab

        if(!riderid){

        return res.status(400).send({status: false, message: "Enter the rider id"})
        }
        if(!latitude) {
            return res.status(400).send({status: false, message: "Enter the latitude"})
        }
        if(!longitude) {
            return res.status(400).send({status: false, message: "Enter the longitude"})
        }
        let Cabdata = await activityModel.aggregate([{
            $geoNear:{
                near:{type:"Point", coordinates: [parseFloat(latitude), parseFloat(longitude)]},
                key: "location",
                maxDistance: parseFloat(distance),
                distanceField: "dist.calculated",
                spherical: true
            }
        }], {isOnDuty: true})

        res.status(201).send({status: true, message: "Found Nearest Cab",requestBody: Cabdata})
    }catch(err){
        console.log(err)
        res.status(500).send({status: false, Error: err.message})
    }
}

module.exports = {
    loginRider,
    createRider,
    riderSearchNearestCab
}