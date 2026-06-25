# Independent Blank Site

This repository is prepared as an independent blank static website. It has no runtime dependency on any main website.

## Current State

- The public website root is `public/`.
- `public/index.html` intentionally renders a blank page.
- GitHub Pages deployment is prepared in `.github/workflows/deploy.yml`.
- Search engines are blocked for now in `public/robots.txt`.

## Needed Before Live Deployment

1. GitHub Pages enabled for this repository with GitHub Actions as the source.
2. DNS access for `love.q-c.hk` so the required records can point to the deployment platform.

The custom domain is already set in `public/CNAME`.
