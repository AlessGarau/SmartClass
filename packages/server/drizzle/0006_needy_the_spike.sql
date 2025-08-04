ALTER TABLE "humidity" DROP CONSTRAINT "humidity_sensor_id_sensor_id_fk";
--> statement-breakpoint
ALTER TABLE "humidity" ADD CONSTRAINT "humidity_sensor_id_sensor_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensor"("id") ON DELETE cascade ON UPDATE no action;