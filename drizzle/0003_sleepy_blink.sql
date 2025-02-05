CREATE TABLE "slam_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slam_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"link_to_entry" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "slam_entries" ADD CONSTRAINT "slam_entries_slam_id_slams_id_fk" FOREIGN KEY ("slam_id") REFERENCES "public"."slams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slam_entries" ADD CONSTRAINT "slam_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;