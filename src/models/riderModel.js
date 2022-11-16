const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema( {
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
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
          },
        username: {
          type: String,
          unique: true,
          required: true,
          lowercase: true,
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


module.exports = mongoose.model('rider', riderSchema)