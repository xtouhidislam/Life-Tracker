# LifeQuest — Design System & Visual Specification

## 1. Visual Philosophy: The "Command Center" Identity

**LifeQuest** is visually engineered as a **premium dark productivity command center with subtle RPG progression**. It delivers an executive, modern dashboard feel—strictly avoiding childish cartoon aesthetics while keeping gamification visceral, satisfying, and responsive.

### Key Visual Pillars
* **Deep Graphite Foundation**: Deep obsidian and charcoal surfaces layered with subtle glassmorphic blurs (`backdrop-filter: blur(16px)`).
* **Luminous Accents**: High-contrast, vibrant neon highlights (electric violet, emerald mint, cyan, and amber gold) used purposefully to guide attention and celebrate progress.
* **Tactile Micro-Interactions**: Fluid, spring-physics animations (via Motion for React) that make completing tasks, routines, and habits feel deeply rewarding.
* **Accessibility First**: WCAG 2.1 AA compliant color contrast ratios, clear visual focus outlines, scalable typography, and native respect for `prefers-reduced-motion`.

---

## 2. Color System & Design Tokens

All colors are exposed as CSS custom properties and mapped directly to Tailwind utility classes.

### 2.1 Surface & Neutral Tokens
| Token | Hex Value | Purpose |
| :--- | :--- | :--- |
| `--bg-base` | `#08090D` | Deepest root background canvas |
| `--bg-subtle` | `#0F1117` | Secondary page sections & sidebar |
| `--bg-surface` | `#161922` | Cards, modals, and panel surfaces |
| `--bg-surface-glass` | `rgba(22, 25, 34, 0.72)` | Glassmorphic floating surfaces |
| `--border-subtle` | `rgba(255, 255, 255, 0.07)` | Standard card and separator borders |
| `--border-strong` | `rgba(255, 255, 255, 0.16)` | Hovered and interactive borders |

### 2.2 Text & Typography Tokens
| Token | Hex Value | Purpose |
| :--- | :--- | :--- |
| `--text-primary` | `#F8FAFC` | Primary headings, values, and titles |
| `--text-secondary` | `#94A3B8` | Subheadings, descriptions, and labels |
| `--text-muted` | `#64748B` | Timestamps, placeholders, and inactive icons |
| `--text-inverse` | `#08090D` | High-contrast text on bright button fills |

### 2.3 Brand & Semantic Accent Tokens
| Accent Domain | Primary Hex | Glow / Alpha Hex | Semantic Usage |
| :--- | :--- | :--- | :--- |
| **Electric Violet** | `#6366F1` | `rgba(99, 102, 241, 0.35)` | Primary brand, major action buttons, XP progress |
| **Emerald Mint** | `#10B981` | `rgba(16, 185, 129, 0.35)` | Habits completed, positive metrics, savings goals |
| **Cyan Horizon** | `#06B6D4` | `rgba(6, 182, 212, 0.35)` | Focus mode, calendar events, deep work sessions |
| **Amber Flame** | `#F59E0B` | `rgba(245, 158, 11, 0.35)` | Streaks, level badges, milestone rewards |
| **Rose Alert** | `#F43F5E` | `rgba(244, 63, 94, 0.35)` | High priority, overdue tasks, expense limits |

---

## 3. Typography Scale

LifeQuest leverages clean, modern geometric sans-serif typography (`Plus Jakarta Sans` or `Inter` paired with tabular figures for numbers).

```css
/* Typography Scale Hierarchy */
--font-display: 2.25rem;  /* 36px - Bold 700 - Hero Headers, Level-up numerals */
--font-h1:      1.75rem;  /* 28px - SemiBold 600 - Section titles */
--font-h2:      1.375rem; /* 22px - SemiBold 600 - Card titles */
--font-h3:      1.125rem; /* 18px - Medium 500 - Modal headers, module tabs */
--font-body:    0.9375rem;/* 15px - Regular 400 - Task titles, descriptions */
--font-small:   0.8125rem;/* 13px - Regular 400 / Medium 500 - Badges, labels */
--font-micro:   0.6875rem;/* 11px - Medium 500 - Tooltips, XP tags, metadata */
```

---

## 4. Spacing, Elevation & Corner Radii

* **Corner Radii (`border-radius`)**:
  * Cards & Containers: `rounded-2xl` (16px – 20px).
  * Buttons & Dropdowns: `rounded-xl` (10px – 12px).
  * Badges & Pills: `rounded-full` (9999px).
* **Elevation & Box Shadows**:
  * `shadow-glass`: `0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)`
  * `shadow-glow-violet`: `0 0 24px rgba(99, 102, 241, 0.28)`
  * `shadow-glow-amber`: `0 0 20px rgba(245, 158, 11, 0.25)`

---

## 5. Component Specifications

### 5.1 Command Center Cards
* **Visual Structure**: 
  * Background: `--bg-surface-glass` with `backdrop-blur-md`.
  * Border: 1px solid `--border-subtle`, smoothly transitioning to `--border-strong` on `:hover`.
  * Padding: Responsive (16px mobile, 24px desktop).

### 5.2 Action Buttons
* **Primary (Electric Violet)**: Luminous violet gradient (`from-indigo-500 to-indigo-600`), white crisp text, subtle glow on hover, micro-scale down on `:active` (`scale(0.98)`).
* **Secondary / Surface**: Transparent surface with 1px border, lightens on hover.
* **Destructive**: Rose-tinted subtle background with crimson text.
* **XP Pill**: Luminous pill displaying `+10 XP` with amber/violet icon.

### 5.3 Progress Indicators
* **Circular Progress Ring (SVG)**:
  * Used in `/today` hero.
  * Dual-layer SVG: subtle background track (`rgba(255, 255, 255, 0.08)`), animated foreground stroke with gradient coloring (`#6366F1` to `#10B981`) and smooth stroke-dashoffset transition.
* **Linear Level Bar**:
  * Track with rounded pill corners, glowing fill, with dynamic numeric label (`Level 12 • 2,840 / 3,000 XP (78%)`).

### 5.4 Checkbox & Completion Micro-Interaction
1. Clicking a task or routine checkbox immediately triggers an animated spring scale (`scale(1.2)` -> `scale(1.0)`).
2. The checkmark draws in via SVG path animation.
3. A subtle 6-particle glow burst radiates outward and dissipates over 450ms.
4. Floating text (`+10 XP`) drifts upwards 24px while fading out.
5. The task card smoothly dims opacity to 0.65 with text strikethrough.

### 5.5 Level-Up Modal Overlay
* Triggered when cumulative XP crosses the leveling threshold.
* Ambient dark backdrop blur (`backdrop-blur-xl`).
* Central glowing emblem radiating golden particles.
* Text: `"LEVEL UP!"` in bold display typography, announcing the newly unlocked tier and stat bonuses.
* Confirm button: `"Claim Rewards & Continue"`.

---

## 6. Layout & Responsive Structure

### 6.1 Desktop Layout (> 1024px)
```text
┌─────────────────┬────────────────────────────────────────────────────────┐
│  LIFEQUEST      │ Top Bar: Search | Streak Pill | Level Pill | Avatar   │
│                 ├────────────────────────────────────────────────────────┤
│  🏠 Today       │ Main Content Container (max-w-[1500px] mx-auto)        │
│  📊 Overview    │                                                        │
│  ✅ Tasks       │ [ Hero Metric ] [ Daily Completion Ring ] [ Quick Stats]│
│  📅 Calendar    │                                                        │
│  🔥 Habits      │ [ Today's Feed ]                 [ Roadmap Snapshot ]  │
│  🌅 Routine     │                                  [ Expense Preview ]   │
│  🗺️ Roadmap     │                                                        │
│  🎯 Focus       │                                                        │
│  💰 Expenses    │                                                        │
│  ─────────────  │                                                        │
│  ⚙️ Settings    │                                                        │
│  Level 12 (78%) │                                                        │
└─────────────────┴────────────────────────────────────────────────────────┘
```
* **Sidebar**: Fixed left navigation (260px wide, collapsible to 80px icon mode).
* **Top Bar**: 64px height, sticky, glassmorphic backdrop.
* **Content Canvas**: Responsive grid up to 1500px width with 32px padding.

### 6.2 Mobile Layout (< 768px)
* **Top Navigation Header**: 56px sticky header with branding, active streak badge, and avatar profile launcher.
* **Content Canvas**: Single column stack with horizontal swipeable card carousels for metrics.
* **Bottom Navigation Bar**: 64px sticky bottom bar with primary tabs (Today, Tasks, Habits, Focus, More) and illuminated indicator under the active tab.
* **Creation Flows**: Slide-up bottom sheets with drag-to-dismiss handles.
