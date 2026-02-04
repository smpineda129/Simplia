# Palette's Journal

## 2024-05-21 - [Initial Entry]
**Learning:** Initializing the journal to track UX/Accessibility learnings.
**Action:** Will document critical insights from now on.

## 2024-05-21 - [Icon-Only Buttons & MUI Labels]
**Learning:** Material UI's `TextField` renders a label and a legend with the same text, which can cause `getByLabelText` to find multiple elements in tests. Also, icon-only buttons (like password toggle) are frequently missed a11y targets.
**Action:** Always add `aria-label` to `IconButton`. Use specific selectors or `getAllByLabelText` when testing MUI inputs.
