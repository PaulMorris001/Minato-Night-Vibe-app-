# Handoff: NightVibe Vendor Screens

## Overview
A redesigned vendor side of NightVibe — three connected screens:
1. **Dashboard** — overview of earnings, services, bookings, rating
2. **My Services** — manage the services the vendor offers
3. **Account** — vendor profile + settings (verification, payouts, business info, location, contact, socials)

Replaces the previous flat/sparse vendor UI with the same editorial treatment the consumer side of the app already uses: earnings hero with sparkline, glassy stat cards, full-bleed service posters, business-card profile, gradient CTAs. Same dark + neon-purple palette and `Bricolage Grotesque` / `Inter` type pairing as the rest of the app.

## About the design files
The files in this bundle are **design references created in HTML** — high-fidelity prototypes showing the intended look and behavior. They are **not** production code to copy directly. The task is to **recreate these designs in the target codebase's existing environment** (React Native / Expo, SwiftUI, Flutter — whatever NightVibe is built in) using its established components, theming, navigation, and vendor API.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, gradients and interactions are locked. Hex values, type ramp, and spacings below are exact. Don't lift the prototype's inline-styled `<div>`s wholesale; rebuild with your codebase's primitives.

The vendor-side already has a top header showing the `NightVibe` wordmark + green `Vendor` pill + avatar. The redesign keeps that header pattern (purple pill now, matching brand) and the existing bottom tab bar (Dashboard / Services / Bookings / Chats / Account).

---

## Shared chrome

### Top header (every screen)
`padding: 4px 18px 12px`, flex space-between, align-center.

- **Left** (flex, gap 10, align-center):
  - **Wordmark** "NightVibe" — Bricolage Grotesque **900, 22px, letter-spacing -0.03em**, gradient text fill `linear-gradient(100deg, #C084FC 0%, #EC4899 100%)`.
  - **Vendor pill** — `display: inline-flex; padding: 4px 9px; border-radius: 999; background: rgba(168,85,247,0.16); border: 1px solid rgba(192,132,252,0.35); color: #C084FC`. Briefcase SVG (10×10, stroke 2.4) + `"VENDOR"` (Inter **10.5/800, letter-spacing 0.08em**, uppercase).
- **Right** (flex, gap 8, align-center):
  - **Notifications** — 34×34 round glassy button, bell SVG (14×14, stroke 2). When unread, a 7×7 pink dot pops at top-right with `box-shadow: 0 0 0 2px #0B0613`.
  - **Avatar** — 34×34 circle, background = the vendor's `avatarCover` (gradient fallback) or actual image, border `1.5px solid rgba(255,255,255,0.14)`.

### Bottom tab bar
Same pattern as the rest of the app. `padding-top: 10; padding-bottom: 26`. Top fade `linear-gradient(to top, rgba(11,6,19,0.98) 40%, rgba(11,6,19,0))`. `border-top: 1px solid rgba(255,255,255,0.08)`.

Tabs (in order): **Dashboard, Services, Bookings, Chats, Account**. Active color `#A855F7` weight 700; inactive `rgba(244,238,255,0.38)` weight 500. The `Account` icon is filled when active, outline otherwise. The `Bookings` and `Chats` tabs are out of scope for this handoff but the tab bar still includes them.

---

## Screen 1 — Dashboard

**Purpose:** Give the vendor a glanceable snapshot of how their business is doing and quick access to add/manage services.

**Decoration:** soft aurora glow behind the header — `position: absolute; top: -120; left: 50%; transform: translateX(-50%); width: 480; height: 320; border-radius: 50%; background: radial-gradient(circle, rgba(168,85,247,0.3), transparent 70%); filter: blur(50px); pointer-events: none`.

### Greeting
`padding: 0 18px 18px`.
- Kicker — Inter 12/500, color `rgba(244,238,255,0.62)`, letter-spacing 0.01em. Content: `"Good evening"` (or morning/afternoon based on local time).
- Headline — Bricolage Grotesque **900, 30px, letter-spacing -0.035em, line-height 1.05**, color `#F4EEFF`. Content: `"Welcome back, {firstName}"`. The first name gets the **gradient text fill** `linear-gradient(100deg, #C084FC 0%, #EC4899 100%)`.

### Earnings hero card
`padding: 0 18px 14px`. The card:
- `position: relative; border-radius: 20; overflow: hidden; padding: 16px 18px 18px`.
- `background: linear-gradient(140deg, #1A1030 0%, #2A1654 55%, #4B1A6E 100%)`.
- `border: 1px solid rgba(255,255,255,0.14)`.
- `box-shadow: 0 24px 60px -20px rgba(124,58,237,0.55)`.

**Decoration layers** (`position: absolute`, behind content):
1. Pink blob — `right: -60; top: -60; width: 220; height: 220; border-radius: 50%; background: radial-gradient(circle, rgba(236,72,153,0.55), transparent 70%)`.
2. Cyan blob — `left: -40; bottom: -60; width: 200; height: 200; border-radius: 50%; background: radial-gradient(circle, rgba(34,211,238,0.3), transparent 70%)`.
3. Faint white grid — `inset: 0; opacity: 0.06; background-image: linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px); background-size: 24px 24px`.

**Inside the card** (all `position: relative; z-index: 1`):

- **Top row** (flex space-between, align-start):
  - **Kicker** — Inter 10/700, uppercase, letter-spacing 0.14em, color `rgba(255,255,255,0.7)`. Content: `"EARNINGS · THIS MONTH"`.
  - **Trend chip** — display inline-flex align-center gap 4, padding 3×8, radius 999. Bg `rgba(52,211,153,0.18)`, border `1px solid rgba(52,211,153,0.35)`, color `#6EE7B7`. Inter 10/700, letter-spacing 0.04em. Up-chevron icon (10×10, stroke 3) + `"{pct}%"`. When negative: swap to pink palette (`rgba(236,72,153,0.18)` / `#FBCFE8`) and flip the chevron down.
- **Amount** — Bricolage Grotesque **900, 44px, letter-spacing -0.04em, line-height 1**, color `#fff`, `margin-top: 6`. Whole dollars only at full size; `.00` cents in 22px/700 at `rgba(255,255,255,0.6)`.
- **Delta line** — Inter 12/500, color `rgba(255,255,255,0.75)`, `margin-top: 6`. Content: `"+${delta} vs. last month"`.
- **Sparkline** — `margin-top: 14`, flex align-end gap 3, height 28. 12 bars, each `flex: 1` of variable height. The last ~3 bars use `linear-gradient(180deg, #EC4899, #A855F7)` with `box-shadow: 0 0 8px rgba(236,72,153,0.5)`; the older bars use `rgba(255,255,255,0.18)` flat. In production, drive the bar heights from real daily/weekly earnings; cap at 100% and clamp small values to a minimum of 8% so the bars are still visible.

### Stats grid (2×2)
`padding: 0 18px 18px`. CSS grid `1fr 1fr`, gap 10. Four glassy cards in this exact order:

1. **Total services** — purple accent (`#C084FC`). Icon: briefcase. Value: `services.length`. Sub: `"{activeCount} active"`.
2. **Bookings** — pink accent (`#EC4899`). Icon: calendar. Value: this month's booking count. Sub: `"this month"`.
3. **Rating** — amber accent (`#F59E0B`). Icon: filled star. Value: `4.9` (1 decimal). Sub: `"{n} reviews"`.
4. **Avg. price** — green accent (`#34D399`). Icon: dollar-sign. Value: `"$20"`. Sub: `"per service"`.

**Each stat card:**
- `padding: 12; border-radius: 14; background: rgba(26,16,48,0.7); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(12px)`.
- Top row (flex space-between, align-center):
  - 28×28 squircle icon tile — `border-radius: 8; background: {accent}22; border: 1px solid {accent}44; color: {accent}`. 14×14 inline SVG.
  - Value — Bricolage Grotesque 800/22/-0.02em, color `#F4EEFF`, line-height 1.
- Label — Inter 11.5/600, color `#F4EEFF`, `margin-top: 8`.
- Sub — Inter 10.5/500, color `rgba(244,238,255,0.38)`, `margin-top: 2`.

### Quick actions
`padding: 0 18px 18px`. Section title `"Quick actions"` (Bricolage 800/18/-0.02em), no action link.

Two side-by-side buttons (flex, gap 8):
- **New service** (flex 1, height 44, radius 12, padding 0×14). Primary gradient `linear-gradient(100deg, #A855F7 0%, #7C3AED 50%, #EC4899 100%)`, white text, Bricolage 800/13/-0.01em. Shadow `0 10px 28px rgba(168,85,247,0.45), inset 0 1px 0 rgba(255,255,255,0.25)`. Plus icon (14×14, stroke 2.5) + label.
- **View payouts** (flex 1, height 44, radius 12). Glassy: bg `rgba(255,255,255,0.05)`, border `1px solid rgba(255,255,255,0.14)`, color `#F4EEFF`. Bricolage 700/13/-0.01em. Dollar-sign icon + label.

### By category
`padding: 0 18px 18px`. Section title `"By category"` with right-side `"Manage"` action link (Inter 11.5/700, color `#C084FC`).

Each category row (`padding: 12×14; border-radius: 14; background: rgba(26,16,48,0.7); border: 1px solid rgba(255,255,255,0.08); flex align-center gap 12`):
- 38×38 squircle (radius 10) — `background: linear-gradient(135deg, {color}33, {color}11); border: 1px solid {color}44`. Contains the category emoji at font-size 18.
- Middle (flex 1):
  - Name — Bricolage 700/14/-0.01em.
  - Sub — Inter 11/500, dim — `"{count} service · ${avgPrice} avg."`.
- Trailing count pill — padding 3×9, radius 999, bg `{color}22`, border `1px solid {color}44`, color `{color}`. Inter 11/700, letter-spacing 0.04em. Content: the count.

### Recent services
`padding: 0 18px 24px`. Section title `"Recent services"` + `"See all"` action.

Each row (`padding: 10×12; border-radius: 14; background: rgba(26,16,48,0.7); border: 1px solid rgba(255,255,255,0.08); flex align-center gap 12; cursor: pointer`):
- 52×52 thumb — radius 12, `background: service.cover`, decorative emoji at `right: -6; bottom: -10; font-size: 38; opacity: 0.45; transform: rotate(-8deg)`, border `1px solid rgba(255,255,255,0.14)`.
- Middle (flex 1, min-width 0):
  - Title — Bricolage 700/14.5/-0.01em, single-line ellipsis.
  - Meta — Inter 11.5/500, dim, flex align-center gap 6. Three segments separated by 2.5×2.5 round dots:
    1. Category name.
    2. Price in `#C084FC` weight 700 (e.g. `"$20"`).
    3. `"{n} bookings"`.
- **Status pill** (right, flex-shrink 0) — display inline-flex align-center gap 5, padding 4×9, radius 999. `letter-spacing: 0.05em; text-transform: uppercase; font-family: Inter; font-size: 10; font-weight: 700`. Leading 5×5 dot.
  - `available`: bg `rgba(52,211,153,0.16)`, color `#6EE7B7`, dot `#34D399` with `box-shadow: 0 0 8px rgba(52,211,153,0.6)`.
  - `unavailable`: bg `rgba(244,238,255,0.06)`, color `rgba(244,238,255,0.38)`, plain dot `rgba(244,238,255,0.38)`, no glow.

---

## Screen 2 — My Services

**Purpose:** List, filter, and manage the vendor's services. Add a new service. Edit / pause / delete existing ones.

### Title row
`padding: 0 18px 16px`, flex space-between, align-center.
- **Left:**
  - `"My services"` — Bricolage Grotesque 900/30/-0.035em/line-height 1.
  - Sub — Inter 12/500, dim, `margin-top: 4`. Content: `"{total} service · {active} active"` (pluralize correctly).
- **Right primary CTA** — inline-flex align-center gap 6, height 40, padding 0×14, radius 12. Same primary gradient + shadow as the dashboard "New service" button. Plus icon (14×14, stroke 2.5) + `"New"`.

### Filter pills
`padding: 0 18px 18px`. Flex, gap 8. Three pills: `All`, `Active`, `Unavailable`, each showing a count chip on the right.

Each pill: `display: inline-flex; padding: 7px 12px; border-radius: 999; gap: 6`.
- Inactive: bg `rgba(255,255,255,0.04)`, border `1px solid rgba(255,255,255,0.08)`, label color `rgba(244,238,255,0.62)`, count chip bg `rgba(255,255,255,0.06)` / color `rgba(244,238,255,0.38)`.
- Active: bg `rgba(168,85,247,0.18)`, border `1px solid rgba(192,132,252,0.4)`, label color `#C084FC`, count chip bg `rgba(168,85,247,0.2)` / color `#C084FC`.

Labels: Inter 12/700, letter-spacing 0.02em. Count chip: padding 1×6, radius 999, Inter 10/700.

### Service cards
`padding: 0 18px 24px`. Flex column, gap 12.

Each card:
- `border-radius: 18; overflow: hidden; background: rgba(26,16,48,0.7); border: 1px solid rgba(255,255,255,0.14); box-shadow: 0 16px 36px -18px rgba(124,58,237,0.4)`.

**Cover region** (height 132, position relative):
- Background = `service.cover` (URL or gradient).
- Decorative emoji — `right: -12; top: -8; font-size: 140; opacity: 0.3; transform: rotate(-12deg)`.
- Readability overlay — `radial-gradient(120% 80% at 100% 0%, rgba(255,255,255,0.2), transparent 50%), linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)`.

**Top chip row** (`absolute; top: 10; left: 10; right: 10`; flex space-between, align-start):
- **Status pill** — flex align-center gap 5, padding 4×9, radius 999. Active state: bg `rgba(52,211,153,0.22)`, border `1px solid rgba(52,211,153,0.4)`, backdrop blur 8, color `#6EE7B7`. Leading 5×5 green dot with glow `0 0 8px rgba(52,211,153,0.6)`. Label `"ACTIVE"` (Inter 10/700, uppercase, letter-spacing 0.05em). Unavailable state: dim greyscale (bg `rgba(0,0,0,0.4)`, color `rgba(244,238,255,0.62)`, plain dot, label `"PAUSED"`).
- **Price chip** — padding 4×10, radius 999. Bg `rgba(0,0,0,0.45)`, backdrop blur 8, border `1px solid rgba(255,255,255,0.18)`. Content `"$" + price` in Bricolage 800/13/-0.01em white.

**Title block** (`absolute; left: 14; right: 14; bottom: 12`):
- Title — Bricolage Grotesque 900/24/-0.03em/line-height 1.05, white, `text-shadow: 0 2px 14px rgba(0,0,0,0.4)`.
- Sub — Inter 12/600, color `rgba(255,255,255,0.85)`, `margin-top: 4`. Content: the category name.

**Body** (`padding: 14×14`):
- **Meta row** — flex align-center gap 14, Inter 12/500, dim:
  - Clock icon (12×12, stroke 2.2, color `#C084FC`) + `service.duration`.
  - Calendar icon (same style) + `"{bookings} booked"`.
- **Description** — `margin-top: 10`, Inter 13/500, color `#F4EEFF`, line-height 1.45. Single line by default; expand on tap.
- **Actions row** — `margin-top: 14; padding-top: 12; border-top: 1px solid rgba(255,255,255,0.08); flex align-center gap 8`:
  - **Edit** (flex 1, height 38, radius 10). Purple-tinted: bg `rgba(168,85,247,0.16)`, border `1px solid rgba(192,132,252,0.3)`, color `#C084FC`. Pencil icon + `"Edit"` (Inter 12/700).
  - **Pause / Resume** (height 38, padding 0×12, radius 10). Neutral: bg `rgba(255,255,255,0.05)`, border `1px solid rgba(255,255,255,0.14)`, color `rgba(244,238,255,0.62)`. Eye-off icon + `"Pause"`. (When already paused, swap to eye icon + `"Resume"` and shift color to `#C084FC`.)
  - **Delete** (38×38, radius 10). Pink-tinted destructive: bg `rgba(236,72,153,0.10)`, border `1px solid rgba(236,72,153,0.3)`, color `#EC4899`. Trash icon (14×14, stroke 2). Tap → confirm dialog before destroying.

### Empty state
When the vendor has no services:
- Centered emoji `🎟️` at font-size 80, opacity 0.3.
- Headline `"No services yet"` (Bricolage 800/20, color `#F4EEFF`).
- Sub `"Add your first service to start taking bookings."` (Inter 13/500, dim).
- Primary CTA `"+ Add service"` (gradient + shadow same as the title-row button).

---

## Screen 3 — Account

**Purpose:** The vendor's profile, business info, and settings. Long scrollable screen with grouped sections.

### Profile hero (business card)
`padding: 0 18px 14px`.

A card with **two regions**: a colored cover header, then a body region with the avatar overlapping.

**Outer card:**
- `position: relative; border-radius: 20; overflow: hidden; border: 1px solid rgba(255,255,255,0.14); box-shadow: 0 22px 50px -22px rgba(124,58,237,0.55)`.

**Cover header** (height 96, position relative):
- Background = `vendor.businessCover` (gradient or image — gradient fallback `linear-gradient(160deg, #F59E0B 0%, #EC4899 60%, #7C3AED 100%)`).
- Readability overlay — `radial-gradient(120% 80% at 100% 0%, rgba(255,255,255,0.22), transparent 50%), linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.45) 100%)`.
- **Edit cover button** — `absolute; right: 12; top: 12`. 32×32 round glassy: bg `rgba(0,0,0,0.4)`, backdrop blur 8, border `1px solid rgba(255,255,255,0.2)`, white text. Pencil icon (13×13, stroke 2).

**Body region** (background `rgba(36,21,64,0.85)`, padding `0 16 16`, position relative):
- **Avatar** — 76×76 circle, `margin-top: -38` so it half-overlaps the cover. Background = `vendor.avatarCover` (gradient or photo). `border: 3px solid #0B0613` for a clean cutout. Center: the avatar emoji at font-size 32. Shadow `0 12px 30px -12px rgba(124,58,237,0.5)`.
- **Name row** (margin-top 8, flex align-center gap 8 wrap):
  - Business name — Bricolage 900/26/-0.03em/line-height 1.
  - Verified ✦ badge (only if verified) — 20×20 circle, `linear-gradient(135deg, #A855F7, #EC4899)`, white sparkle `✦` (font 11), `box-shadow: 0 4px 12px rgba(168,85,247,0.45)`. `title="Verified"` for a11y.
- Sub — `margin-top: 4`, Inter 12.5/500, dim. Content: `"{vendorType} · {handle}"`.
- **Status pills row** — `margin-top: 14`, flex gap 6, wrap. Three pills:
  - **Verified** (green): bg `rgba(52,211,153,0.16)`, border `1px solid rgba(52,211,153,0.35)`, color `#6EE7B7`. Check icon (11×11, stroke 3) + `"Verified"`.
  - **Payouts active** (green): same palette. Dollar-sign icon + `"Payouts active"`. When NOT active: amber palette (bg `rgba(245,158,11,0.16)`, color `#FCD34D`), label `"Set up payouts →"`.
  - **Rating** (purple): bg `rgba(168,85,247,0.16)`, border `1px solid rgba(192,132,252,0.35)`, color `#C084FC`. Star icon + `"{rating} · {reviews}"`.

Each pill: `display: inline-flex; align-items: center; gap: 5; padding: 5px 10px; border-radius: 999; font-family: Inter; font-size: 11; font-weight: 700; letter-spacing: 0.03em`.

### Sections

All sections follow the same pattern:
- `padding: 4px 18px 14px`.
- **Section kicker** — Inter 10/700, uppercase, letter-spacing 0.14em, color `rgba(244,238,255,0.38)`, `margin-bottom: 10`, padding-left 2.
- **Group container** — `border-radius: 16; overflow: hidden; background: rgba(26,16,48,0.7); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(12px)`. Contains stacked rows separated by `1px solid rgba(255,255,255,0.08)` borders.

**Field row** (used inside sections):
- `padding: 12×14; cursor: pointer; flex align-center justify-between gap 12`.
- Left (flex 1, min-width 0):
  - Label — Inter 11/500, color `rgba(244,238,255,0.38)`.
  - Value — Inter 14, color `#F4EEFF`, weight 500, `margin-top: 2`. Single-line ellipsis by default; if `multi`, wrap and let it grow. Links (`website`) render in `#C084FC` weight 600.
- Trailing chevron-right (14×14, stroke 2.2, color `rgba(244,238,255,0.38)`).

#### Sections in order

1. **Business**
   - `businessName`
   - `vendorType`
   - `description` (multi-line — wraps)

2. **Account**
   - `username`
   - `email`

3. **Location**
   - `city`
   - `address`

4. **Contact**
   - `phone`
   - `website` (rendered as link in `#C084FC`)

5. **Socials** — each row uses the **social row** pattern:
   - Leading 32×32 squircle (radius 10) with the platform glyph (Instagram, TikTok, X, Facebook). When the social is set: bg `rgba(168,85,247,0.16)`, border `1px solid rgba(192,132,252,0.3)`, color `#C084FC`. When empty: bg `rgba(255,255,255,0.04)`, border `1px solid rgba(255,255,255,0.08)`, color `rgba(244,238,255,0.38)`.
   - Middle: label (Inter 11/500, dim) + value (Inter 14/600, white) OR — when empty — italic `"Not set · tap to add"` in `rgba(244,238,255,0.38)`.
   - Trailing chevron.
   
   Rows: Instagram, TikTok, X (formerly Twitter), Facebook — in that order.

### Log out
`padding: 4px 18px 24px`. Outside any section group.

A wide row button:
- `height: 48; padding: 0 14; cursor: pointer; border-radius: 14; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.14); flex align-center justify-between`.
- Left: log-out icon (16×16, dim) + `"Log out"` (Inter 13.5/700, color `#F4EEFF`).
- Right: chevron-right (14×14, muted).

Long-press / tap → confirmation sheet. Don't sign out on first tap.

---

## Interactions & behavior

### Dashboard
- Tap earnings hero → opens detailed earnings/payouts screen.
- Tap stat → opens the relevant list (services, bookings, reviews).
- "New service" → creation flow.
- "View payouts" → Stripe Connect dashboard or your payouts screen.
- Tap category row → filtered services list.
- Tap recent service row → service detail.

### Services
- Pull-to-refresh on the list.
- Filter pill → updates the list inline.
- Tap card cover → service detail (read-only).
- **Edit** → service editor.
- **Pause / Resume** → toggles `service.active`. Show optimistic UI; revert on error.
- **Delete** → confirm dialog: `"Delete {service.title}? Existing bookings will be honored."` → `Cancel` / `Delete` (destructive style).

### Account
- Every field row → opens an inline edit sheet for that single field.
- Verified pill → opens verification status detail.
- Payouts pill (when "Set up payouts") → Stripe Connect onboarding.
- Edit-cover button → image picker.
- Avatar tap → image picker (separate from cover).
- Log out → confirmation, then clear session.

### Loading / empty
- **Dashboard loading:** skeleton tiles for the earnings hero (`rgba(26,16,48,0.6)` + shimmer), stats grid (4 placeholders), and recent services (3 row placeholders).
- **No bookings yet:** stats grid still renders, value `0`, sub `"Once you take your first booking it'll show up here."` (Inter 11/500, dim) replaces the normal sub.
- **No services yet:** dashboard's "Recent services" section gets a centered `"+ Add your first service"` link in `#C084FC`/700 in place of the empty list.

### State variants
- **Unverified vendor:** verified pill becomes amber `"Verification pending"`. Banner above the sections: amber card `"Your account is under review. We'll let you know once it's verified."` (don't gate functionality though — the prototype assumes verification doesn't block).
- **Payouts not set up:** pill becomes amber `"Set up payouts →"`; tapping it opens onboarding.
- **Service paused (`!service.active`):**
  - Card cover gets `filter: grayscale(0.45) brightness(0.8)`.
  - Status pill becomes dim grey `"PAUSED"` (palette above).
  - Action button label flips to `"Resume"` and uses `#C084FC` tint.

### Animations
- Earnings sparkline grows on enter (200ms ease-out).
- Status dot glow + sparkline shadows are static (don't pulse — too noisy).
- Card press: 100ms scale `0.985`.
- Field row press: 100ms bg shift to `rgba(26,16,48,0.95)`.

---

## Data model mapping

| Model field | UI element |
|---|---|
| `vendor.businessName` | Account hero title; Business section value |
| `vendor.vendorType` | Account sub line; Business section value |
| `vendor.description` | Business section value (multi-line) |
| `vendor.username` / handle | Header avatar tooltip; Account section value |
| `vendor.email` | Account section value |
| `vendor.phone` | Contact section value |
| `vendor.website` | Contact section value (link) |
| `vendor.city` / `vendor.address` | Location section |
| `vendor.socials.{platform}` | Socials section rows |
| `vendor.isVerified` | Verified ✦ badge + Verified pill |
| `vendor.payouts.active` | Payouts pill state |
| `vendor.rating` / `vendor.ratingCount` | Rating pill + dashboard rating stat |
| `vendor.avatarCover` / `vendor.avatar` | Avatar circle in header + account hero |
| `vendor.businessCover` | Account hero cover header |
| `vendor.services[]` | Services screen list + dashboard recent services |
| `service.title`, `service.category`, `service.price`, `service.duration`, `service.description`, `service.cover`, `service.emoji`, `service.active`, `service.bookings` | Service card |
| Earnings (current month, last month, daily series) | Dashboard earnings hero (compute delta & sparkline) |
| Bookings (current month) | Dashboard bookings stat |

---

## State management

```ts
type VendorScreenState = {
  vendor: Vendor;                       // GET /api/me (vendor scope)
  services: Service[];                  // GET /api/me/services
  earnings: {
    currentMonthTotal: number;
    lastMonthTotal: number;
    daily: number[];                    // last 12 buckets for sparkline
  };
  metrics: {
    bookingsThisMonth: number;
    rating: number;
    ratingCount: number;
  };
  servicesFilter: 'all' | 'active' | 'unavailable';
  isLoading: boolean;
};
```

Endpoints (rough sketch — match what already exists):
- `GET /api/me` — vendor profile.
- `GET /api/me/services` — services list.
- `POST /api/me/services` — create.
- `PATCH /api/me/services/:id` — edit (also handles pause/resume via `active` flag).
- `DELETE /api/me/services/:id`.
- `GET /api/me/earnings?range=this_month` — earnings + comparison.
- `GET /api/me/metrics` — bookings, rating.
- `PATCH /api/me/profile` — field-level edits from the account screen.

---

## Design tokens

### Colors
| Token | Value | Use |
|---|---|---|
| `bg` | `#0B0613` | Screen background |
| `bgStage` | `#07040E` | Outer canvas (not part of screen) |
| `surface` | `rgba(26,16,48,0.7)` | Glassy cards (with blur 12) |
| `surfaceHi` | `rgba(36,21,64,0.85)` | Account hero body region |
| `text` | `#F4EEFF` | Primary text |
| `textDim` | `rgba(244,238,255,0.62)` | Sub-text, hints, meta |
| `textMute` | `rgba(244,238,255,0.38)` | Micro labels, placeholders, dim states |
| `stroke` | `rgba(255,255,255,0.08)` | Hairlines, default borders |
| `strokeHi` | `rgba(255,255,255,0.14)` | Stronger dividers, card outer borders |
| `purple` | `#A855F7` | Gradient start, active tab |
| `purpleDeep` | `#7C3AED` | Gradient middle |
| `purpleSoft` | `#C084FC` | Links, accent tints, gradient text start |
| `pink` | `#EC4899` | Gradient end, bookings accent, destructive |
| `green` | `#34D399` | Active service / verified / payouts dot |
| `greenSoft` | `#6EE7B7` | Active / verified label text |
| `amber` | `#F59E0B` | Rating accent, warning/pending |
| `amberSoft` | `#FCD34D` | Warning label text |
| `cyan` | `#22D3EE` | Decorative blob accent |

### Brand gradients
- **Wordmark text fill:** `linear-gradient(100deg, #C084FC 0%, #EC4899 100%)`.
- **Primary CTA:** `linear-gradient(100deg, #A855F7 0%, #7C3AED 50%, #EC4899 100%)`.
- **Earnings card bg:** `linear-gradient(140deg, #1A1030 0%, #2A1654 55%, #4B1A6E 100%)`.
- **Sparkline bars (recent):** `linear-gradient(180deg, #EC4899, #A855F7)`.
- **Verified badge:** `linear-gradient(135deg, #A855F7, #EC4899)`.
- **Service card cover fallback:** category-derived gradient (stable hash off `service._id`).

### Shadows
- Earnings card: `0 24px 60px -20px rgba(124,58,237,0.55)`.
- Primary CTA: `0 10px 28px rgba(168,85,247,0.45), inset 0 1px 0 rgba(255,255,255,0.25)`.
- Service card: `0 16px 36px -18px rgba(124,58,237,0.4)`.
- Account hero: `0 22px 50px -22px rgba(124,58,237,0.55)`.
- Account avatar: `0 12px 30px -12px rgba(124,58,237,0.5)`.
- Verified badge: `0 4px 12px rgba(168,85,247,0.45)`.
- Status dot glow (green/active): `0 0 8px rgba(52,211,153,0.6)`.
- Sparkline bar glow: `0 0 8px rgba(236,72,153,0.5)`.
- Title shadow on covers: `0 2px 14px rgba(0,0,0,0.4)`.

### Typography
- **Display:** Bricolage Grotesque 900 — greeting headline (30px), title row (30px), earnings amount (44px). Letter-spacing -0.035em / -0.04em.
- **Heading:** Bricolage Grotesque 800 — section titles (18px), service card title (24px), business-card name (26px), stat values (22px), price chips (13px), CTA labels (13–15px). Letter-spacing -0.01em / -0.02em / -0.03em.
- **Sub-heading:** Bricolage Grotesque 700 — service row title (14.5px), category row title (14px). Letter-spacing -0.01em.
- **Body / UI:** Inter 500–600 — descriptions, sub lines, meta, field values. 11–14px.
- **Emphasis:** Inter 700–800 — pill labels, CTA labels, status chips, count chips. 10–12.5px.
- **Micro labels:** Inter 10–11/700, uppercase, letter-spacing 0.05–0.14em.

### Spacing
- Screen edge: **18px** on all main content.
- Section gap: 14px between sections.
- Card padding: 12px (stats), 14px (most cards).
- Hero card padding: `16 18 18`.
- Service card cover height: **132**.
- Account cover header height: **96**.
- Account avatar overlap: `margin-top: -38` (half of 76px).
- Stat icon tile: 28×28 (radius 8).
- Category icon tile: 38×38 (radius 10).
- Social icon tile: 32×32 (radius 10).

### Radii
- Round buttons (notifications, edit cover, etc.): 50%.
- Status pills, count chips, status pills, price chip: 999.
- Inner squircle icons: 8–10.
- Action buttons (Edit / Pause / Delete): 10.
- Cards (stats, category, recent service): 14.
- Service card outer, sections, log-out row: 14–16.
- Larger cards (earnings hero, service card outer, account hero, CTAs container): 18–20.

---

## Assets
No bitmap assets needed for chrome. Avatar and business cover come from URLs (`vendor.avatar`, `vendor.businessCover`) — fall back to deterministic gradients keyed off `vendor._id`. Service covers come from `service.cover`.

Icons (all inline SVG in the prototype — replace with your icon set):
- briefcase (Vendor pill, Services tab, Total services stat)
- bell (notifications)
- chevron-up / chevron-right (trend chip, navigation, field rows)
- calendar (Bookings tab, bookings stat, "booked" in service card)
- star-filled (Rating stat, rating pill)
- dollar-sign (Avg. price stat, View payouts button)
- plus (New service CTA)
- pencil (Edit cover, Edit service)
- eye-off / eye (Pause / Resume)
- trash (Delete)
- clock (Service duration)
- check (Verified pill)
- log-out (Log out row)
- platform glyphs: Instagram (camera/square), TikTok, X (𝕏), Facebook
- 4-square grid (Dashboard tab)
- speech-bubble (Chats tab)
- person silhouette (Account tab — filled when active)

Fonts (load via your existing pipeline; the prototype uses Google Fonts):
- `Bricolage Grotesque` weights 700, 800, 900
- `Inter` weights 500, 600, 700, 800

---

## Files in this bundle
- `Vendor screens.html` — host page mounts all three screens side by side. Tweaks panel toggles a single screen view.
- `vendor.jsx` — exports `VendorDashboard`, `VendorServices`, `VendorAccount`. Also exports the supporting components (`VNHeader`, `VNTabBar`, `VNStat`, `VNServiceCard`, `VNRecentServiceRow`, `VNSection`, `VNField`, `VNSocialRow`, `VNStatusPill`) and the `DEMO_VENDOR` fixture.
- `tweaks-panel.jsx` — prototyping utility for the screen toggle. **Not needed for production.**

Reference the prototype side-by-side with this README. Numbers in the prototype are the source of truth where this README is silent.
