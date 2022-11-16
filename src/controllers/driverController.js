const driverModel = require('../models/driverModel')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const { isValid,isValidBody, validString, validMobileNum,  validEmail,validPwd, isValidObjectId,validPrice,isValidImage}= require('../utils/validation')
  
const createDriver = async (req, res) => {
    try {
        let Body = req.body

    
        if(isValidBody(Body)) {
            return res.status(400).send({status: false, message: "Enter user details"})
        }
        //check key & value of Body is Present or not
        if(!Body.first_name) {
            return res.status(400).send({status: false, message: "FirstName is required"})
        }
        if(!Body.last_name) {
            return res.status(400).send({status: false, message: "LastName is required"})
        }
        if(!Body.cab_name) {
            return res.status(400).send({status: false, message: "Driver Cab Name is required"})
        }
        if(!Body.cab_number) {
            return res.status(400).send({status: false, message: "Driver Cab Number is required"})
        }
        if(!Body.email) {
            return res.status(400).send({status: false, message: "Email ID is required"})
        }
        if(!Body.phone) {
            return res.status(400).send({status: false, message: "Mobile number is required"})
        }
        if(!Body.password) {
            return res.status(400).send({status: false, message: "Password is required"})
        }

   
        if(validString(Body.first_name) ||validString(Body.last_name) ) return res.status(400).send({status: false, message: "FirstName and LastName should be characters and should not contains any numbers"})

        if(!validEmail(Body.email)) return res.status(400).send({status: false, message: "Enter a valid email-id"})

     
        if(!validMobileNum(Body.phone)) return res.status(400).send({status: false, message: "Enter a 10-digit Indian phone number exluding (+91)"})

        if(!validPwd(Body.password)) return res.status(400).send({status: false, message: "Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters"})

        //create password to hash password
        const salt = await bcrypt.genSalt(10)
        Body.password = await bcrypt.hash(Body.password, salt)

        //check email and phone number is already exist or not
        let checkUniqueValues = await driverModel.findOne({
            $or: [{
                phone: Body.phone
            }, {
                email: Body.email
            }]
        })
        if (checkUniqueValues) return res.status(400).send({
            status: false,
            message: "E-Mail or phone number already exist"
        })

        let driverBody = await driverModel.create(Body)
        res.status(201).send({
            status: true,
            message: "Created successfully",
            Body: driverBody
        })

    } catch (err) {
        res.status(500).send({
            status: false,
            Error: err.message
        })
    }
}



const loginDriver = async (req, res) => {
    try {
        let Body = req.body;
        const {email,  password}= Body
            
        

        //check Body is present or not
        if (Object.keys(Body).length == 0) return res.status(400).send({
            status: false,
            message: "Email and Password is required for login"
        })

        //check email or password is present in body or not
        if (!Body.email) return res.status(400).send({
            status: false,
            message: "Email field is empty"
        })
        if (!Body.password) return res.status(400).send({
            status: false,
            message: "Password field is empty"
        })

        //validate email
        if (!validEmail(Body.email)) return res.status(400).send({
            status: false,
            message: "Enter a valid email-id"
        })

        //validate password
        if (!validPwd(Body.password)) return res.status(400).send({
            status: false,
            message: "Enter a valid password"
        })

        //check email is corrrect or not
        let getEmailBody = await driverModel.findOne({
            email
        })
        if (!getEmailBody) return res.status(400).send({
            status: false,
            message: `Driver does not signin of this email please sigin first`
        })

        //check password is correct or not
        let passwordBody = await bcrypt.compare(password, getEmailBody.password)
        if (!passwordBody) return res.status(400).send({
            status: false,
            message: "Password is incorrect"
        })

        //generate token
        let token = jwt.sign({
            riderId: getEmailBody._id
        }, "driverregistration", {
            expiresIn: '1d'
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






module.exports = {loginDriver, createDriver}