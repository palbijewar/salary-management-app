import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, EmployeeStatus } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const firstNames = [
  'Aarav',
  'Aditi',
  'Arjun',
  'Ananya',
  'Rohan',
  'Priya',
  'Rahul',
  'Sneha',
  'Vikram',
  'Neha',
  'Daniel',
  'Emma',
  'James',
  'Olivia',
  'Michael',
  'Sophia',
];

const lastNames = [
  'Sharma',
  'Patel',
  'Singh',
  'Verma',
  'Gupta',
  'Mehta',
  'Kapoor',
  'Reddy',
  'Brown',
  'Smith',
  'Johnson',
  'Williams',
];

const departments = [
  'Engineering',
  'Product',
  'Human Resources',
  'Finance',
  'Sales',
  'Marketing',
  'Operations',
  'Customer Success',
];

const jobTitles = [
  'Software Engineer',
  'Senior Software Engineer',
  'Product Manager',
  'HR Manager',
  'Financial Analyst',
  'Sales Manager',
  'Marketing Specialist',
  'Operations Manager',
];

const countries = [
  { name: 'India', currency: 'INR' },
  { name: 'United States', currency: 'USD' },
  { name: 'United Kingdom', currency: 'GBP' },
  { name: 'Germany', currency: 'EUR' },
  { name: 'Singapore', currency: 'SGD' },
];

function getItem<T>(items: T[], index: number): T {
  return items[index % items.length];
}

function getJoiningDate(index: number): Date {
  const year = 2018 + (index % 8);
  const month = index % 12;
  const day = 1 + (index % 28);

  return new Date(Date.UTC(year, month, day));
}

function getSalary(index: number): number {
  return 50000 + (index % 50) * 10000;
}

async function main() {
  const employeeCount = 10_000;

  console.log(`Seeding ${employeeCount} employees...`);

  const employees = Array.from({ length: employeeCount }, (_, index) => {
    const employeeNumber = index + 1;
    const firstName = getItem(firstNames, index);
    const lastName = getItem(lastNames, index + 3);
    const country = getItem(countries, index);

    return {
      employeeCode: `EMP${String(employeeNumber).padStart(5, '0')}`,
      firstName,
      lastName,
      email: `employee${employeeNumber}@acme.example`,
      department: getItem(departments, index + 2),
      jobTitle: getItem(jobTitles, index + 1),
      country: country.name,
      joiningDate: getJoiningDate(index),
      status:
        index % 20 === 0 ? EmployeeStatus.INACTIVE : EmployeeStatus.ACTIVE,
    };
  });

  await prisma.employee.createMany({
    data: employees,
    skipDuplicates: true,
  });

  console.log('Employees inserted.');

  const salaryRecords = employees.map((employee, index) => {
    const country = getItem(countries, index);

    return {
      employeeId: employee.employeeCode,
      amount: getSalary(index),
      currency: country.currency,
      effectiveFrom: new Date('2026-01-01T00:00:00.000Z'),
    };
  });

  const employeeRecords = await prisma.employee.findMany({
    where: {
      employeeCode: {
        in: employees.map((employee) => employee.employeeCode),
      },
    },
    select: {
      id: true,
      employeeCode: true,
    },
  });

  const employeeIdByCode = new Map(
    employeeRecords.map((employee) => [employee.employeeCode, employee.id]),
  );

  await prisma.salaryRecord.createMany({
    data: salaryRecords.map((salary) => ({
      employeeId: employeeIdByCode.get(salary.employeeId)!,
      amount: salary.amount,
      currency: salary.currency,
      effectiveFrom: salary.effectiveFrom,
    })),
    skipDuplicates: true,
  });

  console.log('Salary records inserted.');
  console.log('Seed completed successfully.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
