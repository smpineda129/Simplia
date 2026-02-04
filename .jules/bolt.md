## 2024-05-23 - Unnecessary Effect Dependencies
**Learning:** `loadStats` was coupled to `search` and `page` in `CorrespondenceList`, causing full stats reload on every keystroke. Global stats should be in a separate `useEffect` dependent only on relevant scopes (like `companyId`).
**Action:** Always check `useEffect` dependencies to ensure we aren't re-fetching unrelated data.

## 2025-02-18 - [Missing FK Indexes]
**Learning:** Prisma schema lacks indexes on foreign keys (`companyId`), which are critical for multi-tenant filtering.
**Action:** Always check `schema.prisma` for missing indexes on frequently filtered foreign keys.
