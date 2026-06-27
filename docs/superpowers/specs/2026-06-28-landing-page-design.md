# Landing Page Design Spec

## Objective
Create a modern, responsive, and professional `LandingPage.vue` for the SewaKi application (a multi-role item rental platform) using Vue 3 (Composition API / Script Setup) and Tailwind CSS. The landing page serves as the entry point for non-authenticated guests.

## Architecture & Routing
1. **New Component**: Create `src/views/LandingPage.vue`.
2. **Router Update (`src/router/index.js`)**:
   - The root path `/` will route to `LandingPage.vue`.
   - Add `meta: { hideNavbar: true }` to `/` so it uses its own custom internal navbar.
   - In the `beforeEach` navigation guard, add a rule: If a user is authenticated and attempts to access `/`, redirect them based on their role:
     - Owner (`pemilik`) -> Redirect to `/dashboard`.
     - Renter (`user`/`penyewa`) -> Redirect to `/katalog`.
3. **Cleanup**: Delete `src/views/Home.vue` and `src/views/Home.css` as their functionality is entirely replaced by `Katalog.vue` and `LandingPage.vue`.

## UI/UX Design (Clean Split-Screen Approach)
The design will follow a clean, SaaS-style aesthetic using pure Tailwind CSS utility classes and the project's design system tokens (e.g., `text-ink`, `bg-canvas`).

### 1. Custom Navbar
- **Left**: 'SewaKi' brand logo/typography.
- **Center**: 'Katalog Barang' navigation link.
- **Right**: Authentication actions ('Login' button as outline/ghost, 'Daftar' button as primary solid).

### 2. Hero Section (Split-Screen)
- **Left Column (Content)**:
  - **Headline**: "Ubah Barang Nganggur Jadi Cuan" (Bold, large font).
  - **Sub-headline**: "Platform sewa barang terpercaya untuk pemilik yang ingin penghasilan tambahan dan penyewa yang mencari kemudahan." (Muted text, readable line height).
  - **CTA Button**: Large primary button labeled "Mulai Sekarang" that redirects to the `/register` route.
- **Right Column (Visual)**:
  - An aesthetic graphic/illustration placeholder or a high-quality relevant image from Unsplash, featuring rounded corners and soft SaaS-like shadow (`shadow-xl`, `rounded-2xl`).

### 3. Value Proposition (Grid Section)
- A 3-column grid layout displaying feature cards.
- **Card Style**: White background, thin hairline borders, soft shadows, and border-radius.
- **Content** (using Heroicons):
  1. **Pemilik (Owner)**: Monetisasi barang nganggur dengan sistem aman. (Icon: Store/Briefcase)
  2. **Penyewa (Renter)**: Akses ribuan barang dengan harga sewa terjangkau. (Icon: Shopping Bag)
  3. **Keamanan (Security)**: Sistem mediasi sengketa oleh Admin dan deposit terjamin. (Icon: Shield Check)

### 4. How it Works (Steps Section)
- A visually distinct section (e.g., `bg-surface-soft`).
- Displays a 3-step process:
  - Step 1: Cari Barang
  - Step 2: Ajukan Sewa
  - Step 3: Nikmati Barang
- Styled with clean typography, numbered badges, and supportive icons.

## Data Flow & State
- This component is primarily presentation-focused (stateless UI).
- It relies on `vue-router` (`useRouter`) for navigation to authentication pages (`/login`, `/register`) and the catalog (`/katalog`).
- No complex backend data fetching is required for this specific view.
