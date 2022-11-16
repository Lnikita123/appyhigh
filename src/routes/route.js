const express = require('express');
const router = express.Router();


const {loginRider, createRider, riderSearchNearestCab } = require("../controllers/riderController")
const {loginDriver, createDriver} = require("../controllers/driverController")

const {activityCreate, isOnDutyUpdate} = require("../controllers/activityController")
const {createBooking, viewBookingDetails} = require('../controllers/bookingController')

//Rider Api
  router.post("/rlogin", loginRider )
  router.post("/rider", createRider)
  router.get("/getnearestcab", riderSearchNearestCab)
  

 //driver API 
 router.post("/dlogin", loginDriver )
 router.post("/driver", createDriver)


 //activity API
 router.post("/createactivity", activityCreate)
 router.put("/updateActivity", isOnDutyUpdate)

 
 //Booking API
 router.post("/createBook", createBooking)
 router.get('/viewBooking', viewBookingDetails)



module.exports = router;
