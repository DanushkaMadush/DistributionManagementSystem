const sql = require("mssql/msnodesqlv8");

let pool;

const connectDB = async () => {
  try {
    if (pool) return pool;

    pool = await sql.connect({
      connectionString: `Driver={ODBC Driver 17 for SQL Server};
        Server=${process.env.DB_SERVER};
        Database=${process.env.DB_NAME};
        Trusted_Connection=Yes;`
    });

    console.log("✅ Connected to Central DB");
    return pool;
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    throw err;
  }
};

module.exports = {
  sql,
  connectDB,
};