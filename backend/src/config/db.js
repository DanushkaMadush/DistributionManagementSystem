const sql = require("mssql/msnodesqlv8");

const getPool = async (dbName) => {
  const pool = await sql.connect({
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${dbName};Trusted_Connection=Yes;`
  });

  return pool;
};

module.exports = {
  sql,
  getPool,
};