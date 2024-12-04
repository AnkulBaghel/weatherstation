#if defined(ESP32)
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <DHT.h>

#define DHTPIN D2
#define DHTTYPE DHT11
#define RAIN_SENSOR_PIN A0 // Analog pin for rain sensor
#define WIFI_SSID "Aditya-Desk"
#define WIFI_PASSWORD "12312345"
#define API_KEY "AIzaSyBVAzen_KeAByye43Hg12RrisCV0KO26N0"
#define DATABASE_URL "https://weather-station-92c86-default-rtdb.asia-southeast1.firebasedatabase.app"
#define USER_EMAIL "ankulbaghel098@gmail.com"
#define USER_PASSWORD "weatherstation123"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);
  pinMode(D3, OUTPUT); // RED LED 
  pinMode(D1, OUTPUT); // WIFI LED
  
  Serial.println("Connecting to Wi-Fi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(D1, HIGH);
    Serial.print(".");
    delay(300);
    digitalWrite(D1, LOW);
  }
  
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());

  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.token_status_callback = tokenStatusCallback; 
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Serial.println("Setup complete.");
}

void loop() {
  String databasePath = "/DHT";  
  digitalWrite(D3, LOW);
  
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int rainValue = analogRead(RAIN_SENSOR_PIN); // Read rain sensor value

  Serial.println("Temperature: " + String(temperature) + "°C");
  Serial.println("Humidity: " + String(humidity) + "%");
  Serial.println("Rain Value: " + String(rainValue));

  if (!isnan(temperature) && !isnan(humidity)) {
    FirebaseJson json;
    json.set("temperature", temperature);
    json.set("humidity", humidity);
    json.set("rainValue", rainValue); // Add rain sensor data to Firebase

    digitalWrite(LED_BUILTIN, LOW);
    delay(100);

    Serial.print("Updating data to Firebase... ");
    if (Firebase.RTDB.setJSON(&fbdo, databasePath.c_str(), &json)) {
      Serial.println("Data updated successfully.");
      digitalWrite(LED_BUILTIN, HIGH);
    } else {
      Serial.println(fbdo.errorReason());
      digitalWrite(D3, HIGH);
    }
  } else {
    Serial.println("Failed to read DHT data.");
    digitalWrite(D3, HIGH);
  }

  delay(5000); // Adjust delay based on your requirements
}
