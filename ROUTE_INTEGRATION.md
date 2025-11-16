# Frontend-Backend Route Integration Guide

## Backend Routes (FastAPI)

All routes are prefixed with their respective routers in `server/main.py`:

### Auth Routes (`/auth`)
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Dataset Routes (`/dataset`)
- `POST /dataset/upload` - Upload CSV/XLSX file

### Model Routes (`/model`)
- `POST /model/evaluate` - Run model evaluation with file and target column

### Results Routes (`/results`)
- `GET /results/latest` - Get latest evaluation result
- `GET /results/history` - Get all evaluation history
- `POST /results/save` - Save evaluation result to history

### History Routes (`/history`)
- `GET /history/history` - Get user's complete analysis history

---

## Frontend Implementation

### Pages Connected to Backend

#### 1. **Auth Page** (`/auth`)
- **Route**: `client/app/auth/page.tsx`
- **Backend Calls**:
  - `POST /auth/signup` - User registration
  - `POST /auth/login` - User login
- **Features**:
  - Toggle between login/signup modes
  - Form validation
  - Error handling
  - Redirect to dashboard on success
  - Stores user in localStorage

#### 2. **Dashboard Page** (`/dashboard`)
- **Route**: `client/app/dashboard/page.tsx`
- **Backend Calls**:
  - `POST /model/evaluate` - Evaluate models with uploaded file
  - `POST /results/save` - Save results to history
- **Features**:
  - File upload (CSV/XLSX)
  - Target column input
  - Real-time model evaluation
  - Display results table with metrics (Accuracy, R², MSE, MAE, Training Time)
  - Statistical summaries (averages, ranges, min/max)
  - Best model highlighting
  - New Analysis button to reset

#### 3. **Results Page** (`/dashboard/results`)
- **Route**: `client/app/dashboard/results/page.tsx`
- **Backend Calls**:
  - `GET /results/latest` - Fetch latest evaluation result
- **Features**:
  - Display latest model evaluation results
  - Model performance comparison table
  - Charts and metrics visualization
  - Dataset information panel
  - Best model recommendations

#### 4. **History Page** (`/dashboard/history`)
- **Route**: `client/app/dashboard/history/page.tsx`
- **Backend Calls**:
  - `GET /results/history` - Fetch all evaluation history
- **Features**:
  - List all past analyses with metadata
  - Quick stats for each analysis (best accuracy, avg accuracy, models tested, avg time)
  - View and delete past analyses
  - Overall statistics (total analyses, avg best accuracy, total models tested, datasets analyzed)
  - Date and time tracking for each analysis

#### 5. **Settings Page** (`/settings`)
- **Route**: `client/app/settings/page.tsx`
- **Features**:
  - Profile management (name, email from auth context)
  - Theme settings (light/dark/system)
  - Password & security settings
  - Active sessions management
  - Notification preferences
  - Account deletion option
  - Pulls user data from auth context

#### 6. **Navbar Component**
- **Route**: `client/components/navbar.tsx`
- **Backend Calls**:
  - `POST /auth/logout` - Logout user
- **Features**:
  - Theme toggle
  - Notifications bell
  - User name display (from auth context)
  - Logout button with redirect to /auth

#### 7. **Sidebar Component**
- **Route**: `client/components/sidebar.tsx`
- **Backend Calls**:
  - `POST /auth/logout` - Logout user
- **Features**:
  - Navigation to Dashboard, Results, History, Settings
  - Logout button with redirect to /auth
  - Collapsible sidebar

---

## Authentication Flow

1. User visits `/auth` page
2. Registers via `POST /auth/signup` or logs in via `POST /auth/login`
3. User data stored in localStorage via `AuthContext`
4. `AuthProvider` wraps entire app (in `client/app/layout.tsx`)
5. Protected pages use `useAuth()` hook to check authentication
6. Logout calls `POST /auth/logout` and clears localStorage
7. Redirect to `/auth` on logout

---

## Data Flow Examples

### Model Evaluation Flow
1. User uploads CSV file on `/dashboard`
2. User enters target column (e.g., "price prediction")
3. Click "Evaluate Models"
4. Frontend POSTs to `POST /model/evaluate` with FormData (file + target_col)
5. Backend runs parallel model evaluation
6. Response includes model metrics (accuracy, R², MSE, MAE, training time)
7. Frontend displays results in table + statistics
8. Frontend calls `POST /results/save` to save to history
9. User can view latest result on `/dashboard/results`
10. User can view all past results on `/dashboard/history`

### Results History Flow
1. User visits `/dashboard/history`
2. Frontend fetches `GET /results/history`
3. Display list of all past evaluations with quick stats
4. Each item shows: file name, target column, best accuracy, avg accuracy, models tested, training time
5. User can click "View" to see full result details
6. User can click "Delete" to remove from history

---

## Environment Configuration

Set in `.env.local` or `.env` in `client/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Default fallback: `http://localhost:8000`

---

## API Error Handling

- All endpoints return meaningful error messages
- Frontend catches errors and displays user-friendly messages
- Auth errors redirect to login
- Network errors show toast/error cards
- Loading states show spinners during API calls

---

## Testing Checklist

- [ ] Signup with new email at `/auth`
- [ ] Login with registered email at `/auth`
- [ ] Upload CSV file on `/dashboard`
- [ ] Enter target column and click "Evaluate Models"
- [ ] Verify results display with all metrics
- [ ] Check `/dashboard/results` for latest results
- [ ] Check `/dashboard/history` for past analyses
- [ ] Click logout and verify redirect to `/auth`
- [ ] Verify theme toggle works
- [ ] Check settings page loads user data
- [ ] Verify sidebar navigation works

---

## Future Enhancements

- [ ] Add JWT token-based auth instead of localStorage
- [ ] Add user profile picture upload
- [ ] Add email notifications on analysis complete
- [ ] Add export results as PDF/CSV
- [ ] Add model deployment functionality
- [ ] Add comparison between multiple analyses
- [ ] Add real-time WebSocket updates for long-running evaluations
- [ ] Add caching for frequently run analyses
