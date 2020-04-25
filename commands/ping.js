const embeds = require("./../storage/embeds.js");
const client = require('./../modules/client.js').getClient();

module.exports = {
	name: 'ping',
	description: 'Get the avatar URL of the tagged user(s), or your own avatar.',
  authNeeded: true,
	execute(message) {
	  message.channel.send(embeds.info(`Pong! \`${client.ws.ping}ms\``))	
  
	},
};