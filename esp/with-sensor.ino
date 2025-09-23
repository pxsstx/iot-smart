#include <ESP8266WiFi.h>          // สำหรับ ESP32
#include <PubSubClient.h>  // MQTT client
#include <DHT.h>

#define DHTPIN 4           // GPIO ของ DHT22
#define DHTTYPE DHT22

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

const char* mqtt_server = "YOUR_MQTT_BROKER_IP_OR_DOMAIN";
const int mqtt_port = 1883;
const char* mqtt_user = "YOUR_MQTT_USER";   // ถ้ามี
const char* mqtt_pass = "YOUR_MQTT_PASSWORD"; // ถ้ามี

const char* deviceId = "deviceId";  // ชื่อ device ใช้ใน topic

WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to WiFi ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(deviceId, mqtt_user, mqtt_pass)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  if (isnan(temp) || isnan(hum)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // ทำให้มี 2 decimal point
  char payload[64];
  snprintf(payload, sizeof(payload), "{\"temperature\": %.2f, \"humidity\": %.2f}", temp, hum);

  Serial.print("Publishing payload: ");
  Serial.println(payload);

  // ส่งข้อมูลไป topic: devices/:deviceId/data
  char topic[64];
  snprintf(topic, sizeof(topic), "devices/%s/data", deviceId);
  client.publish(topic, payload);

  delay(5000); // ส่งทุก 5 วินาที
}