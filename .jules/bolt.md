## 2025-02-18 - [Missing FK Indexes]
**Learning:** Prisma schema lacks indexes on foreign keys (`companyId`), which are critical for multi-tenant filtering.
**Action:** Always check `schema.prisma` for missing indexes on frequently filtered foreign keys.
