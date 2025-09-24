"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLiffContext } from "@/components/liff-provider";
import { Monitor, Activity, Trash2, Eye, Plus, Copy } from "lucide-react";
import { AddDeviceDialog } from "@/components/add-device-dialog";

interface Device {
  id: string;
  name: string;
  status: boolean;
  userId: string;
}

interface DeviceListProps {
  onViewLogs?: (deviceId: string) => void;
}

export function DeviceList({ onViewLogs }: DeviceListProps) {
  const { profile, getAccessToken } = useLiffContext();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchDevices();
    }
  }, [profile]);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:4000/api/users/${profile?.userId}/devices`
      );

      console.log(response);
      if (response.ok) {
        const data = await response.json();
        // Backend returns an array from GET /api/users/:userId/devices
        setDevices(Array.isArray(data) ? data : data.devices || []);
      }
    } catch (error) {
      console.error("Failed to fetch devices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm("Are you sure you want to delete this device?")) return;

    try {
      const response = await fetch(
        `http://localhost:4000/api/devices/${deviceId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setDevices(devices.filter((device) => device.id !== deviceId));
      }
    } catch (error) {
      console.error("Failed to delete device:", error);
    }
  };

  const handleAddDevice = async (deviceData: { name: string }) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/users/${profile?.userId}/devices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deviceData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Backend returns the inserted row directly
        const created = data?.id ? data : data?.device;
        setDevices([...devices, created].filter(Boolean) as Device[]);
        setShowAddDialog(false);
      }
    } catch (error) {
      console.error("Failed to add device:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Copied:", text);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Your Devices</h2>
        <div className="flex items-center space-x-4">
          <Badge
            variant="secondary"
            className="h-9 px-4 py-2 has-[>svg]:px-3 text-sm text-gray-600"
          >
            {devices.length} devices
          </Badge>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <Card key={device.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Monitor className="mr-2 h-5 w-5 text-gray-600" />
                  {device.name || ""}
                </CardTitle>
                <Badge
                  className={
                    device.status
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {device.status ? "Online" : "Offline"}
                </Badge>
              </div>
              <CardDescription>
                <div className="flex gap-x-4 justify-center items-center">
                  <p className=" text-gray-400 truncate">{device.id}</p>
                  <Copy
                    className="hover:text-gray-800 w-5 h-5"
                    onClick={() => copyToClipboard(device.id)}
                  />
                </div>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => onViewLogs?.(device.id)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View Logs
                  </Button>
                  <Button size="sm" variant="outline">
                    <Activity className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteDevice(device.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {devices.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Monitor className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No devices found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first device.
            </p>
            <Button onClick={() => setShowAddDialog(true)}>Add Device</Button>
          </CardContent>
        </Card>
      )}

      <AddDeviceDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddDevice={handleAddDevice}
      />
    </div>
  );
}
