# Connect — Security & Access Specification

Version 1.0 · Read after `Connect_TAD.md`. Every ticket in `Connect_Feature_Ticket_List.md` that touches a write endpoint must be checked against this document.

## 1. Core Principle

**All authorization decisions are made server-side, based on the authenticated session — never trusted from the client.** A request body containing `role`, `user_id`, `guide_id`, or a status field is advisory at best; the server always re-derives the actor's identity and permissions from the verified JWT and the database.

## 2. Roles

| Role | Granted via | Can do |
|---|---|---|
| `tourist` | Public self-signup | Browse, book, chat as tourist, review, manage own profile |
| `guide` | Public self-signup + admin verification gate | Manage own listings/bookings/chat, cannot act until `verification_status = approved` |
| `admin` | **Not** public signup — provisioned only by existing admin or backend bootstrap script | Verify guides, moderate, resolve disputes, view analytics, manage admin accounts |

## 3. Authentication

- JWT access token (short-lived, e.g. 15 min) + refresh token (longer-lived, rotated on use).
- Access token payload includes `user_id` and `role`, signed by the backend — the client cannot modify it without invalidating the signature.
- Refresh tokens are stored server-side (or as a revocable list) so a compromised session can be invalidated.
- Passwords are hashed (bcrypt/argon2) — never stored or logged in plaintext.

## 4. Authorization Rules by Resource

### GuideProfile / Verification
- Only the owning guide can edit their own profile.
- Only `admin` can change `verification_status`.
- A guide with `verification_status != approved` cannot create/activate `TourListing`s and cannot appear in tourist-facing search.

### TourListing
- Create/edit/deactivate: only the owning, verified guide.
- Read: public for active listings from approved guides; guides can read their own inactive listings; admin can read all.

### Booking
- Create: only an authenticated `tourist`, and only against an active listing with available capacity on the requested date.
- Accept/decline: only the `guide` who owns the target listing.
- Status transitions are enforced server-side as a state machine: `pending → accepted|declined`, `accepted → completed|cancelled`. No other transitions are valid, and no role can skip states.
- **Race-condition rule:** booking creation must acquire a lock (or use a DB constraint/transaction) on the specific `Availability` slot so two simultaneous requests cannot both succeed against the last remaining slot.

### Chat (ChatThread / Message)
- Only the two participants (`tourist_id`, `guide_id`) of a thread can read or send messages in it.
- WebSocket subscriptions must verify the connecting user is a participant of the thread before allowing subscription — checked on every connect, not just at thread creation.
- Admin can read chat content only in the context of an active moderation `Report` investigation, and such access should be logged (audit trail).

### Review
- Create: only the `tourist` who completed that specific `booking`, and only once per booking.
- Edit/delete by the author within a limited window (e.g. 24h); after that, only admin can remove (e.g. for moderation reasons).

### Report / Moderation
- Create: any authenticated user.
- Read/resolve: `admin` only.

### Admin Accounts
- No public signup endpoint for `admin` role exists.
- New admin accounts are created only by (a) an existing admin through an admin-only endpoint, or (b) the one-time `create_admin.py` bootstrap script at deploy time.

## 5. Data Protection

- Verification documents (ID scans, certifications) are stored in a private bucket path, never public. Access requires a short-lived signed URL generated server-side after an authorization check (owning guide or admin only).
- PII (email, phone, documents) is never included in public API responses (e.g. public guide profile endpoints strip contact info; contact happens via in-app chat).
- All admin actions that change verification status, resolve disputes, or remove content are written to an audit log (`actor_id`, `action`, `target`, `timestamp`).

## 6. Input Validation & Abuse Prevention

- Rate limiting on auth endpoints (login, signup, password reset) to prevent brute force.
- Rate limiting on booking creation and chat message send to prevent spam.
- File upload validation (type, size) on verification documents and images before accepting into object storage.
- Standard OWASP protections: parameterized queries (ORM), CSRF protection on admin web forms, input sanitization on all free-text fields (chat, reviews, bios).

## 7. Transport & Infra

- HTTPS/TLS everywhere; no plaintext HTTP in staging or production.
- WebSocket connections upgrade over TLS (WSS) and re-validate the JWT at connect time.
- Secrets (DB credentials, JWT signing key, S3 keys) live in environment configuration / secrets manager — never committed to the repo.

## 8. Checklist for Every New Write Endpoint

Before merging any endpoint that creates, updates, or deletes data, confirm:

- [ ] Role is read from the verified session, not the request body.
- [ ] Ownership is checked against the database (e.g. "does this `guide_id` match the authenticated user's guide profile?").
- [ ] Status transitions follow the defined state machine, if applicable.
- [ ] Race conditions are handled for any capacity-limited or uniqueness-constrained write.
- [ ] Sensitive fields (documents, PII) are not leaked in the response payload.
