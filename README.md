# Master Month

A goal tracking application built with SST, React, and DynamoDB.

## Tech Stack

- **Frontend**: React with React Router 7, TanStack Query, Tailwind CSS
- **Backend**: Hono on AWS Lambda
- **Database**: DynamoDB
- **Auth**: Kinde
- **Infrastructure**: SST (Serverless Stack)

## Setup

### Prerequisites

- Node.js 18+ installed
- AWS account with credentials configured
- Kinde account (free tier available)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd master-month
npm install
```

### 2. Set Up Kinde Authentication

1. Create a [Kinde account](https://kinde.com) if you don't have one
2. Create a new application in your Kinde dashboard
3. Choose "Single Page App (SPA)" as the application type
4. Configure the allowed callback URLs:
   - Local development: `http://localhost:5173/callback`
   - Production: `https://yourdomain.com/callback` (after deploying)
5. Configure the allowed logout redirect URLs:
   - Local development: `http://localhost:5173`
   - Production: `https://yourdomain.com` (after deploying)
6. Copy your credentials (Client ID and Domain)

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your Kinde credentials:

```bash
KINDE_CLIENT_ID=your_client_id_here
KINDE_DOMAIN=https://yourdomain.kinde.com
```

Optional: Override redirect URIs if needed (usually not necessary for local dev):

```bash
KINDE_REDIRECT_URI=http://localhost:5173/callback
KINDE_LOGOUT_URI=http://localhost:5173
```

### 4. Run the Application

Start the SST development environment:

```bash
npm run dev
```

This will:
- Deploy your AWS infrastructure (on first run)
- Start the frontend dev server on `http://localhost:5173`
- Set up hot reloading for both frontend and backend
- Display the API and Web URLs

The first deployment may take a few minutes.

## Deployment

Deploy to AWS:

```bash
npx sst deploy
```

For production deployment:

```bash
npx sst deploy --stage production
```

Remove deployment:

```bash
npx sst remove
```

Make sure to update your Kinde allowed callback URLs with the production URLs after deployment.

## Project Structure

```
master-month/
├── packages/
│   ├── core/           # Business logic and DynamoDB operations
│   ├── functions/      # Lambda function handlers (Hono API)
│   └── web/           # React frontend application
├── infra/             # SST infrastructure definitions
│   ├── api.ts         # API Lambda configuration
│   ├── storage.ts     # DynamoDB tables and S3 buckets
│   └── web.ts         # React app deployment
└── sst.config.ts      # SST configuration
```

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests for a specific package
npm test --workspace=@master-month/core
npm test --workspace=@master-month/functions
npm test --workspace=@master-month/web
```

### Type Checking

```bash
# Check all packages
npm run typecheck

# Check specific package
npm run typecheck --workspace=@master-month/core
npm run typecheck --workspace=@master-month/functions
npm run typecheck --workspace=@master-month/web
```

## Features

- User authentication with Kinde
- Create and track goals
- Filter goals by month
- Dark mode support
- Protected routes
- Serverless architecture

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `KINDE_CLIENT_ID` | Your Kinde application client ID | Yes |
| `KINDE_DOMAIN` | Your Kinde domain (e.g., https://yourdomain.kinde.com) | Yes |
| `KINDE_REDIRECT_URI` | OAuth callback URL | No (defaults to {site}/callback) |
| `KINDE_LOGOUT_URI` | Post-logout redirect URL | No (defaults to {site}) |

## Troubleshooting

### "Redirect URI mismatch" error

Make sure your callback URLs are correctly configured in the Kinde dashboard:
- Check that the URL matches exactly (including http vs https)
- Verify the path is `/callback`
- For local dev, use `http://localhost:5173/callback`

### "Invalid token" errors in API

1. Check that `KINDE_DOMAIN` is set correctly in your environment
2. Verify the domain includes the `https://` prefix
3. Check CloudWatch logs for specific error messages

### SST deployment issues

```bash
# Remove and redeploy
npx sst remove
npx sst deploy
```

## License

MIT
