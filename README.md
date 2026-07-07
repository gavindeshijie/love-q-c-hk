# LOVE QC Private Select

Mobile-first 18+ private select storefront for `love.q-c.hk`.

## Stack

- React 19
- TypeScript
- Vite
- CSS variables / mobile-first component styles
- GitHub Pages deployment from `dist/`

## Local Development

```bash
npm install
npm run dev
npm run build
```

## Test Accounts

- Frontend user: any phone number or email with mock verification.
- Admin: `admin / loveqc2026`

## Deployment

`public/CNAME` keeps the custom domain `love.q-c.hk`.

Pushes to `main` run GitHub Actions:

1. `npm ci`
2. `npm run build`
3. deploy `dist/` to GitHub Pages

## Notes Before Production

Merchants still need to provide:

- Real product images
- Real inventory
- Real payment channel configuration
- Real delivery rules
- Real customer-service contacts
- Final privacy policy, terms, and return/legal policy
