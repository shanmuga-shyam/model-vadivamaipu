# Authentication Fix - 401 Unauthorized Error

## Problem
The `/model/evaluate` endpoint was returning `401 Unauthorized` when called from the frontend.

**Error:**
```
INFO:     127.0.0.1:49722 - "POST /model/evaluate HTTP/1.1" 401 Unauthorized
```

## Root Cause
1. **Backend** requires JWT authentication via `Depends(get_current_user)` on all protected endpoints
2. **Frontend Auth Context** was using mock authentication (storing user in localStorage) instead of making real API calls
3. **Frontend API Requests** were not including the JWT token in request headers

## Solution

### 1. Updated AuthContext (`client/components/auth-context.tsx`)
**Before:** Mock authentication with user stored in localStorage
```tsx
const login = async (email: string, password: string) => {
  const mockUser = { id: "1", email, name: email.split("@")[0] }
  localStorage.setItem("user", JSON.stringify(mockUser))
  setUser(mockUser)
}
```

**After:** Real API calls to backend with JWT token management
```tsx
const login = async (email: string, password: string) => {
  const formData = new FormData()
  formData.append("username", email)
  formData.append("password", password)

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    body: formData,
  })

  const data = await res.json()
  const newToken = data.access_token

  // Fetch user info with token
  const userRes = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${newToken}` },
  })

  const userData = await userRes.json()
  setToken(newToken)
  setUser(userData)
  localStorage.setItem("token", newToken)
  localStorage.setItem("user", JSON.stringify(userData))
}
```

**Changes:**
- Added `token` state to store JWT token from backend
- `login()` now makes real API call to `POST /auth/login`
- Fetches user info via `GET /auth/me` with Bearer token
- Stores both token and user in localStorage for persistence
- `signup()` now makes real API call to `POST /auth/signup` then auto-logs in
- `logout()` removes token from localStorage

### 2. Updated Auth Page (`client/app/auth/page.tsx`)
- Added `useAuth()` hook import
- Changed form submission to call `auth.login()` or `auth.signup()`
- Removed placeholder/mock logic
- Removed unused "name" field from login

### 3. Updated Dashboard (`client/app/dashboard/page.tsx`)
- Added `useAuth()` hook to access token
- Updated `/model/evaluate` request to include Authorization header:
```tsx
const res = await fetch(`${API_BASE}/model/evaluate`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${auth.token}`,  // ← Added
  },
  body: form,
})
```

### 4. Updated Results Page (`client/app/dashboard/results/page.tsx`)
- Added `useAuth()` hook
- Updated `/results/latest` request with Authorization header

### 5. Updated History Page (`client/app/dashboard/history/page.tsx`)
- Added `useAuth()` hook
- Updated `/results/history` request with Authorization header

## How It Works Now

### Authentication Flow
1. User enters email/password on `/auth` page
2. Frontend calls `POST /auth/login` with FormData
3. Backend returns `{ access_token: "...", token_type: "bearer" }`
4. Frontend stores token in state and localStorage
5. Frontend calls `GET /auth/me` with `Authorization: Bearer <token>`
6. Backend returns user object
7. Frontend stores user and redirects to `/dashboard`

### Protected API Calls
All protected endpoints now include the Authorization header:
```tsx
headers: {
  Authorization: `Bearer ${auth.token}`,
}
```

This is included in:
- `POST /model/evaluate` - Model evaluation
- `POST /results/save` - Save results to history
- `GET /results/latest` - Get latest evaluation
- `GET /results/history` - Get all user evaluations

## Token Management

### Stored In
- **State** (`auth.token`) - For current session
- **localStorage** - For persistence across page reloads
  - `token` - JWT access token
  - `user` - User object (id, email)

### Retrieval
On app load, AuthProvider checks localStorage:
```tsx
useEffect(() => {
  const storedToken = localStorage.getItem("token")
  const storedUser = localStorage.getItem("user")
  if (storedToken && storedUser) {
    setToken(storedToken)
    setUser(JSON.parse(storedUser))
  }
}, [])
```

### Cleared On
Logout:
```tsx
const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  setToken(null)
  setUser(null)
}
```

## Testing

### Prerequisites
1. Backend running: `uvicorn main:app --reload --port 8000`
2. Frontend running: `npm run dev`
3. Ensure `.env` has `JWT_SECRET` set

### Test Steps
1. Go to http://localhost:3000/auth
2. Click "Sign Up" and create account (email: test@example.com, password: test123)
3. Fill in form and submit
4. Should redirect to `/dashboard`
5. Upload CSV file and set target column
6. Click "Evaluate Models"
7. Should see results without 401 errors

### Debug Tips
- Check browser DevTools → Network tab to verify Authorization header is included
- Check browser DevTools → Application → localStorage for `token` and `user`
- Check server logs for authentication errors

## Files Modified
1. `client/components/auth-context.tsx` - Real API calls + token management
2. `client/app/auth/page.tsx` - Use auth context for login/signup
3. `client/app/dashboard/page.tsx` - Include token in /model/evaluate request
4. `client/app/dashboard/results/page.tsx` - Include token in /results/latest request
5. `client/app/dashboard/history/page.tsx` - Include token in /results/history request

## Key Points
- ✅ Frontend now makes real API calls to backend for authentication
- ✅ JWT tokens are properly stored and managed
- ✅ All protected endpoints include Authorization header
- ✅ Tokens persist across page reloads via localStorage
- ✅ 401 errors should now be resolved
