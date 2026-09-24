# Salary Management System

A full-stack salary management application designed for HR teams managing approximately 10,000 employees across multiple countries.

The application provides employee search, filtering, pagination, salary history, salary updates, and HR dashboard analytics.

## Live Application

- Frontend: https://salary-management-app-nu.vercel.app
- Backend API: https://salary-management-app-lolz.onrender.com

## Architecture

```text
HR Manager
    │
    ▼
React + TypeScript + Vite
    │
    │ REST API
    ▼
NestJS + Node.js
    │
    │ Prisma
    ▼
PostgreSQL
    │
    ▼
Neon
```

## Technologies

- Frontend: React + TypeScript
- Build Tool: Vite
- Backend: NestJS + Node.js
- Database: PostgreSQL
- ORM: Prisma
- API: REST
- Testing: Jest
- Frontend Hosting: Vercel
- Backend Hosting: Render
- Database Hosting: Neon

## Features

### Dashboard

- Total employee count
- Active employee count
- Inactive employee count
- Workforce percentage
- Employees by country
- Employees by department

### Employee Management

- Employee listing
- Server-side pagination
- Employee search
- Country filtering
- Department filtering
- Status filtering
- Employee details
- Current salary display

### Salary Management

- Salary history
- Salary updates
- Effective salary dates
- Currency-aware salary records
- Previous salary records are preserved

### Reliability

- Backend request validation
- 404 handling
- Loading states
- Error states
- Empty states
- Automated tests

## Database Design

The primary entities are:

```text
Employee
   │
   │ 1:N
   ▼
SalaryRecord
```

An employee can have multiple salary records.

The current salary is determined from the salary record with the latest effectiveFrom date.

Salary records are not overwritten when a salary changes, allowing the system to preserve salary history.

## API

### Employees

- GET /employees
- GET /employees/:id
- GET /employees/:id/salary-history
- PATCH /employees/:id/salary

### Dashboard

- GET /dashboard/summary
- GET /dashboard/by-country
- GET /dashboard/by-department

### Employee listing parameters

- page
- limit
- search
- country
- department
- status

Example:

```text
GET /employees?page=1&limit=10&country=India&status=ACTIVE
```

## Performance Considerations

The application is designed around the expected dataset of approximately 10,000 employees.

- Server-side pagination: The backend returns only the requested page instead of sending the complete employee dataset to the browser.
- Database filtering: Search and filters are executed by PostgreSQL rather than filtering all employees in the frontend.
- Indexing: Indexes are provided for frequently queried fields including:
  - Country
  - Department
  - Status
  - Employee name
  - Employee ID + salary effective date
- Parallel dashboard queries: Dashboard summary queries are executed in parallel where appropriate to reduce unnecessary sequential waiting.
- Salary history: Employee salary history is indexed by employee and effective date, allowing recent salary records to be retrieved efficiently.

## Currency Handling

Salary amounts are stored together with their currency.

The dataset contains currencies such as:

- INR
- USD
- GBP
- EUR
- SGD

The application intentionally does not calculate cross-country salary totals or comparisons because those values would require currency conversion and an exchange-rate source.

## Testing

Run backend tests:

```bash
cd backend
npm test
```

Current test coverage focuses on meaningful deterministic behavior including:

- Employee service initialization
- Employee pagination
- Employee search/filtering
- Salary record creation
- Dashboard summary
- Controller initialization

## Local Development

### Backend

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

with:

```env
DATABASE_URL=your_postgresql_connection_string
PORT=3000
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run the development server:

```bash
npm run start:dev
```

Backend runs on:

```text
http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

with:

```env
VITE_API_URL=http://localhost:3000
```

Run:

```bash
npm run dev
```

Frontend runs on the Vite development URL.

## Seed Data

The project includes deterministic seed data for 10,000 employees.

The seed data is synthetic and intended for development and demonstration purposes.

## Project Structure

```text
salary-management-app/
│
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── design-decisions.md
│   └── ai-prompts.md
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   └── src/
│       ├── employee/
│       ├── dashboard/
│       └── prisma/
│
└── frontend/
    └── src/
        ├── App.tsx
        ├── api.ts
        └── index.css
```

## Engineering Decisions

The implementation intentionally favors simplicity and maintainability over unnecessary infrastructure.

The application does not introduce microservices, message queues, Redis, GraphQL, or complex state management because the current requirements do not justify that additional complexity.

The architecture can be extended later if requirements grow.

## Documentation

Additional project documentation:

- docs/requirements.md — project requirements
- docs/architecture.md — system architecture
- docs/design-decisions.md — design decisions and trade-offs
- docs/ai-prompts.md — AI-assisted development log

## Deployment

The production architecture is:

```text
Vercel
  │
  ▼
Render
  │
  ▼
Neon PostgreSQL
```

The frontend uses the production backend through the VITE_API_URL environment variable.

## Future Improvements

Potential future enhancements include:

- Authentication and role-based access
- Audit logs
- Employee creation/editing
- Bulk CSV/Excel imports
- Export functionality
- Currency normalization
- Advanced salary analytics
- Monitoring and application metrics