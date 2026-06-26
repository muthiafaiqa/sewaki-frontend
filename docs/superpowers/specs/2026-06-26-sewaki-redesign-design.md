# Design Spec: Sewaki Frontend Redesign & Architectural Reconstruction

**Date:** 2026-06-26  
**Status:** Draft / Pending Review  
**Topic:** Sewaki Frontend Architectural Refactoring & Design Pattern Implementation

---

## 1. Executive Summary

This document specifies the redesign and structural overhaul of the Sewaki Frontend application. The project currently has a flat view architecture where each page is represented by a single, monolithic `.vue` file. This redesign will:
1. **Reconstruct the Vue Architecture** using a feature-based folder structure, enforcing separation of concern via sub-components and composables as outlined in `vue.md`.
2. **Apply the Design Pattern from `DESIGN.md`** (inspired by Cal.com's clean SaaS aesthetic: white canvas floor, `#111111` primary CTAs, Inter/Cal Sans typography, soft-rounded cards, and a dark footer to close long-scroll pages).
3. **Build Key Core Pages** including a functional `Katalog` page from scratch and populating empty views in the `Transaksi/` namespace.

---

## 2. Architectural Design

### 2.1. Feature-Based Directory Structure
Currently, pages are placed flatly inside `src/views/`. We will group them into self-contained feature folders. Each folder will contain:
*   `index.vue`: The entry page component registered with the router.
*   `components/`: Local sub-components scoped specifically to this view.
*   `composables/`: Local composables containing the reactive state, API requests, and business logic for this view.

**Example Structure (`src/views/Home/`):**
```
src/views/Home/
├── index.vue
├── components/
│   ├── HeroBand.vue
│   ├── FeaturedItems.vue
│   └── CategoryFilter.vue
└── composables/
    └── useHomeData.js
```

### 2.2. Global Shared Components
Reusable design atoms and molecules will be placed in `src/components/ui/` and `src/components/layout/`:
*   `BaseButton.vue`: Enforces the primary near-black and secondary hairline button designs.
*   `BaseInput.vue`: Follows the hairline inputs design with active focus states.
*   `BaseBadge.vue`: Standardized status/pill tags using the pastel/brand palettes.
*   `BaseCard.vue`: Standard container box with `{rounded.lg}` and card surfaces.
*   `AppFooter.vue`: The deep near-black (`#101010`) closing footer.

---

## 3. Design System Integration (`DESIGN.md` mapping)

We will introduce a central design system stylesheet in `src/styles/` containing:
*   **Colors**:
    *   `--color-canvas`: `#ffffff` (default background)
    *   `--color-primary`: `#111111` (all primary buttons and titles)
    *   `--color-surface-card`: `#f5f5f5` (feature card and item backgrounds)
    *   `--color-surface-dark`: `#101010` (footer and featured card background)
    *   `--color-hairline`: `#e5e7eb` (1px borders)
*   **Typography**:
    *   Display sizes (Cal Sans/Inter 600 weight, negative letter spacing for headers).
    *   Body text (Inter, standard readability sizes).
*   **Border Radius**:
    *   `--rounded-md`: `8px` (buttons, inputs)
    *   `--rounded-lg`: `12px` (cards)
    *   `--rounded-xl`: `16px` (marquee/hero mockup frames)
    *   `--rounded-pill`: `9999px` (badges, pill segments)

---

## 4. Feature Specifications & Content Generation

### 4.1. Katalog.vue (To Be Reconstructed)
*   **Goal**: Create a brand-new, clean product directory listing page.
*   **UI/UX**: Sidebar filters for category, price range, and search bar. Grid cards displaying item photo, title, owner, daily price, and deposit.
*   **Logic**: A `useKatalogFilter.js` composable that fetches items reactively based on active query params.

### 4.2. Transaksi Namespace (`KelolaDeposit.vue` & `Pembayaran.vue`)
*   **Goal**: Fill the 0-byte placeholders with actual transaction and payment interfaces.
*   **Pembayaran.vue**: A Cal.com-styled invoice summary showing items rented, rent duration, total deposit refund terms, and a checkout button integrated with Xendit redirect flow.
*   **KelolaDeposit.vue**: A table-based interface for rental owners to review deposits, mark items as inspected, and approve deposit releases back to tenants.

---

## 5. Transition & Route Strategy
All routes in `src/router/index.js` will be updated to point to the new nested directory indexes (e.g., `../views/Home/index.vue` instead of `../views/Home.vue`). We will use dynamic lazy-loading `component: () => import(...)` to optimize chunking and loading performance.

---

## 6. Self-Review Checklist
*   **Placeholders**: Checked. No "TBD" or vague specifications are left.
*   **Consistency**: Direct paths and token names perfectly match `DESIGN.md`.
*   **Incremental plan**: The plan is structured step-by-step from base tokens to views.
