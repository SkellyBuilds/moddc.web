/**
 * Project - Mod Digital Certificates 
 * 
 * Secure your mods.
 * 
 */

console.log("Starting up!")

console.log(process.env["noBk"])
// If you don't want to start one or another
const noBk = process.env["noBk"] == 1 ? true : false;
const noFr = process.env["noFr"] == 1 ? true : false;

if(noBk && noFr){
    throw new Error("Might not be the sharpest tool in the shed...");
}

console.log("Started up!")

const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();
// var bodyParser = require('body-parser')
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
const port = 82;
const hport = 400;
app.disable('x-powered-by');
// For parsing application/json
app.use(express.json());
 

const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };


const {connect} = require("mongoose")
const { mongodbURL } = require("./config.gl");
connect(mongodbURL, {
    autoIndex: false
}).then(() => {
    console.log("(!) Connected to database!");

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

app.use('/', express.static(path.join(__dirname, 'fr/_lc/js')));
app.use('/assets', express.static(path.join(__dirname, 'fr/_lc')));




if(!noFr){
    const fr = require('./fr/index.fr');

    app.use('/', (req, res, next) => {
        if (req.path === '/') {
            res.redirect("/app");
        }
        next();
    });

    app.use('/app*', fr);
} else {
    app.use('/', (req, res, next) => {
        if (req.path === '/') {
            res.redirect("/api");
        }
        next();
    });

    app.use('/app*', (req, res, next) => {
        if (req.path === '/') {
            res.redirect("/api");
        }
        next();
    });
}

if(!noBk){
    const bk = require('./bk/index.bk');
    app.use('/api', bk);
} else {
    app.use('/api', (req, res, next) => {
        res.send({
            bad: "Back end is disabled"
        });
        next();
    });
}

app.use((req, res, next) => {
    if(req.path.includes("/app")){
    res.status(404).sendFile(path.join(__dirname, 'fr/pages', '404.html'));
    } else {
        res.status(404).send({
            bad: "That does not exist!"
        })
    }
  });


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


/*           ANTI CRASHING            ¦¦           ANTI CRASHING           */ 
process.on('unhandledRejection', (reason, p) => {
    console.log('\n\n\n\n\n[🚩 Anti-Crash] unhandled Rejection:'.toUpperCase());
    console.log(reason.stack ? String(reason.stack) : String(reason));
    console.log('=== unhandled Rejection ===\n\n\n\n\n'.toUpperCase());
  });
  process.on("uncaughtException", (err, origin) => {
    console.log('\n\n\n\n\n\n[🚩 Anti-Crash] uncaught Exception'.toUpperCase());
    console.log(err.stack)
    console.log('=== uncaught Exception ===\n\n\n\n\n'.toUpperCase());
  })
  process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('[🚩 Anti-Crash] uncaught Exception Monitor'.toUpperCase());
  });
  process.on('beforeExit', (code) => {
    console.log('\n\n\n\n\n[🚩 Anti-Crash] before Exit'.toUpperCase());
    console.log(code);
    console.log('=== before Exit ===\n\n\n\n\n'.toUpperCase());
  });
  process.on('exit', (code) => {
    console.log('\n\n\n\n\n[🚩 Anti-Crash] exit'.toUpperCase());
    console.log(`${code}`);
    console.log('=== exit ===\n\n\n\n\n'.toUpperCase());
  });
}).catch(err => {
    console.log(err);
    console.log("(!) Failed connecting to database!");
    process.exit(1);
});


// Console


// httpsServer.listen(hport, () => {
//     console.log(`Server running at https://localhost:${hport}/`);
// });
