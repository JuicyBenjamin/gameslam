CREATE TABLE "users" (
	"id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"avatar_link" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;