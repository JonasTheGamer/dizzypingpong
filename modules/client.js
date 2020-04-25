const Discord = require('discord.js')
const client = new Discord.Client();

exports.getClient = function() {
  return client;
}