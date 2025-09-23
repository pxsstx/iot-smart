import Aedes from "aedes";
import net from "net";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// MQTT Broker
const aedes = Aedes();

aedes.on("client", async (client) => {
  try {
    // สมมติว่าคุณมี client.id = deviceId หรือ mapping ไว้
    const deviceId = client.id;

    const { data, error } = await supabase
      .from("devices")
      .update({ status: true })
      .eq("id", deviceId)
      .select()
      .single();

    if (error) throw error;

    console.log(`✅ Device ${deviceId} is now ONLINE`, data);
    console.log(`Client connected: ${client.id}`);
  } catch (err) {
    console.error("Error updating device status:", err);
  }
});

aedes.on("clientDisconnect", async (client) => {
  try {
    const deviceId = client.id;

    const { data, error } = await supabase
      .from("devices")
      .update({ status: false })
      .eq("id", deviceId)
      .select()
      .single();

    if (error) throw error;

    console.log(`✅ Device ${deviceId} is now OFFLINE`, data);
    console.log(`Client disconnected: ${client.id}`);
  } catch (err) {
    console.error("Error updating device status:", err);
  }
});

// เมื่อมี message เข้ามา
aedes.on("publish", async (packet, client) => {
  if (!client) return; // ignore broker publish

  try {
    const topicParts = packet.topic.split("/");
    if (topicParts[0] === "devices" && topicParts[2] === "data") {
      // devices/:deviceId/data
      const deviceId = topicParts[1];
      const payload = JSON.parse(packet.payload.toString());

      console.log(payload);

      const { temperature, humidity } = payload;

      const { data, error } = await supabase
        .from("device_data")
        .insert([{ device_id: deviceId, temperature, humidity }])
        .select()
        .single();

      if (error) throw error;
      console.log(`✅ Data saved to Supabase: device ${deviceId}`, data, "\n");
    }
  } catch (err) {
    console.error("Error saving MQTT data:", err.message, "\n");
  }
});

// สร้าง TCP server (MQTT port 1883)
const server = net.createServer(aedes.handle);
const PORT = process.env.MQTT_PORT || 1883;
server.listen(PORT, () =>
  console.log(`✅ MQTT Broker running on port ${PORT}`)
);
