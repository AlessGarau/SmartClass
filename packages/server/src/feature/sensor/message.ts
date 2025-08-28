export class SensorMessage {
  static readonly DAILY_DATA_SUCCESS = "Daily sensor data retrieved successfully";
  static readonly DAILY_DATA_NOT_FOUND = "No sensor data found for the specified room and date";
  static readonly INVALID_ROOM_ID = "Invalid room ID provided";
  static readonly INVALID_DATE_FORMAT = "Invalid date format. Expected YYYY-MM-DD";
}
