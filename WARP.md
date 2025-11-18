# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project summary

Vite + React + TypeScript single-page application styled with Tailwind CSS and shadcn-ui, implementing a menu/cart experience for a Blaze Pizza–style storefront. The app is purely frontend, with static product data and local cart state.

## Commands

All commands are run from the project root.

- Install dependencies
  - `npm install`
- Run development server (Vite)
  - `npm run dev`
  - Dev server is configured to listen on `::` (all IPv6/IPv4) at port `8080` via `vite.config.ts`.
- Build for production
  - `npm run build`
  - Development-mode build (useful for debugging bundles): `npm run build:dev`
- Preview the production build locally
  - `npm run preview`
- Lint the codebase with ESLint
  - `npm run lint`

### Tests

There is currently no test runner or test script configured (no Jest/Vitest setup in `package.json`). Add a test framework before assuming any `npm test` or "run single test" workflows exist.

## High-level architecture

### Entry point and application shell

- `src/main.tsx` is the browser entry point. It imports global styles (`src/index.css`) and renders `<App />` into the `#root` element.
- `src/App.tsx` is the top-level application shell. It:
  - Creates a `QueryClient` from `@tanstack/react-query` and wraps the app in `QueryClientProvider` (ready for data fetching, even though current data is static).
  - Wraps children in `CartProvider` (global cart state) and `TooltipProvider`.
  - Mounts UI feedback systems: `@/components/ui/toaster` and `@/components/ui/sonner`.
  - Configures routing with `BrowserRouter` and `Routes` from `react-router-dom`:
    - `/` → `src/pages/Index.tsx` (main menu/catalog experience).
    - `*` → `src/pages/NotFound.tsx`, which logs 404s to the console and links back to `/`.
  - New routes should be added above the `"*"` catch-all in `App.tsx`, using components in `src/pages/`.
  - Route components should assume they are wrapped in `CartProvider`, `TooltipProvider`, and `QueryClientProvider` and can use those contexts directly.

#### React Query usage

- The app is pre-wired with `@tanstack/react-query` but currently uses only static data.
- When adding API-backed features, prefer colocating data-fetching hooks near domain logic (e.g., `src/hooks` or per-feature hooks under `src/pages/FeatureName/`).
- Keep React Query hooks inside the `QueryClientProvider` tree (i.e., inside `App.tsx`), and use query keys that reflect the domain (e.g., `['menu', 'pizzas']`, `['cart', 'offers']`).

### Pages and layout

- `src/pages/Index.tsx`
  - The main page orchestrating the layout: fixed `<Header />`, hero image, left navigation `<Sidebar />`, main content area of multiple `<ProductSection />`s, `<CartSidebar />` slide-over, and `<Footer />`.
  - Holds the static product/menu data as in-file arrays (e.g., `whatsHotProducts`, `elevenInchPizzas`, `largePizzas`, `desserts`, `drinks`, etc.), each passed to `ProductSection`.
  - Manages cart sidebar open/close state and uses `useCart().getTotalItems()` to populate the floating cart button badge.
- `src/pages/NotFound.tsx`
  - Simple 404 page using Tailwind utility classes and `useLocation` to log attempted paths.

### State management and cart domain

- `src/contexts/CartContext.tsx`
  - Centralized cart state using React context + `useState`.
  - `CartItem` model includes `id`, `name`, numeric `price`, `quantity`, `size` (`"11"` or `"Large"`), `toppings`, optional `specialInstructions` and `image`.
  - Deduplicates items on `addItem` by matching `name`, `size`, `toppings` (via JSON string compare), and `specialInstructions`, incrementing quantity instead of inserting duplicates.
  - Exposes API via `useCart()`:
    - `items`, `addItem`, `removeItem(id)`, `updateQuantity(id, quantity)` (removes if quantity ≤ 0).
    - Aggregations: `getTotalPrice()` and `getTotalItems()`.
  - `useCart()` throws if used outside `CartProvider`, so keep new cart consumers inside the provider tree in `App.tsx`.
- Cart-aware UI lives primarily in `src/components/ProductCard.tsx`, `src/components/CartSidebar.tsx`, and `src/pages/Index.tsx`.
  - When adding new cart entry points (e.g., quick-add buttons, recommendations), reuse `useCart()` instead of creating parallel cart state.
  - Keep price calculations and cart item shape consistent with `CartItem` so totals and quantities remain accurate.

### Components: layout and navigation

- `src/components/Header.tsx`
  - Fixed top header showing pickup/location info and logo. Maintains an internal `isLocationOpen` toggle for future location selection UI.
- `src/components/HeroSection.tsx`
  - Full-width hero image section beneath the header.
- `src/components/Sidebar.tsx`
  - Left-hand category navigation.
  - Uses an internal `activeItem` state to highlight the selected category.
  - `menuItems` is a fixed list of section titles (e.g., "What's Hot", "11-inch Pizzas").
  - Generates `href` anchors using a shared `slugify()` helper; these correspond to section IDs generated by `ProductSection`.
- `src/components/Banner.tsx` and `src/components/LoyaltyBanner.tsx`
  - Reusable promotional banners (pickup banner and loyalty "Flames" banner) that can be mounted into the layout as needed.

### Components: product display and cart

- `src/components/ProductSection.tsx`
  - Section wrapper for a set of products.
  - Accepts `title`, an array of `products`, and optional `layout` ("single" or "grid").
  - Uses `slugify(title)` to create section IDs, which align with `Sidebar` nav links.
  - Uses `framer-motion` (`motion.div`) to animate section and card appearance, with reduced-motion support via `useReducedMotion()`.
  - Renders `ProductCard` instances in a responsive grid or as a single featured card.
- `src/components/ProductCard.tsx`
  - Core component modeling a single menu item, tightly integrated with `CartContext`.
  - Key responsibilities:
    - Displays product info (name, price, description, imagery) with mobile/desktop-specific layouts.
    - Opens a dialog (`@/components/ui/dialog`) for detailed customization, including:
      - Size selection (`"11"` vs `"Large"`).
      - Topping selection grouped into categories (Meats, Veggies, Cheese, Sauce), with a configurable limit and per-topping surcharge.
      - `specialInstructions` textarea.
      - Quantity control via `QuantityControl` from `@/components/common`.
    - Computes pricing:
      - Extracts numeric base price from the price string.
      - Adds a flat `TOPPING_SURCHARGE` per selected topping and multiplies by quantity to compute the line-item total.
    - On add-to-cart, calls `addItem` on the cart context with the computed item and uses `toast.success` from `use-toast`/`sonner` to notify.
    - Resets local customization state when the dialog closes.
  - Heavily uses `framer-motion` for hover/tap animations and to keep interactions performant (`transform-gpu`, `will-change`).
- `src/components/CartSidebar.tsx`
  - Slide-over sheet component for the current order, driven by `open`/`onOpenChange` props.
  - Uses `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle` from `@/components/ui/sheet` for the panel, and `Button` from `@/components/ui/button`.
  - Reads cart state via `useCart()`:
    - Renders either an "empty cart" message or a list of `CartItemDisplay` components from `@/components/common`.
    - Displays a "Flames" loyalty teaser and a simple "You may also like" area.
    - Includes `ContactInput` for collecting a contact number and an optional utensils checkbox.
    - Shows the subtotal via `getTotalPrice()` and disables the Checkout button until the cart is non-empty and a contact number is provided.
- `Footer` (in `src/components/Footer.tsx`)
  - Standard footer at the bottom of the main layout (not shown above, but used in `Index.tsx`).

### Hooks and utilities

- `src/hooks/use-mobile.tsx`
  - `useIsMobile()` hook wrapping a `matchMedia` query against `MOBILE_BREAKPOINT = 768`.
  - Tracks viewport width and updates on media-query changes; returns a boolean indicating whether the viewport is "mobile".
- `src/hooks/use-toast.ts`
  - Custom toast store used by `@/components/ui/toast`:
    - Manages an in-memory list of toasts with a reducer, a `TOAST_LIMIT`, and a `TOAST_REMOVE_DELAY`.
    - Provides a `toast()` function to create new toasts (with `id`, `dismiss`, `update` helpers).
    - `useToast()` hook subscribes React components to toast state and exposes a `dismiss` dispatcher.
- `src/lib/utils.ts`
  - `cn(...inputs)` helper combining `clsx` and `tailwind-merge` for composing Tailwind className strings.

### Styling and configuration

- Tailwind configuration (`tailwind.config.ts`):
  - `darkMode: ["class"]` and a `container` preset centered with `2rem` padding.
  - Defines color tokens (`border`, `input`, `primary`, `secondary`, `destructive`, `muted`, `accent`, `popover`, `card`, and `sidebar` variants) and radius/animation utilities.
  - Scans `./pages/**/*.{ts,tsx}`, `./components/**/*.{ts,tsx}`, `./app/**/*.{ts,tsx}`, and `./src/**/*.{ts,tsx}` for class usage.
- PostCSS (`postcss.config.js`): Tailwind + Autoprefixer pipeline.
- Vite configuration (`vite.config.ts`):
  - React SWC plugin via `@vitejs/plugin-react-swc`.
  - Uses `lovable-tagger`'s `componentTagger()` plugin in development mode.
  - Sets the `@` path alias to `./src`.

## Conventions for future changes

- Use the `@` import alias for modules under `src` (e.g., `@/components/...`, `@/contexts/...`).
- Keep new cart-related components inside `CartProvider` so `useCart()` remains safe.
- When adding new menu sections, update:
  - The data arrays in `src/pages/Index.tsx`.
  - The `menuItems` list in `src/components/Sidebar.tsx` so navigation and section IDs stay in sync.
- New routes should be declared in `src/App.tsx` above the `"*"` catch-all route and backed by components under `src/pages/`.
- Favor page-level composition for new flows:
  - Put layout/flow orchestration in `src/pages/...`.
  - Keep reusable visual pieces in `src/components/...` and domain state in contexts/hooks.
- For future API integrations:
  - Introduce feature-specific hooks (e.g., `useMenu`, `useDeals`) that wrap React Query, and call them from pages/components rather than inlining `useQuery` everywhere.
- For future cart features (promotions, loyalty, fees):
  - Extend `CartItem` and `CartContext` rather than bolting calculations directly into UI components, so totals remain centralized.
