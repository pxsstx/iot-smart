## IoT Smart Monorepo

This repo contains:

- backend: Node.js MQTT bridge/server
- frontend: Next.js dashboard
- esp: Arduino/ESP sketches

### Structure

```
/backend
/frontend
/esp
```

### Requirements

- Node.js 18+
- pnpm (or npm)
- MQTT broker (e.g., Mosquitto)
- Arduino IDE or PlatformIO for ESP

### Install

```bash
git clone <repo-url> iot-smart
cd iot-smart
pnpm i --filter ./backend --filter ./frontend
# or install separately with npm in each folder
```

### Env Vars

Create env files:

Backend: backend/.env

```
MQTT_URL=mqtt://localhost:1883
MQTT_USERNAME=
MQTT_PASSWORD=
PORT=3001
```

Frontend: frontend/.env.local

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_LIFF_ID=
```

### Run

Backend

```bash
cd backend
pnpm dev
```

Frontend

```bash
cd frontend
pnpm dev
```

Open http://localhost:3000

### MQTT Topics (example)

- devices/<deviceId>/telemetry
- devices/<deviceId>/command

### ESP Sketches

- esp/random-data.ino
- esp/with-sensor.ino

### Scripts

Backend

- pnpm dev
- pnpm test

Frontend

- pnpm dev
- pnpm build
- pnpm start

### License

MIT
