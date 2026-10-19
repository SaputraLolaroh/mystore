# MyStore — Next.js + Neon PostgreSQL

MyStore uses Next.js App Router, Neon PostgreSQL, JWT sessions, Server Actions, and API Routes. The SQLite database has been replaced with persistent PostgreSQL suitable for Vercel serverless deployments.

## Run locally

1. Create a new Neon project and copy its pooled connection string from the Connect dialog.
2. Copy .env.example to .env.local and set DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, and ADMIN_PASSWORD. Keep all real secrets out of Git.
3. Run npm install, then npm run dev.

## Deploy to Vercel

1. Create a NEW project in Neon. This migration does not modify any old Neon project.
2. In Vercel project Settings > Environment Variables, add DATABASE_URL using the pooled connection string from the new Neon project, AUTH_SECRET using a long random value, and ADMIN_EMAIL plus ADMIN_PASSWORD for the initial administrator.
3. Apply the variables to Production and Preview as needed, then redeploy.
4. On first database initialization, the app creates users, products, and app_settings tables and inserts eight sample products. The admin account is created only if ADMIN_EMAIL and ADMIN_PASSWORD are configured before initialization.
5. If the database was initialized before admin credentials were set, configure the variables and reset the new empty database before first use, or create the admin through a secure password-hashing workflow.

## Security

There is no longer a default admin account with a public password. Set a strong AUTH_SECRET in production. Never commit or share DATABASE_URL, AUTH_SECRET, or ADMIN_PASSWORD.
