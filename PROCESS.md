# Connect — Build Process Log

## Current Status
- Last completed ticket: <epic 1.3 — Admin login (no public signup path)>
- Next ticket to start: <epic 1.4 — Refresh token flow + logout/session revocation>
- Overall progress: <Epic 0 complete, Epic 1 in progress>

## What's Working
- Ponytail plugin installed and active
- Repository layout created: backend (FastAPI), web/connect_admin, mobile/connect_user, mobile/connect_guide
- PostgreSQL schema + Alembic migration setup with base models (User, GuideProfile, TourListing, Availability, Booking, ChatThread, Message)
- Env config scaffolding (.env.example for all four apps) and docker-compose for local Postgres
- create_admin.py bootstrap script created
- Logo placed in shared branding location and derivatives generated
- Design system foundation: color/typography/radii tokens and shared components (StatusChip, VerifiedBadge, Avatar, RatingStars, Card, Button, Input, MessageBubble, SkeletonLoader)
- Tourist signup and login endpoints with JWT token issuance (access and refresh tokens)
- Guide signup and login endpoints with JWT token issuance (access and refresh tokens) and automatic creation of GuideProfile with verification_status = pending
- Admin login endpoint (no public signup path) with JWT token issuance

## What's In Progress / Partially Done
- <none>

## Decisions & Deviations
- Used JWT for stateless authentication (as per TAD)
- Used bcrypt for password hashing (via passlib)
- Access token expiration: 15 minutes, Refresh token expiration: 30 days (as per config)
- Role is derived from the token and verified against the database (defense in depth)
- For guides, after signup we create a GuideProfile with verification_status = pending (as per spec)
- Admin login only (no signup) as per spec (admin accounts are created via bootstrap script or by existing admins)

## Known Issues / TODOs
- <none>

## Environment / Setup Notes
- Run `alembic upgrade head` to apply migrations if not already done
- Backend runs on `http://localhost:8000` (as per docker-compose)
- Frontend apps expect API at `http://localhost:8000/api/v1` (as per .env.example)

## Ticket Log
| Ticket | Status | Notes |
|---|---|---|
| 0.0 | Done | Installed and enabled Ponytail (DietrichGebert/ponytail) |
| 0.1 | Done | Repo scaffolding: backend (FastAPI), web/connect_admin, mobile/connect_user, mobile/connect_guide |
| 0.2 | Done | PostgreSQL schema + Alembic migration setup, base models (User, GuideProfile, TourListing, Availability, Booking, ChatThread, Message) |
| 0.3 | Done | Env config scaffolding (.env.example for all four apps) and docker-compose for local Postgres |
| 0.4 | Done | create_admin.py bootstrap script for the first admin account |
| 0.5 | Done | Place logo_connect.png in a shared branding location and generate derivatives |
| 0.6 | Done | Design system foundation: implement color/typography/radii tokens and the shared component set (status chip, verified badge, avatar, rating stars, card, button, input, message bubble, skeleton loader, top status bar, bottom nav, home indicator) per Connect_Frontend_Spec.md §2, reused across connect_user and connect_guide |
| 1.1 | Done | Tourist signup/login (email+password), JWT issuance |
| 1.2 | Done | Guide signup/login, JWT issuance, initial `verification_status = pending` |
| 1.3 | Done | Admin login (no public signup path) |