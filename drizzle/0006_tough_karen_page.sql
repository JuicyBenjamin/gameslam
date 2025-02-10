ALTER TABLE "debug" DROP CONSTRAINT "debug_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "slam_comments" DROP CONSTRAINT "slam_comments_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "slam_entries" DROP CONSTRAINT "slam_entries_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "slam_entry_comments" DROP CONSTRAINT "slam_entry_comments_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "slam_entry_ratings" DROP CONSTRAINT "slam_entry_ratings_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "slam_ratings" DROP CONSTRAINT "slam_ratings_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "slams" DROP CONSTRAINT "slams_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "debug" ADD CONSTRAINT "debug_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slam_comments" ADD CONSTRAINT "slam_comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slam_entries" ADD CONSTRAINT "slam_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slam_entry_comments" ADD CONSTRAINT "slam_entry_comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slam_entry_ratings" ADD CONSTRAINT "slam_entry_ratings_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slam_ratings" ADD CONSTRAINT "slam_ratings_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slams" ADD CONSTRAINT "slams_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;