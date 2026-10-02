# billing-service

Internal API for invoice generation, payment tracking and nightly DB backups to S3.

## Stack
- Node.js 18 + Express
- PostgreSQL (RDS)
- Redis (ElastiCache) for session/cache
- AWS S3 (backups), SES (invoice e-mails)

## Setup

```bash
npm install
cp .env.example .env   # fill in values
npm run dev
```

## Endpoints

| Method | Path                    | Description            |
|--------|-------------------------|------------------------|
| GET    | `/health`               | Health check           |
| GET    | `/api/invoices`         | List invoices          |
| GET    | `/api/invoices/:id`     | Invoice detail         |
| POST   | `/api/invoices`         | Create invoice         |
| POST   | `/api/invoices/:id/send`| E-mail invoice via SES |

## Backups

`npm run backup` dumps the database and uploads it to `AWS_S3_BUCKET`.
Runs nightly via cron on the deploy box.

## Deploy

```bash
docker build -t billing-service .
docker compose up -d
```
