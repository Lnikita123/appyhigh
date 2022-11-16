const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema( {
       first_name: {
          type: String,
          required: true,
          trim: true
        },
        last_name: {
          type: String,
          required: true,
          trim: true
        },
        cab_name: {
          type: String,
          required: true,
          trim: true
        },
        cab_number: {
          type: String,
          required: true,
          trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
          },
        phone: {
          type: Number,
          required: true,
          unique: true,
          minlength: 10,
          maxlength: 10,
          trim: true
        },
        password: {
          type: String,
          required: true,
          trim: true
        },
      }, { timestamps: true });


module.exports = mongoose.model('driver', driverSchema)