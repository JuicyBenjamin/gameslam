-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "idToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist_asset" (
    "artistId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "artist_asset_pkey" PRIMARY KEY ("artistId","assetId")
);

-- CreateTable
CREATE TABLE "artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "debug" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "debug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slam_comment" (
    "id" TEXT NOT NULL,
    "parentCommentId" TEXT,
    "authorId" TEXT NOT NULL,
    "slamEntryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT NOT NULL,

    CONSTRAINT "slam_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slam_entry_comment" (
    "id" TEXT NOT NULL,
    "parentCommentId" TEXT,
    "authorId" TEXT NOT NULL,
    "slamEntryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT NOT NULL,

    CONSTRAINT "slam_entry_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slam_entry_rating" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "slamEntryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRecommended" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,

    CONSTRAINT "slam_entry_rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slam_entry" (
    "id" TEXT NOT NULL,
    "slamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "linkToEntry" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "slam_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slam_rating" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "slamEntryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRecommended" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,

    CONSTRAINT "slam_rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "slam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artist_asset_artistId_assetId_key" ON "artist_asset"("artistId", "assetId");

-- CreateIndex
CREATE UNIQUE INDEX "artist_name_key" ON "artist"("name");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "slam_entry_rating_authorId_slamEntryId_key" ON "slam_entry_rating"("authorId", "slamEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "user_name_key" ON "user"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_asset" ADD CONSTRAINT "artist_asset_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_asset" ADD CONSTRAINT "artist_asset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debug" ADD CONSTRAINT "debug_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slam_comment" ADD CONSTRAINT "slam_comment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "slam_comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slam_comment" ADD CONSTRAINT "slam_comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slam_comment" ADD CONSTRAINT "slam_comment_slamEntryId_fkey" FOREIGN KEY ("slamEntryId") REFERENCES "slam_entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slam_entry_comment" ADD CONSTRAINT "slam_entry_comment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "slam_entry_comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slam_entry_comment" ADD CONSTRAINT "slam_entry_comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slam_entry_comment" ADD CONSTRAINT "slam_entry_comment_slamEntryId_fkey" FOREIGN KEY ("slamEntryId") REFERENCES "slam_entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slam_entry_rating" ADD CONSTRAINT "slam_entry_rating_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slam_entry_rating" ADD CONSTRAINT "slam_entry_rating_slamEntryId_fkey" FOREIGN KEY ("slamEntryId") REFERENCES "slam_entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slam_entry" ADD CONSTRAINT "slam_entry_slamId_fkey" FOREIGN KEY ("slamId") REFERENCES "slam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slam_entry" ADD CONSTRAINT "slam_entry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slam_rating" ADD CONSTRAINT "slam_rating_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slam_rating" ADD CONSTRAINT "slam_rating_slamEntryId_fkey" FOREIGN KEY ("slamEntryId") REFERENCES "slam_entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slam" ADD CONSTRAINT "slam_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slam" ADD CONSTRAINT "slam_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slam" ADD CONSTRAINT "slam_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
