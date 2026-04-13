# 🏛️ Noble Architecture: Primary UI/UX Constitution

> **WARNING:** This document outlines the absolute design and structural laws for the Noble Architecture Enterprise Platform. Any deviation from these rules at the PR level or during component architecture will be immediately rejected.

---

## 1. Typography Laws

The platform strictly mandates a dual-typography system. No other external font families or imports may be used under any circumstance.

- **English/Latin Typeface**: `Geist Sans`
- **Arabic/RTL Typeface**: `IBM Plex Sans Arabic`
- **Code/Monospace**: `Geist Mono`

**Rule Limits**: Browser defaults (`system-ui`, `Arial`) are only fallback safeties. The rendering pipeline must be built on Geist and IBM Plex Arabic exclusively.

---

## 2. The Color Arsenal & Prohibition

Hardcoded Hex, RGB, or standard Tailwind colors (e.g., `text-red-500`, `bg-blue-600`) are **strictly prohibited** in component creation. All UI elements must route through the `app.css` semantic design tokens.

### Authorized Variables:

- **Backgrounds**: `bg-background`, `bg-card`, `bg-popover`, `bg-sidebar-background`
- **Text/Line art**: `text-foreground`, `text-muted-foreground`, `border-border`
- **Primary Actions (God Buttons)**: `bg-primary text-primary-foreground`
- **Destructive/Critical**: `bg-destructive text-destructive-foreground`
- **Vercel Magic Tokens**: `var(--geist-cyan)`, `var(--geist-purple)`, `var(--geist-pink)` (Only for accent lines or progress indicators).

---

## 3. Structural Classes & Shading

All Data wrappers, stats cards, and widget panels must utilize global classes. **Never rebuild border or shadow logic inline.**

**Mandatory Wrapper Classes**:

- `.vercel-card`: Standard component wrapper. Applies rigid borders and subtle hover drop-shadows.
- `.premium-card`: Executive wrapper for KPI metrics. Integrates Glassmorphism naturally.

**Radius Rule**:

- All component corner radiuses must dynamically link to `rounded-lg`, `rounded-md`, or `rounded-sm`. Hardcoding `rounded-3xl` or `rounded-full` outside of avatars is banned.

---

## 4. The Glassmorphism Decree

The Dark mode aesthetic relies heavily on structured multi-layered blurring.
When building overlays (Modals, Dialogs, Sidebars):

- The layer background must be `bg-background/80` or `bg-card/50`.
- It MUST be paired with `backdrop-blur-md` or `backdrop-blur-xl`.
- Solid blacks without backdrop filtering are banned on elevated surfaces to ensure the "Mission Command" aesthetic holds true.

---

## 5. Right-to-Left (RTL) Enforcement

To support global localization flawlessly:

- Never use physical directions (`ml-4`, `pr-2`, `left-0`).
- **You MUST use Logical Properties**: `ms-4` (margin-start), `pe-2` (padding-end), `start-0`, `end-0`.
- Any component submitted with `pl-` or `mr-` will automatically fail visual QA.

_By the decree of Dion ONE Platform engineering. Execute flawlessly._
