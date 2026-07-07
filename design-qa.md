# LOVE QC QA Notes

## Current Build

- `npm run build` passes.
- Vite development server tested locally at `http://localhost:8091/`.
- Checked HTTP 200 for `/`, `/product/p01`, `/checkout`, and `/admin/login`.
- `dist/` includes `index.html`, `404.html`, `CNAME`, `.nojekyll`, and compiled assets.

## Implemented Scope

- 18+ age gate and `/age-denied`.
- Mobile storefront, categories, category listing, search, product detail, cart, checkout, payment result.
- Login, account center, orders, order detail, favorites, history, coupons, membership, addresses.
- Articles, article detail, privacy delivery, support, privacy policy, terms, return policy, 404.
- Mock admin login and admin modules for dashboard, products, categories, orders, coupons, banners, articles, reviews, users, and settings.

## Constraints

- Product imagery is abstract UI art only.
- Payment is mock adapter only, with no real payment credentials.
- Personal data is localStorage mock data prefixed with `loveqc_`.
