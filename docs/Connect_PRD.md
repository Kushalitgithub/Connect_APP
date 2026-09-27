# Connect — Product Requirements Document (PRD)

Version 1.0 · See `Connect_App_Overview.md` for context before reading this document.

## 1. Problem Statement

Tourists visiting Nepal struggle to find trustworthy, verified local guides. Existing options are informal (street touts, unverified social media contacts) with no accountability, no reviews, and no safety net. Local guides, meanwhile, lack a legitimate digital storefront that doesn't route through an agency taking a large cut.

## 2. Goals (v1)

- Let tourists discover and book verified local guides with confidence.
- Let guides create a professional profile, list tours, and manage bookings without needing an agency.
- Give staff the tools to verify guides and keep the marketplace trustworthy.
- Ship a working, secure, real-time (chat) marketplace loop — **excluding payments**, which is a later milestone.

## 3. Non-Goals (v1)

- In-app payments, escrow, or payouts.
- Multi-country expansion (Nepal only for v1).
- Ride-sharing, transport booking, or non-guide services.
- Public self-service admin signup.

## 4. Personas

| Persona | Summary |
|---|---|
| **Tourist (Tina)** | Visiting Nepal for 1–3 weeks, wants a vetted guide for trekking/cultural tours, values reviews and responsiveness. |
| **Guide (Gopal)** | Independent local guide, wants bookings without an agency cut, needs to prove legitimacy via verification. |
| **Admin (Asha)** | Internal staff, verifies guides, monitors disputes, keeps the platform safe. |

## 5. Feature Requirements by Product

### 5.1 Connect User (Tourist app)

| # | Requirement | Priority |
|---|---|---|
| U1 | Browse/search guides by location, tour type, date availability, rating | Must |
| U2 | View guide profile: bio, verification badge, tours offered, reviews, photos | Must |
| U3 | View tour listing detail: itinerary, price, duration, group size, availability | Must |
| U4 | Request/create a booking for a specific tour and date | Must |
| U5 | View booking status (pending / accepted / declined / completed / cancelled) | Must |
| U6 | In-app chat with a guide, scoped to a booking or pre-booking inquiry | Must |
| U7 | Leave a rating + written review after a completed trip | Must |
| U8 | Push notifications for booking status changes and new chat messages | Should |
| U9 | Manage own profile (name, photo, contact info, preferences) | Must |
| U10 | Report a guide, listing, or chat message for abuse | Should |

### 5.2 Connect Guide (Guide app)

| # | Requirement | Priority |
|---|---|---|
| G1 | Register and submit verification documents (ID, certifications) | Must |
| G2 | View verification status (pending / approved / rejected + reason) | Must |
| G3 | Create/edit/deactivate tour listings (title, description, itinerary, price, capacity, availability calendar) | Must |
| G4 | View and respond to incoming booking requests (accept/decline) | Must |
| G5 | View upcoming and past bookings (dashboard) | Must |
| G6 | In-app chat with tourists, scoped to a booking or inquiry | Must |
| G7 | View own reviews and average rating | Must |
| G8 | Push notifications for new booking requests and chat messages | Should |
| G9 | Manage own profile and public-facing bio | Must |

### 5.3 Connect Admin (Staff web)

| # | Requirement | Priority |
|---|---|---|
| A1 | Review pending guide verification submissions; approve/reject with reason | Must |
| A2 | Search/filter all guides, tourists, bookings | Must |
| A3 | View and moderate reported content (reviews, chats, profiles) | Must |
| A4 | Manually resolve booking disputes (cancel/refund-flag, since no live payments in v1 this is a status override) | Must |
| A5 | View marketplace analytics (active guides, bookings/week, top locations) | Should |
| A6 | Manage internal admin accounts (staff only, no public signup) | Must |

## 6. Cross-Cutting Requirements

- **Race-condition safety:** two tourists cannot both book the same guide/date/capacity-limited slot; booking creation must be server-side validated and atomic.
- **Verification gating:** unverified guides cannot publish tour listings or receive bookings.
- **Role-based visibility:** all authorization decisions happen server-side, based on the authenticated session's role — never trusted from the client (see `Connect_Security_Access_Spec.md`).
- **Chat scoping:** chat threads are tied to a guide-tourist pair and, where applicable, a booking — not a global inbox.

## 7. Success Metrics (v1)

- % of guide applications verified within 48 hours.
- Booking request → acceptance rate.
- Average guide response time to booking requests / chat messages.
- Review completion rate after trip completion.
- Zero double-bookings in production.

## 8. Open Questions / Future Milestones

- Payment integration and payout flow (post-v1).
- Multi-language support (English/Nepali at minimum).
- Guide availability calendar sync with external calendars.
- Dynamic pricing / seasonal rates.
