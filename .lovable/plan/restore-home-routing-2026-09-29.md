# Restore Home routing

## Changes
- Keep `/` as the single canonical Home page and preserve its existing component and content unchanged.
- Add a compatibility redirect from `/home` to `/` so stale preview links no longer show the 404 page.
- Preserve the existing Home links, 404 “Go home” action, in-page How It Works scrolling, and active navigation styling.

## Verification
- Open and refresh `/` and `/home`, confirming `/home` redirects to the Home page.
- Click every main navigation destination and refresh each page to confirm none returns 404.
- Confirm How It Works scrolls within Home and does not open another route.
