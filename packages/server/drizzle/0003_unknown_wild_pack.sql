ALTER TABLE "room" ADD COLUMN "building" varchar(50) DEFAULT 'batA' NOT NULL;--> statement-breakpoint
ALTER TABLE "room" ADD COLUMN "floor" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "room" ADD CONSTRAINT "floor_check" CHECK ("room"."floor" >= 0);