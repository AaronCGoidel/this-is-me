# Supabase Authentication Setup

This project now includes server-side authentication using Supabase with OTP (One-Time Password) over phone/SMS.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

### Profiles Table

Create a `profiles` table in your Supabase database:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  phone TEXT UNIQUE,
  name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### Phone Authentication Setup

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Settings
3. Enable phone authentication
4. Configure your SMS provider (Twilio, etc.)

## Usage

### Authentication Flow

1. **Phone Login**: Users can request OTP by providing their phone number

   - The system checks if a profile exists with the phone number
   - If found, sends an OTP to the phone number
   - If not found, returns an error message

2. **OTP Verification**: Users provide the OTP code they received
   - The system verifies the OTP with Supabase
   - On successful verification, creates a session
   - Returns user data and profile information

### Chat Integration

The authentication is integrated into the AaronAI chat system:

- Users can say "I want to login" or "Send me an OTP"
- The AI will ask for their phone number
- After receiving the OTP, users can provide it to complete authentication
- Once authenticated, users have access to additional features

### Client-Side Usage

```tsx
import { useUser } from "@/contexts/UserContext";

function MyComponent() {
  const { user, profile, loading, signOut } = useUser();

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Please login</div>;

  return (
    <div>
      <p>Welcome, {profile?.name || user.phone}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Server-Side Usage

```tsx
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return <div>Protected content</div>;
}
```

## Features Implemented

- ✅ Server-side Supabase client setup
- ✅ Client-side Supabase client setup
- ✅ Middleware for session refresh
- ✅ OTP authentication via phone/SMS
- ✅ Profile verification before sending OTP
- ✅ User context for client-side state management
- ✅ Chat integration with authentication tools
- ✅ Protected routes and authentication status
- ✅ Sign out functionality

## API Endpoints

- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP and create session
- Chat tools: `phoneLogin` and `verifyOtp` for AI integration

## Components

- `UserProvider` - Context provider for authentication state
- `AuthStatus` - Component showing current authentication status
- `useUser` - Hook for accessing user data and authentication methods
