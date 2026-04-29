-- CreateTable
CREATE TABLE "correspondence_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "company_id" INTEGER NOT NULL,
    "description" VARCHAR(255),
    "expiration" INTEGER,
    "area_id" INTEGER,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "correspondence_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "correspondence_types" ADD CONSTRAINT "correspondence_types_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correspondence_types" ADD CONSTRAINT "correspondence_types_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
