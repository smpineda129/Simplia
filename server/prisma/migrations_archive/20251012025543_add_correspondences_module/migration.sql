-- CreateTable
CREATE TABLE "correspondences" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "company_id" INTEGER NOT NULL,
    "correspondence_type_id" INTEGER NOT NULL,
    "recipient_type" VARCHAR(50) NOT NULL,
    "recipient_name" VARCHAR(255) NOT NULL,
    "recipient_email" VARCHAR(255) NOT NULL,
    "advisor_code" VARCHAR(255),
    "assigned_user_id" INTEGER,
    "created_by_user_id" INTEGER NOT NULL,
    "comments" TEXT,
    "incoming_radicado" VARCHAR(255) NOT NULL,
    "outgoing_radicado" VARCHAR(255),
    "status" VARCHAR(50) NOT NULL DEFAULT 'registered',
    "closed_at" TIMESTAMP(6),
    "delivered_physically" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "correspondences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "correspondence_threads" (
    "id" SERIAL NOT NULL,
    "correspondence_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "correspondence_threads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "correspondences_incoming_radicado_key" ON "correspondences"("incoming_radicado");

-- CreateIndex
CREATE UNIQUE INDEX "correspondences_outgoing_radicado_key" ON "correspondences"("outgoing_radicado");

-- AddForeignKey
ALTER TABLE "correspondences" ADD CONSTRAINT "correspondences_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correspondences" ADD CONSTRAINT "correspondences_correspondence_type_id_fkey" FOREIGN KEY ("correspondence_type_id") REFERENCES "correspondence_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correspondences" ADD CONSTRAINT "correspondences_assigned_user_id_fkey" FOREIGN KEY ("assigned_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correspondences" ADD CONSTRAINT "correspondences_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correspondence_threads" ADD CONSTRAINT "correspondence_threads_correspondence_id_fkey" FOREIGN KEY ("correspondence_id") REFERENCES "correspondences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correspondence_threads" ADD CONSTRAINT "correspondence_threads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
