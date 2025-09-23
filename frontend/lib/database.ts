// Simple in-memory database for demo purposes
// In production, replace with actual database

interface Device {
  id: string
  name: string
  type: string
  status: "online" | "offline" | "maintenance"
  lastSeen: string
  userId: string
  createdAt: string
}

interface DeviceLog {
  id: string
  deviceId: string
  timestamp: string
  level: "info" | "warning" | "error"
  message: string
  data?: any
}

// In-memory storage (replace with actual database)
const devices: Device[] = [
  {
    id: "1",
    name: "Smart Thermostat",
    type: "IoT Device",
    status: "online",
    lastSeen: new Date().toISOString(),
    userId: "demo-user",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2",
    name: "Security Camera",
    type: "Camera",
    status: "offline",
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
    userId: "demo-user",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
]

const deviceLogs: DeviceLog[] = [
  {
    id: "1",
    deviceId: "1",
    timestamp: new Date().toISOString(),
    level: "info",
    message: "Temperature updated",
    data: { temperature: 22.5, humidity: 45 },
  },
  {
    id: "2",
    deviceId: "1",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    level: "warning",
    message: "High humidity detected",
    data: { humidity: 85 },
  },
  {
    id: "3",
    deviceId: "2",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    level: "error",
    message: "Connection lost",
    data: { reason: "Network timeout" },
  },
]

export class Database {
  static getDevicesByUserId(userId: string): Device[] {
    return devices.filter((device) => device.userId === userId)
  }

  static getDeviceById(deviceId: string): Device | null {
    return devices.find((device) => device.id === deviceId) || null
  }

  static addDevice(device: Omit<Device, "id" | "createdAt">): Device {
    const newDevice: Device = {
      ...device,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    }
    devices.push(newDevice)
    return newDevice
  }

  static updateDevice(deviceId: string, updates: Partial<Device>): Device | null {
    const index = devices.findIndex((device) => device.id === deviceId)
    if (index === -1) return null

    devices[index] = { ...devices[index], ...updates }
    return devices[index]
  }

  static deleteDevice(deviceId: string): boolean {
    const index = devices.findIndex((device) => device.id === deviceId)
    if (index === -1) return false

    devices.splice(index, 1)
    return true
  }

  static getDeviceLogs(deviceId: string, limit = 50): DeviceLog[] {
    return deviceLogs
      .filter((log) => log.deviceId === deviceId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  static addDeviceLog(log: Omit<DeviceLog, "id">): DeviceLog {
    const newLog: DeviceLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
    }
    deviceLogs.push(newLog)
    return newLog
  }
}
