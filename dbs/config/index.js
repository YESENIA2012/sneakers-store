require("../../dotenv.js");

const { DB_USER, DB_PASS, DB_NAME, SERVER_HOST } = process.env;
const baseConfig = {
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  host: SERVER_HOST,
}

module.exports = {
  development: {...baseConfig},
  test:{...baseConfig,database:`${DB_NAME}_test`}
};
