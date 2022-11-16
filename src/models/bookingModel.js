//bookingModel :- riderId, driverId, fare, rideStatus[done/Notdone], FromLoc, ToLoc


const mongoose = require('mongoose')
let ObjectId = mongoose.Schema.Types.ObjectId

const bookingSchema = new mongoose.Schema({
    riderid: {
        type: ObjectId,
        ref: 'rider',
        required: true,
        unique: true
    },
    driverid: {
        type: ObjectId,
        ref: 'driver',
        required: true,
        unique: true
    },
    location:{
          type:{type: String},
          coordinates:[]
      },
    fare: {
        type: Number,
        default: 0,
        trim: true
    },
    riderStatus: {
        type: Boolean,
        default: false,
    },
    fromlocation:{
        type:{type: String},
        coordinates:[]
    },
    tolocation:{
        type:{type: String},
        coordinates:[]
    },
}, { timestamps: true })

  bookingSchema.index({location:"2dsphere"});
  bookingSchema.index({fromlocation:"2dsphere"});
  bookingSchema.index({tolocation:"2dsphere"});


module.exports = mongoose.model('booking', bookingSchema)