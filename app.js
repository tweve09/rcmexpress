const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('COM2');
const parser = new Readline();
port.pipe(parser);


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Emma2030",
  database: "patient"
})

db.connect((err)=>{
  if(err){
    console.log(err);
    return;
  }
  console.log("Connected to database succefully..");
});

const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

app.get("/", (req,res)=>{
  res.sendFile(__dirname+"/index.html");
})

app.get("/data", (req, res)=>{
  db.query("SELECT * FROM health_data", (error, result)=>{
    if(error){
      console.log("Error in fetching data from database");
    }else{
      console.log("Data fetched succefully");
      res.render("dashboard", {result: result});
    }
  });
})

app.get("/trial", (req, res)=>{
  res.render("trial")
})

io.on("connection", (socket)=>{
  console.log("User is connected");
  socket.on("disconnect", ()=>{
    console.log("User disconnected");
  })
});

parser.on('data', (data) => {
  console.log(data);
  console.log(typeof(data));
  io.emit('data', data);
  const value = Number(data);
  db.execute('INSERT INTO health_data (heart_rate) VALUES (?)', [value]);
});

port.on('error', (err) => {
  console.log(err.message);
});

server.listen(3000, ()=>{
  console.log("Server stated at 3000 port");
})
