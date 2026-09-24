Salary Management System

1. Goal

Build a web-based salary management system that enables an HR Manager to manage and understand salary information for an organization of approximately 10,000 employees across multiple countries.



The system should replace spreadsheet-based salary management with a reliable, searchable and easy-to-use application.

2. Primary User

HR Manager

The HR Manager should be able to:



View employees and their salary information

Search and filter employees

Add and update employee salary information

View salary history

Understand salary distribution across the organization

Answer common salary-related business questions

3. Scope

Employee Management

The system will support:



Employee ID

Employee name

Email

Department

Job title

Country

Joining date

Employment status

Salary Management

The system will support:



Current salary

Currency

Salary effective date

Salary history



Salary changes should preserve historical salary records rather than overwriting the previous value without traceability.

Search and Filtering

HR should be able to search and filter employees by:



Employee name

Employee ID

Country

Department

Employment status

Salary range



Results should be paginated so the application does not load all 10,000 employees at once.

Salary Insights

The system will provide useful salary insights such as:



Total number of employees

Average salary

Salary distribution

Average salary by country

Employee count by country

Employees above a selected salary threshold

4. Data Scale

The system will be seeded with 10,000 employees to represent the expected organization size.



The application should use server-side pagination, filtering and aggregation rather than transferring the entire employee dataset to the browser.

5. Out of Scope

The following are deliberately excluded from the initial version:



Payroll processing

Tax calculation

Payslip generation

Attendance management

Employee self-service

Performance management

Recruitment

Authentication/SSO integration

Complex compensation rules

Multi-level approval workflows

Reasoning

These features are outside the core problem of managing and understanding salary data. Including them would increase implementation complexity without improving the primary HR salary-management workflow for this assessment.

6. Non-Functional Requirements

Maintainability

The application should have clear separation between UI, business logic and data access.

Performance

The system should remain responsive when working with approximately 10,000 employees.

Reliability

Salary updates should maintain data consistency and preserve salary history.

Testability

Core business logic and important API behavior should have automated tests.

Usability

Common HR operations such as searching employees and viewing salary information should require minimal interaction.

7. Technology

Frontend

React

TypeScript

Backend

Node.js

TypeScript

NestJS

Database

PostgreSQL

Prisma ORM

Testing

Jest

Supertest

React Testing Library

8. Success Criteria

The solution is successful when an HR Manager can:



View employee salary information.

Search and filter employees.

Update salaries while preserving salary history.

View salary-related insights.

Perform these operations efficiently against a dataset of 10,000 employees.

Understand the system through the documentation and code structure.