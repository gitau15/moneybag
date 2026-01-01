# MoneyBag

A financial management application built with React and TypeScript, featuring Supabase authentication and database integration.

## Features

- Dashboard with transaction overview
- Calendar view for date-based transactions
- Transaction management (add, view, categorize)
- Goal tracking
- User authentication and registration with Supabase
- Responsive design

## Prerequisites

- Node.js
- Supabase account

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory and add your Supabase environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

## Supabase Configuration

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your Project URL and Public API Key (anon key) from Project Settings > API
3. Add the environment variables to your `.env.local` file
4. Configure email authentication settings:
   - Go to Authentication > Settings in your Supabase dashboard
   - Enable "Email" provider
   - Configure the email templates for password reset
   - Set the confirmation and recovery URLs as needed
5. Create the following tables in your Supabase database:

   Transactions table:
   ```sql
   CREATE TABLE transactions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users NOT NULL,
     date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
     type TEXT NOT NULL CHECK (type IN ('Income', 'Expense')),
     category TEXT NOT NULL,
     amount DECIMAL(10, 2) NOT NULL,
     note TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   Goals table:
   ```sql
   CREATE TABLE goals (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users NOT NULL,
     trip_target DECIMAL(10, 2) DEFAULT 0,
     trip_current DECIMAL(10, 2) DEFAULT 0,
     debt_target DECIMAL(10, 2) DEFAULT 0,
     debt_current DECIMAL(10, 2) DEFAULT 0,
     retirement_target DECIMAL(10, 2) DEFAULT 0,
     retirement_current DECIMAL(10, 2) DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

## Environment Variables

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase public API key

## Running with Vercel

This app is ready to deploy to Vercel. When deploying, add the same environment variables in the Vercel dashboard.

## Backend Server

A separate backend API is available in the `server/` directory for handling complex business logic and data processing. To run the backend server:

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your environment variables
4. Start the server:
   ```bash
   npm run dev
   ```

See the server README for more details.

## Development

The app follows an incremental development approach, with features built one route at a time to ensure each is functional before proceeding to the next.
