# Design Spec: Major Login Page Redesign

This document specifies the redesign of the login page for SewaKi, changing it into a professional, high-standard split-screen layout with an interactive marketplace collage on the left and a clean, spacious login form on the right.

## Goals & Constraints
- **Goal**: Rebuild the login page (`src/views/Auth/login/index.vue` and its components) to look like a premium SaaS application, moving away from "AI-looking" generic templates.
- **Navbar Constraint**: The login page must NOT display the global navigation bar.
- **Layout**: Split-screen design (50/50 split on desktop, full-width form on mobile).
- **Styling**: Utilize the existing design system tokens from `DESIGN.md` and CSS variables, styled via Tailwind utility classes.

---

## Proposed Layout & Routing Changes

### 1. Router Metadata for Global Layout Control
To conditionally hide the Navbar on the login page, we will add a metadata flag.

**File to modify:** `src/router/index.js`
- Route `/login` will receive `meta: { guestOnly: true, hideNavbar: true }`.

**File to modify:** `src/App.vue`
- Update the `<template>` to conditionally render `<Navbar />` using `v-if="!route.meta.hideNavbar"`.

---

## Detailed Page Structure: `src/views/Auth/login/index.vue`

The redesigned layout consists of two primary columns in a full-height container:

```
+------------------------------------------+------------------------------------------+
| LEFT COLUMN (hidden on mobile)           | RIGHT COLUMN                             |
| bg-surface-soft (#f7f7f7)                | bg-canvas (#ffffff)                      |
|                                          |                                          |
| - SewaKi text logo                       | - Centered Form Container                |
| - Header text (Marketplace focus)        | - "Masuk ke Akun Anda" Title             |
|                                          | - Inline alerts (Success/Error)          |
| - Activity Collage (Overlap cards):      | - Stacked Fields (Email & Password)      |
|   1. Transaction Notification Card       | - Rausch Primary Button (#ff385c)        |
|   2. Calendar Booking Simulator          | - Register footer link                   |
|   3. Earning Performance Bar Chart       |                                          |
+------------------------------------------+------------------------------------------+
```

### Left Column: Interactive Activity Collage (Desktop Only)
- **Background**: `bg-surface-soft` (`#f8f9fa` / `var(--color-surface-soft)`) with a clean layout.
- **Branding**: The logo text `"SewaKi"` in `font-sans font-bold text-xl tracking-tight text-ink` (no SVG icon at logo level, just typography).
- **Headline**: `"Kelola Persewaan dalam Satu Platform."` in `text-3xl font-semibold font-sans tracking-tight text-ink`.
- **Subtitle**: `"Mulai menyewakan barang pribadi Anda atau temukan peralatan terbaik di sekitar Makassar."` in `text-sm text-body leading-relaxed max-w-[400px] mt-sm`.
- **Collage Cards Container**: A relative container hosting three absolute-positioned components representing marketplace data. Each component uses clean borders, light shadow elevations, and subtle rotations for visual interest:
  1.  **Transaction Alert Card (`Card 1`)**:
      - Positioned top-left (`top-4 left-6`).
      - Design: White canvas, `rounded-md`, `border border-hairline`, `shadow-md`, `p-md`.
      - Content: User avatar placeholder, text `"Kamera Sony Alpha 7 III disewa oleh @budi_s selama 3 hari"`, status tag `"Disewa"` in success pastel styling (`bg-success/15 text-success`), and timestamp `"Baru saja"`.
  2.  **Calendar Simulator Card (`Card 2`)**:
      - Positioned middle-right (`top-28 right-4`).
      - Design: White canvas, `rounded-md`, `border border-hairline`, `shadow-md`, `p-md`.
      - Content: Mini calendar grid of a month (e.g., June 2026). Selected/Booked dates highlighted in Rausch red (`bg-primary text-on-primary rounded-full`).
  3.  **Earnings Stats Card (`Card 3`)**:
      - Positioned bottom-left (`bottom-8 left-4`).
      - Design: White canvas, `rounded-md`, `border border-hairline`, `shadow-md`, `p-md`.
      - Content: Label `"Total Pendapatan"`, value `"Rp 2.450.000"`, a growth tag `"+18.4%"` in green text, and a clean three-month mini bar chart mockup (using styled div heights).

### Right Column: Clean Form Section (All Viewports)
- **Background**: `bg-canvas` (`#ffffff`).
- **Typography & Form Header**:
  - Centered structure inside a max-width wrapper (`max-w-[400px]`).
  - Title: `"Masuk ke Akun Anda"` in `text-2xl font-bold font-sans tracking-tight text-ink`.
  - Subtitle: `"Silakan masukkan email dan password untuk melanjutkan"` in `text-sm text-muted mt-xs`.
- **Form Controls (`src/views/Auth/login/components/LoginForm.vue`)**:
  - **Inputs**: Use stacked labels above inputs. Inputs must have `1px border-hairline` border, `rounded-md` corners, and a height of `56px`. On focus, the border shifts to a crisp `2px border-ink` (`var(--color-ink)`) with no glowing shadow or outer rings.
  - **Submit Button**: `button-primary` styling in Rausch red (`bg-primary text-on-primary`), `height: 48px`, `rounded-md`, and transition to `bg-primary-active` on hover/active state.
  - **Alert Banners**: Re-styled inline banners for success and error handling. Soft pastel borders and backgrounds (`bg-error/5 border-error/20 text-error`) with no rounded card wrapper around the form.

---

## Verification Plan

### Manual Verification
1. Open the dev server and navigate to `/login`.
2. Verify that the global navigation bar is hidden.
3. Validate layout responsiveness:
   - On desktop: Verify the two-column split. Check that the left-hand activity collage cards render cleanly with correct shadows and rotations.
   - On mobile (width < 768px): Verify that the left column is completely hidden and the form column centers nicely with the SewaKi logo placed on top.
4. Interact with the form inputs:
   - Focus on input fields and check that the border thickness transitions to 2px charcoal-ink with no shadow rings.
   - Test password reveal/hide functionality.
5. Attempt logging in with valid and invalid credentials to verify API error banners and success redirection.
