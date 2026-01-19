const { getPool, sql } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const createUser = async (user) => {
  const pool = await getPool(process.env.USER_DB);

  const employeeId = `EMP-${uuidv4()}`;

  await pool
    .request()
    .input("EmployeeId", sql.NVarChar, employeeId)
    .input("Name", sql.NVarChar, user.name)
    .input("DOB", sql.Date, user.dob)
    .input("Department", sql.NVarChar, user.department)
    .input("Designation", sql.NVarChar, user.designation)
    .input("Salary", sql.Decimal(18, 2), user.salary)
    .input("DateOfJoin", sql.Date, user.dateOfJoin)
    .input("ContactNo", sql.NVarChar, user.contactNo)
    .input("Address", sql.NVarChar, user.address)
    .input("RDCId", sql.Int, user.rdcId)
    .input("Email", sql.NVarChar, user.email)
    .input("PasswordHash", sql.NVarChar, user.passwordHash).query(`
      INSERT INTO dbo.Users
      (EmployeeId, Name, DOB, Department, Designation, Salary,
       DateOfJoin, ContactNo, Address, RDCId, Email, PasswordHash)
      VALUES
      (@EmployeeId, @Name, @DOB, @Department, @Designation, @Salary,
       @DateOfJoin, @ContactNo, @Address, @RDCId, @Email, @PasswordHash)
    `);
};

module.exports = { createUser };