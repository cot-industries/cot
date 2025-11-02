# Clerk Authentication Setup

## The Issue

You're seeing "Not authenticated" because Clerk Account Portal isn't configured for local development.

---

## Quick Fix (Choose One)

### Option 1: Configure Clerk Account Portal for Localhost (Recommended for Dev)

1. **Go to Clerk Dashboard:**
   - https://dashboard.clerk.com
   - Select your application

2. **Navigate to Account Portal:**
   - Sidebar → "Account Portal"

3. **Add Localhost URLs:**
   - Sign-in URL: `http://localhost:3000/sign-in`
   - Sign-up URL: `http://localhost:3000/sign-up`
   - Home URL: `http://localhost:3000/home`

4. **Save Changes**

5. **Refresh `http://localhost:3000`**

---

### Option 2: Use Clerk Components (Faster for Testing)

If you just want to test quickly, let me create local sign-in pages:

**I'll do this for you right now** ↓

---

## What I'm Doing

Instead of relying on Clerk Account Portal (which requires domain setup), I'm creating local sign-in/sign-up pages using Clerk components. This works immediately for localhost.
