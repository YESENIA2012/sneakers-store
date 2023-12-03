const mongoose = require("mongoose")
const { Schema } = mongoose

const userSchema = new Schema({
  nombre: String,
  metadata: { 
    precios_especiales: [ 
      { 
        nombre_producto: String,
        precio_especial_personal: Number
      } 
    ]
  },
})

const UserModel = mongoose.model('users', userSchema)

module.exports = UserModel ;
