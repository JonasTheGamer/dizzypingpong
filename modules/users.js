var db = require("./db.js");
const consta = require("./../constanten.js");
const idModule = require('./id.js');

var con = db.getConnection();
var sessions = [];

exports.updateUser = async function (btUsername,propertyName,propertyValue) {
  try {
    console.log("PROPERTY NAME IS " + propertyName)
    let [centres] = await con.execute(
      "UPDATE `users` SET `" + propertyName + "` = ? WHERE `username` = ?",
      [propertyValue, btUsername]
    );
    console.log(centres)
    if(centres.affectedRows >= 1) {
      return true
    } else {
      return false
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}