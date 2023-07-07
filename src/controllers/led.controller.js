import mqtt from "mqtt";

const client = mqtt.connect("mqtt://192.168.1.8:1883");

client.on("connect", function () {
  console.log("Conectado al servidor MQTT");
  client.subscribe("v1/oficina/ESP32A69EF0C860CF/command");
});
export const handleLed = (req, res) => {
    const {state} = req.params
    if (state === 'encender') {
      const mss = 'on'
      client.publish("v1/oficina/ESP32A69EF0C860CF/command", mss, { qos: 0 });
      return res.json({mss: 'led encendido'})
    } 
    const mss = 'off'
    client.publish('v1/oficina/ESP32A69EF0C860CF/command', mss, { qos: 0})
    return res.json({mss: 'led apagado'})

}