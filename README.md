# Master Month

A goal tracking app that helps with monthly habit formation.

## Prerequisites

- AWS account with credentials configured
- Kinde account (https://kinde.com/)

## Setup

### 1. Setup Kinde

1. Create a Kinde account at https://kinde.com/
2. Create a new application in your Kinde dashboard
3. Copy your credentials (Domain, Client ID, Client Secret)
4. Configure allowed callback URLs in Kinde:
   - Development: `http://localhost:5173`
   - Production: `https://your-domain.com`

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Kinde credentials.

### 3. Install and Deploy

```bash
npm install
npm run dev
```
