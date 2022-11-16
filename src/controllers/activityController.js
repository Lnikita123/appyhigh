const activityModel = require('../models/driverActivityModel')

const activityCreate = async(req, res) => {
    try{
        let data = req.body;

        let activityData = await activityModel.create(data)

        res.status(201).send({status: true, message: "created", data: activityData})

    }catch(err){
        console.log(err)
        res.status(500).send({status: false, Error: err.message})
    }
}


const isOnDutyUpdate = async(req, res) => {
    try{
        let activityId = req.query.id; 
    
          let findActivity = await activityModel.findById(activityId);
          if (!findActivity) return res.status(404).send({ status: false, message: "Invalid activityId" }) 
  
          if (findActivity.isOnDuty == false) {
               let updatedActivity = await activityModel.findOneAndUpdate({ _id: findActivity._id }, { isOnDuty: true}, { new: true });
               if(!updatedActivity) return res.status(404).send({ status: false, message: "activity not complete"})
               res.status(200).send({status: false, message: "success",updatedActivity})
           }else{
            return res.status(400).send({status: false, message:"Driver is already on Duty"})
        }
    }catch(err){
        console.log(err)
        res.status(500).send({status: false, Error: err.message})
    }
}




module.exports = {activityCreate, isOnDutyUpdate }