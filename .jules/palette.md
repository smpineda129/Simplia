# Palette's Journal

## 2024-05-21 - [Initial Entry]
**Learning:** Initializing the journal to track UX/Accessibility learnings.
**Action:** Will document critical insights from now on.

## 2024-05-21 - [Icon-Only Buttons & MUI Labels]
**Learning:** Material UI's `TextField` renders a label and a legend with the same text, which can cause `getByLabelText` to find multiple elements in tests. Also, icon-only buttons (like password toggle) are frequently missed a11y targets.
**Action:** Always add `aria-label` to `IconButton`. Use specific selectors or `getAllByLabelText` when testing MUI inputs.

## 2024-05-23 - Missing Accessible Names on Icon Buttons
**Learning:** Many interactive elements, especially `IconButton`s for actions like toggling password visibility, lack accessible names (`aria-label`). This makes them confusing to screen reader users who might just hear "button".
**Action:** Always ensure icon-only buttons have an `aria-label` describing the action (e.g., "Show password"), even if the visual icon seems obvious.

## 2024-05-24 - [Loading States & Skeletons]
**Learning:** Text-only loading states (like "Cargando...") are jarring and shift layout. `TableSkeleton` exists in the codebase but wasn't consistently used in `UserTable`.
**Action:** Replace text loading indicators with `Skeleton` components (like `TableSkeleton`) to preserve layout and improve perceived performance.
