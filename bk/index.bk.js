const express = require("express");
const http = require("http");
const app = express.Router();
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello!")
})


const v1 = require("./api/https/v1/index");

app.use('/1', v1);

module.exports = app;