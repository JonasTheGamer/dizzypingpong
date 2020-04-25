const express = require("express");
const app = express();
const fs = require("fs")

const { prefix, token } = require('./config.json');
const Discord = require('discord.js');

const client = require('./modules/client.js').getClient();


client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const embeds = require('./storage/embeds.js')
const auth = require("./modules/auth.js");

// Web requests
  app.use(express.static("public"));
  app.get("/", (request, response) => {
    response.sendFile(__dirname + "/views/index.html");
  });

  const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });



// Discord bot

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log('Ready!');
});

async function reactionAdded(reaction,user) {
  let guild = client.guilds.cache.get("279361018721730571");
  let member = guild.members.cache.get(user.id)
  console.log("reaction added received by " + member.displayName)
  console.log(reaction)
}

client.on('message', async function(message){
  if(message.mentions.has('527204711770619904')) {
    message.channel.send(`:sunglasses: You woke me! How can I help? My prefix is \`${prefix}\`.`)
  }
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}
  
  if(command.authNeeded) {
    console.log(await auth.verify(message))
    let authOk = await auth.verify(message)
    if(!authOk){
      return message.channel.send(embeds.error("You need to link your Discord account on our webpanel first. You can do this here:\nhttps://bloxtech.tech/admin"))
    }
  }

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});


// raw message reaction added or removed event
client.on('raw', async function(packet) {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    // Grab the channel to check the message from
    const channel = await client.channels.fetch(packet.d.channel_id);

    channel.messages.cache.find(packet.d.message_id).then(message => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = message.reactions.cache.get(emoji);
        // Adds the currently reacting user to the reaction's users collection.
        //if (reaction) reaction.users.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));
        // Check which type of event it is before emitting
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            reactionAdded(reaction, client.users.cache.get(packet.d.user_id));
        }

    });
});


client.login(token);