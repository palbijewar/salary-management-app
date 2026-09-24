import { useEffect, useState } from "react";
import {
  getCountryStats,
  getDashboardSummary,
  getDepartmentStats,
  getEmployees,
  getEmployeeSalaryHistory,
  updateEmployeeSalary,
} from "./api";
import "./index.css";

type Employee = {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  department: string;
  jobTitle: string;
  country: string;
  status: string;
  salaries: {
    amount: string;
    currency: string;
  }[];
};

function App() {
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [countries, setCountries] = useState<
    { country: string; count: number }[]
  >([]);
  const [departments, setDepartments] = useState<
    { department: string; count: number }[]
  >([]);

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const [salaryHistory, setSalaryHistory] = useState<
    {
      amount: string;
      currency: string;
      effectiveFrom: string;
    }[]
  >([]);

  const [salaryAmount, setSalaryAmount] = useState("");
  const [salaryCurrency, setSalaryCurrency] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [isUpdatingSalary, setIsUpdatingSalary] = useState(false);

  useEffect(() => {
    Promise.all([
      getDashboardSummary(),
      getCountryStats(),
      getDepartmentStats(),
    ]).then(([summaryData, countryData, departmentData]) => {
      setSummary(summaryData);
      setCountries(countryData);
      setDepartments(departmentData);
    });
  }, []);

  useEffect(() => {
    getEmployees({
      page,
      limit: 10,
      search: search || undefined,
      country: country || undefined,
      department: department || undefined,
      status: status || undefined,
    }).then((result) => {
      setEmployees(result.data);
      setTotalPages(result.meta.totalPages);
    });
  }, [page, search, country, department, status]);

  const openEmployee = async (employee: Employee) => {
    setSelectedEmployee(employee);

    const history = await getEmployeeSalaryHistory(employee.id);
    setSalaryHistory(history);
  };

  const handleSalaryUpdate = async () => {
    if (!selectedEmployee) return;

    if (!salaryAmount || !salaryCurrency || !effectiveFrom) {
      alert("Please fill all salary fields.");
      return;
    }

    try {
      setIsUpdatingSalary(true);

      await updateEmployeeSalary(selectedEmployee.id, {
        amount: Number(salaryAmount),
        currency: salaryCurrency,
        effectiveFrom,
      });

      const history = await getEmployeeSalaryHistory(selectedEmployee.id);
      setSalaryHistory(history);

      setSalaryAmount("");
      setSalaryCurrency("");
      setEffectiveFrom("");

      alert("Salary updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to update salary.");
    } finally {
      setIsUpdatingSalary(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Salary Management</h1>
        <p>HR Dashboard</p>
      </header>

      <section className="cards">
        <div className="card">
          <span>Total Employees</span>
          <strong>{summary.total}</strong>
        </div>

        <div className="card">
          <span>Active</span>
          <strong>{summary.active}</strong>
        </div>

        <div className="card">
          <span>Inactive</span>
          <strong>{summary.inactive}</strong>
        </div>
      </section>

      <section className="stats">
        <div className="panel">
          <h2>Employees by Country</h2>
          {countries.map((item) => (
            <p key={item.country}>
              {item.country}: <strong>{item.count}</strong>
            </p>
          ))}
        </div>

        <div className="panel">
          <h2>Employees by Department</h2>
          {departments.map((item) => (
            <p key={item.department}>
              {item.department}: <strong>{item.count}</strong>
            </p>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Employees</h2>

        <div className="filters">
          <input
            placeholder="Search employees..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />

          <select
            value={country}
            onChange={(event) => {
              setCountry(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All Countries</option>
            {countries.map((item) => (
              <option key={item.country} value={item.country}>
                {item.country}
              </option>
            ))}
          </select>

          <select
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All Departments</option>
            {departments.map((item) => (
              <option key={item.department} value={item.department}>
                {item.department}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Department</th>
              <th>Country</th>
              <th>Status</th>
              <th>Salary</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => {
              const salary = employee.salaries[0];

              return (
                <tr
                  key={employee.id}
                  onClick={() => openEmployee(employee)}
                  className="employee-row"
                >
                  <td>{employee.employeeCode}</td>
                  <td>
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td>{employee.department}</td>
                  <td>{employee.country}</td>
                  <td>{employee.status}</td>
                  <td>
                    {salary ? `${salary.currency} ${salary.amount}` : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {selectedEmployee && (
          <div className="modal-overlay">
            <div className="employee-modal">
              <div className="modal-header">
                <div>
                  <h2>
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h2>
                  <span>{selectedEmployee.employeeCode}</span>
                </div>

                <button
                  className="close-button"
                  onClick={() => setSelectedEmployee(null)}
                >
                  ×
                </button>
              </div>

              <div className="employee-details">
                <div>
                  <span>Department</span>
                  <strong>{selectedEmployee.department}</strong>
                </div>

                <div>
                  <span>Job Title</span>
                  <strong>{selectedEmployee.jobTitle}</strong>
                </div>

                <div>
                  <span>Country</span>
                  <strong>{selectedEmployee.country}</strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>{selectedEmployee.status}</strong>
                </div>
              </div>

              <div className="salary-section">
                <h3>Salary History</h3>

                {salaryHistory.map((salary) => (
                  <div className="salary-record" key={salary.effectiveFrom}>
                    <strong>
                      {salary.currency} {salary.amount}
                    </strong>

                    <span>
                      Effective from{" "}
                      {new Date(salary.effectiveFrom).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="salary-section">
                <h3>Update Salary</h3>

                <div className="salary-form">
                  <input
                    type="number"
                    placeholder="Salary amount"
                    value={salaryAmount}
                    onChange={(event) => setSalaryAmount(event.target.value)}
                  />

                  <select
                    value={salaryCurrency}
                    onChange={(event) => setSalaryCurrency(event.target.value)}
                  >
                    <option value="">Currency</option>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="EUR">EUR</option>
                    <option value="SGD">SGD</option>
                  </select>

                  <input
                    type="date"
                    value={effectiveFrom}
                    onChange={(event) => setEffectiveFrom(event.target.value)}
                  />
                </div>

                <button
                  onClick={handleSalaryUpdate}
                  disabled={isUpdatingSalary}
                >
                  {isUpdatingSalary ? "Updating..." : "Update Salary"}
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;
