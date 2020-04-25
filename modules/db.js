const mysql = require("mysql2/promise");

var connection = mysql.createPool({
  host: "sql335.main-hosting.eu",
  user: "u316524083_mv2",
  password: "TdUMEx2ilUCz50GNIY",
  database: "u316524083_mv2"
});

exports.getConnection = function() {
  return connection;
};
