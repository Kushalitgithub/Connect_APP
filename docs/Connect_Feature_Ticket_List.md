# Connect — Feature Ticket List

Version 1.1 · This is the buildable backlog. Read all prior docs first, including `Connect_Feature_Summary.md`. Tickets are grouped by epic and roughly ordered per the build order in `Connect_Frontend_Spec.md` §9.

Each ticket should be treated as one unit of work for an AI coding agent to complete, verify, and then log in `PROCESS.md` (see `Connect_Build_Prompt.md`) before moving to the next.

## Epic 0 — Foundations
- [ ] 0.0 Install and enable Ponytail (`DietrichGebert/ponytail`) in the coding agent before any other ticket — see `Connect_Build_Prompt.md`
- [ ] 0.1 Repo scaffolding: backend (FastAPI), web/connect_admin (React/Vite), mobile/connect_user (Expo/React Native), mobile/connect_guide (Expo/React Native)
- [ ] 0.2 PostgreSQL schema + Alembic migration setup, base models (User, GuideProfile, TourListing, Availability, Booking, ChatThread, Message, Review, Report)
- [ ] 0.3 Env config scaffolding (.env.example for all four apps) and docker-compose for local Postgres
- [ ] 0.4 `create_admin.py` bootstrap script for the first admin account
- [ ] 0.5 Place `logo_connect.png` in a shared branding location and generate derivatives: web favicon for connect_admin, and native iOS/Android app icon + splash screen sets (via Expo `app.json`/`expo-splash-screen`) for connect_user and connect_guide (see `Connect_Frontend_Spec.md` §7)
- [ ] 0.6 Design system foundation: implement color/typography/radii tokens per `Connect_Frontend_Spec.md` §2. Build the shared component set (status chip, verified badge, avatar, rating stars, card, button, input, message bubble, skeleton loader, top status bar, bottom nav, home indicator) **twice**: once as web/Tailwind components for connect_admin, and once as React Native/NativeWind components shared between connect_user and connect_guide (e.g. via a shared RN component package or copied module) — same tokens and naming, native-appropriate implementation

## Epic 1 — Auth & Roles
- [ ] 1.1 Tourist signup/login (email+password), JWT issuance
- [ ] 1.2 Guide signup/login, JWT issuance, initial `verification_status = pending`
- [ ] 1.3 Admin login (no public signup path)
- [ ] 1.4 Refresh token flow + logout/session revocation
- [ ] 1.5 Auth middleware: role + ownership derivation from session on every protected route

## Epic 2 — Guide Verification (Admin + Guide)
- [ ] 2.1 Guide onboarding flow: profile info + document upload to private object storage
- [ ] 2.2 Admin verification queue endpoint + UI: list pending submissions
- [ ] 2.3 Admin approve/reject action with reason, writes to audit log
- [ ] 2.4 Guide-side verification status screen (pending/approved/rejected + reason)
- [ ] 2.5 Enforce verification gate: unverified guides blocked from listing creation server-side

## Epic 3 — Tour Listings & Discovery
- [ ] 3.1 Create/edit/deactivate TourListing (verified guide only, server-enforced ownership)
- [ ] 3.2 Availability model + calendar management per listing
- [ ] 3.3 Public listing read endpoints (search/filter by location, type, date, rating)
- [ ] 3.4 Connect Guide: Tours screen + Tour Editor
- [ ] 3.5 Connect User: Home screen (popular destinations, popular guides, recommended experiences), Destination Detail screen
- [ ] 3.6 Connect User: Find (guide discovery) search/filter screen + Guide Profile + Tour Detail screens

## Epic 4 — Booking Flow
- [ ] 4.1 Booking creation endpoint with atomic availability lock (race-condition safe)
- [ ] 4.2 Booking state machine: pending → accepted|declined → completed|cancelled, server-enforced
- [ ] 4.3 Guide: Requests screen (accept/decline)
- [ ] 4.4 Tourist: Booking Flow (date/slot selection, confirm, pending state)
- [ ] 4.5 Both apps: Bookings list + Booking Detail screens
- [ ] 4.6 Booking status push notifications (guide + tourist)

## Epic 5 — Chat
- [ ] 5.1 WebSocket infrastructure with per-connection auth + thread-participant check
- [ ] 5.2 ChatThread creation (pre-booking inquiry and booking-scoped)
- [ ] 5.3 Message send/receive, read receipts
- [ ] 5.4 Connect User: Inbox + Chat Thread screens
- [ ] 5.5 Connect Guide: Inbox + Chat Thread screens
- [ ] 5.6 New message push notifications

## Epic 6 — Reviews
- [ ] 6.1 Review creation endpoint (only post-completion, one per booking)
- [ ] 6.2 Review edit/delete within author window
- [ ] 6.3 Connect User: Review Composer screen
- [ ] 6.4 Connect Guide: Reviews screen (own reviews + average rating)
- [ ] 6.5 Surface rating on guide search results and profile

## Epic 7 — Reports & Moderation
- [ ] 7.1 Report creation endpoint (any authenticated user, any target type)
- [ ] 7.2 Admin Reports queue UI + resolve action
- [ ] 7.3 "Report" entry points in Connect User UI (guide, listing, chat message)

## Epic 8 — Admin Ops
- [ ] 8.1 Admin Users table (tourist accounts, search/filter)
- [ ] 8.2 Admin Guides table (guide accounts/profiles, search/filter)
- [ ] 8.3 Admin Tours screen (oversight of tour listings platform-wide)
- [ ] 8.4 Admin Bookings table + manual status override for dispute resolution
- [ ] 8.5 Admin Reviews moderation screen
- [ ] 8.6 Admin Dashboard (active guides, bookings/week, top locations, verification turnaround)
- [ ] 8.7 Admin Settings: platform configuration + Admin Accounts management (create/list admins, admin-only)

## Epic 9 — Guide Earnings (v1-scoped, see `Connect_Frontend_Spec.md` §4.4)
- [ ] 9.1 Endpoint to compute a guide's total from completed bookings' listed prices (read-only tally, no payment processing)
- [ ] 9.2 Connect Guide: Earnings screen + Dashboard earnings summary, clearly labeled as an estimate

## Epic 10 — Native Mobile Build & Release
- [ ] 10.1 EAS Build configuration for connect_user (`eas.json`, app config, dev/preview/production build profiles)
- [ ] 10.2 EAS Build configuration for connect_guide
- [ ] 10.3 Native push notification wiring (APNs/FCM via `expo-notifications` + EAS push credentials)
- [ ] 10.4 Camera/geolocation native module wiring via `expo-camera` and `expo-location`, with runtime permission prompts
- [ ] 10.5 Build/signing pipeline for iOS (TestFlight via EAS Submit) and Android (internal track via EAS Submit)

## Epic 11 — Hardening
- [ ] 11.1 Rate limiting on auth, booking creation, chat send
- [ ] 11.2 Full security checklist pass per `Connect_Security_Access_Spec.md` §8 on every write endpoint
- [ ] 11.3 Load test booking creation for race-condition safety under concurrency
- [ ] 11.4 Audit log review and PII leakage review on all public-facing read endpoints
