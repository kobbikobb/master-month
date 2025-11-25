# Master Month

## Prerequisites

### Setup Kinde account

Create a Kinde account and create a new app
Create an env file in /.env with the relevant kinde configuration

Update /.env with DATABASE_URL
Sample server/.env

KINDE_ISSUER_URL=https://codemadesimple.kinde.com KINDE_CLIENT_ID=XXXXXXXXXXXXXX KINDE_CLIENT_SECRET=YYYYYYYYYYYYYY KINDE_SITE_URL=http://localhost:5173 KINDE_LOGOUT_REDIRECT_URI=http://localhost:5173/api KINDE_DOMAIN=https://codemadesimple.kinde.com KINDE_REDIRECT_URI=http://localhost:5173/api/callback DATABASE_URL=postgresql://ZZZZZZZZZZZZZZZZ

## Get started

npm install
npx sst deploy
npx sst remove
