# Salary Management System — Architecture

## 1. Overview

The Salary Management System is a web application for HR teams to manage employee information and salary history for approximately 10,000 employees across multiple countries.

The system uses a React frontend, a NestJS backend, and PostgreSQL as the relational database.

## 2. Architecture

```text
                    ┌─────────────────────┐
                    │     HR Manager      │
                    │      Browser        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React + TypeScript│
                    │       Vite          │
                    │      Vercel         │
                    └──────────┬──────────┘
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   NestJS + Node.js  │
                    │      Backend        │
                    │       Render        │
                    └──────────┬──────────┘
                               │ Prisma
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │        Neon         │
                    └─────────────────────┘
```

## 3. Frontend

* React with TypeScript
* Vite for development and production builds
* Axios for API communication
* Responsive CSS
* Server-side pagination, search and filtering
* Employee details and salary history modal
* Salary update workflow

The frontend is deployed on Vercel.

## 4. Backend

The backend is implemented using NestJS and TypeScript.

Main modules:

```text
src/
├── employee/
│   ├── employee.controller.ts
│   ├── employee.service.ts
│   └── dto.ts
├── dashboard/
│   ├── dashboard.controller.ts
│   └── dashboard.service.ts
└── prisma/
    ├── prisma.service.ts
    └── prisma.module.ts
```

### Employee APIs

```text
GET   /employees
GET   /employees/:id
GET   /employees/:id/salary-history
PATCH /employees/:id/salary
```

### Dashboard APIs

```text
GET /dashboard/summary
GET /dashboard/by-country
GET /dashboard/by-department
```

## 5. Database

PostgreSQL is used because the application manages structured employee and salary data and requires relational integrity.

Main entities:

```text
Employee
   │
   │ 1:N
   ▼
SalaryRecord
```

An employee can have multiple salary records.

The current salary is determined from the salary record with the latest `effectiveFrom` date.

Previous salary records are retained instead of being overwritten, providing an audit-friendly salary history.

## 6. Database Indexing

Indexes are used for the most common filtering and lookup operations.

Important indexes include:

* Employee country
* Employee department
* Employee status
* Employee name
* Salary employee ID + effective date
* Salary effective date

This supports efficient filtering and salary-history queries as the employee dataset grows.

## 7. Pagination

Employee listing uses server-side pagination.

The API accepts:

```text
page
limit
```

and returns:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 10000,
    "totalPages": 1000
  }
}
```

This prevents all 10,000 employee records from being transferred to the browser at once.

## 8. Salary Design

Salary changes create a new `SalaryRecord` instead of modifying the previous record.

For example:

```text
Employee
│
├── ₹50,000  → 2026-01-01
├── ₹75,000  → 2026-07-01
└── ₹80,000  → 2026-10-01
```

This preserves the employee's salary history.

Salary amounts are stored with their currency because employees can belong to different countries.

Cross-country salary aggregation is intentionally not performed without currency conversion.

## 9. Deployment

```text
Frontend
Vercel
   │
   ▼
Backend
Render
   │
   ▼
Database
Neon PostgreSQL
```

Production frontend:

https://salary-management-app-nu.vercel.app

Production backend:

https://salary-management-app-lolz.onrender.com

## 10. Design Principles

The implementation intentionally favors:

* Simple modular architecture
* Clear separation between UI, API and database
* Server-side pagination
* Database-level filtering
* Preserved salary history
* Input validation
* Relational integrity
* Deterministic seed data
* Meaningful automated tests
* Minimal unnecessary complexity
