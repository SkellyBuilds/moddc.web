const express = require("express");
const http = require("http");
const app = express.Router();
const path = require("path");
   

app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'pages', 'index.html'));
 });
    
    module.exports = app;