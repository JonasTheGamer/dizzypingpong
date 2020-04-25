var db = require("./db.js");
const consta = require("./../constanten.js");
const idModule = require('./id.js');

var con = db.getConnection();
var sessions = [];

exports.getOwnedCentres = async function(userid) {
  try {
    let [centres] = await con.execute(
      "SELECT * FROM centers WHERE ownerid = ?",
      [userid]
    );
    return centres;
    
  } catch (e) {
    console.log(e);
    return false;
  }
};

exports.newCentreNow = async function() {
  
  
  var constan = await consta.getConstanten()
  var centrePrice = constan.centrePrice;
  
  // Berken het aantal dagen dat er nog in deze maand zitten
  var date = new Date();
  var time = new Date(date.getTime());
  time.setMonth(date.getMonth() + 1);
  time.setDate(0);
  var daysRemaining =time.getDate() > date.getDate() ? time.getDate() - date.getDate() : 0;

  // Bereken het totaal aantal dagen in deze maand
  var totalDaysInThisMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

  // Reken uit hoeveel TechBux de gebruiker nog moet betalen
  var totalToBePaid = (centrePrice / totalDaysInThisMonth) * daysRemaining
  return Math.round(totalToBePaid);
}

exports.makeCentre = async function (centrename, ownerid) {
  let token = idModule.generateID(87);
  try {
    let [centres] = await con.execute(
      "INSERT INTO centers (name,ownerid,token) VALUES (?,?,?)",
      [centrename,ownerid,token]
    );
    if(centres.affectedRows >= 1) {
      return centres.insertId;
    } else {
      return false
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}

exports.deleteCentre = async function (centreid, ownerid) {
  let token = idModule.generateID(87);
  try {
    let [centres] = await con.execute(
      "UPDATE centers SET ownerid = 0 WHERE ID = ? AND ownerid = ?;",
      [centreid,ownerid]
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

exports.updateCentre = async function (centreid, ownerid, propertyName, propertyValue) {
  try {
    console.log("PROPERTY NAME IS " + propertyName)
    let [centres] = await con.execute(
      "UPDATE `centers` SET `" + propertyName + "` = ? WHERE `ID` = ? AND `ownerid` = ?;",
      [propertyValue, centreid,ownerid]
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