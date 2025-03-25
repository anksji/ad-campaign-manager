# Campaign Manager Frontend

A Next.js frontend application for managing marketing campaigns.

## Features

- Google Authentication integration
- Campaign management (create, update, delete)
- Campaign filtering and search
- Responsive design with MUI and Tailwind CSS

## Tech Stack

- Next.js with TypeScript
- React
- Firebase Authentication
- Material UI
- Tailwind CSS
- Axios for API requests

## Getting Started

First, set up your environment variables:

```bash
# Create a .env.local file with:
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication

The app uses Firebase Authentication with Google Sign-In. Users must log in to access campaign management features.

## API Integration

The frontend connects to the Campaign Manager API for all data operations.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
