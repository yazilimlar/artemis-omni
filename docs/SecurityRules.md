# Artemis Omni — Security Rules

Non-negotiable rules for secrets and configuration in this project.

## Never

- ❌ Never commit `.env`, `.env.local`, or any `.env.*.local` file. (They are in
  `.gitignore`.)
- ❌ Never hardcode API keys, tokens, or passwords in source.
- ❌ Never hardcode Squarespace credentials, Supabase credentials, or AI API keys.
- ❌ Never ask anyone to paste secrets into a chat/LLM.
- ❌ Never expose server-only secrets to the client (no `NEXT_PUBLIC_` prefix on them).

## Always

- ✅ Use **placeholder env names only** in code and docs (see `.env.local.example`).
- ✅ Read configuration from `process.env.*`.
- ✅ Prefix **only** browser-safe values with `NEXT_PUBLIC_`.
- ✅ Keep DNS / Squarespace changes **owner-performed manually**.

## Where secrets live

| Context | Location |
| --- | --- |
| Local development | `.env.local` (gitignored) |
| Vercel (preview & prod) | Project → Settings → Environment Variables |
| Supabase (future) | Supabase project dashboard |
| Squarespace / DNS | Owner-managed manually, never shared with AI tools |

## Public vs server-only env vars

- **Public** (safe to expose, sent to browser): `NEXT_PUBLIC_SITE_URL`,
  `NEXT_PUBLIC_ANALYTICS_ID`, `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Server-only** (never `NEXT_PUBLIC_`): `SUPABASE_SERVICE_ROLE_KEY`,
  `RESEND_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `CONTACT_EMAIL_TO`.

## Verify before committing

```bash
# Confirm env files are ignored
git check-ignore .env.local        # should print: .env.local
git status                         # .env.local must NOT appear
```

## This phase

No backend, auth, or database is implemented. The pilot form does not transmit data.
When wiring these up later, follow the table above and keep every key out of source
control.
