
interface RoomEnvironmentalData {
  room: {
    name: string;
    id: string;
    days: {
      [key: string]: DayData; // e.g. day1, day2, ..., day7
    };
  };
}

interface DayData {
  temperature: HourlyReadings;
  humidity: HourlyReadings;
  airPressure: HourlyReadings;
}

interface HourlyReadings {
  "09:00": number;
  "10:00": number;
  "11:00": number;
  "12:00": number;
  "13:00": number;
  "14:00": number;
  "15:00": number;
  "16:00": number;
  "17:00": number;
}