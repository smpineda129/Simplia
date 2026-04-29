-- CreateTable
CREATE TABLE "retentions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "company_id" INTEGER NOT NULL,
    "area_id" INTEGER NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "date" DATE NOT NULL,
    "comments" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "retentions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retention_lines" (
    "id" SERIAL NOT NULL,
    "retention_id" INTEGER NOT NULL,
    "series" VARCHAR(255) NOT NULL,
    "subseries" VARCHAR(255) NOT NULL,
    "documents" TEXT,
    "code" VARCHAR(255) NOT NULL,
    "local_retention" INTEGER NOT NULL,
    "central_retention" INTEGER NOT NULL,
    "disposition_ct" BOOLEAN NOT NULL,
    "disposition_e" BOOLEAN NOT NULL,
    "disposition_m" BOOLEAN NOT NULL,
    "disposition_d" BOOLEAN NOT NULL,
    "disposition_s" BOOLEAN NOT NULL,
    "comments" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "retention_lines_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "retentions" ADD CONSTRAINT "retentions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retentions" ADD CONSTRAINT "retentions_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retention_lines" ADD CONSTRAINT "retention_lines_retention_id_fkey" FOREIGN KEY ("retention_id") REFERENCES "retentions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
