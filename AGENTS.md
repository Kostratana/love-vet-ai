<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Pet owner / vet accounts and reviews are frontend-only via `src/lib/account-store.ts` (browser storage) — brief forbids backend for these until integration is planned.
- Keep `/` as the canonical Home route and redirect legacy `/home` visits to it — stale preview links must not reach the 404 page.
