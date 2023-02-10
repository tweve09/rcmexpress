const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

app.get("/", (req,res)=>{
  res.send("Hello world!");
})

app.get("/home", (req,res)=>{
  res.sendFile(__dirname+"/index.html");
})

app.get("/dashboard", (req, res)=>{
  res.sendFile(__dirname+"/dashboard.html");
})

io.on("connection", (socket)=>{
  console.log("User is connected");
});

server.listen(3000, ()=>{
  console.log("Server stated at 3000 port");
})
