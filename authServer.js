const express = require("express");
const authServer = express();
require("dotenv").config({ path: "./config/.env" });

authServer.listen(process.env.AUTH_SERVER_PORT, () => {
  console.log(`Server running on PORT ${process.env.AUTH_SERVER_PORT}`);
});
