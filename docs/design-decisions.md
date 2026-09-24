# Salary Management System — Design Decisions & Trade-offs

## 1. PostgreSQL instead of MongoDB

### Decision

Use PostgreSQL as the primary database.

### Why

The application contains structured employee and salary data with a clear relationship between employees and salary records.

The system benefits from:

* Relational integrity
* Foreign-key relationships
* Structured filtering
* Aggregation queries
* Transactions
* Strong data consistency

MongoDB could also model the data, but PostgreSQL provides a natural fit for this use case without introducing unnecessary document-structure decisions.

---

## 2. Salary history as a separate table

### Decision

Store salary changes as separate `SalaryRecord` rows instead of updating the salary directly on `Employee`.

### Why

HR systems need historical salary information.

For example:

```text
Employee
│
├── ₹50,000 → Jan 2026
├── ₹75,000 → Jul 2026
└── ₹80,000 → Oct 2026
```

This preserves previous values and makes salary history available without maintaining a separate audit mechanism.

### Trade-off

Queries for the current salary require finding the latest salary record.

The implementation handles this by ordering salary records by `effectiveFrom` descending and selecting the latest record.

---

## 3. Server-side pagination

### Decision

Paginate employees on the backend rather than loading all employees into the browser.

### Why

The system is designed for approximately 10,000 employees and could grow further.

Returning only the requested page:

* Reduces API response size
* Reduces browser memory usage
* Improves initial rendering
* Keeps filtering close to the database

### Trade-off

Pagination requires additional API parameters and frontend state management.

The additional complexity is small compared with transferring the entire employee dataset.

---

## 4. Database indexes

Indexes were added to fields used frequently for filtering and lookup:

* `country`
* `department`
* `status`
* employee name
* `employeeId + effectiveFrom`
* `effectiveFrom`

### Why

These indexes support common HR workflows such as:

* Find employees by country
* Filter by department
* Filter active/inactive employees
* Retrieve salary history
* Determine recent salary records

### Trade-off

Indexes consume additional storage and make writes slightly more expensive.

For this application, the read-performance benefit is more relevant because HR users are expected to perform frequent searches and filtering.

---

## 5. Salary currency is stored with each salary record

### Decision

Every salary record stores both:

```text
amount
currency
```

### Why

Employees can belong to different countries.

For example:

```text
India         INR
United States USD
United Kingdom GBP
Germany       EUR
Singapore     SGD
```

Displaying a single global salary total without currency conversion would produce misleading results.

### Product decision

Cross-currency salary comparisons are outside the scope of this implementation unless an FX conversion source and normalization rules are introduced.

---

## 6. Simple country and department fields

### Decision

Country and department are stored directly as fields on `Employee` instead of introducing separate lookup tables.

### Why

The assignment does not require management of countries or departments as independent entities.

Using simple fields keeps the implementation easier to understand and avoids unnecessary CRUD operations.

### Trade-off

If the product later requires configurable department metadata, organizational hierarchies, localization or department ownership, separate entities could be introduced.

---

## 7. REST API

### Decision

Use a REST-style API between the React frontend and NestJS backend.

### Why

The application has straightforward resource-based operations:

* Employees
* Salary history
* Salary updates
* Dashboard statistics

REST keeps the API predictable and easy to consume.

GraphQL would add flexibility but would also introduce additional infrastructure and schema complexity that is not required for this application.

---

## 8. NestJS modular structure

The backend is separated into:

* Employee module
* Dashboard module
* Prisma module

### Why

This keeps responsibilities separated and makes the codebase easier to navigate.

Employee-related business logic stays inside the employee service, while dashboard aggregation logic stays inside the dashboard service.

---

## 9. Validation at the API boundary

Request DTOs use validation rules for:

* Pagination values
* Employee status
* Salary amount
* Currency
* Effective date

### Why

Validation prevents invalid input from reaching the business logic or database.

The frontend provides user-friendly controls, but backend validation remains the source of protection because APIs can be called independently of the UI.

---

## 10. Deterministic seed data

The application seeds exactly 10,000 deterministic employee records.

### Why

Deterministic data makes development and testing repeatable.

It also provides enough data to demonstrate:

* Pagination
* Search
* Filtering
* Dashboard aggregation
* Database performance

The dataset is intentionally synthetic and does not contain real employee information.

---

## 11. Testing strategy

The project uses Jest tests focused on meaningful behavior rather than maximizing test count.

Current tests cover:

* Service initialization
* Employee pagination
* Employee search/filter behavior
* Salary record creation
* Dashboard summary
* Controller initialization

The tests use mocked Prisma dependencies so they remain fast and deterministic.

---

## 12. Why the system is intentionally simple

The assignment prioritizes clear thinking, engineering judgment and maintainability rather than unnecessary complexity.

The implementation therefore avoids introducing:

* Microservices
* Message queues
* Redis
* Authentication systems
* Complex state-management libraries
* GraphQL
* Separate country/department services
* Unnecessary infrastructure

These could be introduced if future requirements justified them.

For the current scope, a React → NestJS → PostgreSQL architecture provides a clear and maintainable solution.

---

## 13. Future improvements

If the product were expanded beyond the assessment, potential improvements could include:

* Authentication and role-based access control
* Audit logs for salary changes
* Bulk employee imports
* CSV/Excel export
* Currency normalization using an FX provider
* Advanced salary analytics
* Employee profile editing
* Optimized search using PostgreSQL full-text search
* Background processing for large imports
* Monitoring and application metrics
