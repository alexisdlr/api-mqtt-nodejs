import mqtt from "mqtt";
import { io } from "../index.js";

const client = mqtt.connect("mqtt://192.168.1.8:1883");

client.on("connect", function () {
  console.log("Conectado al servidor MQTT");
  client.subscribe("v1/devices/ESP32A69EF0C860CF/hum");
});

const waitForMessage = () => {
  return new Promise((resolve, reject) => {
    client.on("message", function (topic, message) {
      console.log(
        "Mensaje recibido en el canal " +
          topic.toString() +
          ": " +
          message.toString()
      );
      if (topic === "v1/oficina/ESP32A69EF0C860CF/hum") {
        // Verificar si el mensaje proviene del canal "temp"
        const humActual = parseFloat(message.toString());
        console.log(humActual);
        io.emit('humidity', humActual); // Envía la temperatura a todos los clientes conectados

        if (!isNaN(humActual)) {
          resolve(humActual);
        } else {
          reject(new Error("No se ha recibido la temperatura aún"));
        }
      }
    });
  });
};


export const getHum = async (req, res) => {
  try {
    const humActual = await waitForMessage();
    res.json({ humedad: humActual });
  } catch (error) {
    res.status(404).json({ mensaje: error.message });
  }
};

export const publishMss = async (req, res) => {
  const { mss } = req.body;
  client.publish("temp", mss);
  res.json({ mss: "Mensaje publicado en el canal: temp" });
};
