ALTER TABLE "equipment" DROP CONSTRAINT "equipment_room_id_room_id_fk";
--> statement-breakpoint
ALTER TABLE "humidity" DROP CONSTRAINT "humidity_room_id_room_id_fk";
--> statement-breakpoint
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_class_id_class_id_fk";
--> statement-breakpoint
ALTER TABLE "movement" DROP CONSTRAINT "movement_room_id_room_id_fk";
--> statement-breakpoint
ALTER TABLE "movement" DROP CONSTRAINT "movement_sensor_id_sensor_id_fk";
--> statement-breakpoint
ALTER TABLE "pressure" DROP CONSTRAINT "pressure_room_id_room_id_fk";
--> statement-breakpoint
ALTER TABLE "pressure" DROP CONSTRAINT "pressure_sensor_id_sensor_id_fk";
--> statement-breakpoint
ALTER TABLE "sensor" DROP CONSTRAINT "sensor_room_id_room_id_fk";
--> statement-breakpoint
ALTER TABLE "temperature" DROP CONSTRAINT "temperature_room_id_room_id_fk";
--> statement-breakpoint
ALTER TABLE "temperature" DROP CONSTRAINT "temperature_sensor_id_sensor_id_fk";
--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "humidity" ADD CONSTRAINT "humidity_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_class_id_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movement" ADD CONSTRAINT "movement_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movement" ADD CONSTRAINT "movement_sensor_id_sensor_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pressure" ADD CONSTRAINT "pressure_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pressure" ADD CONSTRAINT "pressure_sensor_id_sensor_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensor" ADD CONSTRAINT "sensor_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temperature" ADD CONSTRAINT "temperature_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temperature" ADD CONSTRAINT "temperature_sensor_id_sensor_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensor"("id") ON DELETE cascade ON UPDATE no action;