-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'EXPERT', 'ADMIN');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GOOGLE', 'NAVER', 'KAKAO');

-- CreateEnum
CREATE TYPE "ChallengeType" AS ENUM ('OFFICIAL', 'BLOG');

-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('DEADLINE', 'INPROGRESS', 'APPROVED', 'REJECTED', 'CANCELLED', 'PENDING', 'DELETED');

-- CreateEnum
CREATE TYPE "ChallengeField" AS ENUM ('NEXT', 'MODERN', 'API', 'WEB', 'CAREER');

-- CreateEnum
CREATE TYPE "NoticeType" AS ENUM ('CHALLENGE', 'APPROVAL', 'FEEDBACK', 'DEADLINE', 'ATTEND');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nick_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "provider" "Provider",
    "refresh_token" TEXT NOT NULL,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "challenge_id" TEXT NOT NULL,
    "challenge_no" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "ChallengeType" NOT NULL,
    "status" "ChallengeStatus" NOT NULL,
    "field" "ChallengeField" NOT NULL,
    "source" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "capacity" TEXT NOT NULL,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    "delete_reason" TEXT,
    "isClose" BOOLEAN NOT NULL DEFAULT false,
    "adminId" TEXT,
    "isReject" BOOLEAN NOT NULL DEFAULT false,
    "reject_content" TEXT,
    "isApprove" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("challenge_id")
);

-- CreateTable
CREATE TABLE "Attend" (
    "attend_id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT,
    "work_item" TEXT NOT NULL,
    "isSave" BOOLEAN NOT NULL DEFAULT false,
    "is_delete" BOOLEAN NOT NULL DEFAULT false,
    "delete_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attend_pkey" PRIMARY KEY ("attend_id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "feedback_id" TEXT NOT NULL,
    "attend_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("feedback_id")
);

-- CreateTable
CREATE TABLE "Like" (
    "like_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "attend_id" TEXT NOT NULL,
    "liker" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("like_id")
);

-- CreateTable
CREATE TABLE "Notice" (
    "notice_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "attend_id" TEXT,
    "type" "NoticeType" NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("notice_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_challenge_no_key" ON "Challenge"("challenge_no");

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attend" ADD CONSTRAINT "Attend_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attend" ADD CONSTRAINT "Attend_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge"("challenge_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_attend_id_fkey" FOREIGN KEY ("attend_id") REFERENCES "Attend"("attend_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_attend_id_fkey" FOREIGN KEY ("attend_id") REFERENCES "Attend"("attend_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_attend_id_fkey" FOREIGN KEY ("attend_id") REFERENCES "Attend"("attend_id") ON DELETE SET NULL ON UPDATE CASCADE;
