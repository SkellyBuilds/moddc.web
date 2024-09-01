const express = require("express");
const app = express.Router();


app.use("/o2", require("./auth"))
app.use("/yourmods", require("./projects"))
app.use("/versions", require("./versions"))

module.exports = app;