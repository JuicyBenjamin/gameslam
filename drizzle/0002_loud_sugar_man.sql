ALTER TABLE "artist_assets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "artists" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "assets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "debug" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "slam_comments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "slam_entries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "slam_entry_comments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "slam_entry_ratings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "slam_ratings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "slams" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "anon can read artist_assets" ON "artist_assets" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can read artist_assets" ON "artist_assets" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "anon can read artists" ON "artists" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can read artists" ON "artists" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "anon can read assets" ON "assets" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can read assets" ON "assets" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can insert own debug" ON "debug" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = user_id);--> statement-breakpoint
CREATE POLICY "anon can read slam comments" ON "slam_comments" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can read slam comments" ON "slam_comments" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can insert own slam comments" ON "slam_comments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = author_id);--> statement-breakpoint
CREATE POLICY "authenticated can update own slam comments" ON "slam_comments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = author_id);--> statement-breakpoint
CREATE POLICY "authenticated can delete own slam comments" ON "slam_comments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = author_id);--> statement-breakpoint
CREATE POLICY "anon can read entries" ON "slam_entries" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can read entries" ON "slam_entries" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can insert own entries" ON "slam_entries" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = user_id);--> statement-breakpoint
CREATE POLICY "authenticated can update own entries" ON "slam_entries" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = user_id);--> statement-breakpoint
CREATE POLICY "authenticated can delete own entries" ON "slam_entries" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = user_id);--> statement-breakpoint
CREATE POLICY "anon can read entry comments" ON "slam_entry_comments" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can read entry comments" ON "slam_entry_comments" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can insert own entry comments" ON "slam_entry_comments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = author_id);--> statement-breakpoint
CREATE POLICY "authenticated can update own entry comments" ON "slam_entry_comments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = author_id);--> statement-breakpoint
CREATE POLICY "authenticated can delete own entry comments" ON "slam_entry_comments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = author_id);--> statement-breakpoint
CREATE POLICY "anon can read entry ratings" ON "slam_entry_ratings" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can read entry ratings" ON "slam_entry_ratings" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can insert own entry ratings" ON "slam_entry_ratings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = author_id);--> statement-breakpoint
CREATE POLICY "authenticated can update own entry ratings" ON "slam_entry_ratings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = author_id);--> statement-breakpoint
CREATE POLICY "authenticated can delete own entry ratings" ON "slam_entry_ratings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = author_id);--> statement-breakpoint
CREATE POLICY "anon can read slam ratings" ON "slam_ratings" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can read slam ratings" ON "slam_ratings" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can insert own slam ratings" ON "slam_ratings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = author_id);--> statement-breakpoint
CREATE POLICY "authenticated can update own slam ratings" ON "slam_ratings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = author_id);--> statement-breakpoint
CREATE POLICY "authenticated can delete own slam ratings" ON "slam_ratings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = author_id);--> statement-breakpoint
CREATE POLICY "anon can read slams" ON "slams" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can read slams" ON "slams" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "anon can read users" ON "users" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can read users" ON "users" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can update own profile" ON "users" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = id);