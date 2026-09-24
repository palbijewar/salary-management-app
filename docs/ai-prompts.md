Salary Management System — AI Usage

AI tools were used as an engineering assistant during the development of the Salary Management System.

AI was used primarily for:

Exploring implementation approaches
Reviewing code structure
Debugging development issues
Generating test ideas
Improving documentation
Reviewing edge cases
Suggesting UI improvements

All generated suggestions were reviewed, tested and adapted before being included in the project.

1. Requirements and planning
Prompt

Analyze the salary management assignment requirements and break them into functional requirements, technical requirements, deliverables and implementation phases.

Usage

Used to create the initial requirements document and development plan.

2. Database design
Prompt

Design a relational PostgreSQL schema for 10,000 employees where employees can have multiple salary records and salary history must be preserved.

Usage

Used as input while designing the Employee and SalaryRecord models.

The final schema was reviewed and adjusted to include appropriate indexes and a uniqueness constraint on employee salary effective dates.

3. Backend API design
Prompt

Design REST endpoints for employee listing, pagination, search, filtering, employee details, salary history and salary updates using NestJS.

Usage

Used to structure the Employee module and controller.

The final API was implemented and tested against the actual application requirements.

4. Validation
Prompt

What validation should be applied to pagination parameters, employee filters and salary update requests in a NestJS API?

Usage

Used to identify validation requirements for:

Page number
Page size
Employee status
Salary amount
Currency
Effective date
5. Performance considerations
Prompt

How should an employee management application efficiently handle approximately 10,000 employees with search, filtering and pagination?

Usage

The resulting considerations influenced:

Server-side pagination
Database filtering
Database indexes
Selecting only the required salary record for employee listings
Parallel dashboard queries
6. Testing
Prompt

Identify a small set of meaningful deterministic unit tests for an employee and salary management backend without creating unnecessary test cases.

Usage

Used to focus testing on important business behavior rather than maximizing test count.

Tests cover employee pagination, filtering, salary record creation and dashboard behavior.

7. Debugging

AI assistance was used during development to investigate issues including:

Prisma Client generation
NestJS dependency injection in tests
DTO validation behavior
Frontend state management
Render deployment configuration
Production build paths

Each issue was reproduced locally or through deployment logs before applying a fix.

8. UI improvements
Prompt

Review the HR dashboard UI and suggest simple improvements that improve readability without adding unnecessary complexity.

Usage

This resulted in improvements such as:

KPI cards
Workforce percentages
Country and department visual bars
Status badges
Salary formatting
Employee details modal
Loading, error and empty states
Improved pagination information
9. Documentation

AI assistance was also used to structure:

Architecture documentation
Design decisions
Trade-off documentation
Performance considerations
README content

The final documentation was reviewed against the actual implementation.

AI Usage Principles

AI was treated as an engineering assistant rather than an autonomous implementation system.

The development process remained:

Requirement
    ↓
Design decision
    ↓
AI-assisted exploration
    ↓
Implementation
    ↓
Local testing
    ↓
Review and adjustment
    ↓
Git commit

The developer remained responsible for the final architecture, implementation decisions, testing and deployment.