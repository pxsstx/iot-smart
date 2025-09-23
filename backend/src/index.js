import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---------------- HTTP API ----------------

// สร้าง user ใหม่
app.post("/api/users", async (req, res) => {
  const { userId, displayName, pictureUrl } = req.body;
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([{ userId, displayName, pictureUrl }])
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// เพิ่มอุปกรณ์ให้ user
app.post("/api/users/:userId/devices", async (req, res) => {
  const { userId } = req.params;
  const { name } = req.body;

  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("userId", userId)
      .single();

    if (userError || !user) throw userError || new Error("User not found");

    const { data, error } = await supabase
      .from("devices")
      .insert([{ name, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ดึงอุปกรณ์ทั้งหมดของ user
app.get("/api/users/:userId/devices", async (req, res) => {
  const { userId } = req.params;
  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("userId", userId)
      .single();
    if (userError || !user) throw userError || new Error("User not found");

    const { data, error } = await supabase
      .from("devices")
      .select("*")
      .eq("user_id", user.id);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ดึงค่า sensor ล่าสุด
app.get("/api/devices/:deviceId/logs", async (req, res) => {
  const { deviceId } = req.params;

  try {
    const { data, error } = await supabase
      .from("device_data")
      .select("temperature, humidity, created_at")
      .eq("device_id", deviceId)
      .order("created_at", { ascending: false })
      .limit(20); // จำนวน log ล่าสุดที่ต้องการ

    if (error) throw error;

    const { data: deviceData, error: deviceError } = await supabase
      .from("devices")
      .select("name")
      .eq("id", deviceId)
      .single();

    if (deviceError) throw deviceError;

    const logs = data.map((row) => ({
      timestamp: row.created_at,
      temperature: row.temperature,
      humidity: row.humidity,
    }));

    res.json({
      device_id: deviceId,
      name: deviceData?.name,
      logs,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`✅ HTTP Server running on port ${port}`));
