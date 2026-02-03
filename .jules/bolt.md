## 2024-05-23 - Unnecessary Effect Dependencies
**Learning:** `loadStats` was coupled to `search` and `page` in `CorrespondenceList`, causing full stats reload on every keystroke. Global stats should be in a separate `useEffect` dependent only on relevant scopes (like `companyId`).
**Action:** Always check `useEffect` dependencies to ensure we aren't re-fetching unrelated data.
