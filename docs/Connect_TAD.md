# Connect — Technical Architecture Document (TAD)

Version 1.0 · Read after `Connect_App_Overview.md` and `Connect_PRD.md`.

## 1. System Overview

A single backend service (Connect API) and one PostgreSQL database serve three frontends. No frontend talks directly to the database or duplicates business logic — all validation, authorization, and state transitions live server-side.

```
Connect User (React + Capacitor) ─┐
Connect Guide (React + Capacitor) ─┼──> Connect API (FastAPI) ──> PostgreSQL
Connect Admin (React web)         ─┘         │
                                              ├──> Object Storage (S3-compatible, images/docs)
                                              └──> WebSocket layer (chat, live notifications)
```

## 2. Technology Stack

**Backend**
- FastAPI (Python) — REST API + WebSocket endpoints
- PostgreSQL — primary datastore (PostGIS extension if/when geo-radius search is needed)
- Alembic — schema migrations
- JWT — stateless auth tokens (access + refresh)
- boto3 — S3-compatible object storage for images and verification documents

**Frontend (all three products)**
- React 18 + TypeScript
- Vite build tool
- Tailwind CSS 4
- Axios for API calls
- React Router

**Mobile (Connect User, Connect Guide)**
- Capacitor wraps the React/Vite build into native iOS and Android shells (see `README.md`)
- Native plugins as needed: `@capacitor/camera`, `@capacitor/geolocation`, `@capacitor/push-notifications`, `@capacitor/filesystem`
- PWA support retained for browser access

**Realtime**
- WebSocket connections for chat and live booking/notification updates

## 3. Repository Layout

```
/backend/                    FastAPI app, Alembic migrations, admin bootstrap script
/web/connect_admin/          React web app (staff)
/mobile/connect_user/        React + Capacitor app (tourists)
/mobile/connect_guide/       React + Capacitor app (guides)
/docs/                       This document set
```

## 4. Core Data Model (high level)

| Entity | Key fields | Notes |
|---|---|---|
| **User** | id, role (tourist/guide/admin), email, hashed_password, created_at | Single users table with a role column; role is set server-side at creation and never client-editable post-signup except by admin. |
| **GuideProfile** | user_id (FK), bio, verification_status, verification_docs[], rating_avg | 1:1 with User where role = guide. |
| **TourListing** | id, guide_id (FK), title, description, itinerary, price, capacity, active | Only creatable/editable by a verified guide who owns it. |
| **Availability** | id, tour_listing_id (FK), date, slots_remaining | Drives booking capacity checks. |
| **Booking** | id, tourist_id (FK), tour_listing_id (FK), date, status, created_at | status: pending / accepted / declined / completed / cancelled. |
| **ChatThread** | id, tourist_id (FK), guide_id (FK), booking_id (FK, nullable) | Nullable booking_id supports pre-booking inquiries. |
| **Message** | id, thread_id (FK), sender_id (FK), body, sent_at, read_at | |
| **Review** | id, booking_id (FK), tourist_id (FK), guide_id (FK), rating, body | Only creatable after booking.status = completed. |
| **Report** | id, reporter_id (FK), target_type, target_id, reason, status | Feeds Admin moderation queue. |

## 5. API Design Principles

- REST for CRUD and state transitions (`/bookings/{id}/accept`, `/bookings/{id}/decline`), WebSocket for chat and live status pushes.
- Every write endpoint re-derives the actor's role and ownership from the authenticated session — request bodies are never trusted for `role`, `guide_id`, `user_id`, etc.
- Booking creation is wrapped in a DB-level transaction with a row lock (or equivalent constraint) on the availability slot to prevent race-condition double-booking.
- Pagination on all list endpoints (guides, tours, bookings, reviews).
- Consistent error envelope: `{ "error": { "code": str, "message": str } }`.

## 6. Authentication & Session Flow

1. User authenticates (email/password, or future OAuth) → API issues short-lived JWT access token + longer-lived refresh token.
2. Access token carries `user_id` and `role`, signed server-side — client cannot forge role.
3. Every protected endpoint validates the token signature and re-checks role/ownership against the database, not just the token claim, for sensitive mutations (defense in depth).
4. Full detail in `Connect_Security_Access_Spec.md`.

## 7. Storage

- Guide verification documents and profile/tour images go to S3-compatible object storage.
- Verification documents are **never** publicly readable — access is via short-lived signed URLs, admin/owner only.
- Public images (profile photos, tour photos) are served via CDN-fronted public bucket paths.

## 8. Deployment Targets

- Backend: containerized FastAPI service, PostgreSQL managed instance.
- Connect Admin: static build served behind auth-gated hosting.
- Connect User / Connect Guide: web build deployed as PWA; native builds produced via Capacitor for App Store / Play Store distribution.

## 9. Environments

| Env | Purpose |
|---|---|
| local | `docker-compose` / local Postgres on `localhost:5434`, backend on `:8000` |
| staging | Pre-production, mirrors prod schema, used for QA and TestFlight/internal testing tracks |
| production | Live marketplace |

## 10. Non-Functional Requirements

- All booking-critical operations must be atomic and idempotent on retry.
- API must reject any client-supplied `role`, `user_id`, or `status` field on writes where the server should be the source of truth.
- WebSocket connections must re-authenticate on connect and reject unauthorized thread subscriptions.
- Target: p95 API latency < 300ms for read endpoints under expected v1 load.
