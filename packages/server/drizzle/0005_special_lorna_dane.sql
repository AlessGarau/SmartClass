ALTER TABLE "reporting" DROP CONSTRAINT "reporting_equipment_id_equipment_id_fk";
--> statement-breakpoint
ALTER TABLE "user_lesson" DROP CONSTRAINT "user_lesson_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_lesson" DROP CONSTRAINT "user_lesson_lesson_id_lesson_id_fk";
--> statement-breakpoint
ALTER TABLE "reporting" ADD CONSTRAINT "reporting_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_lesson" ADD CONSTRAINT "user_lesson_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_lesson" ADD CONSTRAINT "user_lesson_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;