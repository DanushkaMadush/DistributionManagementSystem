const { getPool, sql } = require('../config/db');

const getUserWithRolesByEmail = async (email) => {
  const pool = await getPool(process.env.USER_DB);

  const result = await pool.request()
    .input('Email', sql.NVarChar, email)
    .query(`
      SELECT 
        u.UserId,
        u.EmployeeId,
        u.Email,
        u.PasswordHash,
        r.RoleName
      FROM Users u
      JOIN UserRoles ur ON u.UserId = ur.UserId
      JOIN Roles r ON ur.RoleId = r.RoleId
      WHERE u.Email = @Email
    `);

  return result.recordset;
};

module.exports = {
  getUserWithRolesByEmail
};