"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplet, Info, Thermometer } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DeviceLogEntry {
  timestamp: string;
  temperature: number;
  humidity: number;
}

interface Device {
  id: string;
  name: string;
  type: string;
  logs: DeviceLogEntry[];
}

export function DeviceLogs({ deviceId }: { deviceId?: string }) {
  const [device, setDevice] = useState<Device | null>(null);
  const [logs, setLogs] = useState<DeviceLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deviceId) return;

    async function fetchLogs() {
      try {
        const response = await fetch(
          `http://localhost:4000/api/devices/${deviceId}/logs`
        );
        if (!response.ok) throw new Error("Failed to fetch device logs");

        const data = await response.json();

        setLogs(data.logs || []);
        setDevice({
          id: data.device_id,
          name: data.name || "Unknown Device",
          type: data.type || "Unknown Type",
          logs: data.logs || [],
        });
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [deviceId]);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {device ? `${device.name}` : "Loading device..."}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : logs.length === 0 ? (
            <div className="text-center py-8">
              <Info className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-600">No logs found for this device.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Latest Log */}
              <div className="border-l-4 border-green-200 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 flex flex-col  gap-5">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">
                        Latest
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(logs[0].timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex gap-5">
                      <div className="flex gap-x-5">
                        <Thermometer /> {logs[0].temperature} °C
                      </div>
                      <div>|</div>
                      <div className="flex gap-x-5">
                        <Droplet /> {logs[0].humidity} %
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graph */}
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={logs.slice().reverse()} // reverse ให้เวลาเก่า→ใหม่
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(tick) =>
                        new Date(tick).toLocaleTimeString()
                      }
                    />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      labelFormatter={(label) =>
                        new Date(label).toLocaleString()
                      }
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperature"
                      stroke="#ff7300"
                      name="Temperature (°C)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="humidity"
                      stroke="#387908"
                      name="Humidity (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
