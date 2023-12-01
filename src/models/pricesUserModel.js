const { getInstance } = require("../../dbs/setup")

async function initUsersModel(){
  const mongoose = await getInstance()
  const model = mongoose.model('users', {})
  
  return model
}

module.exports = { initUsersModel };
