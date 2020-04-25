let db = require("./db.js");
let con = db.getConnection();
let embeds = require("./../storage/embeds.js")

exports.verify = async function (message) {
  let [users] = await con.execute(
      "SELECT * FROM users WHERE discordid = ?",
      [message.author.id]
    );
  
  if(users.length < 1) {
    return false;
  } else {
    let user = users[0];
    return true;
  }
  
}

exports.getUser = async function (message) {
  let [users] = await con.execute(
      "SELECT * FROM users WHERE discordid = ?",
      [message.author.id]
    );
  
  if(users.length < 1) {
    return false;
  } else {
    let user = users[0];
    return user;
  }
  
}