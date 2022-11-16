const bookingModel = require('../models/bookingModel')
const activityModel = require('../models/driverActivityModel')

const createBooking = async (req, res) => {
    try {
        let activityid = req.query.id

        let activityData = await activityModel.findById(activityid)
        //console.log(activityData)
        if (!activityData) return res.status(404).send({
            status: false,
            message: "Invalid activityId"
        })

        if (activityData.isOnDuty == true) {
            if (activityData.isBooked == false) {
                let data = req.body;

                let {
                    riderid,
                    driverid,
                    location,
                    fare,
                    riderStatus,
                    fromlocation,
                    tolocation
                } = data;

                let lat1 = fromlocation.coordinates[0]
                let lon1 = fromlocation.coordinates[1]
                let lat2 = tolocation.coordinates[0]
                let lon2 = tolocation.coordinates[1]

                lon1 = lon1 * Math.PI / 180;
                lon2 = lon2 * Math.PI / 180;
                lat1 = lat1 * Math.PI / 180;
                lat2 = lat2 * Math.PI / 180;

                // Haversine formula
                let dlon = lon2 - lon1;
                let dlat = lat2 - lat1;
                let a = Math.pow(Math.sin(dlat / 2), 2) +
                    Math.cos(lat1) * Math.cos(lat2) *
                    Math.pow(Math.sin(dlon / 2), 2);

                let c = 2 * Math.asin(Math.sqrt(a));
                //console.log(c * 3956)

                let farekm = c * 3956

                data.fare = farekm * 20


                let bookingData = await bookingModel.create(data)
                if (bookingData) {
                    let updatedBooking = await activityModel.findOneAndUpdate({
                        _id: activityData._id
                    }, {
                        isBooked: true
                    }, {
                        new: true
                    });
                    if (!updatedBooking) return res.status(404).send({
                        status: false,
                        message: "Booking is not update"
                    })
                    res.status(200).send({
                        status: false,
                        message: "Booking Created",
                        data: bookingData
                    })
                } else {
                    if (!bookingData) return res.status(404).send({
                        status: false,
                        message: "Booking Not created something wrong!"
                    })
                }
            } else {
                res.status(400).send({
                    status: false,
                    message: "Driver is already booked"
                })
            }
        } else {
            res.status(400).send({
                status: false,
                message: "Driver is not in duty"
            })
        }

    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: false,
            Error: err.message
        })
    }
}


const viewBookingDetails = async (req, res) => {
    try {
        let bookingId = req.query.id; 

        let findBooking = await bookingModel.findById(bookingId);
        if (!findBooking) return res.status(404).send({
            status: false,
            message: "Something went wrong in booking id please check"
        })

        if (findBooking.riderStatus == false) {
            let updateBooking = await bookingModel.findOneAndUpdate({
                _id: findBooking._id
            }, {
                riderStatus: true
            }, {
                new: true
            });
            if (!updateBooking) return res.status(404).send({
                status: false,
                message: "Booking status not complete"
            })
            res.status(200).send({
                status: false,
                message: "success",
                updateBooking
            })
        } else {
            return res.status(400).send({
                status: false,
                message: "Rider is not in cab"
            })
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            Error: err.message
        })
    }
}




module.exports = {
    createBooking,
    viewBookingDetails
}