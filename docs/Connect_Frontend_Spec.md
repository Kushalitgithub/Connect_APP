# Connect — Frontend Specification

Version 2.0 · Read after `Connect_Security_Access_Spec.md`. Design tokens and screen inventory below are sourced from `Connect_Feature_Summary.md` (extracted from the Figma Make prototype). **Figma remains the visual source of truth for exact spacing/detail** — this document defines structure, behavior, and the design tokens to implement.

## 1. Shared Frontend Principles

- React 18 + TypeScript + Vite across all three products.
- Tailwind CSS 4 for styling; component-level composition over global overrides.
- Axios for API calls with a shared, typed API client per app.
- React Router for navigation.
- `lucide-react` icons throughout.
- All API-derived state (role, ownership, booking status) is rendered from server responses — the frontend never infers permissions on its own; it reflects what the API allows/returns.
- The Figma Make prototype uses mock data (`Home.tsx` etc.) — this is prototype-only; production builds wire every screen to the real Connect API per `Connect_TAD.md`, not to mock arrays.

## 2. Design System

### 2.1 Color Tokens
| Token | Value | Use |
|---|---|---|
| Primary | `#F54900` | Primary actions, brand accents |
| Primary Light | `#FF6B2B` | Hover/active states, success status |
| Primary Dark | `#C23900` | Pressed states |
| Accent | `#F4A261` | Secondary accents, warning status |
| Accent Light | `#F7BC8A` | Subtle accent backgrounds |
| Accent Dark | `#E08040` | Accent pressed states |
| Background | `#F7F5F0` | App background |
| Surface | `#FFFFFF` | Cards, sheets |
| Surface Alt | `#F0EDE6` | Secondary surfaces |
| Text Primary | `#1A1A2E` | Headings, primary text |
| Text Secondary | `#4A5568` | Body text |
| Text Muted | `#9AA3B2` | Placeholder/meta text |
| Border | `#E8E4DC` | Dividers, input borders |
| Error | `#E05252` | Error states |
| Pending | `#F59E0B` | Pending status indicator |
| Star | `#FBBF24` | Rating stars |

### 2.2 Status Chip Colors
| Status | Background | Text |
|---|---|---|
| Pending | `#FEF3C7` | `#92400E` |
| Accepted | `#D1FAE5` | `#065F46` |
| Rejected | `#FEE2E2` | `#991B1B` |
| Completed | `#E0F2FE` | `#0369A1` |
| Cancelled | `#F3F4F6` | `#6B7280` |

These map directly onto `Booking.status` and `GuideProfile.verification_status` — implement as a single shared status-chip component per app, not one-off styling per screen.

### 2.3 Typography
- Sans (default UI): `'Outfit', system-ui, sans-serif`
- Serif (display/headline use): `'DM Serif Display', Georgia, serif`

### 2.4 Border Radii
`sm: 8px · md: 12px · lg: 16px · xl: 24px · 2xl: 32px · full: 9999px`

### 2.5 Motion
- Screen transitions: `screen-enter-right` / `screen-enter-left` (slide + fade, `translateX(28px)→0`), `screen-enter-fade` (fade + scale `0.98→1`), `slide-up` (bottom sheets/modals), `fade-in` (simple content fades).
- Splash: `splashLogo` — opacity `0→1`, scale `0.82→1`, blur `8px→0`. Uses the `logo_connect.png` brand asset from §5.
- Loading: `shimmer` skeleton loaders for async content (guide lists, tour details) instead of blank/spinner-only states.
- Interaction: buttons scale to `0.98` on press with a color shift; inputs/cards get visible hover/focus background or border changes; active nav items get a background color change.
- All transitions should be hardware-accelerated (transform/opacity), not layout-triggering properties.

### 2.6 Visual Style — Glassmorphism
- Bottom nav, cards, input fields, and search/modal overlays use a glassmorphism treatment: translucent background + `backdrop-filter: blur(...)` + subtle border/shadow.
- Applies consistently across Connect User and Connect Guide (mobile apps); Connect Admin (web, dense data tables) does **not** need the same glassmorphism treatment — favor clarity/density over the mobile aesthetic there.

### 2.7 Shared Components
Status chip · Verified badge · Avatar (circular, with fallback) · Rating stars · Card (glassmorphism) · Button (primary/secondary/accent) · Input (glassmorphism, focus state) · Message bubble (sent/received) · Skeleton loader · Search/modal overlay · Top status bar (back button, title, actions, light/dark variant) · Bottom nav (floating, glassmorphism) · Home indicator (bottom safe-area bar on mobile).

Build each of these once per app as a shared component — screens compose them rather than re-implementing status colors, chips, or nav per screen.

## 3. Connect User (Tourist App)

### 3.1 Navigation (bottom nav, floating/glassmorphism, safe-area aware)
`Home | Find | Bookings | Inbox`

### 3.2 Screen Inventory
| Screen | Purpose |
|---|---|
| Onboarding | Intro screen with entry points to login, signup, continue as guide, or admin login |
| Login / Signup | Role selection (tourist/guide) during signup |
| Home | Search entry (overlay), popular destinations (horizontal scroll), popular guides, recommended experiences |
| Destination Detail | Hero image + gradient overlay, quick stats (altitude, guide count, best time), tags, description, highlights, best time to visit, CTA to find guides there |
| Find (Guide Discovery) | Browse/search guides by location; results list |
| Guide Profile | Verified badge, rating + review count, specialty, languages, price/day, about, experience, places covered; Book / Message CTAs |
| Tour Detail | Itinerary, price, capacity, date picker, booking CTA |
| Booking Flow | Date/slot selection → confirm request → pending state |
| Bookings | List of bookings by status (pending/accepted/completed/cancelled) |
| Booking Detail | Full booking info, chat entry point, review CTA once completed |
| Inbox | List of chat threads |
| Chat Thread | Real-time messaging with a guide |
| Review Composer | Rating + written review, shown post-completion |
| Profile / Settings | View/edit profile, notification center (bell + badge), logout |

### 3.3 Key States to Design For
- Empty states: no bookings yet, no messages yet, no search results.
- Booking status badges: per §2.2 status chip colors.
- Offline/PWA: cached last-known guide list and booking list visible when offline; clear "you're offline" indicator.

## 4. Connect Guide (Guide App)

### 4.1 Navigation (bottom nav, floating/glassmorphism, safe-area aware)
`Dashboard | Requests | Bookings | Inbox`

### 4.2 Screen Inventory
| Screen | Purpose |
|---|---|
| Onboarding / Verification | Multi-step: profile info → document upload → submitted state → status tracking |
| Dashboard | Overview: pending requests, upcoming bookings, rating, earnings summary (see §4.4) |
| Requests | Incoming booking requests with Accept / Decline actions |
| Tours (Listings) | Guide's own tour listings; create/edit/deactivate |
| Tour Editor | Title, description, itinerary, price, capacity, availability calendar |
| Bookings | Upcoming and past bookings |
| Booking Detail | Full booking info, chat entry point |
| Earnings | See §4.4 — v1 scope note |
| Inbox | List of chat threads (bookings + pre-booking inquiries) |
| Chat Thread | Real-time messaging with a tourist |
| Reviews | Own reviews and average rating |
| Profile / Settings | Public bio, availability defaults, notification preferences, logout |

### 4.3 Verification-Gated UI
- If `verification_status = pending`, Tours and Requests screens show a persistent "Under review" state and block listing creation.
- If `verification_status = rejected`, show the rejection reason and a re-submission path.

### 4.4 Earnings — v1 scope note
The PRD marks live payments/payouts as a **post-v1 milestone**. For v1, the Earnings screen and Dashboard earnings summary show a **computed total from completed bookings' listed prices** (i.e. a running tally of what's been earned on paper), not a real payment/payout ledger. Label it clearly as an estimate if there's any risk of it being read as a live balance. Revisit this screen's scope once payment integration lands.

## 5. Connect Admin (Staff Web)

### 5.1 Navigation (sidebar or top nav, standard web layout — not mobile bottom nav)
`Dashboard | Users | Guides | Verification | Bookings | Tours | Reviews | Reports | Settings`

### 5.2 Screen Inventory
| Screen | Purpose |
|---|---|
| Dashboard | Platform metrics overview (active guides, bookings/week, top locations, verification turnaround) |
| Users | Searchable/filterable table of tourist accounts |
| Guides | Searchable/filterable table of guide accounts and profiles |
| Verification | Pending guide submissions queue, document viewer, approve/reject with reason |
| Bookings | Searchable/filterable table, manual status override for dispute resolution |
| Tours | Admin oversight of tour listings across the platform |
| Reviews | Review moderation queue |
| Reports | Moderation queue for reported content (reviews, chats, profiles) |
| Settings | Platform configuration; admin account management (admin-only, no public signup — see `Connect_Security_Access_Spec.md`) |

## 6. App Switcher — prototype only, not a production feature

The Figma Make prototype includes a floating "App Switcher" button to preview Tourist, Guide, and Admin UIs from one build. **Do not implement this in production.** It conflicts with the security model: role is derived server-side from the authenticated session and is never client-selectable, and admin has no self-service entry point at all (`Connect_Security_Access_Spec.md` §2, §4). If a real need emerges for one account to hold multiple roles (e.g. a tourist who is also a guide), that requires its own spec — flag it rather than building the prototype's switcher as-is.

## 7. Branding Assets

- The project logo (`logo_connect.png`) is the canonical brand mark and must be used across all three apps — app icons, splash screens (`splashLogo` animation, §2.5), auth screens, nav headers/wordmark placement — rather than a placeholder or text-only logo.
- Store it once at a shared/assets location referenced by all three frontends (e.g. `/assets/branding/logo_connect.png`) and generate platform-specific derivatives from it (favicon, PWA manifest icons, and native iOS/Android app icon sets for the Capacitor builds) rather than sourcing a different logo per platform.
- Check Figma for exact logo lockup, clear-space, and minimum-size rules before placing it in any layout.

## 8. Design System Notes

- Verification badge: a single consistent visual treatment used everywhere a guide is shown (search results, profile, chat header).
- Status badges (booking, verification) use the shared status-chip component (§2.2, §2.7).
- Chat UI is shared conceptually between Connect User and Connect Guide (same message bubble treatment, timestamps, read receipts) — implement as a shared component pattern even if the two apps are separate codebases.
- Mobile apps must respect safe-area insets (notch/home-indicator) on all fixed nav and header elements, including the home-indicator bar — see `Connect_TAD.md` for the Capacitor/native wrapping context.
- Responsive target: mobile apps designed for max-width ~480px; Admin is a standard responsive web layout.

## 9. Build Order Recommendation

1. Auth (signup/login) for all three roles, including onboarding screens.
2. Design system foundation: color/typography/radii tokens, shared components (§2.7) — build once, reuse everywhere.
3. Connect Admin verification queue (needed to unblock guide testing).
4. Connect Guide: onboarding, tours, requests, dashboard.
5. Connect User: home, destination detail, guide discovery, guide profile, tour detail, booking flow.
6. Chat (both apps) once booking flow exists to scope threads against.
7. Reviews, reports/moderation, admin remaining screens (users, guides, tours, analytics dashboard).
8. Guide earnings summary (v1-scoped per §4.4).
