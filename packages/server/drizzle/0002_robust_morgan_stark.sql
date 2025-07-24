CREATE TABLE "weather" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"temperature_min" integer NOT NULL,
	"temperature_max" integer NOT NULL,
	"condition" varchar(50) NOT NULL,
	"description" varchar(255),
	"humidity" integer,
	"wind_speed" numeric(5, 2),
	"fetched_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
