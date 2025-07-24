import { Service } from "typedi";
import mqtt from "mqtt";
import { SensorDataRepository } from "./SensorDataRepository";
import { MqttError } from "../middleware/error/mqttError";

export interface SensorTopicConfig {
  topic: string;
  sensorId: string;
  roomId: string;
  type: "temperature" | "humidity" | "pressure" | "movement";
}

interface MqttMessage {
  sink_id: string;
  source_address: number;
  sensor_id: number;
  tx_time_ms_epoch: number;
  data: any;
  event_id: number;
}

interface TemperatureData {
  temperature: number;
}

interface HumidityData {
  humidity: number;
}

interface MovementData {
  state: string;
  move_duration: number;
  move_number: number;
  x_axis: number;
  y_axis: number;
  z_axis: number;
}

interface PressureData {
  pressure: number;
}

@Service()
export class SensorDataCollector {
  private client: mqtt.MqttClient | null = null;
  private repository: SensorDataRepository;
  private interval?: NodeJS.Timeout;
  private sensorConfigs: SensorTopicConfig[];
  private latestData: Record<string, MqttMessage> = {};

  constructor(repository: SensorDataRepository) {
    this.repository = repository;
    this.sensorConfigs = [
      {
        topic: "pws-packet/202481598920718/641896457/127",
        sensorId: "c4ff9159-eced-4bd9-9f71-527b3bd44fa9",
        roomId: "c5a3a18c-69ac-4c24-b170-a47613d51435",
        type: "movement",
      },
      {
        topic: "pws-packet/202481598920718/641896457/114",
        sensorId: "c4ff9159-eced-4bd9-9f71-527b3bd44fa9",
        roomId: "c5a3a18c-69ac-4c24-b170-a47613d51435",
        type: "humidity",
      },
      {
        topic: "pws-packet/202481598920718/641896457/116",
        sensorId: "c4ff9159-eced-4bd9-9f71-527b3bd44fa9",
        roomId: "c5a3a18c-69ac-4c24-b170-a47613d51435",
        type: "pressure",
      },
      {
        topic: "pws-packet/202481598920718/641896457/112",
        sensorId: "c4ff9159-eced-4bd9-9f71-527b3bd44fa9",
        roomId: "c5a3a18c-69ac-4c24-b170-a47613d51435",
        type: "temperature",
      },
    ];
  }

  public async start(brokerUrl: string): Promise<void> {
    if (!brokerUrl || !brokerUrl.startsWith("mqtt://")) {
      throw MqttError.invalidBrokerUrl(brokerUrl);
    }

    return new Promise((resolve, reject) => {
      this.client = mqtt.connect(brokerUrl);

      this.client.on("connect", () => {
        console.log("Service de collecte de données MQTT connecté");
        
        this.sensorConfigs.forEach(config => {
          this.client!.subscribe(config.topic, (err) => {
            if (err) {
              MqttError.subscriptionFailed(config.topic, err);
            } else {
              console.log(`Abonné au topic ${config.topic} (${config.type})`);
            }
          });
        });

        this.startPeriodicCollection();
        resolve();
      });

      this.client.on("error", (err) => {
        reject(MqttError.connectionFailed(err));
      });

      this.client.on("message", (topic, message) => {
        try {
          const messageStr = message.toString();
          const parsedMessage: MqttMessage = JSON.parse(messageStr);
          this.latestData[topic] = parsedMessage;
          
          const sensorConfig = this.sensorConfigs.find(config => config.topic === topic);
          if (sensorConfig) {
            console.log(`Données ${sensorConfig.type} reçues:`, JSON.stringify(parsedMessage.data, null, 2));
          }
        } catch (error) {
          MqttError.messageParsingFailed(topic, error as Error);
        }
      });
    });
  }

  private startPeriodicCollection(): void {
    this.interval = setInterval(async () => {
      await this.collectAndSaveData();
    }, 30000);

    console.log("Collection périodique démarrée (toutes les 30 secondes)");
  }

  private async collectAndSaveData(): Promise<void> {
    let savedCount = 0;

    for (const config of this.sensorConfigs) {
      const mqttMessage = this.latestData[config.topic];
        
      if (mqttMessage) {
        const timestamp = new Date(mqttMessage.tx_time_ms_epoch);
          
        const sensorData = {
          room_id: config.roomId,
          sensor_id: config.sensorId,
          data: JSON.stringify(mqttMessage.data),
          saved_at: timestamp,
        };

        try {
          switch (config.type) {
          case "temperature":
            const tempData = mqttMessage.data as TemperatureData;
            console.log(`Température: ${tempData.temperature}°C`);
            const tempSensorData = {
              ...sensorData,
              data: tempData.temperature.toString(),
            };
            await this.repository.insertTemperature(tempSensorData);
            break;
          case "humidity":
            const humidityData = mqttMessage.data as HumidityData;
            console.log(`Humidité: ${humidityData.humidity}%`);
            const humiditySensorData = {
              ...sensorData,
              data: humidityData.humidity.toString(),
            };
            await this.repository.insertHumidity(humiditySensorData);
            break;
          case "pressure":
            const pressureData = mqttMessage.data as PressureData;
            console.log(`Pression: ${pressureData.pressure || "N/A"}`);
            const pressureSensorData = {
              ...sensorData,
              data: pressureData.pressure?.toString() || "N/A",
            };
            await this.repository.insertPressure(pressureSensorData);
            break;
          case "movement":
            const movementData = mqttMessage.data as MovementData;
            console.log(`Mouvement: ${movementData.state} (x:${movementData.x_axis}, y:${movementData.y_axis}, z:${movementData.z_axis})`);
            const movementSensorData = {
              ...sensorData,
              data: movementData.state,
            };
            await this.repository.insertMovement(movementSensorData);
            break;
          }
          savedCount++;
        } catch (error) {
          MqttError.dataInsertionFailed(config.type, error as Error);
        }
      }
    }

    if (savedCount > 0) {
      console.log(`${savedCount} données sauvegardées à ${new Date().toISOString()}`);
    } else {
      console.log("Aucune nouvelle donnée à sauvegarder");
    }
  }

  public stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }

    if (this.client) {
      this.client.end();
    }

    console.log("Service de collecte de données arrêté");
  }

  public getLatestData(): Record<string, MqttMessage> {
    return { ...this.latestData };
  }
} 