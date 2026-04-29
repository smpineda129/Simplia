-- CreateTable
CREATE TABLE "proceedings" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "company_id" INTEGER NOT NULL,
    "retention_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "company_one" VARCHAR(255),
    "company_two" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "proceedings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "proceedings" ADD CONSTRAINT "proceedings_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proceedings" ADD CONSTRAINT "proceedings_retention_id_fkey" FOREIGN KEY ("retention_id") REFERENCES "retentions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
