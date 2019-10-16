exports.data = {
  host: process.env.LOCAL_HOST_NAME,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
};

exports.cred = {
  "authorization": process.env.authorizationCode,
  "partner-token": process.env.partnertokenCode
};