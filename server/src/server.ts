// Load required modules
var http = require("http");              // http server core module
var express = require("express");           // web framework external module
var serveStatic = require('serve-static');  // serve static files
var socketIo = require("socket.io");        // web socket external module
var expressSession = require("express-session");
var bodyParser = require('body-parser')



import { AdminManager } from "./managers/AdminManager";
import "reflect-metadata";
import { APIs } from "./api";
import { request, response } from "express";
import { Method } from "./abstract/ControllerInterface";
import { createConnection } from "typeorm";

// This sample is using the easyrtc from parent folder.
// To use this server_example folder only without parent folder:
// 1. you need to replace this "require("../");" by "require("easyrtc");"
// 2. install easyrtc (npm i easyrtc --save) in server_example/package.json

var easyrtc = require("../../"); // EasyRTC internal module

// Set process name
process.title = "courses";

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var app = express();
app.disable('x-powered-by');
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(serveStatic(__dirname + '/../static', { 'index': ['react.html'] }));
app.use(expressSession({
    secret: 'ONLINE COURSES KEY',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 }
}))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


APIs.forEach((api) => {
    api.pathes().forEach((method) => {
        let path = '/' + api.controllerPath() + '/' + method.path;
        if (method.method === Method.GET) {
            app.get(path, async (request, response) => {
                await method.handler(request, response);
            });
        }
        else if (method.method === Method.POST) {
            app.post(path, async (request, response) => {
                await method.handler(request, response);
            });
        }
    })
});

app.get('/user/req', (req, res) => {
    res.send("End")
})

// Start Express http server on port 8080
var webServer = http.createServer(app);

// Start Socket.io so it attaches itself to Express server
var socketServer = socketIo.listen(webServer, { "log level": 1 });

easyrtc.setOption("logLevel", "debug");

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function (socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function (err, connectionObj) {
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }

        connectionObj.setField("credential", msg.msgData.credential, { "isShared": false });

        console.log("[" + easyrtcid + "] Credential saved!", connectionObj.getFieldValueSync("credential"));

        callback(err, connectionObj);
    });
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function (connectionObj, roomName, roomParameter, callback) {
    console.log("[" + connectionObj.getEasyrtcid() + "] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});

// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer, null, function (err, rtcRef) {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", function (appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});


let port = process.env.PORT || 8080;
// Listen on port 8080
webServer.listen(port, async function () {
    await createConnection();
    console.log('listening on http://localhost:' + String(port));
});
