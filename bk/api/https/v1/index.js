const express = require("express");
const http = require("http");
const app = express.Router();

const lbC = require("./connections/labrinth/index")

app.get("/", (req, res) => {
    res.send({
        res: "Hello world!"
    })
})

app.use("/labrinth", lbC);
app.use("/users", require("./accounts/user"))
app.use("/projects", require("./projects/index"))

module.exports = app;