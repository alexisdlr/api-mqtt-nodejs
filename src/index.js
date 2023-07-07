import express from "express";
import tempRoutes from "./routes/temp.route.js";
import ledRoutes from './routes/led.route.js';
import humRoutes from './routes/humidity.route.js';
import http from 'http'
import mqtt from "mqtt";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app)
export const io = new Server(server, {
  cors: {
    origin: "*", // Reemplaza esto con la URL de tu aplicación Next.js
    methods: ["GET", "POST"]
  }
})
const client = mqtt.connect("mqtt://192.168.1.8:1883");
let device
client.on("connect", function () {
  console.log("Conectado al servidor MQTT");
  client.subscribe("v1/oficina/ESP32A69EF0C860CF/#");
  client.subscribe("v1/oficina/ESP32B8F23A0824C3/#");
  

});


client.on("message", function (topic, message) {
  
  if (topic === "v1/oficina/ESP32A69EF0C860CF/data") {
    device = topic.toString().split('/')[2]
    // Verificar si el mensaje proviene del canal "temp"
    const dataParsed = JSON.parse(message);
    dataParsed.device = device
    io.emit(device + '/data', dataParsed); // Envía la temperatura a todos los clientes conectados
  }
  if (topic === "v1/oficina/ESP32B8F23A0824C3/data") {
    device = topic.toString().split('/')[2]
    // Verificar si el mensaje proviene del canal "temp"
    const dataParsed = JSON.parse(message);
    dataParsed.device = device

    io.emit(device + '/data', dataParsed); // Envía la temperatura a todos los clientes conectados
  }
  
});



app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use(express.json());

app.use("/oficina/temp", tempRoutes);
app.use("/oficina/led", ledRoutes);
app.use("/oficina/hum", humRoutes);


server.listen(8800, () => console.log(`listening at port 8800`));
