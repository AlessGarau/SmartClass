import { database } from "./database";
import * as schema from "./schema";

async function main() {
  console.log("Seeding database...");
  
  // Clear existing data
  await database.delete(schema.reportingTable);
  await database.delete(schema.movementTable);
  await database.delete(schema.pressureTable);
  await database.delete(schema.temperatureTable);
  await database.delete(schema.humidityTable);
  await database.delete(schema.userLessonTable);
  await database.delete(schema.userMobileDeviceTable);
  await database.delete(schema.lessonTable);
  await database.delete(schema.equipmentTable);
  await database.delete(schema.sensorTable);
  await database.delete(schema.classTable);
  await database.delete(schema.userTable);
  await database.delete(schema.roomTable);

  // Seed rooms
  const rooms = await database.insert(schema.roomTable).values([
    { name: "Room 101", capacity: 25, is_enabled: true },
    { name: "Room 102", capacity: 30, is_enabled: true },
    { name: "Room 103", capacity: 28, is_enabled: false }, // Under maintenance
    { name: "Science Lab", capacity: 20, is_enabled: true },
    { name: "Computer Lab", capacity: 24, is_enabled: true },
    { name: "Library", capacity: 50, is_enabled: true },
    { name: "Auditorium", capacity: 100, is_enabled: true },
    { name: "Art Studio", capacity: 18, is_enabled: true },
  ]).returning();

  // Seed users (teachers and administrators)
  const users = await database.insert(schema.userTable).values([
    { email: "john.smith@school.edu", password: "$2b$10$hash1", role: "teacher", first_name: "John", last_name: "Smith" },
    { email: "mary.jones@school.edu", password: "$2b$10$hash2", role: "teacher", first_name: "Mary", last_name: "Jones" },
    { email: "david.wilson@school.edu", password: "$2b$10$hash3", role: "teacher", first_name: "David", last_name: "Wilson" },
    { email: "sarah.brown@school.edu", password: "$2b$10$hash4", role: "teacher", first_name: "Sarah", last_name: "Brown" },
    { email: "mike.davis@school.edu", password: "$2b$10$hash5", role: "teacher", first_name: "Mike", last_name: "Davis" },
    { email: "admin@school.edu", password: "$2b$10$hash6", role: "admin", first_name: "Admin", last_name: "User" },
    { email: "principal@school.edu", password: "$2b$10$hash7", role: "admin", first_name: "Principal", last_name: "Johnson" },
  ]).returning();

  // Seed classes
  const classes = await database.insert(schema.classTable).values([
    { name: "Mathematics", student_count: 28 },
    { name: "English Literature", student_count: 25 },
    { name: "Physics", student_count: 22 },
    { name: "Chemistry", student_count: 20 },
    { name: "History", student_count: 30 },
    { name: "Art", student_count: 18 },
    { name: "Computer Science", student_count: 24 },
    { name: "Biology", student_count: 26 },
  ]).returning();

  // Seed equipment (AC and heaters)
  const equipment = await database.insert(schema.equipmentTable).values([
    { type: "ac", is_functional: true, is_running: true, room_id: rooms[0].id },
    { type: "heater", is_functional: true, is_running: false, room_id: rooms[0].id },
    { type: "ac", is_functional: true, is_running: true, room_id: rooms[1].id },
    { type: "heater", is_functional: true, is_running: false, room_id: rooms[1].id },
    { type: "ac", is_functional: false, is_running: false, room_id: rooms[2].id }, // Broken AC
    { type: "heater", is_functional: true, is_running: false, room_id: rooms[2].id },
    { type: "ac", is_functional: true, is_running: true, room_id: rooms[3].id },
    { type: "heater", is_functional: true, is_running: false, room_id: rooms[3].id },
    { type: "ac", is_functional: true, is_running: true, room_id: rooms[4].id },
    { type: "heater", is_functional: true, is_running: false, room_id: rooms[4].id },
    { type: "ac", is_functional: true, is_running: false, room_id: rooms[5].id },
    { type: "heater", is_functional: true, is_running: false, room_id: rooms[5].id },
    { type: "ac", is_functional: true, is_running: true, room_id: rooms[6].id },
    { type: "heater", is_functional: true, is_running: false, room_id: rooms[6].id },
    { type: "ac", is_functional: true, is_running: false, room_id: rooms[7].id },
    { type: "heater", is_functional: false, is_running: false, room_id: rooms[7].id }, // Broken heater
  ]).returning();

  // Seed lessons
  const lessons = await database.insert(schema.lessonTable).values([
    { title: "Algebra Basics", start_time: new Date("2024-01-15T08:00:00"), end_time: new Date("2024-01-15T09:30:00"), class_id: classes[0].id, room_id: rooms[0].id },
    { title: "Shakespeare Analysis", start_time: new Date("2024-01-15T10:00:00"), end_time: new Date("2024-01-15T11:30:00"), class_id: classes[1].id, room_id: rooms[1].id },
    { title: "Newton's Laws", start_time: new Date("2024-01-15T13:00:00"), end_time: new Date("2024-01-15T14:30:00"), class_id: classes[2].id, room_id: rooms[3].id },
    { title: "Chemical Reactions", start_time: new Date("2024-01-15T14:45:00"), end_time: new Date("2024-01-15T16:15:00"), class_id: classes[3].id, room_id: rooms[3].id },
    { title: "World War II", start_time: new Date("2024-01-16T08:00:00"), end_time: new Date("2024-01-16T09:30:00"), class_id: classes[4].id, room_id: rooms[0].id },
    { title: "Watercolor Techniques", start_time: new Date("2024-01-16T10:00:00"), end_time: new Date("2024-01-16T11:30:00"), class_id: classes[5].id, room_id: rooms[7].id },
    { title: "Python Programming", start_time: new Date("2024-01-16T13:00:00"), end_time: new Date("2024-01-16T14:30:00"), class_id: classes[6].id, room_id: rooms[4].id },
    { title: "Cell Biology", start_time: new Date("2024-01-16T14:45:00"), end_time: new Date("2024-01-16T16:15:00"), class_id: classes[7].id, room_id: rooms[3].id },
  ]).returning();

  // Seed sensors
  const sensors = await database.insert(schema.sensorTable).values([
    { room_id: rooms[0].id, physical_id: "TEMP_001" },
    { room_id: rooms[0].id, physical_id: "HUM_001" },
    { room_id: rooms[0].id, physical_id: "PRESS_001" },
    { room_id: rooms[0].id, physical_id: "MOV_001" },
    { room_id: rooms[1].id, physical_id: "TEMP_002" },
    { room_id: rooms[1].id, physical_id: "HUM_002" },
    { room_id: rooms[1].id, physical_id: "PRESS_002" },
    { room_id: rooms[1].id, physical_id: "MOV_002" },
    { room_id: rooms[3].id, physical_id: "TEMP_003" },
    { room_id: rooms[3].id, physical_id: "HUM_003" },
    { room_id: rooms[4].id, physical_id: "TEMP_004" },
    { room_id: rooms[4].id, physical_id: "HUM_004" },
    { room_id: rooms[6].id, physical_id: "TEMP_005" },
    { room_id: rooms[6].id, physical_id: "HUM_005" },
    { room_id: rooms[6].id, physical_id: "MOV_005" },
  ]).returning();

  // Seed temperature data
  const temperatures = await database.insert(schema.temperatureTable).values([
    { room_id: rooms[0].id, data: "22.5", sensor_id: sensors[0].id },
    { room_id: rooms[0].id, data: "23.1", sensor_id: sensors[0].id },
    { room_id: rooms[1].id, data: "21.8", sensor_id: sensors[4].id },
    { room_id: rooms[1].id, data: "22.2", sensor_id: sensors[4].id },
    { room_id: rooms[3].id, data: "24.0", sensor_id: sensors[8].id },
    { room_id: rooms[4].id, data: "20.5", sensor_id: sensors[10].id },
    { room_id: rooms[6].id, data: "19.8", sensor_id: sensors[12].id },
  ]).returning();

  // Seed humidity data
  const humidities = await database.insert(schema.humidityTable).values([
    { room_id: rooms[0].id, data: "45.2", sensor_id: sensors[1].id },
    { room_id: rooms[0].id, data: "46.8", sensor_id: sensors[1].id },
    { room_id: rooms[1].id, data: "42.1", sensor_id: sensors[5].id },
    { room_id: rooms[1].id, data: "43.5", sensor_id: sensors[5].id },
    { room_id: rooms[3].id, data: "48.9", sensor_id: sensors[9].id },
    { room_id: rooms[4].id, data: "41.3", sensor_id: sensors[11].id },
    { room_id: rooms[6].id, data: "44.7", sensor_id: sensors[13].id },
  ]).returning();

  // Seed pressure data
  const pressures = await database.insert(schema.pressureTable).values([
    { id: 1, room_id: rooms[0].id, data: "1013.25", sensor_id: sensors[2].id },
    { id: 2, room_id: rooms[0].id, data: "1013.50", sensor_id: sensors[2].id },
    { id: 3, room_id: rooms[1].id, data: "1012.80", sensor_id: sensors[6].id },
    { id: 4, room_id: rooms[1].id, data: "1013.10", sensor_id: sensors[6].id },
  ]).returning();

  // Seed movement data
  const movements = await database.insert(schema.movementTable).values([
    { id: 1, room_id: rooms[0].id, data: "detected", sensor_id: sensors[3].id },
    { id: 2, room_id: rooms[0].id, data: "no_movement", sensor_id: sensors[3].id },
    { id: 3, room_id: rooms[1].id, data: "detected", sensor_id: sensors[7].id },
    { id: 4, room_id: rooms[1].id, data: "detected", sensor_id: sensors[7].id },
    { id: 5, room_id: rooms[6].id, data: "no_movement", sensor_id: sensors[14].id },
  ]).returning();

  // Seed user-lesson relationships (teachers assigned to lessons)
  const userLessons = await database.insert(schema.userLessonTable).values([
    { user_id: users[0].id, lesson_id: lessons[0].id }, // John Smith - Algebra
    { user_id: users[1].id, lesson_id: lessons[1].id }, // Mary Jones - Shakespeare
    { user_id: users[2].id, lesson_id: lessons[2].id }, // David Wilson - Physics
    { user_id: users[3].id, lesson_id: lessons[3].id }, // Sarah Brown - Chemistry
    { user_id: users[4].id, lesson_id: lessons[4].id }, // Mike Davis - History
    { user_id: users[1].id, lesson_id: lessons[5].id }, // Mary Jones - Art
    { user_id: users[2].id, lesson_id: lessons[6].id }, // David Wilson - Programming
    { user_id: users[3].id, lesson_id: lessons[7].id }, // Sarah Brown - Biology
  ]).returning();

  // Seed user mobile devices
  const userMobileDevices = await database.insert(schema.userMobileDeviceTable).values([
    { user_id: users[0].id, device_token: "token_john_123", refresh_token: "refresh_john_123" },
    { user_id: users[1].id, device_token: "token_mary_456", refresh_token: "refresh_mary_456" },
    { user_id: users[2].id, device_token: "token_david_789", refresh_token: "refresh_david_789" },
    { user_id: users[3].id, device_token: "token_sarah_012", refresh_token: "refresh_sarah_012" },
    { user_id: users[5].id, device_token: "token_admin_345", refresh_token: "refresh_admin_345" },
  ]).returning();

  // Seed reporting data
  const reports = await database.insert(schema.reportingTable).values([
    { equipment_id: equipment[4].id, description: "AC unit not cooling properly", status: "pending" },
    { equipment_id: equipment[15].id, description: "Heater making unusual noise", status: "pending" },
    { equipment_id: equipment[0].id, description: "AC maintenance completed", status: "resolved" },
    { equipment_id: equipment[2].id, description: "Regular maintenance check", status: "resolved" },
    { equipment_id: equipment[6].id, description: "Temperature not reaching set point", status: "open" },
  ]).returning();

  console.log("Database seeded successfully!");
  console.log(`- ${rooms.length} rooms created`);
  console.log(`- ${users.length} users created`);
  console.log(`- ${classes.length} classes created`);
  console.log(`- ${equipment.length} equipment items created`);
  console.log(`- ${lessons.length} lessons created`);
  console.log(`- ${sensors.length} sensors created`);
  console.log(`- ${temperatures.length} temperature readings created`);
  console.log(`- ${humidities.length} humidity readings created`);
  console.log(`- ${pressures.length} pressure readings created`);
  console.log(`- ${movements.length} movement detections created`);
  console.log(`- ${userLessons.length} user-lesson relationships created`);
  console.log(`- ${userMobileDevices.length} mobile devices registered`);
  console.log(`- ${reports.length} equipment reports created`);
  
  process.exit(0);
}

main().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});