import mqtt from "mqtt";

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log("Connected to broker");

  setInterval(() => {
    const temp = Math.random() * 10 + 25;
    const hum = Math.random() * 20 + 50;
    client.publish(
      "devices/e2590477-0a6c-4064-acc3-cc0d5f72da3b/data",
      JSON.stringify({
        temperature: parseFloat(temp.toFixed(2)),
        humidity: parseFloat(hum.toFixed(2)),
      })
    );
    console.log("\ntemperature : ", temp.toFixed(2));
    console.log("humidity : ", hum.toFixed(2));
  }, 5000);
});
