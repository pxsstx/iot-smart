#include <ESP8266WiFi.h>
#include <PubSubClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

const char* mqtt_server = "YOUR_MQTT_BROKER_IP"; // ip เครืิ่อง
const int mqtt_port = 1883;

const char* deviceId = "deviceId";  // ใช้ใน topic

WiFiClient espClient;
PubSubClient client(espClient);

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
    // ไม่มี user/pass
    if (client.connect(deviceId)) {
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
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  randomSeed(micros());
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Random data
  float temp = random(2000, 3500) / 100.0;
  float hum  = random(4000, 7000) / 100.0;

  char payload[64];
  snprintf(payload, sizeof(payload), "{\"temperature\": %.2f, \"humidity\": %.2f}", temp, hum);

  Serial.print("Publishing payload: ");
  Serial.println(payload);

  char topic[64];
  snprintf(topic, sizeof(topic), "devices/%s/data", deviceId);
  client.publish(topic, payload);

  delay(5000);
}