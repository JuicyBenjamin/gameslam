CREATE TABLE "slam_entry_ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"slam_entry_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_recommended" boolean NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"content" text NOT NULL,
	CONSTRAINT "slam_entry_ratings_author_id_slam_entry_id_unique" UNIQUE("author_id","slam_entry_id")
);
--> statement-breakpoint
CREATE TABLE "slam_ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"slam_entry_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_recommended" boolean NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "slams" ALTER COLUMN "artist_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "slams" ALTER COLUMN "asset_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "slam_entry_ratings" ADD CONSTRAINT "slam_entry_ratings_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slam_entry_ratings" ADD CONSTRAINT "slam_entry_ratings_slam_entry_id_slam_entries_id_fk" FOREIGN KEY ("slam_entry_id") REFERENCES "public"."slam_entries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slam_ratings" ADD CONSTRAINT "slam_ratings_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slam_ratings" ADD CONSTRAINT "slam_ratings_slam_entry_id_slam_entries_id_fk" FOREIGN KEY ("slam_entry_id") REFERENCES "public"."slam_entries"("id") ON DELETE no action ON UPDATE no action;