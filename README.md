# rokum.dev — Personal Kanban

Simple single-page Kanban app using Next.js and Google sign-in (NextAuth). Data is stored in the browser's `localStorage` per authenticated user (email).

Quick start

1. Copy `.env.local.example` to `.env.local` and fill values (Google OAuth client, secret, NEXTAUTH_SECRET, allowed emails)

```bash
cp .env.local.example .env.local
# edit .env.local
npm install
npm run dev
```

Notes

- Only emails listed in `ALLOWED_USERS` (comma-separated) can sign in.
- Data is stored locally in the browser; for production you may want to add a server-side DB.

Contributing

- See `CONTRIBUTING.md` for branch workflow and PR rules. Use `.github/PULL_REQUEST_TEMPLATE.md` when creating PRs.
- A helper script to create branches is available at `scripts/new-branch.sh`.
