const { Schema } = require("mongoose")
const { getInstance } = require("../../dbs/setup")

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

async function initUsersModel(){
  const mongoose = await getInstance()
  const model = mongoose.model('users', userSchema)
  
  return model
}

module.exports = { initUsersModel };
