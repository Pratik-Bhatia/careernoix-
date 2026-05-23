# Smart Job Matching Platform

A modern, AI-powered job matching platform designed to streamline recruitment by analyzing resumes and identifying skill gaps for targeted career growth.

## 🚀 Project Overview

The **Smart Job Matching Platform** connects job seekers with ideal opportunities by leveraging intelligent resume parsing and matching algorithms. It provides candidates with actionable insights through gap analysis, highlighting missing skills required for their desired roles.

## ✨ Core Features

- **Authentication System**: Secure user registration and login with JWT-based authentication.
- **Interactive Dashboard**: Real-time overview of application status and profile insights.
- **Resume Parsing**: Automated extraction of skills and experience from PDF resumes.
- **Gap Analysis**: Intelligent identification of skill gaps compared to job descriptions.
- **Job Matching**: (In Development) Algorithm to match candidates with relevant job openings.

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Visualization**: [Recharts](https://recharts.org/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Language**: Python 3.10+
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/)
- **Authentication**: JWT (JSON Web Tokens), BCrypt password hashing
- **PDF Processing**: PyPDF2

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL (Alpine)

## 📂 Folder Structure

```
smart-job-matching/
├── backend/                # FastAPI backend application
│   ├── app/                # Application source code
│   │   ├── api/            # API endpoints & routers
│   │   ├── core/           # Core configuration & security
│   │   ├── db/             # Database session & base models
│   │   ├── models/         # SQLAlchemy database models
│   │   ├── schemas/        # Pydantic data schemas
│   │   ├── services/       # Business logic & external services
│   │   └── main.py         # Application entry point
│   ├── tests/              # Backend tests
│   ├── Dockerfile          # Backend Docker configuration
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # Reusable UI components
│   │   └── lib/            # Utility functions
│   ├── public/             # Static assets
│   ├── Dockerfile          # Frontend Docker configuration
│   └── next.config.ts      # Next.js configuration
├── docker-compose.yml      # Docker services orchestration
└── README.md               # Project documentation
```

## ⚡ Setup Instructions

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose installed on your machine.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd smart-job-matching
    ```

2.  **Environment Configuration:**
    Ensure the `backend/.env` file exists with necessary configurations (e.g., `DATABASE_URL`, `SECRET_KEY`).

3.  **Start the Application:**
    Run the following command to build and start all services:
    ```bash
    docker compose up --build
    ```

4.  **Access the Application:**
    - **Frontend**: [http://localhost:3000](http://localhost:3000)
    - **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
    - **Database**: `localhost:5432`

## 🔄 User Flow

1.  **Registration/Login**: Users create an account or log in to access the platform.
2.  **Dashboard Access**: Upon login, users are directed to a personalized dashboard.
3.  **Resume Upload**: Users upload their resume (PDF format) for parsing.
4.  **Analysis**: The system parses the resume and displays extracted skills and experience.
5.  **Gap Analysis**: Users can view a comparison of their skills against potential job requirements.

## 🔮 Future Improvements

- [ ] Advanced AI matching algorithm implementation.
- [ ] Integration with external job boards APIs.
- [ ] Email notifications for job alerts.
- [ ] Enhanced user profile customization.
- [ ] Automated skill gap recommendations (courses/resources).

---

Built with ❤️ by the Smart Job Matching Team.
