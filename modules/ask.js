let embeds = require("./../storage/embeds.js")

exports.ask = async function (question,allowCancel,message,args){
  const filter = response => {
    return response.author.id == message.author.id;
  };
  
  message.channel.send(embeds.prompt(question,allowCancel,5));
  
  let collected = await message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
		.catch(collected => {
			message.channel.send(embeds.error("Prompt expired."));
		});
  
  if(collected) {
    let reply = collected.first().content;
    if(allowCancel & reply.toLowerCase() == "cancel") {
      message.channel.send(embeds.success("Prompt cancelled"))
      return false;
    }
    return reply;
  } else {
    return false
  }
}