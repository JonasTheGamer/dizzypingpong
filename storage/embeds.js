var discord = require("discord.js")
const checkMarkIcon = "https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-line/254000/172-512.png";
const errorIcon = "https://cdn2.iconfinder.com/data/icons/mix-color-5/100/Mix_color_5__info-512.png"
const logo = 'https://cdn.glitch.com/081dea63-c026-4d41-8f48-f166153b551f%2Flogoroundedcorners.png?v=1587716861517';
const infoIcon = 'https://cdn.pixabay.com/photo/2016/06/15/15/02/info-1459077_960_720.png';
const weburl = 'https://bloxtech.tech';

exports.error = function(message){
  var embed = new discord.MessageEmbed()
  //embed.setAuthor("BloxTech",logo,weburl)
  embed.setDescription(message)
  embed.setFooter("Error",errorIcon)
  embed.setTimestamp()
  embed.setColor("#ff1d00") 
  return embed
}

exports.prompt = function(question,allowCancel,expiry) {
  let embed = new discord.MessageEmbed()
  embed.setDescription(`**Prompt**\n${question}`)
  
  if(allowCancel){
    embed.addField("_ _","Say **cancel** to cancel.");
  }
  
  embed.setFooter(`This prompt will automatically cancel in ${expiry} minutes.`)
  return embed
}

exports.info = function(message,fields){
  var embed = new discord.MessageEmbed()
  embed.setDescription(message)
  if(fields) {
    fields.forEach(field => {
      embed.addField(field.title,field.text);
    })
  }
  embed.setFooter("Info",infoIcon)
  embed.setTimestamp()
  embed.setColor("#34bdeb") 
  return embed
}

exports.infoTitle = function(title,message,fields,thumbnail){
  var embed = new discord.MessageEmbed()
  if(title !== "") {
    embed.setTitle(title);
  }
  if(message !== "") {
    embed.setDescription(message)
  }
  if(thumbnail !== "") {
    embed.setThumbnail(thumbnail)
  }
  if(fields) {
    fields.forEach(field => {
      embed.addField(field.title,field.text);
    })
  }
  embed.setFooter("Info",infoIcon)
  embed.setTimestamp()
  embed.setColor("#34bdeb") 
  return embed
}

exports.success = function(message){
  var embed = new discord.MessageEmbed()
  embed.setDescription(message)
  embed.setFooter("Success",checkMarkIcon)
  embed.setTimestamp()
  embed.setColor("#05ff11") 
  return embed
}

exports.announcement = function(message){
  var embed = new discord.MessageEmbed()
  embed.setDescription(message)
  embed.setDescription(message)
  embed.setFooter("",checkMarkIcon)
  embed.setTimestamp()
  embed.setColor("#05ff11") 
  return embed
}

exports.loading = function(message){
  var embed = new discord.MessageEmbed()
  embed.setDescription(message)
  embed.setFooter("Loading...","https://www.drupal.org/files/issues/throbber_12.gif")
  embed.setTimestamp()
  embed.setColor("#05ff11") 
  return embed
}