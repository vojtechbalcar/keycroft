# Supabase Database Setup

Keycroft already uses Prisma and Auth.js. For this repo, Supabase should be used as the Postgres database, while Prisma remains the ORM and Auth.js remains the session layer.

## 1. Create the project

1. Create a Supabase project.
2. Open `Connect` or `Project Settings -> Database`.
3. Copy your Postgres connection strings.

Use these env mappings:

- `DIRECT_URL`: direct host on port `5432`
- `DATABASE_URL`: pooled host if you have it, otherwise use the same direct URL temporarily

## 2. Add local env vars

Create `.env.local` in the repo root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"
AUTH_SECRET="generate-a-random-secret"
EMAIL_SERVER_HOST="smtp.resend.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="resend"
EMAIL_SERVER_PASSWORD="your-smtp-password"
EMAIL_FROM="Keycroft <login@your-domain.com>"
```

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

## 3. Push the schema

```bash
npm run db:generate
npm run db:push
```

## 4. What should appear in Supabase

After `db:push`, Supabase should contain Prisma/Auth.js tables such as:

- `User`
- `Account`
- `Session`
- `VerificationToken`
- `GuestProfileLink`
- `ChapterProgress`
- `TypingRun`

## 5. Email sign-in

The new `/login` page in this repo uses Auth.js magic-link email sign-in. To activate it:

1. Configure a real SMTP provider.
2. Fill `EMAIL_SERVER_*` and `EMAIL_FROM`.
3. Restart the Next.js dev server.

If SMTP is missing, the page still renders but explains that email login is not active yet.
