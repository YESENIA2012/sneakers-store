const config = require("./config/index.js");
const mongoose = require('mongoose');
const{ MongoMemoryServer } = require('mongodb-memory-server');
let instance

const connectToDb = async (envVariables) =>{
  const { ENVIRONMENT, DB_USER, DB_PASS, SERVER_HOST, DB_NAME } = envVariables;
  let uri

  if(ENVIRONMENT !== "test"){
    uri = `mongodb://${DB_USER}:${DB_PASS}@${SERVER_HOST}/${DB_NAME}`;
  } 
  const dbInstance = await mongoose.connect(uri)

  return dbInstance
}

const initDbConnectionForTest = async() => {
  const dbInstance = await MongoMemoryServer.create()
  const uri = dbInstance.getUri()
  instance = mongoose.connect(uri)

  return instance
}

const initializeConnection = async () => {
  try {
    const { ENVIRONMENT } = process.env;

    if (instance) {
      return instance;
    }

    if (!ENVIRONMENT) {
      throw new Error(`Please setup a valid ENVIRONMENT`);
    }

    if (!(ENVIRONMENT in config)) {
      throw new Error(`Environment ${ENVIRONMENT} is not supported`);
    }

    const dbConfig = config[ENVIRONMENT]
    console.log("initializing a new connection instance ", dbConfig);
    
    instance = connectToDb(process.env)

    return instance
  } catch (error) {
    console.log("error connecting to the db..",error);
    throw error;
  }
};

module.exports = { connectToDb, initializeConnection, initDbConnectionForTest };
