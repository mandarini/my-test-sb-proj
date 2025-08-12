# Next.js and Supabase Starter Kit - Realtime Demo

The simplest demo showing how Supabase Realtime works with Next.js. This project builds on the [Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs) and adds [Realtime functionality](https://supabase.com/docs/guides/realtime/postgres-changes).

## What This Demo Shows

- **Live database updates** - Changes sync instantly across all connected clients
- **Presence tracking** - See who's online in real-time
- **Broadcast messaging** - Send events between users
- **Zero authentication required** - Public access for easy testing

## Quick Start

### 1. Clone the repo
```bash
git clone git@github.com:mandarini/my-test-sb-proj.git
cd my-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
# Copy the example env file
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase project credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these from your [Supabase project settings](https://supabase.com/dashboard/project/_/settings/api).

### 4. Set up the database

1. Go to your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql)
2. Run the migration from `supabase/migrations/001_create_instruments_table.sql`

This creates:
- An `instruments` table
- RLS policies allowing public CRUD operations
- Realtime subscriptions enabled
- Sample data

### 5. Run the app
```bash
npm run dev
```

### 6. Test it out!

1. Open [http://localhost:3000/instruments](http://localhost:3000/instruments)
2. Click "Add Random Instrument" to see realtime updates
3. Open multiple browser tabs to see presence and broadcasts
4. Check the console for clear logs showing realtime events

## How It Works

The `/instruments` page demonstrates:
- **Database changes**: Using `postgres_changes` to listen for INSERT/UPDATE/DELETE
- **Presence**: Track online users with Supabase Presence
- **Broadcast**: Send messages between clients

All changes happen instantly without page refresh!

## Learn More

- [Supabase Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Realtime Guide](https://supabase.com/docs/guides/realtime/postgres-changes)
- [Next.js Documentation](https://nextjs.org/docs)
