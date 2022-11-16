const mongoose = require('mongoose')

const isValid = function(value) {
  if(typeof value === 'undefined' || value === null) return false
  if(typeof value === 'string' && value.trim().length === 0) return false
  if(typeof value === "object") return false
  return true
}

const isValidBody = (object) => {
    if (Object.keys(object).length > 0) {
      return false
    }else {
      return true;
    }
  };
  
  const validString = (String) => {
    if (/\d/.test(String)) { 
      return true
    }else {
      return false;
    };
  };
  
  const validMobileNum = (Mobile) => {
    if (/^[6-9]\d{9}$/.test(Mobile)) {
      return true
    }else {
      return false;
    };
  };
  
  const validEmail = (Email) => {
    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(Email)){
      return true
    }else {
      return false;
    }
      
  };
  
  const validPwd = (Password) => {
    if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(Password)){
      return true
    }else {
      return false;
    }
  };

  const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
  }
  
module.exports = { isValid, isValidBody, validString, validMobileNum, validEmail, validPwd,isValidObjectId};

//^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$