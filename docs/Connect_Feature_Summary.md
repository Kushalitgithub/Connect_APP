# CONNECT App Features Summary

## Theme and Colors

### Primary Palette
- **Primary**: `#F54900` ( vibrant orange )
- **Primary Light**: `#FF6B2B`
- **Primary Dark**: `#C23900`
- **Accent**: `#F4A261` ( light orange/brown )
- **Accent Light**: `#F7BC8A`
- **Accent Dark**: `#E08040`

### Neutral Palette
- **Background**: `#F7F5F0` ( off-white )
- **Surface**: `#FFFFFF` ( white )
- **Surface Alt**: `#F0EDE6`
- **Text Primary**: `#1A1A2E` ( dark blue )
- **Text Secondary**: `#4A5568` ( grayish blue )
- **Text Muted**: `#9AA3B2` ( light gray )
- **Border**: `#E8E4DC` ( light beige )

### Status Colors
- **Success**: `#FF6B2B` ( orange )
- **Warning**: `#F4A261` ( same as accent )
- **Error**: `#E05252` ( reddish )
- **Pending**: `#F59E0B` ( amber )
- **Star**: `#FBBF24` ( yellow )

### Status Chip Colors
- **Pending**: `#FEF3C7` ( background ), `#92400E` ( text )
- **Accepted**: `#D1FAE5` ( background ), `#065F46` ( text )
- **Rejected**: `#FEE2E2` ( background ), `#991B1B` ( text )
- **Completed**: `#E0F2FE` ( background ), `#0369A1` ( text )
- **Cancelled**: `#F3F4F6` ( background ), `#6B7280` ( text )

## Typography
- **Sans Serif**: `'Outfit', system-ui, sans-serif`
- **Serif**: `'DM Serif Display', Georgia, serif`

## Border Radii
- **sm**: `8px`
- **md**: `12px`
- **lg**: `16px`
- **xl**: `24px`
- **2xl**: `32px`
- **full**: `9999px`

## Animations and Transitions

### Screen Transitions
- **screen-enter-right**: Slide in from right (`translateX(28px)` to `0`, opacity `0` to `1`)
- **screen-enter-left**: Slide in from left (`translateX(-28px)` to `0`, opacity `0` to `1`)
- **screen-enter-fade**: Fade in with slight scale (`opacity 0` to `1`, `scale(0.98)` to `1`)
- **slide-up**: Slide up from bottom (`translateY(20px)` to `0`, opacity `0` to `1`)
- **fade-in**: Simple fade in (`opacity 0` to `1`)

### Special Animations
- **splashLogo**: Initial logo animation (`opacity 0` to `1`, `scale(0.82)` to `1`, `blur(8px)` to `0`)
- **shimmer**: Skeleton loading animation (moving gradient background)

### Interactive States
- Button active state: `scale(0.98)` with color shift
- Hover/focus states on inputs, buttons, and cards with background/border changes
- Nav item active state: background color change

## App Features

### Authentication & Onboarding
- **Onboarding Screen**: Introduction with options to login, signup, continue as guide, or admin login
- **Login/Signup**: Role selection (tourist/guide) during signup/login
- **Admin Login**: Separate admin authentication flow
- **App Switcher**: Floating button to switch between Tourist, Guide, and Admin apps
- **Role-based Experience**: Different navigation and screens based on user role (tourist, guide, admin)

### Navigation
- **Bottom Navigation Bar**: 
  - Tourist: Home, Find, Bookings, Inbox
  - Guide: Dashboard, Requests, Bookings, Inbox
  - Admin: Dashboard, Users, Guides, Verification, Bookings, Tours, Reviews, Reports, Settings (accessible via screens)
- **Floating Nav**: Glassmorphism design with backdrop blur
- **Screen History**: Tab-aware navigation with direction-based animations (left/right based on tab order)
- **Screen Data Passing**: Navigation carries data between screens (e.g., guide profile to booking)

### Tourist Features
- **Home Screen**:
  - Search destinations (with overlay)
  - Popular destination cards (horizontal scroll)
  - Popular guides cards
  - Recommended experiences cards
- **Destination Exploration**:
  - Search bar with real-time filtering
  - Location detail view with:
    - Hero image with gradient overlay
    - Quick stats (altitude, guide count, best time)
    - Tags
    - Description
    - Highlights (must-see places)
    - Best time to visit
    - CTA to find guides in that location
- **Guide Discovery**:
  - Browse popular guides
  - Search for guides by location
  - Guide profile with:
    - Verified badge
    - Rating and review count
    - Specialty and languages
    - Price per day
    - About, experience, places covered
    - Action buttons: Book, Message
- **Booking Flow**:
  - Select guide → Booking screen (date selection, etc.) → Confirmation → Bookings list
  - Leave review after booking completion
- **Profile & Settings**:
  - View/edit profile
  - Notification center (bell badge)
  - Logout option

### Guide Features
- **Guide Dashboard**:
  - Overview of requests, bookings, earnings
- **Guide Requests**: Incoming booking requests to accept/reject
- **Guide Bookings**: Manage confirmed bookings
- **Guide Earnings**: Track income and payouts
- **Guide Tours**: Create and manage tour offerings
- **Inbox**: Communication with tourists

### Admin Features
- **Admin Dashboard**: Overview of platform metrics
- **User Management**: View and manage tourist and guide accounts
- **Guide Management**: Verify guides, manage profiles
- **Booking Oversight**: View all bookings across platform
- **Tour Management**: Admin oversight of tour offerings
- **Review Moderation**: Manage user-generated reviews
- **Reports & Analytics**: Generate reports on platform usage
- **Settings**: Platform configuration options

### Common UI Components
- **Status Bar**: Top bar with back button, title, and actions (light/dark variants)
- **Bottom Nav**: Floating glassmorphism navigation
- **Cards**: Glassmorphism cards with backdrop blur and subtle shadows
- **Buttons**: 
  - Primary (orange background)
  - Secondary (orange outline)
  - Accent (different orange background)
- **Inputs**: Glassmorphism input fields with focus states
- **Avatars**: Circular image containers with fallback background
- **Chips**: Small tags for status, specialties, etc.
- **Badges**: Verified badge, notification counters
- **Rating Stars**: Star display for guide and experience ratings
- **Message Bubbles**: Sent/received styling in chat
- **Skeleton Loaders**: Shimmering placeholders while content loads
- **Overlay/Popup**: Glassmorphism overlays for search and modals
- **Home Indicator**: Bottom iPhone-style home bar

### Technical & UX Features
- **Responsive Design**: Adapts to mobile and smaller screens (max-width: 480px)
- **Smooth Animations**: All screen transitions and interactive elements use hardware-accelerated animations
- **Glassmorphism**: Extensive use of backdrop-filter and background blur for modern iOS/Android aesthetic
- **Icon System**: Uses lucide-react for consistent, lightweight icons
- **Data Mocking**: Uses mock data for locations, guides, experiences (shown in Home.tsx)
- **TypeScript**: Strong typing throughout (React + TypeScript)
- **Vite + Tailwind CSS v4**: Modern build system with utility-first styling
- **Figma Make Integration**: Designed to run inside Figma Make environment

## Summary
The CONNECT app is a comprehensive platform connecting tourists with local guides in Nepal, featuring role-specific experiences for tourists, guides, and administrators. The design emphasizes a modern glassmorphism aesthetic with smooth animations, intuitive navigation, and a warm orange color scheme inspired by Nepalese landscapes and culture.

---
*Features extracted from source code review: App.tsx, index.css, Home.tsx, and related component files.*