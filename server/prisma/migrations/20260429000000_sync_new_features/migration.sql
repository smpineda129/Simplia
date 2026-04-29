-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_RESPONSE', 'RESOLVED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('PQRS', 'TECHNICAL_SUPPORT', 'BILLING', 'FEATURE_REQUEST', 'BUG_REPORT', 'OTHER');

-- AlterTable
ALTER TABLE "action_events" ADD COLUMN     "company_id" BIGINT,
ADD COLUMN     "ip_address" VARCHAR(45),
ADD COLUMN     "user_agent" TEXT;

-- AlterTable
ALTER TABLE "correspondence_document" ADD COLUMN     "folder_id" BIGINT;

-- AlterTable
ALTER TABLE "correspondence_threads" ADD COLUMN     "tagged_users" JSON;

-- AlterTable
ALTER TABLE "correspondences" ADD COLUMN     "attachments" JSON,
ADD COLUMN     "content" TEXT,
ADD COLUMN     "destination_area_id" BIGINT,
ADD COLUMN     "origin_area_id" BIGINT,
ADD COLUMN     "priority" TEXT DEFAULT 'medium',
ADD COLUMN     "received_at" TIMESTAMP(6),
ADD COLUMN     "recipient_id" BIGINT,
ADD COLUMN     "sender_id" BIGINT,
ADD COLUMN     "tracking_number" VARCHAR(255),
ADD COLUMN     "type" VARCHAR(255) NOT NULL DEFAULT 'general';

-- AlterTable
ALTER TABLE "document_proceeding" ADD COLUMN     "folder_id" BIGINT;

-- AlterTable
ALTER TABLE "external_users" ADD COLUMN     "otp_code" VARCHAR(255),
ADD COLUMN     "otp_expires_at" TIMESTAMP(0);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT;

-- AlterTable
ALTER TABLE "warehouses" ADD COLUMN     "address" VARCHAR(500);

-- CreateTable
CREATE TABLE "proceeding_folders" (
    "id" BIGSERIAL NOT NULL,
    "proceeding_id" BIGINT NOT NULL,
    "name" VARCHAR(191) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "proceeding_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audits" (
    "id" BIGSERIAL NOT NULL,
    "user_type" VARCHAR(255),
    "user_id" BIGINT,
    "event" VARCHAR(255) NOT NULL,
    "auditable_type" VARCHAR(255) NOT NULL,
    "auditable_id" BIGINT NOT NULL,
    "old_values" TEXT,
    "new_values" TEXT,
    "url" TEXT,
    "ip_address" INET,
    "user_agent" VARCHAR(1023),
    "tags" VARCHAR(255),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" VARCHAR(255) NOT NULL,
    "user_id" BIGINT,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "payload" TEXT NOT NULL,
    "last_activity" INTEGER NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "email" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0),

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "correspondence_folders" (
    "id" BIGSERIAL NOT NULL,
    "correspondence_id" BIGINT NOT NULL,
    "name" VARCHAR(191) NOT NULL,
    "s3_prefix" VARCHAR(500),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "correspondence_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" BIGSERIAL NOT NULL,
    "ticket_number" VARCHAR(20) NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TicketType" NOT NULL,
    "module" VARCHAR(100),
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "user_id" BIGINT,
    "company_id" BIGINT,
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "contact_name" VARCHAR(191),
    "contact_email" VARCHAR(191),
    "contact_phone" VARCHAR(40),
    "assigned_to_id" BIGINT,
    "image_url" VARCHAR(500),
    "resolved_at" TIMESTAMP(0),
    "closed_at" TIMESTAMP(0),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_comments" (
    "id" BIGSERIAL NOT NULL,
    "ticket_id" BIGINT NOT NULL,
    "user_id" BIGINT,
    "comment" TEXT NOT NULL,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "attachment_url" VARCHAR(500),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "ticket_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_history" (
    "id" BIGSERIAL NOT NULL,
    "ticket_id" BIGINT NOT NULL,
    "user_id" BIGINT,
    "action" VARCHAR(100) NOT NULL,
    "field" VARCHAR(50),
    "old_value" TEXT,
    "new_value" TEXT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "electronic_signatures" (
    "id" BIGSERIAL NOT NULL,
    "correspondence_id" BIGINT NOT NULL,
    "thread_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "signer_name" VARCHAR(255) NOT NULL,
    "signer_email" VARCHAR(255) NOT NULL,
    "document_hash" VARCHAR(64) NOT NULL,
    "signature_token" VARCHAR(36) NOT NULL,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "metadata" JSON,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "electronic_signatures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audits_auditable_type_auditable_id_index" ON "audits"("auditable_type", "auditable_id");

-- CreateIndex
CREATE INDEX "audits_user_id_user_type_index" ON "audits"("user_id", "user_type");

-- CreateIndex
CREATE INDEX "sessions_last_activity_index" ON "sessions"("last_activity");

-- CreateIndex
CREATE INDEX "sessions_user_id_index" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "support_tickets_ticket_number_key" ON "support_tickets"("ticket_number");

-- CreateIndex
CREATE INDEX "support_tickets_user_id_idx" ON "support_tickets"("user_id");

-- CreateIndex
CREATE INDEX "support_tickets_company_id_idx" ON "support_tickets"("company_id");

-- CreateIndex
CREATE INDEX "support_tickets_assigned_to_id_idx" ON "support_tickets"("assigned_to_id");

-- CreateIndex
CREATE INDEX "support_tickets_status_idx" ON "support_tickets"("status");

-- CreateIndex
CREATE INDEX "support_tickets_priority_idx" ON "support_tickets"("priority");

-- CreateIndex
CREATE INDEX "support_tickets_created_at_idx" ON "support_tickets"("created_at");

-- CreateIndex
CREATE INDEX "ticket_comments_ticket_id_idx" ON "ticket_comments"("ticket_id");

-- CreateIndex
CREATE INDEX "ticket_comments_user_id_idx" ON "ticket_comments"("user_id");

-- CreateIndex
CREATE INDEX "ticket_history_ticket_id_idx" ON "ticket_history"("ticket_id");

-- CreateIndex
CREATE INDEX "ticket_history_user_id_idx" ON "ticket_history"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "electronic_signatures_thread_id_key" ON "electronic_signatures"("thread_id");

-- CreateIndex
CREATE UNIQUE INDEX "electronic_signatures_signature_token_key" ON "electronic_signatures"("signature_token");

-- CreateIndex
CREATE INDEX "electronic_signatures_correspondence_id_idx" ON "electronic_signatures"("correspondence_id");

-- CreateIndex
CREATE INDEX "electronic_signatures_user_id_idx" ON "electronic_signatures"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "correspondences_tracking_number_key" ON "correspondences"("tracking_number");

-- AddForeignKey
ALTER TABLE "correspondences" ADD CONSTRAINT "fk_correspondences_destination" FOREIGN KEY ("destination_area_id") REFERENCES "areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "correspondences" ADD CONSTRAINT "fk_correspondences_origin" FOREIGN KEY ("origin_area_id") REFERENCES "areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "correspondences" ADD CONSTRAINT "fk_correspondences_recipient" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "correspondences" ADD CONSTRAINT "fk_correspondences_sender" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "document_proceeding" ADD CONSTRAINT "document_proceeding_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "proceeding_folders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proceeding_folders" ADD CONSTRAINT "proceeding_folders_proceeding_id_fkey" FOREIGN KEY ("proceeding_id") REFERENCES "proceedings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "correspondence_document" ADD CONSTRAINT "correspondence_document_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "correspondence_folders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "correspondence_folders" ADD CONSTRAINT "correspondence_folders_correspondence_id_fkey" FOREIGN KEY ("correspondence_id") REFERENCES "correspondences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_comments" ADD CONSTRAINT "ticket_comments_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_comments" ADD CONSTRAINT "ticket_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_history" ADD CONSTRAINT "ticket_history_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_history" ADD CONSTRAINT "ticket_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "electronic_signatures" ADD CONSTRAINT "electronic_signatures_correspondence_id_fkey" FOREIGN KEY ("correspondence_id") REFERENCES "correspondences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "electronic_signatures" ADD CONSTRAINT "electronic_signatures_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "correspondence_threads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

