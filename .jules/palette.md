## 2024-05-23 - Missing Accessible Names on Icon Buttons
**Learning:** Many interactive elements, especially `IconButton`s for actions like toggling password visibility, lack accessible names (`aria-label`). This makes them confusing to screen reader users who might just hear "button".
**Action:** Always ensure icon-only buttons have an `aria-label` describing the action (e.g., "Show password"), even if the visual icon seems obvious.
