import mqtt from "mqtt";
class MqttClient {
  private client: mqtt.MqttClient;
  private latestData: Record<string, string> = {};

  constructor(brokerUrl: string, defaultTopic: string = "pws-packet/#") {
    this.client = mqtt.connect(brokerUrl);
    this.client.on("connect", () => {
      console.log("Connecté à MQTT");
      this.client.subscribe(defaultTopic);
    });
    this.client.on("message", async (topic: any, message: any) => {
      console.log(`Reçu sur ${topic} : ${message}`);
      this.latestData[topic] = message.toString();
    });
  }

  public getLatestData(topic: string): string | undefined {
    return this.latestData[topic];
  }

  public subscribe(topic: string) {
    this.client.subscribe(topic);
  }
}

export default MqttClient;
