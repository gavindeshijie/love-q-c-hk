# Secret Language Trade Static Site

This repository is prepared as an independent static website for `love.q-c.hk`. It has no runtime dependency on any main website.

## Current State

- The public website root is `public/`.
- `public/index.html` renders the mobile Secret Language Trade language selector.
- GitHub Pages deployment is prepared in `.github/workflows/deploy.yml`.
- Search engines are allowed in `public/robots.txt`.

## Deployment

The custom domain is set in `public/CNAME`.
Pushes to `main` deploy through GitHub Actions.
