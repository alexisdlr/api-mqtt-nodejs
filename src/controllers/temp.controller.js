import mqtt from "mqtt";

const client = mqtt.connect("mqtt://192.168.1.8:1883");

client.on("connect", function () {
  console.log("Conectado al servidor MQTT");
  client.subscribe("v1/oficina/ESP32A69EF0C860CF/temp");
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
      if (topic === "v1/oficina/ESP32A69EF0C860CF/temp") {
        // Verificar si el mensaje proviene del canal "temp"
        const temperaturaActual = parseFloat(message.toString());
        console.log(temperaturaActual);

        if (!isNaN(temperaturaActual)) {
          resolve(temperaturaActual);
        } else {
          reject(new Error("No se ha recibido la temperatura aún"));
        }
      }
    });
  });
};


export const getTemp = async (req, res) => {
  try {

    const temperaturaActual = await waitForMessage();

    res.json({ temperatura: temperaturaActual });
  } catch (error) {
    res.status(404).json({ mensaje: error.message });
  }
};

export const publishMss = async (req, res) => {
  const { mss } = req.body;
  client.publish("v1/oficina/ESP32A69EF0C860CF/temp", mss);
  res.json({ mss: "Mensaje publicado en el canal: temp" });
};
