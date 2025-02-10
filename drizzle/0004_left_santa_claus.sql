CREATE TABLE "slam_entry_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_comment_id" uuid,
	"author_id" uuid NOT NULL,
	"slam_entry_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"comment" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "slam_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_comment_id" uuid,
	"author_id" uuid NOT NULL,
	"slam_entry_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"comment" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "slam_entry_comments" ADD CONSTRAINT "slam_entry_comments_parent_comment_id_slam_entry_comments_id_fk" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."slam_entry_comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slam_entry_comments" ADD CONSTRAINT "slam_entry_comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slam_entry_comments" ADD CONSTRAINT "slam_entry_comments_slam_entry_id_slam_entries_id_fk" FOREIGN KEY ("slam_entry_id") REFERENCES "public"."slam_entries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slam_comments" ADD CONSTRAINT "slam_comments_parent_comment_id_slam_comments_id_fk" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."slam_comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slam_comments" ADD CONSTRAINT "slam_comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slam_comments" ADD CONSTRAINT "slam_comments_slam_entry_id_slam_entries_id_fk" FOREIGN KEY ("slam_entry_id") REFERENCES "public"."slam_entries"("id") ON DELETE no action ON UPDATE no action;