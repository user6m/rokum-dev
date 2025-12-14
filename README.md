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

Deployment (Vercel)

Recommended: deploy the project to Vercel for easy hosting. Steps:

1. Sign in to https://vercel.com with your GitHub account and click "New Project" → import the `rokum-dev` repository.
2. In the Vercel project settings, add the following Environment Variables (Production & Preview as needed):

   - `GOOGLE_CLIENT_ID` — Google OAuth client id
   - `GOOGLE_CLIENT_SECRET` — Google OAuth client secret
   - `NEXTAUTH_SECRET` — random secret (32 bytes hex)
   - `NEXTAUTH_URL` — https://your-domain.vercel.app (or http://localhost:3000 for local)
   - `ALLOWED_USERS` — comma-separated allowed emails

3. Deploy: Vercel will build and deploy automatically on push to `main` (or configured branch).

Notes:

- Keep `.env.local` out of source control. Use Vercel UI to store production secrets.
- If you want automatic previews for PRs, enable Preview Deployments in Vercel when importing the repo.
