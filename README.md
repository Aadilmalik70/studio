# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at `src/app/page.tsx`.

## Environment Variables

Before running the application, you need to set up your environment variables. Copy the `.env.example` file to a new file named `.env` (if it doesn't exist) and fill in your Firebase project credentials and any other required API keys.

```bash
cp .env.example .env
```

Then, edit the `.env` file with your specific values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"

# Replace with the email address of the admin user
NEXT_PUBLIC_ADMIN_EMAIL="admin@example.com"

# Genkit/Google AI environment variables (if using Gemini)
# You can obtain an API key from Google AI Studio: https://aistudio.google.com/app/apikey
# GENAI_API_KEY="YOUR_GENAI_API_KEY"
```

**Important:** Ensure these variables are correctly set to avoid authentication errors like `auth/api-key-not-valid`. The `NEXT_PUBLIC_ADMIN_EMAIL` is used to identify the admin user.

## Running the Development Server

First, install the dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Genkit Development

To run the Genkit development server for AI flows:
```bash
npm run genkit:dev
```
Or for watching changes:
```bash
npm run genkit:watch
```
This will typically start the Genkit developer UI on [http://localhost:4000](http://localhost:4000).
