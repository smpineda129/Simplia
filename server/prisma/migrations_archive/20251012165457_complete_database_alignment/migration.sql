/*
  Warnings:

  - You are about to drop the column `retention_id` on the `proceedings` table. All the data in the column will be lost.
  - Added the required column `retention_line_id` to the `proceedings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "proceedings" DROP CONSTRAINT "proceedings_retention_id_fkey";

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "document_date" DATE,
ADD COLUMN     "file_pages" INTEGER,
ADD COLUMN     "medium" VARCHAR(100),
ADD COLUMN     "meta" JSONB,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "text_meta" TEXT,
ADD COLUMN     "text_meta_extract" TEXT,
ALTER COLUMN "file_size" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "entities" ADD COLUMN     "identification" VARCHAR(255);

-- AlterTable
ALTER TABLE "proceedings" DROP COLUMN "retention_id",
ADD COLUMN     "end_date" DATE,
ADD COLUMN     "loan" VARCHAR(255),
ADD COLUMN     "retention_line_id" INTEGER NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "document_proceeding" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "proceeding_id" INTEGER NOT NULL,
    "consecutive" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "document_proceeding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entity_proceeding" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "proceeding_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "entity_proceeding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "box_proceeding" (
    "id" SERIAL NOT NULL,
    "box_id" INTEGER NOT NULL,
    "proceeding_id" INTEGER NOT NULL,
    "folder" VARCHAR(255),
    "book" VARCHAR(255),
    "other" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "box_proceeding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proceeding_threads" (
    "id" SERIAL NOT NULL,
    "proceeding_id" INTEGER NOT NULL,
    "from_id" INTEGER NOT NULL,
    "assigned_id" INTEGER NOT NULL,
    "reason" TEXT,
    "address" VARCHAR(255),
    "name" VARCHAR(255),
    "document" VARCHAR(255),
    "signed" TEXT,
    "warehouse_signed" TEXT,
    "is_finished" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "proceeding_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "dni" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "state" VARCHAR(100),
    "city" VARCHAR(100),
    "address" TEXT,
    "company_id" INTEGER NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "remember_token" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "external_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_user_proceeding" (
    "id" SERIAL NOT NULL,
    "external_user_id" INTEGER NOT NULL,
    "proceeding_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "external_user_proceeding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forms" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "fields" JSONB NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "ends_at" TIMESTAMP(6),
    "emails" JSONB,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" SERIAL NOT NULL,
    "form_id" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_textracts" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "jobId" VARCHAR(255) NOT NULL,
    "finished_at" TIMESTAMP(6),
    "result" TEXT,
    "plain" TEXT,
    "pages" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "document_textracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sent_emails" (
    "id" SERIAL NOT NULL,
    "hash" CHAR(32) NOT NULL,
    "headers" TEXT,
    "subject" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "opens" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "message_id" VARCHAR(255),
    "meta" TEXT,
    "recipient_email" VARCHAR(255) NOT NULL,
    "recipient_name" VARCHAR(255),
    "sender_email" VARCHAR(255) NOT NULL,
    "sender_name" VARCHAR(255),
    "clicked_at" TIMESTAMP(6),
    "opened_at" TIMESTAMP(6),
    "correspondence_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "sent_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sent_emails_url_clicked" (
    "id" SERIAL NOT NULL,
    "sent_email_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "hash" CHAR(32) NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "sent_emails_url_clicked_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_users_email_key" ON "external_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "forms_uuid_key" ON "forms"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "sent_emails_hash_key" ON "sent_emails"("hash");

-- AddForeignKey
ALTER TABLE "proceedings" ADD CONSTRAINT "proceedings_retention_line_id_fkey" FOREIGN KEY ("retention_line_id") REFERENCES "retention_lines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_proceeding" ADD CONSTRAINT "document_proceeding_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_proceeding" ADD CONSTRAINT "document_proceeding_proceeding_id_fkey" FOREIGN KEY ("proceeding_id") REFERENCES "proceedings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_proceeding" ADD CONSTRAINT "entity_proceeding_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_proceeding" ADD CONSTRAINT "entity_proceeding_proceeding_id_fkey" FOREIGN KEY ("proceeding_id") REFERENCES "proceedings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "box_proceeding" ADD CONSTRAINT "box_proceeding_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "boxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "box_proceeding" ADD CONSTRAINT "box_proceeding_proceeding_id_fkey" FOREIGN KEY ("proceeding_id") REFERENCES "proceedings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proceeding_threads" ADD CONSTRAINT "proceeding_threads_proceeding_id_fkey" FOREIGN KEY ("proceeding_id") REFERENCES "proceedings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proceeding_threads" ADD CONSTRAINT "proceeding_threads_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proceeding_threads" ADD CONSTRAINT "proceeding_threads_assigned_id_fkey" FOREIGN KEY ("assigned_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_users" ADD CONSTRAINT "external_users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_user_proceeding" ADD CONSTRAINT "external_user_proceeding_external_user_id_fkey" FOREIGN KEY ("external_user_id") REFERENCES "external_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_user_proceeding" ADD CONSTRAINT "external_user_proceeding_proceeding_id_fkey" FOREIGN KEY ("proceeding_id") REFERENCES "proceedings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_textracts" ADD CONSTRAINT "document_textracts_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sent_emails" ADD CONSTRAINT "sent_emails_correspondence_id_fkey" FOREIGN KEY ("correspondence_id") REFERENCES "correspondences"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sent_emails_url_clicked" ADD CONSTRAINT "sent_emails_url_clicked_sent_email_id_fkey" FOREIGN KEY ("sent_email_id") REFERENCES "sent_emails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
