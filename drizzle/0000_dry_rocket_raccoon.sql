-- CREATE TYPE "public"."user_role" AS ENUM('user', 'creator', 'admin');--> statement-breakpoint
CREATE TABLE "users" (
	"_id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"bio" varchar(255) DEFAULT 'I''m a new user!',
	"image" varchar(255) DEFAULT 'https://example.com/avatar.jpg',
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"isVerified" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
