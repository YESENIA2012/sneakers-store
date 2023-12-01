const config = require("./config/index.js");

const connectToMongo = async(envVariables)=>{
  const {  DB_USER, DB_PASS, SERVER_HOST, DB_NAME } = envVariables;

  const mongoose = require('mongoose');
  const uri = `mongodb://${DB_USER}:${DB_PASS}@${SERVER_HOST}/${DB_NAME}`;

  const mongod =  await mongoose.connect(uri)
  return mongod
}

const getInstance = async () => {
  try {
    const { ENVIRONMENT } = process.env;

    if (!ENVIRONMENT) {
      throw new Error(`Please setup a valid ENVIRONMENT`);
    }

    if (!(ENVIRONMENT in config)) {
      throw new Error(`Environment ${ENVIRONMENT} is not supported`);
    }

    const dbConfig = config[ENVIRONMENT]

    console.log("initializing a new connection instance ", dbConfig);
    
    const instance = await connectToMongo(process.env)
    return instance

  } catch (error) {
    console.log("error connecting to the db..");
    throw error;
  }
};

module.exports = { getInstance };
