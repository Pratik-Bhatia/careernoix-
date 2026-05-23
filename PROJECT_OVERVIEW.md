# Smart Job Matching Project Overview

This document explains how the current project works from frontend to backend, what technologies are being used, and what functionality exists today.

## 1. What The Project Is

Smart Job Matching is a resume-driven job matching platform. Users can register, log in, upload a PDF resume, and view job match results based on extracted resume skills. The app also now includes a frontend-only Experience editor screen for building and improving resume experience entries.

The current product is an MVP. The backend handles authentication, PDF parsing, resume storage, job role matching, and course/job data access. The frontend provides the user interface, authentication flow, upload flow, dashboard, and the new experience builder screen.

## 2. Tech Stack

### Frontend

- Next.js 16.1.4 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand for client-side state
- Axios for API calls
- Lucide React for icons
- Framer Motion for selected UI animations
- Recharts is installed for dashboard/data visualization components

### Backend

- FastAPI
- Python
- SQLAlchemy ORM
- PostgreSQL in Docker
- SQLite is currently configured in `backend/.env` through `DATABASE_URL=sqlite:///./smart_job_db.db`
- Pydantic and pydantic-settings
- JWT authentication with `python-jose`
- Password hashing with Passlib + Argon2
- PDF parsing with PyPDF2
- Uvicorn development server

### Infrastructure

- Docker Compose is available for frontend, backend, and PostgreSQL
- Local dev can also run backend and frontend separately with terminal commands

## 3. Current Folder Structure

```text
smart-job-matching/
  backend/
    app/
      api/
        endpoints/
          auth.py
          resume.py
          matches.py
          job_roles.py
          courses.py
        api.py
        deps.py
      core/
        config.py
        security.py
      db/
        base.py
        base_class.py
        session.py
      models/
        all_models.py
      schemas/
        user.py
        content.py
      services/
        resume_parser.py
        matching.py
        recommendation.py
      main.py
    requirements.txt
    Dockerfile

  frontend/
    src/
      app/
        (auth)/
          login/page.tsx
          register/page.tsx
        (dashboard)/
          dashboard/page.tsx
          upload/page.tsx
          experience/page.tsx
          layout.tsx
        layout.tsx
        page.tsx
        globals.css
      components/
        dashboard/
        ui/
        upload/
      lib/
        api.ts
        utils.ts
      store/
        useStore.ts
      config.ts
    package.json
    Dockerfile

  docker-compose.yml
  README.md
  PROJECT_OVERVIEW.md
```

## 4. Frontend Architecture

The frontend is a Next.js App Router application.

### Main Route Groups

- `/login`: user login screen
- `/register`: user registration screen
- `/dashboard`: authenticated dashboard
- `/upload`: authenticated resume upload screen
- `/experience`: authenticated frontend-only resume experience editor

The dashboard routes share the layout in:

```text
frontend/src/app/(dashboard)/layout.tsx
```

That layout provides:

- Sidebar navigation
- Mobile sidebar behavior
- User display area
- Sign out button
- Main dashboard content container

### Shared UI Components

The app has reusable UI primitives in:

```text
frontend/src/components/ui/
```

Current shared components:

- `Button.tsx`
- `Card.tsx`
- `Input.tsx`

Dashboard and upload-specific components live under:

```text
frontend/src/components/dashboard/
frontend/src/components/upload/
```

## 5. Frontend State Management

The frontend uses Zustand in:

```text
frontend/src/store/useStore.ts
```

Current state includes:

- `user`
- `token`
- `isLoading`
- `resumeUploaded`
- `dashboardData`

Main actions:

- `setAuth(token, user)`: stores JWT token in `localStorage` and updates state
- `logout()`: removes token and clears user/dashboard state
- `setResumeUploaded(value)`: tracks whether a resume has been uploaded
- `setDashboardData(data)`: stores dashboard API data
- `checkAuth()`: reads token from `localStorage`

The token is stored in browser `localStorage` under:

```text
token
```

## 6. Frontend API Layer

The centralized frontend API client is in:

```text
frontend/src/lib/api.ts
```

It creates an Axios instance:

```text
baseURL = NEXT_PUBLIC_API_URL or http://localhost:8000
```

The frontend config is in:

```text
frontend/src/config.ts
```

### Request Flow

Before every request, the Axios interceptor checks `localStorage` for a JWT token. If a token exists, it adds:

```text
Authorization: Bearer <token>
```

### Response Flow

If the backend returns `401`, the Axios response interceptor:

- removes the local token
- redirects the browser to `/login`

### Dashboard Fetching

`fetchDashboardData()` calls:

- `GET /matches/latest?limit=10`
- `GET /job-roles/`

It then enriches match results with job role data on the frontend if the backend response does not include the full job role object.

## 7. Authentication Flow

### Register

Frontend page:

```text
frontend/src/app/(auth)/register/page.tsx
```

Backend endpoint:

```text
POST /auth/register
```

Flow:

1. User enters email and password.
2. Frontend validates password confirmation and terms checkbox.
3. Frontend trims/lowercases the email.
4. Request is sent to `/auth/register`.
5. Backend trims/lowercases the email again.
6. Backend checks if a user already exists with case-insensitive email lookup.
7. Backend hashes the password with Argon2.
8. Backend stores the user.
9. Frontend redirects to `/login`.

### Login

Frontend page:

```text
frontend/src/app/(auth)/login/page.tsx
```

Backend endpoint:

```text
POST /auth/login
```

Flow:

1. User enters email and password.
2. Frontend trims/lowercases email.
3. Frontend sends `application/x-www-form-urlencoded` data:

```text
username=<email>
password=<password>
```

4. Backend performs case-insensitive email lookup.
5. Backend verifies password hash.
6. Backend returns JWT access token.
7. Frontend decodes JWT payload to read user id from `sub`.
8. Frontend stores token and user data in Zustand/localStorage.
9. User is routed to `/dashboard`.

## 8. Backend Architecture

The FastAPI app starts in:

```text
backend/app/main.py
```

Main responsibilities:

- create database tables on startup with SQLAlchemy metadata
- configure CORS
- include the API router
- expose root endpoint `/`
- expose utility endpoints `/seed` and `/reset-db`

API routes are registered in:

```text
backend/app/api/api.py
```

Current API groups:

- `/auth`
- `/job-roles`
- `/courses`
- `/resume`
- `/matches`

## 9. Backend Models

Models are defined in:

```text
backend/app/models/all_models.py
```

### User

Stores:

- id
- email
- full_name
- hashed_password
- is_active
- created_at

Relationships:

- one resume
- many match results

### Resume

Stores:

- id
- user_id
- content: raw parsed resume text
- parsed_skills: JSON list of extracted skills

### JobRole

Stores:

- id
- title
- description
- required_skills: JSON list

### MatchResult

Stores:

- id
- user_id
- job_role_id
- score
- details: JSON with matched and missing skills

### Course

Stores:

- id
- title
- provider
- url
- difficulty
- skills_covered: JSON list

## 10. Resume Upload Flow

Frontend page:

```text
frontend/src/app/(dashboard)/upload/page.tsx
```

Backend endpoint:

```text
POST /resume/upload
```

Flow:

1. User selects a PDF in the upload screen.
2. Frontend checks if a token exists.
3. Frontend sends the PDF as `multipart/form-data`.
4. Backend validates that the uploaded file is a PDF.
5. Backend reads the file bytes.
6. `extract_text_from_pdf()` extracts raw text using PyPDF2.
7. `parse_resume()` extracts basic structured data:
   - name
   - email
   - skills
   - raw text length
8. Backend saves or updates the user resume record.
9. Backend loads all job roles.
10. For each job role, backend compares resume skills with required skills.
11. Backend creates or updates match results.
12. Backend returns parsed resume data, match summaries, and progress stages.
13. Frontend marks resume as uploaded and redirects to dashboard.

## 11. Matching Logic

Matching is implemented in:

```text
backend/app/services/matching.py
```

Current matching approach:

- normalize skills to lowercase
- trim spaces
- map aliases like:
  - `js` to `javascript`
  - `py` to `python`
  - `reactjs` to `react`
  - `postgres` to `postgresql`
- compare resume skills against job required skills
- calculate score as:

```text
matched required skills / total required skills * 100
```

The result includes:

- score
- matched_skills
- missing_skills

## 12. Dashboard Flow

Frontend page:

```text
frontend/src/app/(dashboard)/dashboard/page.tsx
```

Flow:

1. Dashboard checks for auth token.
2. If missing, user is redirected to `/login`.
3. Frontend calls `fetchDashboardData()`.
4. It fetches latest match results and job roles.
5. It computes:
   - total job matches
   - best match score
   - matched skills count
   - missing skills count
6. It shows loading, empty, error, and data-ready states.

If there are no matches, the dashboard prompts the user to upload a resume.

## 13. Experience Screen

Frontend page:

```text
frontend/src/app/(dashboard)/experience/page.tsx
```

This screen was added as a frontend-only resume builder section.

Current behavior:

- authenticated route
- redirects to `/login` if no token exists
- stores experience entries in browser `localStorage`
- supports adding new entries
- supports editing saved entries
- supports deleting entries
- supports moving entries up and down
- supports an "Improve wording" UI action that rewrites bullets locally
- shows saved timestamp
- shows section quality checklist
- shows compact resume preview

Storage key:

```text
careeronix_experience_entries
```

This screen currently does not call backend APIs. It is ready for future backend persistence once a resume-builder API exists.

## 14. Current API Endpoints

### Auth

```text
POST /auth/register
POST /auth/login
```

### Resume

```text
POST /resume/upload
```

Requires JWT bearer token.

### Matches

```text
POST /matches/{job_role_id}
GET /matches/latest?limit=5
```

Requires JWT bearer token.

### Job Roles

```text
GET /job-roles/
```

### Courses

```text
GET /courses/
GET /courses/recommendations?skills=python,sql
```

## 15. Data Flow Summary

```text
User
  -> Next.js page
  -> Zustand state / localStorage token
  -> Axios apiClient
  -> FastAPI endpoint
  -> SQLAlchemy session
  -> Database models
  -> Service layer logic
  -> JSON response
  -> Frontend state update
  -> UI render
```

## 16. Local Development

### Backend

```powershell
cd E:\startup\smart-job-matching\backend
..\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

Backend docs:

```text
http://localhost:8000/docs
```

### Frontend

```powershell
cd E:\startup\smart-job-matching\frontend
npm.cmd run dev -- -p 3001
```

Frontend app:

```text
http://127.0.0.1:3001
```

### Docker Compose

```powershell
docker compose up --build
```

Docker Compose maps:

- frontend: `http://localhost:3000`
- backend: `http://localhost:8000`
- database: `localhost:5432`

## 17. What Exists Today

Currently implemented:

- User registration
- User login
- JWT auth token storage
- Protected dashboard route behavior
- Resume PDF upload
- Basic PDF text extraction
- Heuristic skill extraction
- Job role list API
- Course list and course recommendation API
- Skill matching against job roles
- Match result persistence
- Dashboard stats and match cards
- Experience builder UI with local persistence
- Shared UI components
- Responsive dashboard sidebar
- Local and Docker-based development options

## 18. Known Limitations

- Resume parsing is heuristic and keyword-based, not AI-based yet.
- Experience screen is frontend-only and not stored in the backend database.
- There is no full profile API yet.
- There is no complete resume-builder backend yet.
- Dashboard user object is rebuilt from login information and JWT id, not fetched from a dedicated `/me` endpoint.
- Some route links in the sidebar, such as applications and settings, are present as navigation items but do not currently have implemented pages.
- Course recommendations depend on stored course data and simple skill matching.
- Database configuration can differ between Docker/PostgreSQL and local `.env` SQLite usage.

## 19. Suggested Next Steps

- Add `/auth/me` endpoint to fetch the current user profile.
- Add backend persistence for resume-builder sections, including Experience.
- Add CRUD APIs for experience entries.
- Replace heuristic parsing with a stronger parser or AI-assisted extraction.
- Add database migrations instead of creating tables directly on startup.
- Add frontend pages for Applications and Settings or remove those sidebar links until implemented.
- Add end-to-end tests for auth, upload, and dashboard flows.
- Clean up debug logging in frontend API/dashboard files.

