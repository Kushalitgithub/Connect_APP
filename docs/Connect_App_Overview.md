# Connect — App Overview

## 1. Vision

Connect is a Nepal-focused tourism marketplace that connects independent travelers directly with local, verified guides. It replaces informal, hard-to-trust arrangements (street touts, unverifiable WhatsApp contacts) with a platform that handles discovery, booking, in-app communication, payments (future milestone), and trust/safety — while giving local guides a legitimate digital storefront and income channel.

## 2. Products

Connect ships as three coordinated products sharing one backend and one database:

| Product | Audience | Platform |
|---|---|---|
| **Connect User** | Tourists / travelers | React + Capacitor (native iOS/Android + PWA) |
| **Connect Guide** | Local guides | React + Capacitor (native iOS/Android + PWA) |
| **Connect Admin** | Internal staff / moderators | React web (browser only) |

All three talk to a single **Connect API** (FastAPI) backed by one **PostgreSQL** database, so business rules (booking validity, verification state, roles) are never duplicated client-side.

## 3. Core User Loops

**Tourist (Connect User)**
Discover guides → view guide profile & tours → book a tour → chat with guide → complete trip → leave a review.

**Guide (Connect Guide)**
Register → submit verification documents → get approved → create tour listings → receive & accept booking requests → chat with tourists → complete trip → get paid (future milestone) → build review history.

**Admin (Connect Admin)**
Review & verify guide applications → monitor live bookings and disputes → moderate reviews/chat reports → resolve escalations → view marketplace analytics.

## 4. Product Boundaries

- Connect is a **tourism / guide marketplace**, not a ride-sharing or general gig-work platform.
- **Payments** (in-app checkout, guide payouts, escrow) is a separate, later milestone — v1 focuses on discovery, booking requests, and communication.
- **Figma is the single visual source of truth** for all UI; the Frontend Spec translates Figma into buildable structure but never overrides it.
- Admin is **not** a public signup role — accounts are provisioned internally only.

## 5. Target Users

- **Tourists:** independent and small-group travelers visiting Nepal who want a vetted local guide without relying on informal street arrangements.
- **Guides:** individual local guides (trekking, city, cultural, adventure) who want a legitimate digital channel for bookings, separate from agencies.
- **Admin/staff:** a small internal team responsible for guide verification, trust & safety, and marketplace health.

## 6. Document Map

This overview sits alongside five companion documents. An AI coding agent or engineer should read them **in this order** before writing code:

1. **Connect_App_Overview.md** *(this document)* — what we're building and why
2. **Connect_PRD.md** — product requirements and user stories
3. **Connect_TAD.md** — technical architecture, stack, data model, API design
4. **Connect_Security_Access_Spec.md** — auth, roles, authorization rules
5. **Connect_Frontend_Spec.md** — navigation, screens, design system
6. **Connect_Feature_Ticket_List.md** — the actual buildable backlog, broken into tickets

Then consult the Figma file for exact visual detail before implementing any screen.
