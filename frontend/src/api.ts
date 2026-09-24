import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");
  return response.data;
};

export const getEmployees = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  department?: string;
  status?: string;
}) => {
  const response = await api.get("/employees", { params });
  return response.data;
};

export const getCountryStats = async () => {
  const response = await api.get("/dashboard/by-country");
  return response.data;
};

export const getDepartmentStats = async () => {
  const response = await api.get("/dashboard/by-department");
  return response.data;
};

export const getEmployeeSalaryHistory = async (employeeId: string) => {
  const response = await api.get(`/employees/${employeeId}/salary-history`);
  return response.data;
};

export const updateEmployeeSalary = async (
  employeeId: string,
  data: {
    amount: number;
    currency: string;
    effectiveFrom: string;
  },
) => {
  const response = await api.patch(
    `/employees/${employeeId}/salary`,
    data,
  );

  return response.data;
};