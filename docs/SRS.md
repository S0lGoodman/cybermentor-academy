# Software Requirements Specification - Cybermentor Platform

## System Design
- **Application Type**: Full-stack web application with responsive design
- **User Roles**: Admin and Student with role-based access control
- **Core Features**:
  - Content management system for structured learning materials
  - Phase/monthly progression system
  - Video and text-based content delivery
  - Quiz and assessment functionality
  - Progress tracking for students
  - Admin dashboard for platform management

## Architecture Pattern
- **Frontend**: Single Page Application (SPA) with component-based architecture
- **Backend**: Serverless architecture using Supabase services
- **Pattern**: Client-server with API-first approach
- **Deployment**: Cloud-based containerized deployment

## State Management
- **Frontend State**: React Context API for global state with local component state where appropriate
- **Client-side Caching**: For improved performance and offline capabilities
- **Server State**: Managed through Supabase real-time subscriptions
- **Authentication State**: Handled by Supabase Auth with JWT tokens

## Data Flow
- **Client-to-Server**: RESTful API calls and real-time subscriptions
- **Server-to-Database**: Direct Supabase database operations
- **Content Delivery**: CDN-based delivery for media assets
- **Event Flow**:
  1. User actions trigger frontend state changes
  2. API calls to Supabase functions/endpoints
  3. Database operations process data
  4. Real-time updates push changes to subscribed clients

## Technical Stack
- **Frontend**:
  - React.js with Next.js (recommended for SEO, server-side rendering, and route management)
  - TailwindCSS for styling (matches clean, modern UI requirements)
  - React Query for server state management
  - React Player for video content delivery
- **Backend**:
  - Supabase for authentication, database, and storage
  - Serverless functions for complex business logic
- **Database**: PostgreSQL (via Supabase)
- **Media Storage**: Supabase Storage
- **Hosting/Deployment**: Vercel (pairs well with Next.js) or Netlify

## Authentication Process
- **Provider**: Supabase Authentication
- **Authentication Flow**:
  1. Admin-only user creation (no self-registration)
  2. Email/password authentication
  3. JWT token-based session management
  4. Role-based access control (RBAC)
- **Security Measures**:
  - HTTPS enforcement
  - Row-level security in Supabase
  - Token refresh mechanism
  - Secure password policies

## Route Design
- **Admin Routes**:
  - `/admin/dashboard` - Admin overview
  - `/admin/content` - Content management
  - `/admin/content/[phase]/[module]` - Specific content editing
  - `/admin/students` - Student management
  - `/admin/students/[id]` - Individual student view
  - `/admin/quizzes` - Quiz management
- **Student Routes**:
  - `/dashboard` - Student home and progress overview
  - `/learn/[phase]` - Phase/month view
  - `/learn/[phase]/[module]` - Module content
  - `/learn/[phase]/[module]/[lesson]` - Specific lesson
  - `/quizzes/[id]` - Quiz taking interface
  - `/profile` - User profile and settings

## API Design
- **Authentication Endpoints**:
  - `POST /auth/login` - User login
  - `POST /auth/logout` - User logout
  - `GET /auth/user` - Get current user
- **Content Endpoints**:
  - `GET /api/phases` - Get all phases
  - `GET /api/phases/:phaseId/modules` - Get modules for phase
  - `GET /api/modules/:moduleId/lessons` - Get lessons for module
  - `GET /api/lessons/:lessonId` - Get specific lesson content
- **Admin Endpoints**:
  - `POST /api/admin/users` - Create new user
  - `PUT /api/admin/users/:userId` - Update user
  - `POST /api/admin/content` - Create content
  - `PUT /api/admin/content/:contentId` - Update content
- **Student Endpoints**:
  - `GET /api/progress` - Get student progress
  - `POST /api/progress/lesson/:lessonId` - Mark lesson as complete
  - `POST /api/quizzes/:quizId/submit` - Submit quiz answers
  - `GET /api/quizzes/:quizId/results` - Get quiz results

## Database Design ERD
- **Tables**:
  - `users`
    - id (PK)
    - email
    - encrypted_password
    - role (admin/student)
    - access_level (monthly/full)
    - created_at
    - updated_at

  - `phases`
    - id (PK)
    - name
    - description
    - order_number
    - created_at
    - updated_at

  - `modules`
    - id (PK)
    - phase_id (FK)
    - title
    - description
    - order_number
    - created_at
    - updated_at

  - `lessons`
    - id (PK)
    - module_id (FK)
    - title
    - content_type (video/text/quiz)
    - content
    - video_url
    - order_number
    - created_at
    - updated_at

  - `quizzes`
    - id (PK)
    - lesson_id (FK)
    - title
    - description
    - passing_score
    - created_at
    - updated_at

  - `quiz_questions`
    - id (PK)
    - quiz_id (FK)
    - question_text
    - question_type (multiple_choice/fill_blank/etc)
    - options (JSON)
    - correct_answer
    - points
    - created_at
    - updated_at

  - `user_progress`
    - id (PK)
    - user_id (FK)
    - lesson_id (FK)
    - completion_status
    - completion_date
    - time_spent
    - created_at
    - updated_at

  - `quiz_attempts`
    - id (PK)
    - user_id (FK)
    - quiz_id (FK)
    - score
    - passed
    - submitted_at
    - created_at
    - updated_at

  - `quiz_answers`
    - id (PK)
    - quiz_attempt_id (FK)
    - question_id (FK)
    - user_answer
    - is_correct
    - created_at
    - updated_at
