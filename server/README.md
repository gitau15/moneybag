# MoneyBag Backend API

This is the backend API for the MoneyBag financial management application.

## Features

- RESTful API endpoints for managing transactions
- User-specific data handling
- Goal tracking endpoints
- Supabase integration for database operations

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the server directory and add your environment variables:
   ```env
   PORT=5000
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. Run the server:
   ```bash
   npm run dev  # For development with auto-restart
   # or
   npm start    # For production
   ```

## API Endpoints

### Transactions

- `GET /api/transactions/:userId` - Get all transactions for a user
- `POST /api/transactions` - Add a new transaction
- `PUT /api/transactions/:transactionId` - Update a transaction
- `DELETE /api/transactions/:transactionId` - Delete a transaction

### Goals

- `GET /api/goals/:userId` - Get user's financial goals
- `POST /api/goals` - Update user's financial goals

## Environment Variables

- `PORT` - Port for the server to run on (default: 5000)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (needed for backend operations)

## Database Schema

The backend expects the following tables in your Supabase database:

### Transactions table:
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
```

### Goals table:
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

## Development

To run the backend in development mode with auto-restart on file changes:
```bash
npm run dev
```

## Deployment

This backend can be deployed to platforms like Heroku, Railway, or any Node.js hosting service. Remember to set your environment variables in the deployment environment.