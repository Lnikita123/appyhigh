//riverLocationModel(activityModel): - driverId, location, isOnDuty, isBooked,

const mongoose = require('mongoose')
let ObjectId = mongoose.Schema.Types.ObjectId

const activitySchema = new mongoose.Schema({
    driverid: {
        type: ObjectId,
        ref: 'driver',
        //required: true,
        //unique: true
    },
    location:{
          type:{type: String, required: true},
          coordinates:[]
      },
    isOnDuty: {
        type: Boolean,
        default: false,
    },
    isBooked: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

  activitySchema.index({location:"2dsphere"});


module.exports = mongoose.model('activity', activitySchema)

